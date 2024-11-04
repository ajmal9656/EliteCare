import { Routes,Route } from 'react-router-dom';
import SignupPage from '../pages/doctorPages/SignupPage';
import OTPForm from '../components/doctorComponents/OTPForm';
import Login from '../pages/doctorPages/Login';
import DoctorProtectedRoute from './ProtectedRoutes/DoctorProtectedRoute';
import DoctorHomePage from '../pages/doctorPages/DoctorHomePage';
import DashboardPage from '../pages/doctorPages/DashboardPage';
import VerificationProcessingPage from '../pages/doctorPages/VerificationProcessingPage';
import DoctorLayout from '../pages/doctorPages/DoctorLayout';
import SlotManagementPage from '../pages/doctorPages/SlotManagementPage';
import AppointmentsPage from '../pages/doctorPages/AppointmentsPage';
import AppointmentDetailsPage from '../pages/doctorPages/AppointmentDetailsPage';
import WalletPage from '../pages/doctorPages/WalletPage';
import ChatPage from '../pages/doctorPages/ChatPage';
import ProfilePage from '../pages/doctorPages/ProfilePage';
import VideochatPage from '../pages/doctorPages/VideochatPage';





function doctorRoutes() {
  
  return (
    
    <Routes>
      
      <Route path="/signup" element={<SignupPage/>} />
      <Route path="/otp" element={<OTPForm/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/" element={<DoctorProtectedRoute><DoctorHomePage /></DoctorProtectedRoute>} />
      
      <Route path="/verificationProcessing" element={<VerificationProcessingPage/>} />
      <Route path='/' element={<DoctorLayout/>}>
                   <Route index path="dashboard" element={<DashboardPage/>} />
                   <Route  path="slotManagement" element={<SlotManagementPage/>} />
                   <Route  path="appointments" element={<AppointmentsPage/>} />
                   <Route  path="appointmentDetails" element={<AppointmentDetailsPage/>} />
                   <Route  path="wallet" element={<WalletPage/>} />
                   <Route  path="chat" element={<ChatPage/>} />
                   <Route  path="profile" element={<ProfilePage/>} />
                  
                   
                   
            </Route>


                


      
      
      
      
      
    </Routes>
  )
}

export default doctorRoutes
