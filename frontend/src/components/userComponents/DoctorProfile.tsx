import { useNavigate, useOutletContext } from 'react-router-dom';
import Button from '../common/userCommon/Button';
import { DoctorDataWithSpecialization } from '../../interfaces/doctorinterface';

function DoctorProfile() {
  const navigate = useNavigate();

  // Access the doctor data from the Outlet context
  const { doctor } = useOutletContext<{ doctor: DoctorDataWithSpecialization }>();

  // Handle button click event
  const handleClick = () => {
    console.log('Booking slot for:', doctor);
    navigate(`/doctorProfile/checkSlots`, {
      state: { doctor }, // Passing the entire doctor object
    });
  };

  return (
    <div className='w-[100%] h-[1000px] flex place-content-center'>
      <div className='w-[70%] h-[400px] flex flex-col justify-center items-center'>
        <div className='w-[80%] h-[600px] pt-24 bg-white mt-5 shadow-lg shadow-gray-200'>
          {/* Doctor's Name */}
          <div className='w-[100%] h-[45px] flex place-content-center items-center'>
            <h1 className='text-2xl font-semibold font-serif text-backgroundColor'>
              Dr. {doctor.name}
            </h1>
          </div>

          {/* Doctor's Specialization */}
          <div className='w-[100%] h-[45px] flex place-content-center items-center'>
            <h1 className='text-xl font-semibold font-serif text-backgroundColor'>
              Specialization: {doctor.department.name}
            </h1>
          </div>

          {/* Doctor's Email */}
          <div className='w-[100%] h-[45px] flex place-content-center items-center'>
            <h1 className='text-xl font-semibold font-serif text-backgroundColor'>
              Email: {doctor.email}
            </h1>
          </div>

          {/* Book Slot Button */}
          <div className='w-[100%] h-[45px] flex place-content-center items-center'>
            <Button title="Book Slot" onClick={handleClick} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
