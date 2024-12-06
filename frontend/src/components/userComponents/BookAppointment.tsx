import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Button from '../common/userCommon/Button';
import { toast } from 'sonner';
import { createCheckoutSession } from '../../services/userAxiosService';

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
      const responses = await createCheckoutSession(appointmentData)

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
        <div className='w-[80%] object-cover bg-white my-5 shadow-lg shadow-gray-300 rounded-lg overflow-hidden'>
          <div className='w-full object-cover flex flex-col p-6'>
            <div className='w-full h-auto flex flex-col items-center mb-5 mt-9'>
              <h1 className='text-2xl font-semibold font-serif text-backgroundColor'>
                Dr. {appointmentData.doctor.name}
              </h1>
              <h2 className='text-xl font-semibold font-serif text-gray-600'>
                {appointmentData.doctor.department.name}
              </h2>
            </div>

            {/* Patient Info */}
            <div className='w-full'>
              <div className='w-full flex justify-start items-center mb-2'>
                <h2 className='text-lg font-semibold font-serif text-gray-700'>
                  Patient Name: <span className='font-normal'>{appointmentData.patientName}</span>
                </h2>
              </div>
              <div className='w-full flex justify-start items-center mb-2'>
                <h2 className='text-lg font-semibold font-serif text-gray-700'>
                  Age: <span className='font-normal'>{appointmentData.age}</span>
                </h2>
              </div>
              <div className='w-full flex justify-start items-center mb-2'>
                <h2 className='text-lg font-semibold font-serif text-gray-700'>
                  Date: <span className='font-normal'>{formatDate(appointmentData.date)}</span>
                </h2>
              </div>
              <div className='w-full flex justify-start items-center mb-2'>
                <h2 className='text-lg font-semibold font-serif text-gray-700'>
                  Slot: <span className='font-normal'>{formatTime(appointmentData.slot.start, appointmentData.slot.end)}</span>
                </h2>
              </div>
              
              <div className='w-full flex flex-col items-start mb-3'>
                <h2 className='text-base font-semibold font-serif text-gray-700'>
                  Description:
                </h2>
                <div className='overflow-y-auto px-6 w-full h-[100px] bg-gray-100 rounded-lg mt-3'>
                  <p className='text-lg font-serif text-gray-700'>
                    {appointmentData.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pay now button */}
          <div className='w-full flex flex-col justify-center items-center h-[80px] bg-white  '>
            <Button title="Pay now" onClick={handleClick} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
