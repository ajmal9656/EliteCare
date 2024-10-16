import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axiosUrl from '../../utils/axios';
import { DoctorApplication } from '../../interfaces/doctorinterface';
import { useNavigate } from 'react-router-dom';

function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<DoctorApplication[]>([]);

  const fetchApplications = async () => {
    try {
      const response = await axiosUrl.get('/admin/getApplications');
      setApplications(response.data.response);
    } catch (error) {
      toast.error('Failed to fetch applications');
    }
  };

  const viewApplication = async (applicationId: string) => {
    try {
      const response = await axiosUrl.get(`/admin/getDoctorApplication/${applicationId}`);
      navigate('/admin/viewApplication', { state: { response: response.data.response } });
    } catch (error) {
      toast.error('Failed to fetch applications');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="flex flex-col pl-64 p-4 ml-3 mt-14">
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
          {applications.map((application) => (
            <tr key={application._id} className="hover:bg-gray-100 transition duration-200 text-center">
              <td className="py-2 px-4 border-b border-gray-300">{`Dr. ${application.name}`}</td>
              <td className="py-2 px-4 border-b border-gray-300">{application.department}</td>
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
    </div>
  );
}

export default Applications;
