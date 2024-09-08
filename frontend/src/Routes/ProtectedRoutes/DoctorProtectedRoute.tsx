import { RootState } from '../../Redux/store';
import { useSelector } from 'react-redux';
import DoctorVerifivationForm from '../../components/doctorComponents/DoctorVerifivationForm';
import VerificationProcessingPage from '../../pages/doctorPages/VerificationProcessingPage';
import RejectionApplicationPage from '../../pages/doctorPages/RejectionApplicationPage';


interface DoctorProtectedRouteProps {
  children: React.ReactNode;
}

function  DoctorProtectedRoute({ children }: DoctorProtectedRouteProps) {
  const DoctorData = useSelector((state: RootState) => state.doctor);

  console.log("DoctorData:", DoctorData);
  

  if (DoctorData.docStatus === "pending") {
    return (
      <DoctorVerifivationForm/>
        
    );
  } else if (DoctorData.docStatus === "submitted") {
    return <VerificationProcessingPage/>
   
  } 
   else if (DoctorData.docStatus === "rejected") {
    const reason = DoctorData.doctorInfo?.rejectedReason || "No reason provided";
    
    return <RejectionApplicationPage reason={reason}  />
   
  } else {
    return (
      
      <>{children}</>
    );
    
  }
}

export default DoctorProtectedRoute;
