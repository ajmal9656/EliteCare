import React from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import '../index.css';
import UserRoutes from './Routes/UserRoutes';
import AdminRoutes from './Routes/adminRoutes';
import DoctorRoutes from './Routes/doctorRoutes';
import { Toaster,toast } from 'sonner';
 





function App() {
  console.log("sdfjkgbv")
  

  return (
    <>
    <Router>
      <Routes>
        <Route path="/*" element={<UserRoutes/>} />
        <Route path="/admin*" element={<AdminRoutes/>} />
        <Route path="/doctor*" element={<DoctorRoutes/>} />
        
      </Routes>
    </Router>
    <Toaster position="top-center" expand={false} richColors />
    </>

  )
}
export default App
