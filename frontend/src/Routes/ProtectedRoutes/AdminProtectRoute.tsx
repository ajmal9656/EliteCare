import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { useEffect } from 'react';

interface AdminProtectRouteProps {
  children: React.ReactNode;
}

function AdminProtectRoute({ children }: AdminProtectRouteProps) {
  const navigate = useNavigate();
  const adminToken = useSelector((state: RootState) => state.admin.adminInfo);

  console.log("eeeeeeeeeeeeeee",adminToken);
  

 
  useEffect(() => {
    if (adminToken==null) {
      navigate('/admin/login', {
        state: { message: 'Authorization failed' },
        replace: true,
      });
    }
  }, [navigate, adminToken]);


  
  return <>{children}</>;
}

export default AdminProtectRoute;
