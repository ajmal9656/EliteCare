import { useEffect, useState } from "react";
import axiosUrl from "../../utils/axios";
import { DoctorDataWithSpecialization } from '../../interfaces/doctorinterface';
import { Link } from "react-router-dom";

interface DoctorsWithSpecializationProps {
  specializationId: string | undefined;
}

function DoctorsWithSpecialization({ specializationId }: DoctorsWithSpecializationProps) {
  const [doctors, setDoctors] = useState<DoctorDataWithSpecialization[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchDoctorsWithSpecialization = async (id: string, page: number, search: string) => {
    try {
      const response = await axiosUrl.get(`/getDoctorsWithSpecialization/${id}`, {
        params: { page, limit: 3, search } // Added search query to params
      });
      console.log("response", response.data.data);
      setDoctors(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  useEffect(() => {
    if (specializationId) {
      fetchDoctorsWithSpecialization(specializationId, currentPage, searchQuery);
    }
  }, [specializationId, currentPage]); // Re-fetch when searchQuery changes

  const handlePagination = (direction: string) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "previous" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update search query as user types
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1); // Reset to the first page when searching
    fetchDoctorsWithSpecialization(specializationId as string, 1, searchQuery); // Re-fetch with search query
  };

  return (
    <>
      <div id='services' className="h-[500px] flex flex-col justify-center lg:px-32 px-5 text-white bg-[url('/src/assets/specDoctors.png')] bg-no-repeat bg-cover opacity-90">
        <div className="flex justify-start items-center w-full h-full">
          <div className="lg:w-3/5 pl-5 space-y-5 mt-10 pt-20 lg:mt-0">
            <h1 className="text-5xl font-bold leading-tight">
              Find the right doctor for you
            </h1>
            <p>Choosing the right doctor is an important decision for your health and well-being. It’s essential to find a healthcare professional who understands your needs, communicates effectively, and has the expertise in the area of care you require. Whether you’re looking for a general physician or a specialist, consider factors like experience, bedside manner, and reviews from other patients. Taking the time to choose the right doctor ensures that you receive the best care possible and feel confident in your healthcare journey.</p>
          </div>
        </div>
      </div>

      <section className="py-12 bg-gray-100 px-24">
        <div className="container mx-auto flex justify-between items-center mb-12 px-12">
          <h2 className="text-4xl font-bold text-backgroundColor">
            Our Doctors
          </h2>

          {/* Search Container */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search Doctors"
              value={searchQuery} // Controlled input
              onChange={handleSearchChange} // Update state on input change
              className="p-3 rounded-lg border border-gray-300"
            />
            <button
              className="bg-backgroundColor text-white py-3 px-6 rounded-lg"
              onClick={handleSearchSubmit} // Trigger search on button click
            >
              Search
            </button>
          </div>
        </div>

        {/* Doctors List */}
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
              <p className="mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                Department: {doctor.department.name}
              </p>
              <p className="text-backgroundColor overflow-hidden text-ellipsis whitespace-nowrap">
                {doctor.email}
              </p>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center">
          {/* Help text */}
          <span className="text-sm text-slate-500 dark:text-slate-400 mt-5">
            Showing <span className="font-semibold text-gray-900 dark:text-slate-300">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-slate-300">{totalPages}</span> Entries
          </span>

          {/* Pagination Buttons */}
          <div className="inline-flex mt-4 space-x-2">
            <button
              className={`flex items-center justify-center px-5 py-2 h-10 text-base font-medium ${currentPage === 1 ? "bg-backgroundColor text-gray-100 cursor-not-allowed" : "bg-backgroundColor text-white hover:scale-105 hover:shadow-xl hover:bg-backgroundColor"} rounded-l-md shadow-lg transform transition duration-300 ease-in-out dark:bg-slate-500 dark:text-gray-200`}
              onClick={() => handlePagination("previous")}
              disabled={currentPage === 1}
            >
              <svg className="w-4 h-4 mr-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
              </svg>
              Prev
            </button>

            <button
              className={`flex items-center justify-center px-5 py-2 h-10 text-base font-medium ${currentPage === totalPages ? "bg-backgroundColor text-gray-100 cursor-not-allowed" : "bg-backgroundColor to-gray-700 text-white hover:scale-105 hover:shadow-xl hover:bg-backgroundColor"} rounded-r-md shadow-lg transform transition duration-300 ease-in-out dark:bg-slate-500 dark:text-gray-200`}
              onClick={() => handlePagination("next")}
              disabled={currentPage === totalPages}
            >
              Next
              <svg className="w-4 h-4 ml-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default DoctorsWithSpecialization;
