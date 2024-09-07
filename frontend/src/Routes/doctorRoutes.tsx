import { Routes,Route } from 'react-router-dom';
import SignupPage from '../pages/doctorPages/SignupPage';
import OTPForm from '../components/doctorComponents/OTPForm';
import Login from '../pages/doctorPages/Login';
import DoctorProtectedRoute from './ProtectedRoutes/DoctorProtectedRoute';
import DoctorHomePage from '../pages/doctorPages/DoctorHomePage';
import DashboardPage from '../pages/doctorPages/DashboardPage';
import DoctorsListpage from '../pages/doctorPages/DoctorsListpage';




function doctorRoutes() {
  return (
    
    <Routes>
      
      <Route path="/signup" element={<SignupPage/>} />
      <Route path="/otp" element={<OTPForm/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/home" element={<DoctorProtectedRoute><DoctorHomePage /></DoctorProtectedRoute>} />
      <Route path="/dashboard" element={<DashboardPage/>} />
      <Route path="/doctorsList" element={<DoctorsListpage/>} />
      
      
      
      
      
    </Routes>
  )
}

export default doctorRoutes
