import { Routes,Route } from 'react-router-dom';
import AdminLoginPage from '../pages/adminPages/AdminLoginPage';
import AdminHomePage from '../pages/adminPages/AdminHome';
import SpecializationPage from '../pages/adminPages/SpecializationPage';

function adminRoutes() {
  return (
    <Routes>
    <Route path="/login" element={<AdminLoginPage/>} />
    <Route path="/home" element={<AdminHomePage/>} />
    <Route path="/specializations" element={<SpecializationPage/>} />
    
    
    
    
    
    
  </Routes>
  )
}

export default adminRoutes
