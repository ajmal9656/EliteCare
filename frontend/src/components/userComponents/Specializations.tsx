import axiosUrl from '../../utils/axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdHealthAndSafety } from "react-icons/md";

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
      const response = await axiosUrl.get("/getSpecializations");
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
      <div id='services' className="h-[500px] flex flex-col justify-center lg:px-32 px-5 text-white bg-[url('/src/assets/specialization3.png')] bg-no-repeat bg-cover opacity-90">
        <div className="flex justify-end items-center w-full h-full">
          <div className="lg:w-3/5 pl-10 space-y-5 mt-10 pt-20 lg:mt-0">
            <h1 className="text-5xl font-bold leading-tight">
              Find the right doctor for you
            </h1>
            <p>
            Choosing the right specialization is a crucial step in shaping your career and future. It involves aligning your interests, strengths, and passions with a field that offers growth opportunities and personal fulfillment. Whether you're drawn to healthcare, technology, education, or the arts, selecting a specialization allows you to focus your efforts and expertise in an area that excites you. It's important to research and explore various fields, considering your long-term goals and the impact each specialization can have on your career path.
            </p>
          </div>
        </div>
      </div>

      {/* Section for Title and Search */}
      <section className="py-12 bg-gray-100 px-24">
        <div className="container mx-auto flex justify-between items-center mb-12 px-12">
          <h2 className="text-4xl font-bold text-backgroundColor">
            Our Specializations
          </h2>

          {/* Search Container */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search Specializations"
              className="p-3 rounded-lg border border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}  // Update search term on change
            />
            <button
              className="bg-backgroundColor text-white py-3 px-6 rounded-lg"
              onClick={() => console.log("Search Button Clicked")} // Placeholder for actual search logic
            >
              Search
            </button>
          </div>
        </div>

        {/* Specializations List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSpecializations.map((specialization) => (
            <Link
              key={specialization._id}
              to={`/doctorsWithSpecialization/${specialization._id}`}
              className="bg-white shadow-lg rounded-lg p-6 h-85 w-full sm:w-3/4 lg:w-2/3 mx-auto flex flex-col items-center transition-transform transform hover:-translate-y-2 cursor-pointer"
            >
              {/* Centered Icon */}
              <div className="bg-[#d5f2ec] p-4 rounded-full transition-colors duration-300 ease-in-out group-hover:bg-[#ade9dc] flex items-center justify-center mb-4">
                {icon2}
              </div>
              {/* Centered Name */}
              <h3 className="text-2xl font-semibold mb-2 text-center text-backgroundColor">
                {specialization.name}
              </h3>
              {/* Centered Description */}
              <p className=" text-center flex-1 overflow-hidden text-ellipsis">
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
