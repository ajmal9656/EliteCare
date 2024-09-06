
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Signup from '../pages/userPages/Signup';
import Otp from '../pages/userPages/OtpPage';
import Login from '../pages/userPages/Login';
import LandingPage from '../pages/userPages/LandingPage';
import ProfilePage from '../pages/userPages/ProfilePage';
import UserProtectRoute from './ProtectedRoutes/UserProtectRoute';


function UserRoutes() {
  console.log("fjfghj")
  return (
    
    <Routes>
      <Route path="/signup" element={<Signup/>} />
      <Route path="/otp" element={<Otp/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/home" element={<LandingPage/>} />
      <Route path="/profile" element={<UserProtectRoute><ProfilePage/></UserProtectRoute>} />
      
      
    </Routes>
  
  )
}

export default UserRoutes


