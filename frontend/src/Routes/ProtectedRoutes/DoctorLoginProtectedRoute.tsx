import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { useEffect, useState } from 'react';
import axiosUrl from '../../utils/axios';

interface LoginProtectRouteProps {
  children: React.ReactNode;
}

function DoctorLoginProtectRoute({ children }: LoginProtectRouteProps) {
  const navigate = useNavigate();
  const doctorToken = useSelector((state: RootState) => state.doctor);
 

  console.log("eeeeeeeeeeeeeee",doctorToken);
  

 
  useEffect(() => {
    // const fetchDoctorData = async () => {
    //   if (doctorToken?.doctorInfo?.email) {
    //     try {
    //       const response = await axiosUrl.get(
    //         `/doctor/getDoctorData/${doctorToken?.doctorInfo?.email}`
    //       );
    //       console.log("doctt",response.data.response);
          
    //       setDocDetails(response.data.response);
    //     } catch (error) {
    //       console.error('Error fetching doctor data:', error);
    //       navigate('/doctor/login');
    //     }
    //   } else {
    //     navigate('/doctor/login');
    //   }
    // };

    // fetchDoctorData();
    
    if (doctorToken.doctorInfo!=null) {
      console.log("DOCsTATUS",doctorToken.docStatus);
      
      navigate('/doctor/', {
        state: { message: 'logged in' },
        replace: true,
      });
    }
  }, [navigate, doctorToken]);


  return <>{children}</>;


  
  
}

export default DoctorLoginProtectRoute;
