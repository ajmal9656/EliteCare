import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { useEffect } from 'react';

interface DoctorProtectRouteProps {
  children: React.ReactNode;
}

function DoctorProtectRoute({ children }: DoctorProtectRouteProps) {
  const navigate = useNavigate();
  const doctorToken = useSelector((state: RootState) => state.doctor.doctorInfo);

  console.log("eeeeeeeeeeeeeee",doctorToken);
  

 
  useEffect(() => {
    if (doctorToken==null) {
      navigate('/doctor/login', {
        state: { message: 'Authorization failed' },
        replace: true,
      });
    }
  }, [navigate, doctorToken]);


  
  return <>{children}</>;
}

export default DoctorProtectRoute;
