import { useEffect, useState } from 'react';
import CustomTable from "../common/doctorCommon/Table";
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import axiosUrl from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

function Appointments() {
  // Access doctor data from Redux store
  const DoctorData = useSelector((state: RootState) => state.doctor);
  const navigate = useNavigate();
  // State to store appointment data
  const [rows, setRows] = useState<Array<{ [key: string]: any }>>([]);
  const [status, setStatus] = useState<string>('All'); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Define the columns for the table
  const columns = [
    { id: 'patientName', label: 'Patient Name', align: 'left' as 'left' },
    { id: 'date', label: 'Date', align: 'left' as 'left' },
    { id: 'time', label: 'Time', align: 'left' as 'left' },
    { id: 'status', label: 'Status', align: 'left' as 'left' },
    { id: 'viewDetails', label: 'View Details', align: 'left' as 'left' },
  ];

  // Handle view details button click
  const handleViewDetails = (row: { [key: string]: any }) => {
    console.log('View details for:', row);
    navigate('/doctor/appointmentDetails', { state: { appointment: row } }); // Navigate with state
  };

  
  // Fetch appointments based on the current status
  const fetchAppointments = async (status: string, page: number) => {
    try {
      const response = await axiosUrl.get(`/doctor/getAppointments/${DoctorData?.doctorInfo?.doctorId}`, {
        params: { status, page, limit: 7 }, // Adding page and limit to the API request
      });
      console.log("appointment data", response.data.data);

      if (Array.isArray(response.data.data.appointments)) {  // Check if 'data' is an array
        const convertedData = response.data.data.appointments.map((appointment: any) => ({
          patientName: appointment.patientNAme,
          date: new Date(appointment.date).toLocaleDateString(),
          time: `${appointment.start} to ${appointment.end}`,
          status: appointment.status,
          viewDetails: appointment, 
        }));
  
        setRows(convertedData);
        setTotalPages(response.data.data.totalPages); // Update rows if the data is an array
      } else {
        console.error('Expected an array of appointments, but received:', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Call fetchAppointments on status change or when component mounts
  useEffect(() => {
    if (DoctorData?.doctorInfo?.doctorId) {
      fetchAppointments(status, currentPage); // Fetch data for current status
    }
  }, [status, DoctorData?.doctorInfo?.doctorId, currentPage]); // Dependencies on status and doctor ID

  // Handle status change
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus); // Update status
    setCurrentPage(1);
  };

  const handlePagination = (direction: string) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "previous" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col w-full mx-auto pl-80 p-4 ml-3 mt-14 h-screen px-10">
      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-4 justify-end  pt-10">
        <button
          className={`px-3 py-1 border border-transparent text-sm font-medium ${
            status === 'All' ? 'bg-backgroundColor text-white' : 'bg-white text-gray-500'
          } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-backgroundColor`}
          onClick={() => handleStatusChange('All')}
        >
          All
        </button>
        <button
          className={`px-3 py-1 border border-transparent text-sm font-medium ${
            status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-500'
          } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
          onClick={() => handleStatusChange('pending')}
        >
          Pending
        </button>
        <button
          className={`px-3 py-1 border border-transparent text-sm font-medium ${
            status === 'prescription pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-500'
          } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
          onClick={() => handleStatusChange('prescription pending')}
        >
          Prescription Pending
        </button>
        <button
          className={`px-3 py-1 border border-transparent text-sm font-medium ${
            status === 'completed' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500'
          } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          onClick={() => handleStatusChange('completed')}
        >
          Completed
        </button>
        <button
          className={`px-3 py-1 border border-transparent text-sm font-medium ${
            status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-white text-gray-500'
          } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
          onClick={() => handleStatusChange('cancelled')}
        >
          Cancelled
        </button>
        <button
          className={`px-3 py-1 border border-transparent text-sm font-medium ${
            status === 'cancelled by Dr' ? 'bg-red-500 text-white' : 'bg-white text-gray-500'
          } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
          onClick={() => handleStatusChange('cancelled by Dr')}
        >
          Cancelled by Dr
        </button>
      </div>

      {/* Custom Table */}
      <CustomTable columns={columns} rows={rows} onViewDetails={handleViewDetails} />
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
          : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-105 hover:shadow-xl hover:from-blue-600 hover:to-cyan-600"
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
          : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:scale-105 hover:shadow-xl hover:from-cyan-600 hover:to-blue-600"
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

export default Appointments;
