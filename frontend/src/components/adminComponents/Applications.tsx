import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DoctorApplication } from '../../interfaces/doctorinterface';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../../Redux/Action/adminActions';
import { useDispatch } from 'react-redux';
import { getApplications, getDoctorApplication } from '../../services/adminAxiosService';

function Applications() {
  const navigate = useNavigate();
  const dispatch:any = useDispatch()
  const [applications, setApplications] = useState<DoctorApplication[]>([]);
   const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchApplications = async (page:number) => {
    try {
      const response = await getApplications(page) 
      setApplications(response.data.response.applications);
      setTotalPages(response.data.response.totalPages)
    } catch (error:any) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Redirecting to login page.");
        await dispatch(logoutAdmin());
          navigate("/admin/login"); // Navigate to the login page if unauthorized
      } else {
        console.error("Error fetching user details:", error);
      }
    }
  };

  const viewApplication = async (applicationId: string) => {
    try {
      const response = await getDoctorApplication(applicationId)
      navigate('/admin/viewApplication', { state: { response: response.data.response } });
    } catch (error) {
      toast.error('Failed to fetch applications');
    }
  };

  useEffect(() => {
    fetchApplications(currentPage);
  }, [currentPage]);
  const handlePagination = (direction: string) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "previous" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col pl-64 p-10 ml-3 mt-14">
      <div className='flex flex-row justify-between'>
        <div className="flex justify-between items-center mb-4">
          
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4  border-b border-gray-300 text-gray-700">Name</th>
            <th className="py-2 px-4  border-b border-gray-300 text-gray-700">Department</th>
            <th className="py-2 px-4 text-center border-b border-gray-300 text-gray-700">View Details</th>
          </tr>
        </thead>
        <tbody >
          {applications.map((application:any) => (
            <tr key={application._id} className="hover:bg-gray-100 transition duration-200 text-center">
              <td className="py-2 px-4 border-b border-gray-300">{`Dr. ${application.name}`}</td>
              <td className="py-2 px-4 border-b border-gray-300">{application.department.name}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">
                <button
                  className='bg-blue-500 text-white px-3 py-1 rounded transition duration-200 hover:bg-blue-600'
                  onClick={() => viewApplication(application._id)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col items-center">
  {/* Help text */}
  <span className="text-sm text-slate-500 dark:text-slate-400 mt-5">
    Showing <span className="font-semibold text-gray-900 dark:text-slate-300">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-slate-300">{totalPages}</span> Entries
  </span>

  {/* Buttons */}
  <div className="inline-flex mt-4 space-x-2">
    <button
      className={`flex items-center justify-center px-5 py-2 h-10 text-base font-medium ${
        currentPage === 1 
          ? "bg-slate-500 text-gray-100 cursor-not-allowed" 
          : "bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 text-white hover:scale-105 hover:shadow-xl hover:from-blue-600 hover:to-cyan-600"
      } rounded-l-md shadow-lg transform transition duration-300 ease-in-out dark:bg-slate-500 dark:text-gray-200`}
      onClick={() => handlePagination("previous")}
      disabled={currentPage === 1}
    >
      <svg className="w-4 h-4 mr-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
      </svg>
      Prev
    </button>

    <button
      className={`flex items-center justify-center px-5 py-2 h-10 text-base font-medium ${
        currentPage === totalPages 
          ? "bg-slate-500 text-gray-100 cursor-not-allowed" 
          : "bg-gradient-to-br from-gray-800 via-gray-600 to-gray-700 text-white hover:scale-105 hover:shadow-xl hover:from-cyan-600 hover:to-blue-600"
      } rounded-r-md shadow-lg transform transition duration-300 ease-in-out dark:bg-slate-500 dark:text-gray-200`}
      onClick={() => handlePagination("next")}
      disabled={currentPage === totalPages}
    >
      Next
      <svg className="w-4 h-4 ml-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
      </svg>
    </button>
  </div>
</div>
    </div>
  );
}

export default Applications;
