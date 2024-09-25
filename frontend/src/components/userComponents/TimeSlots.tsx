import { useOutletContext, useNavigate } from 'react-router-dom';
import { useEffect, useState, forwardRef, Ref } from 'react';
import DatePicker from 'react-datepicker';
import { addDays } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { DoctorDataWithSpecialization } from '../../interfaces/doctorinterface';
import axiosUrl from '../../utils/axios';
import Button from '../common/userCommon/Button';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { User } from '../../interfaces/userInterface';

interface Slot {
  _id: string;
  start: string;
  end: string;
  availability: boolean;
}

function TimeSlots() {
  const { doctor } = useOutletContext<{ doctor: DoctorDataWithSpecialization }>();
  const navigate = useNavigate();

  const userData: User | null = useSelector((state: RootState) => state.user.userInfo);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [patientName, setPatientName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const formatDateForBackend = (date: Date): string => {
    const midnightDate = new Date(date);
    midnightDate.setUTCHours(0, 0, 0, 0);
    return midnightDate.toISOString().replace('Z', '+00:00');
  };

  const formatTimeRange = (start: string, end: string) => {
    
    const formatTime = (date: string) => {
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
      };
      
      
      return new Date(date).toLocaleTimeString([], options);
    };

    return `${formatTime(start)} to ${formatTime(end)}`;
  };

  const sendDateToBackend = async (date: Date | null) => {
    if (!date) return;
    const formattedDate = formatDateForBackend(date);
    try {
      const response = await axiosUrl.get('/getSlots', {
        params: {
          date: formattedDate,
          doctorId: doctor._id,
        },
      });
      setSlots(response.data.response);
      setSelectedSlot(null); // Reset selected slot when slots change
    } catch (error) {
      console.error('Error sending date to backend:', error);
    }
  };

  const handleClick = () => {
    if (!selectedSlot) {
      toast.error('Please select a slot');
      return;
    }
    
    setIsModalOpen(true);
  };

  const handleBookAppointment = async () => {
    if (!patientName || !age || !description) {
      toast.error('Please fill all the fields');
      return;
    }

    if (!selectedSlot || !selectedDate) {
      toast.error('Please select a slot and date');
      return;
    }

    if (!userData) {
      navigate("/login")
      toast.error('Please login');
      return;
    }

    try {
      const formattedDate = formatDateForBackend(selectedDate);
      console.log("gggg",formattedDate)

      const response = await axiosUrl.post('/checkSlotStatus', {
        slotId: selectedSlot,   
        doctorId: doctor._id ,
        date:formattedDate ,
        userId:userData._id  
      });
      console.log("qqqqqq",response.data.data)
      if(response.data.data){




        const appointmentData = {
          patientName,
          age,
          description,
          date: formattedDate,
          slot: selectedSlot,
          doctor: doctor,
          userId: userData._id,
        };
  
        navigate('/doctorProfile/appoinmentDetails', { state: {doctor, appointmentData} });

      }else{
        toast.error("Slot is busy");
        setIsModalOpen(false);

      }


      
    
    } catch (error) {
      console.error('Error preparing appointment data:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    sendDateToBackend(selectedDate);
  }, [selectedDate]);

  // Filter out slots that are less than 1 hour from the current UTC time
  const currentDateTimeLocal = new Date();
  const currentDateTimeUTC = new Date(currentDateTimeLocal.getTime() - (currentDateTimeLocal.getTimezoneOffset() * 60000));
  const oneHourLaterUTC = new Date(currentDateTimeUTC.getTime() + 300);
  const availableSlots = slots.filter(slot => new Date(slot.start) >= oneHourLaterUTC);

  const selectedSlotDetails = slots.find(slot => slot._id === selectedSlot?._id);

  return (
    <div className='w-full h-[1000px] flex justify-center'>
      <div className='w-[70%] h-[400px] flex flex-col justify-center items-center'>
        <div className='w-[80%] h-[600px] bg-white mt-5 shadow-lg shadow-gray-200 flex flex-col'>
          <div className='w-full h-[90px] flex flex-row'>
            <div className='w-[50%] h-[90px]'></div>
            <div className='w-[50%] h-[90px] flex items-center justify-end '>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={new Date()}
                maxDate={addDays(new Date(), 3)}
                placeholderText="Select a date"
                dateFormat="MM/dd/yyyy"
                customInput={<CustomInput />}
              />
            </div>
          </div>
          <div className='flex flex-col w-full h-[290px] ml-10'>
            <div className='w-[90%] h-[230px] grid grid-cols-3 grid-rows-3 gap-4 p-4'>
              {availableSlots.length > 0 ? (
                availableSlots.map(slot => (
                  <label key={slot._id} className="flex items-center border-2 rounded-lg p-2 bg-backgroundColor text-white">
                    <input
                      type="radio"
                      name="slot"
                      value={slot._id}
                      className="mr-2"
                      disabled={!slot.availability}
                      onChange={() => setSelectedSlot(slot)}
                    />
                    <span className="flex-1">{formatTimeRange(slot.start, slot.end)}</span>
                  </label>
                ))
              ) : (
                <p className='text-3xl text-center'>No available slots</p>
              )}
            </div>
            <div className='w-[90%] h-[60px] flex justify-center items-center'>
              {availableSlots.length > 0 && <Button title='Book Slot' onClick={handleClick} />}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] md:w-[40%] p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Patient Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Show selected date and slot */}
            {selectedDate && (
              <div className="mb-4">
                <p><strong>Selected Date:</strong> {selectedDate.toLocaleDateString()}</p>
              </div>
            )}
            {selectedSlotDetails && (
              <div className="mb-4">
                <p><strong>Selected Slot:</strong> {formatTimeRange(selectedSlotDetails.start, selectedSlotDetails.end)}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <Button title='Book Appointment' onClick={handleBookAppointment} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick }, ref: Ref<HTMLInputElement>) => (
    <input
      className="text-center px-3 py-2 rounded-md shadow-md border border-gray-300 focus:outline-none cursor-pointer w-[70%]"
      onClick={onClick}
      ref={ref}
      value={value || ''}
      readOnly
      placeholder="Select date"
    />
  )
);

export default TimeSlots;
