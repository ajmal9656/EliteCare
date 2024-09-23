import { useEffect, useState } from "react";
import axiosUrl from "../../utils/axios";
import { DoctorDataWithSpecialization } from '../../interfaces/doctorinterface';
import { Link } from "react-router-dom";

interface DoctorsWithSpecializationProps {
  specializationId: string | undefined;
}

function DoctorsWithSpecialization({ specializationId }: DoctorsWithSpecializationProps) {
  const [doctors, setDoctors] = useState<DoctorDataWithSpecialization[]>([]);

  const fetchDoctorsWithSpecialization = async (id: string) => {
    try {
      const response = await axiosUrl.get(`/getDoctorsWithSpecialization/${id}`);
      console.log("responsedgvs",response.data.response)
      setDoctors(response.data.response); 
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };
  
  useEffect(() => {
    if (specializationId) {
      fetchDoctorsWithSpecialization(specializationId);
    }
  }, [specializationId]);

  return (
    <>
      <div id='services' className="h-[500px] flex flex-col justify-center lg:px-32 px-5 text-white bg-[url('/src/assets/specDoctors.png')] bg-no-repeat bg-cover opacity-90">
        <div className="flex justify-start items-center w-full h-full">
          <div className="lg:w-3/5 pl-5 space-y-5 mt-10 pt-20 lg:mt-0">
            <h1 className="text-5xl font-bold leading-tight">
              Find the right doctor for you
            </h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam magnam omnis natus accusantium quos. Reprehenderit incidunt expedita moles</p>
          </div>
        </div>
      </div>

      <section className="py-12 bg-gray-100 px-24">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10 text-backgroundColor">
            Our Doctors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <Link
                key={doctor._id}
                to={{
                  pathname: `/doctorProfile/profile`,
                }}
                state={{ doctor }} // Passing doctor details to the next page
                className="bg-white shadow-lg rounded-lg p-6 h-85 w-full sm:w-3/4 lg:w-2/3 mx-auto flex flex-col transition-transform transform hover:-translate-y-2 cursor-pointer"
              >
                <img
                  src={doctor.signedImageUrl}
                  alt={doctor.name}
                  className="w-full h-60 object-cover mb-4 rounded-md"
                />
                <h3 className="text-2xl font-semibold mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {doctor.name}
                </h3>
                <p className=" mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  Department: {doctor.department.name}
                </p>
                <p className="text-backgroundColor overflow-hidden text-ellipsis whitespace-nowrap">
                  {doctor.email}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default DoctorsWithSpecialization;
