import { Routes,Route } from 'react-router-dom';
import SignupPage from '../pages/doctorPages/SignupPage';
import OTPForm from '../components/doctorComponents/OTPForm';
import Login from '../pages/doctorPages/Login';
import DoctorProtectedRoute from './ProtectedRoutes/DoctorProtectedRoute';
import DoctorHomePage from '../pages/doctorPages/DoctorHomePage';




function doctorRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage/>} />
      <Route path="/otp" element={<OTPForm/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/home" element={<DoctorProtectedRoute><DoctorHomePage /></DoctorProtectedRoute>} />
      
      
      
      
      
    </Routes>
  )
}

export default doctorRoutes
