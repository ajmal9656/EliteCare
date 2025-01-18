import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment-timezone';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { TiTick } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import { logoutDoctor } from '../../Redux/Action/doctorActions';
import { checkSlotAvailabile, createSlot, deleteSlot, getSlots } from '../../services/doctorAxiosService';


function SlotManagement() {

  const navigate = useNavigate()
  const dispatch:any = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); 
  const [availableSlots, setAvailableSlots] = useState<{ start: string, end: string, availability: boolean, _id: string,date:Date,doctorId:string }[]>([]);

  const MySwal = withReactContent(Swal);

  const DoctorData = useSelector((state: RootState) => state.doctor);

  const rawTimeSlots = [
    { start: '09:15', end: '10:00' },
    { start: '10:15', end: '11:00' },
    { start: '11:15', end: '12:00' },
    { start: '12:15', end: '13:00' },
    { start: '13:15', end: '14:00' },
    { start: '14:15', end: '15:00' },
    { start: '15:15', end: '16:00' },
    { start: '18:15', end: '19:00' },
    { start: '19:15', end: '20:00' },
    
  ];

  const timeSlots = rawTimeSlots.map((slot) => {
    return `${moment(slot.start, 'HH:mm').format('h:mm A')} to ${moment(slot.end, 'HH:mm').format('h:mm A')}`;
  });

  const toggleAddSlotModal = () => {
    if (isModalOpen) {
      
      formik.resetForm();
    }
    
    setIsModalOpen(!isModalOpen);
  };

  const formik = useFormik({
    initialValues: {
      startDate: null,
      endDate: null,
      selectedSlots: [] as string[],
    },
    validationSchema: Yup.object({
      startDate: Yup.date().required('Start date is required'),
      endDate: Yup.date()
        .required('End date is required')
        .min(Yup.ref('startDate'), 'End date cannot be earlier than the start date'),
      selectedSlots: Yup.array().min(1, 'At least one slot is required'),
    }),
    onSubmit: async (values) => {
      try {
        console.log("Start Date:", values.startDate);
        console.log("End Date:", values.endDate);
    
        // Parse start and end dates without converting to UTC initially
        const startDate = moment(values.startDate).startOf('day');
        const endDate = moment(values.endDate).endOf('day');
    
        console.log("Start Date (Local):", startDate.toISOString());
        console.log("End Date (Local):", endDate.toISOString());
    
       // Generate all dates between startDate and endDate
    const dateRange: moment.Moment[] = [];
    let currentDate = startDate.clone(); // Use .clone() for moment objects
    while (currentDate.isSameOrBefore(endDate, 'day')) {
      dateRange.push(currentDate.clone()); // Clone to preserve original moment object
      currentDate.add(1, 'day'); // Increment the date
    }

    // Create slots array where each object represents a date with selected times
    const slotsWithDates = dateRange.map((date) => {
      const slots = values.selectedSlots.map((slot) => {
        const [startTime, endTime] = slot.split(' to ');

        // Adjust start and end times for each slot in the local time zone
        const slotStartTime = date
          .clone()
          .set({
            hour: moment(startTime, 'h:mm A').hour(),
            minute: moment(startTime, 'h:mm A').minute(),
          })
          .format('YYYY-MM-DDTHH:mm:ss'); // Format without .toISOString()

        const slotEndTime = date
          .clone()
          .set({
            hour: moment(endTime, 'h:mm A').hour(),
            minute: moment(endTime, 'h:mm A').minute(),
          })
          .format('YYYY-MM-DDTHH:mm:ss'); // Format without .toISOString()

        return { start: slotStartTime, end: slotEndTime };
      });

      return { slots };
    });
    
        const formData = {
          startDate:moment(values.startDate).startOf('day').utcOffset(0, true).toISOString(),
          endDate: moment(values.endDate).startOf('day').utcOffset(0, true).toISOString(),
          selectedSlots: slotsWithDates,
          doctorId: DoctorData?.doctorInfo?.doctorId,
        };
    
        console.log("Slot Form Data:", formData);
    
        await createSlot(formData)


        setSelectedDate(values.startDate)



        fetchSlotsForDate(formData.startDate)
    
        toggleAddSlotModal();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });
  

  const checkSlotInPast = (slot: string) => {
    if (formik.values.startDate) {
      const selectedDate = moment(formik.values.startDate).startOf('day');
      const currentDate = moment();

      const [slotStart] = slot.split(' to ');
      const slotTime = moment(selectedDate).set({
        hour: moment(slotStart, 'h:mm A').hour(),
        minute: moment(slotStart, 'h:mm A').minute(),
      });

      return currentDate.isSame(selectedDate, 'day') && currentDate.isAfter(slotTime);
    }
    return false;
  };

  const handleSlotChange = async (slot: string) => {
    if (!formik.values.startDate||!formik.values.endDate) {
      formik.setFieldError('selectedDate', 'Date is required');
      toast.error('Please select a date first');
      return;
    }
  
    if (checkSlotInPast(slot)) {
      toast.error('The time has already passed fot today');
      return;
    }
  
  
    const isAvailable = await checkSlotAvailability(slot);
    
    if (!isAvailable) {
      toast.error('This time slot is already booked for the selected date');
      return; 
    }
  
    const selectedSlots = formik.values.selectedSlots;
    formik.setFieldValue(
      'selectedSlots',
      selectedSlots.includes(slot)
        ? selectedSlots.filter((s) => s !== slot)
        : [...selectedSlots, slot]
    );
  };

  const generateTimeSlots = (
    startDate: string, 
    endDate: string, 
    startTime: string, 
    endTime: string
  ) => {
    const slots = [];
    const startMoment = moment(startDate).startOf('day');
    const endMoment = moment(endDate).startOf('day');
    
    while (startMoment.isSameOrBefore(endMoment)) {
      // Create time range for the current date
      const start = startMoment.clone()
        .set({
          hour: moment(startTime, 'h:mm A').hour(),
          minute: moment(startTime, 'h:mm A').minute(),
        })
        .format('YYYY-MM-DDTHH:mm:ss');

        
  
      const end = startMoment.clone()
        .set({
          hour: moment(endTime, 'h:mm A').hour(),
          minute: moment(endTime, 'h:mm A').minute(),
        })
        .format('YYYY-MM-DDTHH:mm:ss');
  
      slots.push({ start, end });
      startMoment.add(1, 'days'); // Move to the next day
    }
  
    return slots;
  };
  
 
  const checkSlotAvailability = async (slot: string) => {
    console.log("slotttt",slot);
    
    const [startTime, endTime] = slot.split(' to ');
    const startDate = moment(formik.values.startDate).startOf('day').utcOffset(0, true).toISOString() 
    const endDate = moment(formik.values.endDate).startOf('day').utcOffset(0, true).toISOString() 


    const timeSlots = generateTimeSlots(startDate, endDate, startTime, endTime);
  
   
    // const start = moment.tz(startDate, 'UTC')
    //         .set({
    //           hour: moment(startTime, 'h:mm A').hour(),
    //           minute: moment(startTime, 'h:mm A').minute(),
    //         })
    //         .toISOString();

    //       const end = moment.tz(startDate, 'UTC')
    //         .set({
    //           hour: moment(endTime, 'h:mm A').hour(),
    //           minute: moment(endTime, 'h:mm A').minute(),
    //         })
    //         .toISOString();
    console.log("time slots",timeSlots);
    
            
  
    try {
      
      const response = await checkSlotAvailabile(timeSlots,startDate,endDate,DoctorData?.doctorInfo?.doctorId)
      console.log("mmm",response.data.data);
      if(response.data.data){
        return true
      }else{
        return false
      }
  
      
    } catch (error) {
      console.error('Error checking slot availability:', error);
      toast.error('Failed to check slot availability');
      return false;
    }
  };
  

  const fetchSlotsForDate = async (date: string | null) => {
    if (date) {
      try {
        console.log("date",date)
        const doctorId = DoctorData?.doctorInfo?.doctorId;
        
       
      
        
        

        const response = await getSlots(date,doctorId)
        console.log("gggg",response.data.data)

        if (response?.data?.data?.length > 0) {
          setAvailableSlots(
            response.data.data.map((slot: { start: string; end: string; }) => ({
              ...slot,
              id: slot.start + slot.end,
            }))
          );
          
        } else {
          setAvailableSlots([]);
          
        }
      } catch (error) {
        console.error('Error calling API:', error);
        toast.error('Error selecting date');
        setAvailableSlots([]);
      }
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    
    var selectedDateUTC = moment(date).utc().startOf('day').add(1,'days').toISOString(); 

    fetchSlotsForDate(selectedDateUTC); 
  };

  const handleDeleteSlot = async (slotId: string, date: Date, doctorId: string) => {
    try {
      // Show SweetAlert confirmation dialog
      const result = await MySwal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });
  
      if (result.isConfirmed) {
        
  
       
        await deleteSlot(slotId,date,doctorId)
  
        
        setAvailableSlots(prevSlots => prevSlots.filter(slot => slot._id !== slotId));
  
       
  
       
        await MySwal.fire('Deleted!', 'The slot has been deleted.', 'success');
      }
    } catch (error: any) {
      console.error('Error deleting slot:', error.response?.data || error.message);
      toast.error('Error deleting slot');
    }
  };
  

 
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const date = new Date();
        const selectedDateUTC = moment(date).utc().startOf("day").toISOString();
        await fetchSlotsForDate(selectedDateUTC); // Assuming fetchSlotsForDate is async
  
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized: Redirecting to login page.");
          await dispatch(logoutDoctor());
          navigate("/doctor/login"); // Navigate to the login page if unauthorized
        } else {
          console.error("Error fetching user details:", error);
        }
      }
    };
  
    fetchData();
  }, [dispatch, navigate]); // Add dependencies where necessary
  

  return (
    <div className="flex flex-col w-full mx-auto pl-64 p-4 mt-14">
  <div className="shadow-lg w-full h-[730px] flex gap-4 p-4">
    {/* Calendar Section */}
    <div className=" bg-white p-4 box-border relative w-2/3">
      <button 
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={toggleAddSlotModal}
      >
        Add Slot
      </button>
      <div className="flex items-center justify-center h-full">
  <div className="transform scale-110"> {/* Increase scale value to enlarge further */}
    <Calendar
      onClickDay={handleDateChange}
      value={selectedDate}
      minDate={new Date()}
      maxDate={new Date(new Date().setDate(new Date().getDate() + 10))}
    />
  </div>
</div>

    </div>

    {/* Available Slots Section */}
    <div className="flex-1 bg-white p-4 box-border w-1/2">
      <h3 className="text-lg font-bold mb-2">Available Slots</h3>
      <div className="grid grid-cols-1 gap-2">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot, index) => (
            <div 
              key={index} 
              className={`p-4 border rounded-lg transition-all duration-300 ${slot.availability ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-green-100 text-green-600 hover:bg-green-200'} flex justify-between items-center cursor-pointer`}
            >
              {slot.start} to {slot.end}
              {slot.availability ? (
                <MdDelete 
                  onClick={() => handleDeleteSlot(slot._id, slot.date, slot.doctorId)} 
                  fill="red" 
                  size={24} 
                  className="cursor-pointer hover:scale-110 transition-all" 
                />
              ) : (
                <TiTick 
                  fill="green" 
                  size={24} 
                  className="cursor-pointer hover:scale-110 transition-all" 
                />
              )}
            </div>
          ))
        ) : (
          <p>No available slots for the selected date.</p>
        )}
      </div>
    </div>
  </div>

  {/* Modal for Adding Slots */}
  {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Slots</h2>
      <form onSubmit={formik.handleSubmit}>
      <div className="mb-4">
  <label className="block mb-2">Select Start Date:</label>
  <DatePicker
    selected={formik.values.startDate}
    onChange={(date:any) => {
      // Check if the end date is already selected and if start date is greater than end date
      if (formik.values.endDate && date > formik.values.endDate) {
        formik.setFieldValue('startDate', formik.values.endDate); // Set start date to the end date
      } else {
        formik.setFieldValue('startDate', date);
      }
    }}
    dateFormat="MM/dd/yyyy"
    className="border border-gray-300 p-2 rounded w-full"
    placeholderText="Select start date"
    minDate={new Date()}
  />
  {formik.errors.startDate && <div className="text-red-500">{formik.errors.startDate}</div>}
</div>


        <div className="mb-4">
          <label className="block mb-2">Select End Date:</label>
          <DatePicker
            selected={formik.values.endDate}
            onChange={(date) => formik.setFieldValue('endDate', date)}
            dateFormat="MM/dd/yyyy"
            className="border border-gray-300 p-2 rounded w-full"
            placeholderText="Select end date"
            minDate={formik.values.startDate || new Date()} // Ensure end date is after or equal to start date
          />
          {formik.errors.endDate && <div className="text-red-500">{formik.errors.endDate}</div>}
        </div>

        <div className="mb-4">
          <label className="block mb-2">Select Slots:</label>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <div key={slot}>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formik.values.selectedSlots.includes(slot)}
                    onChange={() => handleSlotChange(slot)}
                    className="mr-2"
                  />
                  {slot}
                </label>
              </div>
            ))}
          </div>
          {formik.errors.selectedSlots && <div className="text-red-500">{formik.errors.selectedSlots}</div>}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            onClick={toggleAddSlotModal}
          >
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Slots
          </button>
        </div>
      </form>
    </div>
  </div>
)}

</div>

  );
}

export default SlotManagement;