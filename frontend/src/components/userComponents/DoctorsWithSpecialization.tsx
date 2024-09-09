import { useEffect, useState } from "react";
import axiosUrl from "../../utils/axios";
import { DoctorDetails } from '../../interfaces/doctorinterface';
import { Link } from "react-router-dom";



interface DoctorsWithSpecializationProps {
  specializationId: string | undefined;
}

function DoctorsWithSpecialization({ specializationId }: DoctorsWithSpecializationProps) {
  const [doctors, setDoctors] = useState<DoctorDetails[]>([]);

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
    console.log("Updated doctors list:", doctors);
  }, [doctors]);

  useEffect(() => {
    if (specializationId) {
      fetchDoctorsWithSpecialization(specializationId);
      
    }
  }, []);

  return (
    <section className="py-12 bg-gray-100 px-24">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10">
            Our Doctors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <Link 
              key={doctor._id} 
              to={`/doctorsWithdoctor/${doctor._id}`} 
              className="bg-white shadow-lg rounded-lg p-6 h-72 w-full sm:w-3/4 lg:w-2/3 mx-auto flex flex-col transition-transform transform hover:-translate-y-2 cursor-pointer"
              
            >
              <h3 className="text-2xl font-semibold mb-4">{doctor.name}</h3>
              <p className="text-gray-700 flex-1 overflow-hidden text-ellipsis">
                {doctor.email}
              </p>
            </Link>
            ))}
          </div>
        </div>
      </section>
  );
}



export default DoctorsWithSpecialization;
