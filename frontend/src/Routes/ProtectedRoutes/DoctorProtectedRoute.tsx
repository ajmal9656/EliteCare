import { RootState } from '../../Redux/store';
import { useSelector } from 'react-redux';
import DoctorVerifivationForm from '../../components/doctorComponents/DoctorVerifivationForm';
import VerificationProcessingPage from '../../pages/doctorPages/VerificationProcessingPage';


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
    return <>{children}</>
   
  } else {
    return (
      <VerificationProcessingPage/>
    );
    
  }
}

export default DoctorProtectedRoute;
