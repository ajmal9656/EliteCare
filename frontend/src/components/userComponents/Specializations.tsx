
import axiosUrl from '../../utils/axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Specialization {
  _id: string;
  name: string;
  description: string;
  isListed: boolean;
}

function Specializations() {

  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  const fetchSpecializations = async () => {

    try {
      console.log("enter");
      
      const response = await axiosUrl.get("/getSpecializations");
      console.log("spec",response.data)
      setSpecializations(response.data.response);  // Store the fetched data in state
    } catch (error) {
      console.error("Error fetching specializations:", error);
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []); // Empty dependency array to run once on mount

  
  return (
    <>
      <div id='services' className="h-[500px] flex flex-col justify-center lg:px-32 px-5 text-white bg-[url('/src/assets/specialization3.png')] bg-no-repeat bg-cover opacity-90">
        <div className="flex justify-end items-center w-full h-full">
          <div className="lg:w-3/5 pl-10 space-y-5 mt-10 pt-20 lg:mt-0">
            <h1 className="text-5xl font-bold leading-tight">
              Find the right doctor for you
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam magnam
              omnis natus accusantium quos. Reprehenderit incidunt expedita
              molestiae impedit at sequi dolorem iste sit culpa, optio voluptates
              fugiat vero consequatur?
            </p>
          </div>
        </div>
      </div>
      <section className="py-12 bg-gray-100 px-24">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10">
            Our Specializations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {specializations.map((specialization) => (
              <Link 
              key={specialization._id} 
              to={`/doctorsWithSpecialization/${specialization._id}`} 
              className="bg-white shadow-lg rounded-lg p-6 h-72 w-full sm:w-3/4 lg:w-2/3 mx-auto flex flex-col transition-transform transform hover:-translate-y-2 cursor-pointer"
              
            >
              <h3 className="text-2xl font-semibold mb-4">{specialization.name}</h3>
              <p className="text-gray-700 flex-1 overflow-hidden text-ellipsis">
                {specialization.description}
              </p>
            </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Specializations;
