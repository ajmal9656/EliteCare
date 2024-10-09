import { useNavigate, useOutletContext } from 'react-router-dom';
import Button from '../common/userCommon/Button';
import { DoctorDataWithSpecialization } from '../../interfaces/doctorinterface';
import { Rating, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axiosUrl from '../../utils/axios';

function DoctorProfile() {
  const navigate = useNavigate();

  // Access the doctor data from the Outlet context
  const { doctor } = useOutletContext<{ doctor: DoctorDataWithSpecialization }>();
  const [reviews, setReviews] = useState<any[]>([]); // Set the state to store reviews
  const [averageRating, setAverageRating] = useState(0); // State to store the average rating

  // Handle button click event
  const handleClick = () => {
    console.log('Booking slot for:', doctor);
    navigate(`/doctorProfile/checkSlots`, {
      state: { doctor }, // Passing the entire doctor object
    });
  };

  // Function to fetch additional doctor details
  const fetchDoctorDetails = async (doctorId: string) => {
    try {
      const response = await axiosUrl.get(`/doctordetails/${doctorId}`, {
        params: { reviewData: true }, // Include appointment parameter
      });
      console.log('Doctor Details:', response.data.response.appointments);
      setReviews(response.data.response.appointments);
      calculateAverageRating(response.data.response.appointments); // Calculate average rating after fetching reviews
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  // Function to calculate the average rating
  const calculateAverageRating = (reviews: any[]) => {
    if (reviews.length === 0) return 0; // Return 0 if there are no reviews
    const totalRating = reviews.reduce((acc, review) => acc + review.review.rating, 0);
    const average = totalRating / reviews.length;
    setAverageRating(Number(average.toFixed(1))); // Set average rating with one decimal point
  };

  // Fetch doctor details on component mount
  useEffect(() => {
    if (doctor && doctor._id) { // Make sure doctor and doctor.id are available
      fetchDoctorDetails(doctor._id); // Call the function with the doctor's ID
    }
  }, [doctor]);

  return (
    <div className='w-full flex justify-center'>
      <div className='w-[70%] h-auto flex flex-col justify-center items-center'>
        <div className='w-[95%] h-auto bg-white my-5 shadow-lg rounded-lg border border-gray-200'>
          {/* Doctor's Name */}
          <div className='w-full flex justify-end mt-5 items-center'>
            <div className="flex items-center gap-2 font-bold text-blue-gray-500 mr-16">
              {averageRating} {/* Display average rating */}
              <Rating value={averageRating} readOnly /> {/* Use readOnly to display the average rating */}
              <Typography color="blue-gray" className="font-medium text-blue-gray-500">
                Out of {reviews.length} Reviews {/* Display the number of reviews */}
              </Typography>
            </div>
          </div>
          
          <div className='w-full flex justify-center mt-5 items-center'>
            <h1 className='text-3xl font-bold font-serif text-backgroundColor'>
              Dr. {doctor.name}
            </h1>
          </div>

          {/* Doctor's Specialization */}
          <div className='w-full flex justify-center items-center my-2'>
            <h1 className='text-xl font-semibold font-serif text-gray-600'>
              {doctor.department.name}
            </h1>
          </div>

          {/* Doctor's Email */}
          <div className='w-full flex justify-center items-center my-2'>
            <h1 className='text-xl font-medium font-serif text-gray-600'>
              <span className='text-indigo-600'>{doctor.email}</span>
            </h1>
          </div>

          {/* Static text about Doctor's Specialty and Experience */}
          <div className='w-[95%] px-10 py-4 text-center'>
            <h2 className='text-lg font-medium text-gray-700'>
              Specialty & Experience
            </h2>
            <p className='text-gray-500 mt-2'>
              Dr. {doctor.name} has over 10 years of experience in {doctor.department.name}, specializing in treating complex medical conditions. 
              With a patient-centered approach, they are dedicated to providing the highest quality of care and ensuring each patient feels comfortable and informed.
            </p>
          </div>

          {/* Book Slot Button */}
          <div className='w-full h-20 flex justify-center items-center'>
            <Button title="Book Slot" onClick={handleClick} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
