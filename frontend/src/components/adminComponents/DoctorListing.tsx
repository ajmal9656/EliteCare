import {useEffect,useState} from 'react';
import { toast } from 'sonner';
import axiosUrl from '../../utils/axios';
import { DoctorDetails } from '../../interfaces/doctorinterface';
import { useNavigate } from 'react-router-dom';

function DoctorListing() {
    const navigate = useNavigate()

    const [doctors,setDoctors] = useState<DoctorDetails[]>([])
  
    const fetchDoctors = async () => {
        try {
          const response = await axiosUrl.get('/admin/getDoctors');
          setDoctors(response.data.response);
        } catch (error) {
          toast.error('Failed to fetch Doctors');
        }
      };
    // const viewApplication = async (applicationId:string) => {
    //     try{
    //       console.log("afaf",applicationId);
          
    //         const response = await axiosUrl.get(`/admin/getDoctorApplication/${applicationId}`);
    //         navigate("/admin/viewApplication",{state:{response:response.data.response}})
          
  
    //     }
    //     catch (error) {
    //         toast.error('Failed to fetch applications');
    //       }
          
    //     } 
      
    
      useEffect(() => {
        fetchDoctors();
      }, []);
  
      const toggleListState = async(id: string) => {
        await axiosUrl.put(`/admin/listUnlistDoctor/${id}`);
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor._id === id ? { ...doctor, isBlocked: !doctor.isBlocked } : doctor
          )
        );
      };
    
  
  
  
  
    return (
      <div className="flex flex-col  pl-64 p-4 ml-3 mt-14 ">
        <div className='flex flex-row justify-between'>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Doctors</h1>
        </div>
  
        
        </div>
  
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-300 text-center">Name</th>
              <th className="py-2 px-4 border-b border-gray-300 text-center">email</th>
              <th className="py-2 px-4 border-b border-gray-300 text-center">View Details</th>
              <th className="py-2 px-4 border-b border-gray-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td className="py-2 px-4 border-b border-gray-300 text-center">
                  Dr.{doctor.name}
                </td>
                <td className="py-2 px-4 border-b border-gray-300 text-center">
                  {doctor.email}
                </td>
                <td className="py-2 px-4 border-b border-gray-300 text-center">
                  
                  <button
                    className='bg-red-500 text-white px-2 py-1 rounded'
                    // onClick={() => viewdoctor(doctor._id)}
                  >
                    view
                  </button>
                </td>
                <td className="py-2 px-4 border-b border-gray-300 text-center">
                  
                  <button
                    className={`${doctor.isBlocked ? 'bg-green-500' : 'bg-red-500'} text-white px-2 py-1 rounded`}
                    onClick={() => toggleListState(doctor._id)}
                  >
                    {doctor.isBlocked ? 'List' : 'Unlist'}
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        
      </div>
    )
}

export default DoctorListing
