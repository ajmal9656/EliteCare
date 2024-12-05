import { useEffect, useState } from "react";
import { DoctorDataWithSpecialization } from '../../interfaces/doctorinterface';
import { Link } from "react-router-dom";
import { getDoctorswithSpecialization } from "../../services/userAxiosService";

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
      const response = await getDoctorswithSpecialization(id,page,search)
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
  <div
    id="services"
    className="h-[500px] flex flex-col justify-center px-5 lg:px-32 text-white bg-[url('/src/assets/specDoctors.png')] bg-no-repeat bg-cover opacity-90"
  >
    <div className="flex justify-start items-center w-full h-full">
      <div className="w-full lg:w-3/5 pl-5 space-y-5 mt-10 pt-20 lg:mt-0">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          Find the right doctor for you
        </h1>
        <p className="text-sm md:text-base lg:text-lg">
          Choosing the right doctor is an important decision for your health and
          well-being. It’s essential to find a healthcare professional who
          understands your needs, communicates effectively, and has the
          expertise in the area of care you require. Whether you’re looking for
          a general physician or a specialist, consider factors like experience,
          bedside manner, and reviews from other patients. Taking the time to
          choose the right doctor ensures that you receive the best care
          possible and feel confident in your healthcare journey.
        </p>
      </div>
    </div>
  </div>

  <section className="py-8 sm:py-12 bg-gray-100 px-5 sm:px-10 lg:px-24">
    <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center mb-12 px-5 sm:px-10 lg:px-12 space-y-6 lg:space-y-0">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-backgroundColor text-center lg:text-left">
        Our Doctors
      </h2>

      {/* Search Container */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Search Doctors"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full sm:w-auto p-3 rounded-lg border border-gray-300"
        />
        <button
          className="w-full sm:w-auto bg-backgroundColor text-white py-3 px-6 rounded-lg"
          onClick={handleSearchSubmit}
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
          state={{ doctor }}
          className="bg-white shadow-lg rounded-lg p-6 flex flex-col transition-transform transform hover:-translate-y-2 cursor-pointer mx-auto max-w-xs" // Added max-w-xs
        >
          <img
            src={doctor.signedImageUrl}
            alt={doctor.name}
            className="w-full h-40 sm:h-60 object-cover mb-4 rounded-md"
          />
          <h3 className="text-xl sm:text-2xl font-semibold mb-1 truncate">
            {doctor.name}
          </h3>
          <p className="text-sm sm:text-base mb-1 truncate">
            Department: {doctor.department.name}
          </p>
          <p className="text-sm sm:text-base text-backgroundColor truncate">
            {doctor.email}
          </p>
        </Link>
      ))}
    </div>

    {/* Pagination */}
    <div className="flex flex-col items-center mt-8">
      {/* Help Text */}
      <span className="text-sm text-slate-500 mt-2">
        Showing{" "}
        <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
        <span className="font-semibold text-gray-900">{totalPages}</span>{" "}
        Entries
      </span>

      {/* Pagination Buttons */}
      <div className="flex mt-4 space-x-2">
        <button
          className={`flex items-center px-5 py-2 text-sm sm:text-base font-medium ${
            currentPage === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-backgroundColor text-white hover:scale-105 hover:shadow-lg"
          } rounded-l-md`}
          onClick={() => handlePagination("previous")}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <button
          className={`flex items-center px-5 py-2 text-sm sm:text-base font-medium ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-backgroundColor text-white hover:scale-105 hover:shadow-lg"
          } rounded-r-md`}
          onClick={() => handlePagination("next")}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  </section>
</>


  );
}

export default DoctorsWithSpecialization;
