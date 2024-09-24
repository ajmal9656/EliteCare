import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function Appointment() {
  const location = useLocation();

  // Extract data from location.state
  const appointmentData = location.state?.appointmentData;  // Check if appointmentData exists in location.state
  const doctor = location.state?.doctor;  // Check if appointmentData exists in location.state

  // Log the passed data to the console
  useEffect(() => {
    if (appointmentData) {
      console.log('Received Appointment Data:', appointmentData);
    }
  }, [appointmentData]);

  return (
    <div className='w-full h-[1000px] flex justify-center'>
      <div className='w-[70%] h-[400px] flex flex-col justify-center items-center'>
        <div className='w-[80%] h-[600px] bg-white mt-5 shadow-lg shadow-gray-200 flex flex-col'>
          {/* Render data if available */}
          {appointmentData ? (
            <div>
              <p>Patient Name: {appointmentData.patientName}</p>
              <p>Age: {appointmentData.age}</p>
              <p>Description: {appointmentData.description}</p>
              <p>Date: {appointmentData.date}</p>
              <p>Slot ID: {appointmentData.slotId.start}</p>
              <p>Doctor ID: {doctor.name}</p>
              <p>User ID: {appointmentData.userId}</p>
            </div>
          ) : (
            <p>No appointment data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Appointment;
