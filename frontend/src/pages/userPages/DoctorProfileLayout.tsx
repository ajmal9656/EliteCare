import { useLocation } from 'react-router-dom';
import { DoctorDataWithSpecialization } from '../../interfaces/doctorinterface';
import { Outlet } from 'react-router-dom';

function DoctorProfileLayout() {
  
  const location = useLocation();
  const doctor = location.state?.doctor as DoctorDataWithSpecialization; 
  console.log("dddddddd",doctor)

 

  

  return (
    <div className='w-[100%] h-[1500px] md:h-[800px]  flex flex-col bg-gray-100'>
      {/* Doctor's Profile Image */}
      <div className='w-[100%] h-[600px] bg-gradient-to-r from-[#D2EFEA] to-[#ADE9DC] flex place-content-center'>
  <div className='w-[16%] h-[230px] mt-16 relative '>
    {/* Display Doctor's Image */}
    <img
      src={doctor.signedImageUrl}
      alt={doctor.name}
      className='w-full h-full object-cover z-10 mt-28 rounded-md'
    />
  </div>
</div>
<Outlet context={{ doctor }}/>


      
      
    </div>
  );
}

export default DoctorProfileLayout;

