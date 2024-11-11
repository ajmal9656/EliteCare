import { useNavigate, useOutletContext } from 'react-router-dom';
import Button from '../common/userCommon/Button';
import { DoctorDataWithSpecialization } from '../../interfaces/doctorinterface';
import { Rating, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axiosUrl from '../../utils/axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';


function DoctorProfile() {
  const navigate = useNavigate();
  const { doctor } = useOutletContext<{ doctor: DoctorDataWithSpecialization }>();
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);

  const handleClick = () => {
    navigate(`/doctorProfile/checkSlots`, {
      state: { doctor },
    });
  };

  const fetchDoctorDetails = async (doctorId: string) => {
    try {
      const response = await axiosUrl.get(`/doctordetails/${doctorId}`, {
        params: { reviewData: true },
      });
      setReviews(response.data.response.appointments);
      calculateAverageRating(response.data.response.appointments);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  const calculateAverageRating = (reviews: any[]) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.review.rating, 0);
    const average = totalRating / reviews.length;
    setAverageRating(Number(average.toFixed(1)));
  };

  useEffect(() => {
    if (doctor && doctor._id) {
      fetchDoctorDetails(doctor._id);
    }
  }, [doctor]);
  useEffect(() => {
    console.log("ffffffffffffffffff",reviews)
  }, [reviews]);

  // Custom arrow components
  const NextArrow = (props: any) => (
    <div
      className="absolute right-[-50px] top-[50%] transform -translate-y-1/2 cursor-pointer z-10 
                 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shadow-lg hover:bg-gray-300 transition-colors duration-300"
      onClick={props.onClick}
    >
      <MdArrowForwardIos fontSize="medium" style={{ color: '#333' }} />
    </div>
  );
  
  const PrevArrow = (props: any) => (
    <div
      className="absolute left-[-50px] top-[50%] transform -translate-y-1/2 cursor-pointer z-10 
                 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shadow-lg hover:bg-gray-300 transition-colors duration-300"
      onClick={props.onClick}
    >
      <MdArrowBackIos fontSize="medium" style={{ color: '#333' }} />
    </div>
  );

  const carouselSettings = {
    dots: true,
    infinite: true, // Enable cyclic navigation
    speed: 500,
    slidesToShow: 3, // Fixed to show 3 slides
    slidesToScroll: 1,
    nextArrow: <NextArrow  />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3, // Fixed to 3 to avoid resizing
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3, // Fixed to 3 to avoid resizing
          slidesToScroll: 1,
        },
      },
    ],
  };


  return (
    <div className='w-full flex justify-center'>
      <div className='w-[70%] h-auto flex flex-col justify-center items-center'>
        {/* Doctor details section */}
        <div className='w-[95%] h-auto bg-white my-5 shadow-lg rounded-lg border border-gray-200'>
          <div className='w-full flex justify-end mt-5 items-center'>
            <div className="flex items-center gap-2 font-bold text-blue-gray-500 mr-16">
              {averageRating}
              <Rating value={averageRating} readOnly />
              <Typography color="blue-gray" className="font-medium text-blue-gray-500">
                Out of {reviews.length} Reviews
              </Typography>
            </div>
          </div>
          <div className='w-full flex justify-center mt-5 items-center'>
            <h1 className='text-3xl font-bold font-serif text-backgroundColor'>
              Dr. {doctor.name}
            </h1>
          </div>
          <div className='w-full flex justify-center items-center my-2'>
            <h1 className='text-xl font-semibold font-serif text-gray-600'>
              {doctor.department.name}
            </h1>
          </div>
          <div className='w-full flex justify-center items-center my-2'>
            <h1 className='text-xl font-medium font-serif text-gray-600'>
              <span className='text-indigo-600'>{doctor.email}</span>
            </h1>
          </div>
          <div className='w-[95%] px-10 py-4 text-center'>
            <h2 className='text-lg font-medium text-gray-700'>
              Specialty & Experience
            </h2>
            <p className='text-gray-500 mt-2'>
              Dr. {doctor.name} has over 10 years of experience in {doctor.department.name}, specializing in treating complex medical conditions. 
              With a patient-centered approach, they are dedicated to providing the highest quality of care and ensuring each patient feels comfortable and informed.
            </p>
          </div>
          <div className='w-full h-20 flex justify-center items-center'>
            <Button title="Book Slot" onClick={handleClick} />
          </div>
        </div>

        {/* Carousel for Reviews */}
        <div className="w-full mt-4 relative pb-8">
  {/* Check if the reviews array is not empty */}
  {reviews.length > 0 && (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Patient Reviews
      </h2>
      <Slider {...carouselSettings}>
        {reviews.map((review, index) => (
          <div key={index} className="carousel-slide">
            <div className="bg-white shadow-lg rounded-lg p-6 h-full flex flex-col justify-between border border-gray-200 transition-all duration-300 hover:shadow-xl transform hover:scale-105">
              <div className="flex items-center space-x-3">
                <Typography variant="h6" className="font-semibold text-gray-900">
                  {review.patientName}
                </Typography>
              </div>
              <div className="mt-3">
                <Rating value={review.review.rating} readOnly precision={0.5} />
              </div>
              <div className="mt-4 text-gray-700">
                <Typography variant="body2" className="line-clamp-3">
                  {review.review.description}
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </>
  ) }
</div>



      </div>
    </div>
  );
}

export default DoctorProfile;
