
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdHealthAndSafety } from "react-icons/md";
import { getSpecializations } from '../../services/userAxiosService';

interface Specialization {
  _id: string;
  name: string;
  description: string;
  isListed: boolean;
}

function Specializations() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');  // Add state for the search term

  const fetchSpecializations = async () => {
    try {
      const response = await getSpecializations()
      setSpecializations(response.data.response);  // Store the fetched data in state
    } catch (error) {
      console.error("Error fetching specializations:", error);
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []); // Empty dependency array to run once on mount

  const icon2 = <MdHealthAndSafety size={35} className="text-backgroundColor" />;

  // Filter specializations based on search term
  const filteredSpecializations = specializations.filter(specialization =>
    specialization.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <>
      {/* Hero Section */}
      <div
        id="services"
        className="h-[500px] flex flex-col justify-center lg:px-32 px-5 text-white bg-[url('/src/assets/specialization3.png')] bg-no-repeat bg-cover opacity-90"
      >
        <div className="flex flex-col lg:flex-row justify-end items-center w-full h-full">
          <div className="lg:w-3/5 pl-10 space-y-5 mt-10 pt-20 lg:mt-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center lg:text-left">
              Find the right doctor for you
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-justify lg:text-left">
              Choosing the right specialization is a crucial step in shaping your
              career and future. It involves aligning your interests, strengths,
              and passions with a field that offers growth opportunities and
              personal fulfillment. Whether you're drawn to healthcare, technology,
              education, or the arts, selecting a specialization allows you to
              focus your efforts and expertise in an area that excites you.
            </p>
          </div>
        </div>
      </div>

      {/* Section for Title and Search */}
      <section className="py-12 bg-gray-100 px-5 lg:px-24">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center mb-12 px-5 lg:px-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-backgroundColor text-center lg:text-left">
            Our Specializations
          </h2>

          {/* Search Container */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6 lg:mt-0">
            <input
              type="text"
              placeholder="Search Specializations"
              className="p-3 rounded-lg border border-gray-300 w-full sm:w-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
            />
            <button
              className="bg-backgroundColor text-white py-3 px-6 rounded-lg w-full sm:w-auto"
              onClick={() => console.log("Search Button Clicked")} // Placeholder for actual search logic
            >
              Search
            </button>
          </div>
        </div>

        {/* Specializations List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-5 lg:px-0">
          {filteredSpecializations.map((specialization) => (
            <Link
              key={specialization._id}
              to={`/doctorsWithSpecialization/${specialization._id}`}
              className="bg-white shadow-lg rounded-lg p-6 h-auto sm:h-85 w-full sm:w-3/4 lg:w-2/3 mx-auto flex flex-col items-center transition-transform transform hover:-translate-y-2 cursor-pointer"
            >
              {/* Centered Icon */}
              <div className="bg-[#d5f2ec] p-4 rounded-full transition-colors duration-300 ease-in-out group-hover:bg-[#ade9dc] flex items-center justify-center mb-4">
                {icon2}
              </div>
              {/* Centered Name */}
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-center text-backgroundColor">
                {specialization.name}
              </h3>
              {/* Centered Description */}
              <p className="text-sm sm:text-base lg:text-lg text-center flex-1 overflow-hidden text-ellipsis">
                {specialization.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>

  );
}

export default Specializations;
