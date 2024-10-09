import { useState, useEffect } from "react";
import { GrMoney } from "react-icons/gr";
import { FaUsers, FaUserDoctor } from "react-icons/fa6";
import axiosUrl from "../../utils/axios";
import RevenueChart from "./RevenueChart";
import UserDoctorChart from "./UserDoctorChart";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalDoctors: 0,
    activeUsers: 0,
    adminRevenue:0,
    doctorRevenue:0,
    activeDoctors: 0,
    userDoctorChartData: [],
  });

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosUrl.get("/admin/dashboardData"); // Replace with your API endpoint
        console.log("res",response.data.response);
        setDashboardData({
          totalRevenue: response.data.response.totalRevenue,
          totalUsers: response.data.response.totalUsers,
          totalDoctors: response.data.response.totalDoctors,
          activeUsers: response.data.response.activeUsers,
          activeDoctors: response.data.response.activeDoctors,
          userDoctorChartData: response.data.response.userDoctorChartData,
          adminRevenue:response.data.response.adminRevenue,
          doctorRevenue:response.data.response.doctorRevenue,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(()=>{
    console.log("dash",dashboardData);
    
  },[])

  return (
    <div className="flex flex-col pl-64 p-4 ml-8 mt-20 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        {/* Total Revenue Card */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex flex-col justify-center items-start">
            <GrMoney size={60} />
            <h1 className="text-xl font-semibold mt-4">Total Revenue</h1>
            <h3 className="text-4xl font-bold mt-2">${dashboardData.totalRevenue}</h3>
          </div>
        </div>

        {/* Total Users Card */}
        <div className="bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex flex-col justify-center items-start">
            <FaUsers size={60} />
            <h1 className="text-xl font-semibold mt-4">Total Users: {dashboardData.totalUsers}</h1>
            <h1 className="text-xl font-semibold mt-1">Active Users: {dashboardData.activeUsers}</h1>
          </div>
        </div>

        {/* Total Doctors Card */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex flex-col justify-center items-start">
            <FaUserDoctor size={60} />
            <h1 className="text-xl font-semibold mt-4">Total Doctors: {dashboardData.totalDoctors}</h1>
            <h1 className="text-xl font-semibold mt-1">Active Doctors: {dashboardData.activeDoctors}</h1>
          </div>
        </div>
      </div>

      <div className="w-[100%] h-[500px] flex space-x-10">
        <div className="w-[50%] bg-white p-10 shadow-lg rounded-lg">
          {/* Pass revenue data to RevenueChart */}
          <RevenueChart data={dashboardData.userDoctorChartData} />
        </div>
        <div className="w-[50%] bg-white p-10 shadow-lg rounded-lg">
          {/* Pass user and doctor data to UserDoctorChart */}
          <UserDoctorChart data={dashboardData.userDoctorChartData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
