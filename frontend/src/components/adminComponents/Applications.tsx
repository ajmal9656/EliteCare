import {useEffect,useState} from 'react';
import { toast } from 'sonner';
import axiosUrl from '../../utils/axios';
import { DoctorApplication } from '../../interfaces/doctorinterface';
import { useNavigate } from 'react-router-dom';



function Applications() {
  const navigate = useNavigate()

    const [applications,setApplications] = useState<DoctorApplication[]>([])

    const fetchSpecializations = async () => {
        try {
          const response = await axiosUrl.get('/admin/getApplications');
          setApplications(response.data.response);
        } catch (error) {
          toast.error('Failed to fetch applications');
        }
      };
    const viewApplication = async (applicationId:string) => {
        try{
          console.log("afaf",applicationId);
          
            const response = await axiosUrl.get(`/admin/getDoctorApplication/${applicationId}`);
            navigate("/admin/viewApplication",{state:{response:response.data.response}})
          

        }
        catch (error) {
            toast.error('Failed to fetch applications');
          }
          
        } 
      
    
      useEffect(() => {
        fetchSpecializations();
      }, []);

    





  return (
    <div className="flex flex-col  pl-64 p-4 ml-3 mt-14 ">
      <div className='flex flex-row justify-between'>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Applications</h1>
      </div>

      
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Name</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Department</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">View Details</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((appliction) => (
            <tr key={appliction._id}>
              <td className="py-2 px-4 border-b border-gray-300 text-center">
                Dr.{appliction.name}
              </td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">
                {appliction.department}
              </td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">
                
                <button
                  className='bg-red-500 text-white px-2 py-1 rounded'
                  onClick={() => viewApplication(appliction._id)}
                >
                  view
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
    </div>
  )
}

export default Applications
