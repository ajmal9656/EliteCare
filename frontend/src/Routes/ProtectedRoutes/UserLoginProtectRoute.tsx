import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { useEffect } from 'react';

interface LoginProtectRouteProps {
  children: React.ReactNode;
}

function UserLoginProtectRoute({ children }: LoginProtectRouteProps) {
  const navigate = useNavigate();
  const userToken = useSelector((state: RootState) => state.user);

  console.log("eeeeeeeeeeeeeee",userToken);
  

 
  useEffect(() => {
    if (userToken.userInfo!=null) {
      navigate('/', {
        state: { message: 'logged in' },
        replace: true,
      });
    }
  }, [navigate, userToken]);


  
  return <>{children}</>;
}

export default UserLoginProtectRoute;
