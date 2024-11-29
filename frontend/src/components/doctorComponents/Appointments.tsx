import { useEffect, useState } from 'react';
import CustomTable from "../common/doctorCommon/Table";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import axiosUrl from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { logoutDoctor } from '../../Redux/Action/doctorActions';

function Appointments() {
  const DoctorData = useSelector((state: RootState) => state.doctor);
  const navigate = useNavigate();
  const dispatch:any = useDispatch()
  const [rows, setRows] = useState<Array<{ [key: string]: any }>>([]);
  const [status, setStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const columns = [
    { id: 'patientName', label: 'Patient Name', align: 'left' as 'left' },
    { id: 'date', label: 'Date', align: 'left' as 'left' },
    { id: 'time', label: 'Time', align: 'left' as 'left' },
    { id: 'status', label: 'Status', align: 'left' as 'left' },
    { id: 'viewDetails', label: 'View Details', align: 'left' as 'left' },
  ];

  const handleViewDetails = (row: { [key: string]: any }) => {
    navigate('/doctor/appointmentDetails', { state: { appointment: row } });
  };

  const fetchAppointments = async (status: string, page: number, startDate: Date | null, endDate: Date | null) => {
    try {
      const params: { [key: string]: any } = { status, page, limit: 5 };
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      console.log("params",params);
      

      const response = await axiosUrl.get(`/doctor/getAppointments/${DoctorData?.doctorInfo?.doctorId}`, { params });
      const convertedData = response.data.data.appointments.map((appointment: any) => ({
        patientName: appointment.patientNAme,
        date: new Date(appointment.date).toLocaleDateString(),
        time: `${appointment.start} to ${appointment.end}`,
        status: appointment.status,
        viewDetails: appointment,
      }));
      setRows(convertedData);
      setTotalPages(response.data.data.totalPages);
    } catch (error:any) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Redirecting to login page.");
        await dispatch(logoutDoctor());
   
          navigate("/doctor/login"); // Navigate to the login page if unauthorized
      } else {
        console.error("Error fetching user details:", error);
      }
    }
  };

  useEffect(() => {
    if (DoctorData?.doctorInfo?.doctorId) {
      fetchAppointments(status, currentPage, startDate, endDate);
    }
  }, [status, DoctorData?.doctorInfo?.doctorId, currentPage]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1); // Reset to first page
  };

  const handlePagination = (direction: string) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'previous' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on search
    fetchAppointments(status, currentPage, startDate, endDate);
  };

  return (
    <div className="flex flex-col w-full mx-auto pl-80 p-4 ml-3 mt-14 h-screen px-10">
      <div className="flex space-x-4 mb-4 justify-between items-center pt-10">
        <div className="flex space-x-4 items-center">
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            placeholderText="Start Date"
            className="text-sm px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-28"
          />
          <DatePicker
            selected={endDate}
            onChange={(date: Date|null) => setEndDate(date)}
            placeholderText="End Date"
            className="text-sm px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-28"
          />
          <button
            className="text-sm px-2 py-1 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        <div className="flex space-x-4 justify-end items-center">
          <div className="flex space-x-4">
            {['All', 'pending', 'prescription pending', 'completed', 'cancelled', 'cancelled by Dr'].map((buttonStatus) => (
              <button
                key={buttonStatus}
                className={`px-3 py-1 border border-transparent text-sm font-medium ${status === buttonStatus ? 'bg-blue-500 text-white' : 'bg-white text-gray-500'} rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2`}
                onClick={() => handleStatusChange(buttonStatus)}
              >
                {buttonStatus.charAt(0).toUpperCase() + buttonStatus.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Table */}
      <CustomTable columns={columns} rows={rows} onViewDetails={handleViewDetails} />

      {/* Pagination and Info */}
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
