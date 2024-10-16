import { useState, useEffect } from 'react';
import axiosUrl from '../../utils/axios';

function Appointments() {
  // State to store fetched appointments
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState<string>('All'); 

  // Function to fetch appointments from the backend
  const fetchAppointments = async (status: string) => {
    try {
      const response = await axiosUrl.get('/admin/getAppointments',{
        params: { status }
      });
      console.log('tt', response.data.data);
      setAppointments(response.data.data);
    } catch (err) {
      console.error(err); // It's good practice to log errors for debugging
    }
  };

  // useEffect to fetch appointments when the component mounts
  useEffect(() => {
    fetchAppointments(status);
  }, [status]);

  const viewAppointment = (id: string) => {
    // Logic to view appointment details
    console.log(`Viewing appointment with ID: ${id}`);
  };

  // Helper function to determine status color
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
      case 'cancelled by Dr':
        return 'text-red-600';
      case 'prescription pending':
        return 'text-orange-600'; // For Prescription Pending
      default:
        return 'text-gray-600'; // Default text color for unrecognized statuses
    }
  };

  

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
  };

  return (
    <div className="flex flex-col pl-64 p-4 ml-3 mt-14">
      <div className="flex flex-row justify-end items-center mb-4">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded border border-transparent text-sm font-medium ${status === 'All' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500'}`}
            onClick={() => handleStatusChange('All')}
          >
            All
          </button>

          <button
            className={`px-3 py-1 rounded border border-transparent text-sm font-medium ${status === 'completed' ? 'bg-green-600 text-white' : 'bg-white text-gray-500'}`}
            onClick={() => handleStatusChange('completed')}
          >
            Completed
          </button>
          
          <button
            className={`px-3 py-1 rounded border border-transparent text-sm font-medium ${status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-500'}`}
            onClick={() => handleStatusChange('pending')}
          >
            Pending
          </button>

          <button
            className={`px-3 py-1 rounded border border-transparent text-sm font-medium ${status === 'prescription pending' ? 'bg-orange-600 text-white' : 'bg-white text-gray-500'}`}
            onClick={() => handleStatusChange('prescription pending')}
          >
            Prescription Pending
          </button>

          <button
            className={`px-3 py-1 rounded border border-transparent text-sm font-medium ${status === 'cancelled' ? 'bg-red-600 text-white' : 'bg-white text-gray-500'}`}
            onClick={() => handleStatusChange('cancelled')}
          >
            Cancelled
          </button>

          <button
            className={`px-3 py-1 rounded border border-transparent text-sm font-medium ${status === 'cancelled by Dr' ? 'bg-red-600 text-white' : 'bg-white text-gray-500'}`}
            onClick={() => handleStatusChange('cancelled by Dr')}
          >
            Cancelled by Dr
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b border-gray-300 text-gray-700">Doctor Name</th>
            <th className="py-2 px-4 border-b border-gray-300 text-gray-700">Patient Name</th>
            <th className="py-2 px-4 border-b border-gray-300 text-gray-700">Date</th>
            <th className="py-2 px-4 border-b border-gray-300 text-gray-700">Time</th>
            <th className="py-2 px-4 border-b border-gray-300 text-gray-700">Status</th>
            <th className="py-2 px-4 text-center border-b border-gray-300 text-gray-700">View Details</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment: any) => (
            <tr key={appointment._id} className="hover:bg-gray-100 transition duration-200 text-center">
              <td className="py-2 px-4 border-b border-gray-300">{`Dr. ${appointment.docId.name}`}</td>
              <td className="py-2 px-4 border-b border-gray-300">{appointment.patientNAme}</td>
              <td className="py-2 px-4 border-b border-gray-300">{new Date(appointment.date).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b border-gray-300">{appointment.start} to {appointment.end}</td>
              <td className={`py-2 px-4 border-b border-gray-300 ${getStatusClass(appointment.status)}`}>
                {appointment.status}
              </td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded transition duration-200 hover:bg-blue-600"
                  onClick={() => viewAppointment(appointment._id)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Appointments;
