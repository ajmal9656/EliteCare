import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { useEffect } from 'react';

interface LoginProtectRouteProps {
  children: React.ReactNode;
}

function AdminLoginProtectRoute({ children }: LoginProtectRouteProps) {
  const navigate = useNavigate();
  const adminToken = useSelector((state: RootState) => state.admin);

  console.log("eeeeeeeeeeeeeee",adminToken);
  

 
  useEffect(() => {
    if (adminToken.adminInfo!=null) {
      navigate('/admin/dashboard', {
        state: { message: 'logged in' },
        replace: true,
      });
    }
  }, [navigate, adminToken]);


  
  return <>{children}</>;
}

export default AdminLoginProtectRoute;
