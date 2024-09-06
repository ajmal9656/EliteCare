import { RootState } from '../../Redux/store';
import { useSelector } from 'react-redux';
import DoctorVerifivationForm from '../../components/doctorComponents/DoctorVerifivationForm';


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
    return (
      <div>
        <h1>Submitted</h1>
      </div>
    );
  } else {
    return <>{children}</>
  }
}

export default DoctorProtectedRoute;
