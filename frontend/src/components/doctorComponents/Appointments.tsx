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
  const fetchAppointments = async (status: string) => {
    try {
      const response = await axiosUrl.get(`/doctor/getAppointments/${DoctorData?.doctorInfo?.doctorId}`, {
        params: { status }
      });
      console.log("appointment data", response.data.data);

      // Transform the data to match the table's expected format
      const convertedData = response.data.data.map((appointment: any) => ({
        patientName: appointment.patientNAme, // Ensure this matches your data structure
        date: new Date(appointment.date).toLocaleDateString(), // Format the date
        time: `${appointment.start} to ${appointment.end}`,
        status: appointment.status,
        viewDetails: appointment, // Pass the entire appointment object or specific identifier
      }));

      setRows(convertedData); // Save transformed data in rows
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Call fetchAppointments on status change or when component mounts
  useEffect(() => {
    if (DoctorData?.doctorInfo?.doctorId) {
      fetchAppointments(status); // Fetch data for current status
    }
  }, [status, DoctorData?.doctorInfo?.doctorId]); // Dependencies on status and doctor ID

  // Handle status change
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus); // Update status
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
    </div>
  );
}

export default Appointments;
