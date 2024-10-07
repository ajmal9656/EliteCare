import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Button from '../common/userCommon/Button';
import axiosUrl from '../../utils/axios';
import { toast } from 'sonner';

function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const appointmentData = location.state?.appointmentData;
  const doctor = location.state?.doctor;

  console.log("app", appointmentData);
  console.log("doctor", doctor);

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to format time
  const formatTime = (start: string, end: string) => {
    const formatTimeZone = (dateString: string) => {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return ''; // Return empty if date is invalid
      }

      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC', // You can adjust this to your timezone if needed
      };

      return date.toLocaleTimeString([], options);
    };

    const startTime = formatTimeZone(start);
    const endTime = formatTimeZone(end);

    // Only display the time if both are valid
    return startTime && endTime ? `${startTime} to ${endTime}` : 'Invalid time';
  };

  // Handle payment click
  const handleClick = async () => {
    try {
      const responses = await axiosUrl.post('/create-checkout-session', {
        appointment: appointmentData,
      });

      console.log("session", responses.data.message);

      if (responses.data.session) {
        window.location.href = responses.data.session.url;
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        console.error('Error in Stripe Checkout process:', error.response.data.message);
        toast.error(`${error.response.data.message}`);
        navigate(`/doctorProfile/checkSlots`, {
          state: { doctor },
        });
      } else {
        console.error('Unexpected error:', error.message);
        alert('An unexpected error occurred.');
      }
    }
  };

  useEffect(() => {
    if (appointmentData) {
      console.log('Received Appointment Data:', appointmentData);
    }
  }, [appointmentData]);

  return (
    <div className='w-full object-cover flex justify-center '>
      <div className='w-[90%] object-cover flex flex-col justify-center items-center '>
        <div className='w-[80%] object-cover bg-white my-5 shadow-lg shadow-gray-200'>
          <div className='w-[100%] object-cover flex flex-col'>
            <div className='w-[100%] h-[150px] flex flex-col pt-14 '>
              <div className='w-[100%] h-[45px] flex place-content-center items-center'>
                <h1 className='text-2xl font-semibold font-serif text-backgroundColor'>
                  Dr. {appointmentData.doctor.name}
                </h1>
              </div>
              <div className='w-[100%] h-[25px] flex place-content-center items-center'>
                <h1 className='text-xl font-semibold font-serif text-backgroundColor'>
                  {appointmentData.doctor.department.name}
                </h1>
              </div>
            </div>

            {/* Patient Info */}
            <div className='w-[100%] h-[235px]  '>
              <div className='w-[100%] h-[25px] flex place-content-start items-center pl-5'>
                <h2 className='text-lg font-semibold font-serif text-gray-700'>
                  Patient Name: {appointmentData.patientName}
                </h2>
              </div>
              <div className='w-[100%] h-[25px] flex place-content-start items-center pl-5'>
                <h2 className='text-lg font-semibold font-serif text-gray-700'>
                  Age: {appointmentData.age}
                </h2>
              </div>
              <div className='w-[100%] h-[25px] flex place-content-start items-center pl-5'>
                <h2 className='text-lg font-semibold font-serif text-gray-700'>
                  Date: {formatDate(appointmentData.date)}
                </h2>
              </div>
              <div className='w-[100%] h-[25px] flex place-content-start items-center pl-5'>
                <h2 className='text-lg font-semibold font-serif text-gray-700'>
                  Slot: {formatTime(appointmentData.slot.start, appointmentData.slot.end)}
                </h2>
              </div>
              
              <div className='w-[100%] object-cover flex flex-col place-content-center items-center '>
                <h2 className='w-[100%] text-base font-semibold font-serif text-gray-700 pl-5'>
                  Description:
                </h2>
                <div className='overflow-y-auto px-6 w-[95%] h-[100px] bg-gray-100 rounded-lg mt-3'>
                  <p className='w-[100%] text-lg font-serif text-gray-700 break-words'>
                    {appointmentData.description}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Pay now button */}
          <div className='w-[100%] flex flex-col place-content-center place-items-center  h-[80px] '>
            <Button title="Pay now" onClick={handleClick} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
