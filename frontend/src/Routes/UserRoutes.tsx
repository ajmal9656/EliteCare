
import { Routes,Route } from 'react-router-dom';
import Signup from '../pages/userPages/Signup';
import Otp from '../pages/userPages/OtpPage';
import Login from '../pages/userPages/Login';
import LandingPage from '../pages/userPages/LandingPage';
import ProfilePage from '../pages/userPages/ProfilePage';
import UserProtectRoute from './ProtectedRoutes/UserProtectRoute';
import SpecializationPage from '../pages/userPages/SpecializationPage';
import DoctorsWithSpecializationPage from '../pages/userPages/DoctorsWithSpecializationPage';
import DoctorProfilePage from '../pages/userPages/DoctorProfilePage';
import UserLayout from '../pages/userPages/UserLayout';
import DoctorProfileLayout from '../pages/userPages/DoctorProfileLayout';
import TimeSlotsPage from '../pages/userPages/TimeSlotsPage';
import UserLoginProtectRoute from './ProtectedRoutes/UserLoginProtectRoute';
import UserProfilePage from '../pages/userPages/UserProfilePage';
import UserProfilesLayout from '../pages/userPages/UserProfilesLayout';
import BookAppointmentPage from '../pages/userPages/BookAppointmentPage';
import PaymentSuccess from '../components/common/PaymentSuccess';
import AppointmentPage from '../pages/userPages/AppointmentPage';
import AppointmentDetailsPage from '../pages/userPages/AppointmentDetailsPage';
import ChatPage from '../pages/userPages/ChatPage';



function UserRoutes() {
  console.log("fjfghj")
  return (
    
    <Routes>
      <Route path="/signup" element={<Signup/>} />
      <Route path="/otp" element={<Otp/>} />
      <Route path="/login" element={<UserLoginProtectRoute><Login/></UserLoginProtectRoute>} />
      
         <Route path='/' element={<UserLayout/>}>
             <Route index path="/" element={<LandingPage/>} />
             <Route path="/profile" element={<UserProtectRoute><ProfilePage/></UserProtectRoute>} />
             <Route path="/specializations" element={<SpecializationPage/>} />
             <Route path="/doctorsWithSpecialization/:id" element={<DoctorsWithSpecializationPage/>} />
             
                <Route path='/doctorProfile' element={<DoctorProfileLayout/>} >
                    <Route path="profile" element={<DoctorProfilePage/>} />
                    <Route path="checkSlots" element={<TimeSlotsPage/>} />
                    <Route path="appoinmentDetails" element={<BookAppointmentPage/>} />

                </Route>
                
         </Route>
         <Route path='/userProfile' element={<UserProtectRoute><UserProfilesLayout/></UserProtectRoute>} >
                    <Route path="profile" element={<UserProfilePage/>} />
                    <Route path="appointments" element={<AppointmentPage/>} />
                    <Route path="viewAppointment" element={<AppointmentDetailsPage/>} />
                    <Route path="chat" element={<ChatPage/>} />

                
                     

                </Route>

                <Route path="/confirmPayment/:appointmentId/:doctorId" element={<PaymentSuccess/>} />       
      
      
      
    </Routes>
  
  )
}

export default UserRoutes


