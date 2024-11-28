import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import axiosUrl from "../../utils/axios";
import { Link } from "react-router-dom";

interface Doctor {
  _id: string;
  name: string;
  department: { name: string };
  signedImageUrl: string;
}

const Doctors: React.FC = () => {

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosUrl.get('/getDoctors'); // Replace with your backend endpoint
        console.log("docsss",response.data.response);
        
        setDoctors(response.data.response); // Assuming response data has the list of doctors
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);
  

  const slider = useRef<Slider | null>(null);

  const settings = {
    accessibility: true,
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };

  

  return (
    <div className=" min-h-screen flex flex-col justify-center lg:px-28 px-5 pt-16">
  <div className=" flex flex-col items-center lg:flex-row justify-between mb-10 lg:mb-0">
    <div>
      <h1 className=" text-4xl font-semibold text-center lg:text-start">
        Our Doctors
      </h1>
      <p className=" mt-2 text-center lg:text-start">
        Our Doctors are here to take care for you...
      </p>
    </div>
    <div className="flex gap-5 mt-4 lg:mt-0">
      <button
        className=" bg-[#d5f2ec] text-backgroundColor px-4 py-2 rounded-lg active:bg-[#ade9dc]"
        onClick={() => slider.current?.slickPrev()}
      >
        <FaArrowLeft size={25} />
      </button>
      <button
        className=" bg-[#d5f2ec] text-backgroundColor px-4 py-2 rounded-lg active:bg-[#ade9dc]"
        onClick={() => slider.current?.slickNext()}
      >
        <FaArrowRight size={25} />
      </button>
    </div>
  </div>
  <div className=" mt-5">
  <Slider ref={slider} {...settings}>
    {Array.isArray(doctors) && doctors.map((doctor, index) => (
      <Link
      key={doctor._id}
              to={{
                pathname: `/doctorProfile/profile`,
              }}
              state={{ doctor}}
      className="h-[390px] max-w-sm text-black rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] mb-2 cursor-pointer mx-auto"
    >
      <div className="overflow-hidden h-72 rounded-t-xl w-full">
        <img
          src={doctor.signedImageUrl}
          alt="img"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-center items-center">
        <h1 className="font-semibold text-xl pt-4">Dr. {doctor.name}</h1>
        <h3 className="pt-2">{doctor.department.name}</h3>
      </div>
    </Link>
    
    ))}
  </Slider>
</div>

</div>

  );
};

export default Doctors;
