import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Button from '../common/userCommon/Button';
import axiosUrl from '../../utils/axios';
import { toast } from 'sonner';



function Appointment() {
  const location = useLocation();
  const navigate = useNavigate()
  const appointmentData = location.state?.appointmentData;
  const doctor = location.state?.doctor;
  console.log("app",appointmentData);
  console.log("doctor",doctor)

  // Handle payment click
  const handleClick = async () => {
    try {
      // Call your backend to create a Stripe checkout session
      const responses = await axiosUrl.post('/create-checkout-session', {
        appointment: appointmentData, // Pass appointmentData as part of the object
      });
  
      console.log("session", responses.data.message);
  
      if (responses.data.session) {
        window.location.href = responses.data.session.url;
      }
  
    } catch (error: any) {
      
      // Check if the error response contains data and handle it
      if (error.response && error.response.data && error.response.data.message) {
        console.error('Error in Stripe Checkout process:', error.response.data.message);
        // You can display this message on the UI as well
        toast.error(`${error.response.data.message}`)
        navigate(`/doctorProfile/checkSlots`, {
          state: { doctor }, // Passing the entire doctor object
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
    <div className='w-full h-[1000px] flex justify-center'>
      <div className='w-[70%] h-[400px] flex flex-col justify-center items-center'>
        <div className='w-[80%] h-[600px] pt-16 bg-white mt-5 shadow-lg shadow-gray-200'>
          <div className='w-[100%] h-[45px] flex place-content-center items-center'>
            <h1 className='text-2xl font-semibold font-serif text-backgroundColor'>
              Dr. {appointmentData.doctor.name}
            </h1>
          </div>
          <div className='w-[100%] h-[25px] flex place-content-center items-center'>
            <h1 className='text-xl font-semibold font-serif text-backgroundColor'>
              Specialization: {appointmentData.doctor.department.name}
            </h1>
          </div>
          <div className='w-[100%] h-[45px] flex place-content-center items-center'>
            <Button title="Pay now" onClick={handleClick} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointment;
