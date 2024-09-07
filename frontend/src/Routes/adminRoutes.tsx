import { Routes,Route } from 'react-router-dom';
import AdminLoginPage from '../pages/adminPages/AdminLoginPage';
import AdminHomePage from '../pages/adminPages/AdminHome';
import SpecializationPage from '../pages/adminPages/SpecializationPage';
import AdminLayout from '../pages/adminPages/AdminLayout';
import DashboardPage from '../pages/adminPages/DashboardPage';
import ApplicationsPage from '../pages/adminPages/ApplicationsPage';
import ApplicationDetailspage from '../pages/adminPages/ApplicationDetailspage';

function adminRoutes() {
  return (
    <Routes>
    <Route path="/login" element={<AdminLoginPage/>} />
    <Route path="/home" element={<AdminHomePage/>} />
            <Route path='/' element={<AdminLayout/>}>
                   <Route index path="dashboard" element={<DashboardPage/>} />
                   <Route path="specializations" element={<SpecializationPage/>} />
                   <Route path="applications" element={<ApplicationsPage/>} />
                   <Route path="viewApplication" element={<ApplicationDetailspage/>} />
            </Route>

            
    
    
    
    
    
    
  </Routes>
  )
}

export default adminRoutes
