import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Button from '../common/userCommon/Button';
import axiosUrl from '../../utils/axios';



function Appointment() {
  const location = useLocation();
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
                       // Pass doctor as part of the object
      });

      console.log("session",responses.data)

      if(responses.data.session){
        window.location.href = responses.data.session.url
            }

      

      

     
    } catch (error:any) {
      console.error('Error in Stripe Checkout process:', error);
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
