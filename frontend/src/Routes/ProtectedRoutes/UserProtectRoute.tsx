import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { useEffect } from 'react';

interface UserProtectRouteProps {
  children: React.ReactNode;
}

function UserProtectRoute({ children }: UserProtectRouteProps) {
  const navigate = useNavigate();
  const userToken = useSelector((state: RootState) => state.user.userInfo);

  console.log("eeeeeeeeeeeeeee",userToken);
  

 
  useEffect(() => {
    if (userToken==null) {
      navigate('/login', {
        state: { message: 'Authorization failed' },
        replace: true,
      });
    }
  }, [navigate, userToken]);


  
  return <>{children}</>;
}

export default UserProtectRoute;
