import { FaUsers } from 'react-icons/fa';
import { FaUserDoctor } from 'react-icons/fa6';
import { GrMoney } from 'react-icons/gr';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import axiosUrl from '../../utils/axios';
import RevenueChart from './RevenueChart';
import { useNavigate } from 'react-router-dom';
import { logoutDoctor } from '../../Redux/Action/doctorActions';

function Dashboard() {

  const navigate = useNavigate()
  const dispatch:any = useDispatch()
  
  const DoctorData = useSelector((state: RootState) => state.doctor);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    monthlyRevenue: [],
    totalAppointments: 0,
    todaysAppointments: 0,
    numberOfPatients: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosUrl.get('/doctor/dashboardData', {
          params: { doctorId: DoctorData?.doctorInfo?.doctorId }, 
        });

        console.log("Dashboard Data:", response.data.response);
        
        // Update state with the received data
        setDashboardData(response.data.response);
        
      } catch (error:any) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized: Redirecting to login page.");
          await dispatch(logoutDoctor());
   
          navigate("/doctor/login"); // Navigate to the login page if unauthorized
        } else {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchData();
  }, [DoctorData?.doctorInfo?.doctorId]); // The effect will run when DoctorData?.doctorInfo?.doctorId changes

  return (
    <div className="flex flex-col w-full mx-auto pl-80 p-4 ml-3 mt-14 pt-10 h-screen px-10 bg-slate-50 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        {/* Total Revenue Card */}
        <div className="bg-gradient-to-r from-blue-100 to-blue-300 text-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex flex-col justify-center items-start">
            <GrMoney size={60} />
            <h1 className="text-xl font-semibold mt-4">Total Revenue</h1>
            <h3 className="text-4xl font-bold mt-2">${dashboardData.totalRevenue}</h3>
          </div>
        </div>

        {/* Total Appointments Card */}
        <div className="bg-gradient-to-r from-green-100 to-green-300 text-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex flex-col justify-center items-start">
            <FaUserDoctor size={60} />
            <h1 className="text-xl font-semibold mt-4">Total Appointments: {dashboardData.totalAppointments}</h1>
            <h1 className="text-xl font-semibold mt-1">Today's Appointments: {dashboardData.todaysAppointments}</h1>
          </div>
        </div>

        {/* Total Patients Card */}
        <div className="bg-gradient-to-r from-gray-200 to-gray-400 text-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex flex-col justify-center items-start">
            <FaUsers size={60} />
            <h1 className="text-xl font-semibold mt-4">Total Patients: {dashboardData.numberOfPatients}</h1>
          </div>
        </div>
      </div>

      <div className="w-full h-[350px] flex space-x-10">
        <div className="w-full bg-white p-10 shadow-lg rounded-lg">
        <RevenueChart monthlyRevenue={dashboardData.monthlyRevenue} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
