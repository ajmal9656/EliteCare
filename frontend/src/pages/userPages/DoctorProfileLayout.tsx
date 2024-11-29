import { useLocation } from 'react-router-dom';
import { DoctorDataWithSpecialization } from '../../interfaces/doctorinterface';
import { Outlet } from 'react-router-dom';

function DoctorProfileLayout() {
  const location = useLocation();
  
  // Retrieve doctor and appointment data from location.state
  const doctor = location.state?.doctor as DoctorDataWithSpecialization | undefined;
  const appointmentData = location.state?.appointmentData; // Check if appointmentData is available

  // Log the doctor and appointment data for debugging
  console.log("Doctor Data:", doctor);
  console.log("Appointment Data:", appointmentData);

  return (
    <div className='w-full flex flex-col bg-gray-100'>
  {/* Doctor's Profile Image */}
  <div className='w-full h-[300px] bg-gradient-to-r from-[#D2EFEA] to-[#ADE9DC] flex justify-center'>
    <div className='w-[13%] h-[200px] mt-16 relative sm:w-[20%] md:w-[10%] lg:w-[13%]'>
      {doctor ? (
        <img
          src={doctor.signedImageUrl}
          alt={doctor.name}
          className='w-full h-full object-cover z-10 mt-28 rounded-md'
        />
      ) : (
        <p>No doctor data available</p>
      )}
    </div>
  </div>

  {/* Pass doctor and appointmentData (if available) through Outlet context */}
  {appointmentData ? (
    <Outlet context={{ doctor, appointmentData }} />
  ) : (
    <Outlet context={{ doctor }} />
  )}
</div>

  );
}

export default DoctorProfileLayout;
