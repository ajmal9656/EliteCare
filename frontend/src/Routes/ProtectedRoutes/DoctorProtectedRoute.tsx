import { RootState } from '../../Redux/store';
import { useSelector } from 'react-redux';
import DoctorVerifivationForm from '../../components/doctorComponents/DoctorVerifivationForm';
import VerificationProcessingPage from '../../pages/doctorPages/VerificationProcessingPage';
import RejectionApplicationPage from '../../pages/doctorPages/RejectionApplicationPage';
import { useNavigate } from 'react-router-dom';
import axiosUrl from '../../utils/axios';
import { useState, useEffect } from 'react';

interface DoctorProtectedRouteProps {
  children: React.ReactNode;
}

function DoctorProtectedRoute({ children }: DoctorProtectedRouteProps) {
  const navigate = useNavigate();
  const DoctorData = useSelector((state: RootState) => state.doctor);

  const [docDetails, setDocDetails] = useState<any>(null);


  console.log("DoctorData:", DoctorData);

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (DoctorData?.doctorInfo?.email) {
        try {
          const response = await axiosUrl.get(
            `/doctor/getDoctorData/${DoctorData?.doctorInfo?.email}`
          );
          console.log("doctt",response.data.response);
          
          setDocDetails(response.data.response);
        } catch (error) {
          console.error('Error fetching doctor data:', error);
          navigate('/doctor/login');
        }
      } else {
        navigate('/doctor/login');
      }
    };

    fetchDoctorData();
  }, [DoctorData?.doctorInfo?.email, navigate]);

  

  if (!docDetails) {
    return null; // or a fallback UI if required
  }

  if (DoctorData.doctorInfo === null) {
    navigate('/doctor/login');
  } else if (docDetails.kycStatus === 'submitted') {
    return <VerificationProcessingPage />;
  } else if (docDetails.kycStatus === 'rejected') {
    const reason = docDetails.rejectedReason || 'No reason provided';
    return <RejectionApplicationPage reason={reason} />;
  } else if (docDetails.kycStatus === 'pending') {
    return <DoctorVerifivationForm />;
  } else {
    if(docDetails.approved){
      console.log("Nnnnnnnnnnn");
      
      navigate('/doctor/login');

      
      
    }else{
      console.log("kkkkkkk");
      
      return <>{children}</>;
    }
    
    
  }
}

export default DoctorProtectedRoute;
