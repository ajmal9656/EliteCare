import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutDoctor } from "../../../Redux/Action/doctorActions";
import { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { useSocket } from "../../../Context/SocketIO";
import axiosUrl from "../../../utils/axios";
import { RootState } from "../../../Redux/store";



function Sidebar() {
  const navigate = useNavigate();
  const dispatch:any = useDispatch()

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any>([]);

  const doctorData = useSelector((state: RootState) => state.doctor.doctorInfo);

  let {socket} = useSocket()

  const fetchUnreadNotifications = async () => {
    
    try {
      console.log("hellow",doctorData);
      
      const response = await axiosUrl.get(`/chat/getAllNotifications/${doctorData?.doctorId}`);
      console.log("wwwwwww",response.data);
       // Adjust endpoint as needed
      setNotifications(response.data);

      await axiosUrl.get(`/chat/readAllNotifications/${doctorData?.doctorId}`);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } 
  };

  const handleLogout = async () => {
    
  
    try {
      await dispatch(logoutDoctor());
     
      // await axiosUrl.post('/logout', {}, { 
      //   withCredentials: true 
      // });
  
      // Remove user info from localStorage
      localStorage.removeItem('doctorInfo');
  
      // Redirect to login page
      navigate("/doctor/login");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleNotificationDrawer = () => {
    console.log("hii");
    
    setIsNotificationOpen(true);
    fetchUnreadNotifications();
    
    setNotificationCount(0)


  };
  const toggleCloseNotificationDrawer = () => {
    console.log("hii");
    
    setIsNotificationOpen(false);
    

  };

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await axiosUrl.get(`/chat/notificationCount/${doctorData?.doctorId}`);
        
        console.log("no",response.data.notificationCount.notificationCount);
        
        setNotificationCount(response.data.notificationCount.notificationCount);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();
  }, [doctorData?.doctorId]);

  useEffect(()=>{

    socket?.on('receiveNotification', (notificationData:any) => {
      console.log("fffffffffffffffffff");
      
      
      setNotificationCount((prevCount) => {console.log("hhhhhhhhhhhhhhhhh",prevCount);
        return prevCount + 1});
      console.log('Notification received:', notificationData);
      // dispatch(addNotification(notificationData)); 
    });
    socket?.on('AppointmentNotification', () => {
      console.log("fffffffffffffffffff");
      
      
      setNotificationCount((prevCount) => {console.log("hhhhhhhhhhhhhhhhh",prevCount);
        return prevCount + 1});
      
      // dispatch(addNotification(notificationData)); 
    });
    socket?.on('AppointmentCancellation', () => {
      console.log("fffffffffffffffffff");
      
      
      setNotificationCount((prevCount) => {console.log("hhhhhhhhhhhhhhhhh",prevCount);
        return prevCount + 1});
      
      // dispatch(addNotification(notificationData)); 
    });

  },[socket])
  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b bg-gradient-to-l from-cyan-500 to-blue-500 ">
  <div className="px-3 py-3 lg:px-5 lg:pl-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-start rtl:justify-end">
        <button
          data-drawer-target="logo-sidebar"
          data-drawer-toggle="logo-sidebar"
          aria-controls="logo-sidebar"
          type="button"
          className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>
        <a  className="flex ms-2 md:me-24">
          
          <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
          EliteCare
          </span>
        </a>
      </div>
      <div className="flex items-center">
        <div className="flex items-center ms-3">
        <button onClick={toggleNotificationDrawer} className="relative text-white text-2xl hover:text-hoverColor transition duration-300">
            <IoNotificationsOutline size={36}  />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          
          <button
            type="button"
            className="ml-4 text-sm text-gray-900 dark:text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</nav>


      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full  border-r border-gray-200 sm:translate-x-0 bg-white shadow-md"
        aria-label="Sidebar"
      >
        <div className="h-full px-1 pb-4 overflow-y-auto bg-white">
        <ul className="space-y-2 font-medium">
  <li>
    <NavLink
      to="/doctor/dashboard"
      className={({ isActive }) =>
        `flex items-center p-2 rounded-lg group ${
          isActive
            ? "bg-gradient-to-l from-cyan-500 to-blue-500 text-white"
            : "text-slate-600 hover:bg-gray-100 dark:hover:bg-gradient-to-l from-cyan-200 to-blue-200"
        }`
      }
    >
      <svg
        className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 21"
      >
        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
      </svg>
      <span className="ms-3">Dashboard</span>
    </NavLink>
  </li>
  <li>
    <NavLink
      to="/doctor/profile"
      className={({ isActive }) =>
        `flex items-center p-2 rounded-lg group ${
          isActive
            ? "bg-gradient-to-l from-cyan-500 to-blue-500 text-white"
            : "text-slate-600 hover:bg-gray-100 dark:hover:bg-gradient-to-l from-cyan-200 to-blue-200"
        }`
      }
    >
      <svg
  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white"
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  viewBox="0 0 20 20"
>
  <path d="M10 0a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm-7 18a7 7 0 0 1 14 0H3Z" />
</svg>

      <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
    </NavLink>
  </li>
  <li>
    <NavLink
      to="/doctor/appointments"
      className={({ isActive }) =>
        `flex items-center p-2 rounded-lg group ${
          isActive
            ? "bg-gradient-to-l from-cyan-500 to-blue-500 text-white"
            : "text-slate-600 hover:bg-gray-100 dark:hover:bg-gradient-to-l from-cyan-200 to-blue-200"
        }`
      }
    >
      <svg
    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M17 2h-3V1a1 1 0 1 0-2 0v1H8V1a1 1 0 1 0-2 0v1H3a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM3 8h14v9H3V8Zm14-3H3V4h2v1a1 1 0 1 0 2 0V4h4v1a1 1 0 1 0 2 0V4h2v1a1 1 0 1 0 2 0V4Z" />
  </svg>
      <span className="flex-1 ms-3 whitespace-nowrap">Appointments</span>
    </NavLink>
  </li>
  <li>
    <NavLink
      to="/doctor/slotManagement"
      className={({ isActive }) =>
        `flex items-center p-2 rounded-lg group ${
          isActive
            ? "bg-gradient-to-l from-cyan-500 to-blue-500 text-white"
            : "text-slate-600 hover:bg-gray-100 dark:hover:bg-gradient-to-l from-cyan-200 to-blue-200"
        }`
      }
    >
      <svg
  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white"
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  viewBox="0 0 20 20"
>
  <path d="M10 1.5a8.5 8.5 0 1 1-8.5 8.5 8.51 8.51 0 0 1 8.5-8.5Zm0 15a6.5 6.5 0 1 0-6.5-6.5 6.508 6.508 0 0 0 6.5 6.5ZM10.75 5a.75.75 0 0 1 1.5 0v4.25H15a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z" />
</svg>

      <span className="flex-1 ms-3 whitespace-nowrap">Slot Management</span>
    </NavLink>
  </li>
  
  <li>
  <NavLink
    to="/doctor/wallet"
    className={({ isActive }) =>
      `flex items-center p-2 rounded-lg group ${
        isActive
          ? "bg-gradient-to-l from-cyan-500 to-blue-500 text-white"
          : "text-slate-600 hover:bg-gray-100 dark:hover:bg-gradient-to-l from-cyan-200 to-blue-200"
      }`
    }
  >
    <svg
      className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm13 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
    </svg>
    <span className="flex-1 ms-3 whitespace-nowrap">Wallet</span>
  </NavLink>
</li>

</ul>
        </div>
      </aside>
      <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-lg transform transition-transform duration-300 ${isNotificationOpen ? "translate-x-0" : "translate-x-full"}`}>
  <div className="p-4 border-b flex justify-between items-center bg-gradient-to-l from-cyan-500 to-blue-500 text-white">
    <h2 className="text-xl font-semibold">Notifications</h2>
    <button onClick={toggleCloseNotificationDrawer} className="text-white text-2xl">
      <AiOutlineClose />
    </button>
  </div>
  <div className="p-4 max-h-[90vh] overflow-y-auto">
    {/* Display Notifications */}
    <ul>
      {notifications.length > 0 ? (
        notifications.slice().reverse().map((notificationObj: any, index: any) => (
          <li
            key={index}
            className={`mb-4 border-b pb-2 ${
              notificationObj.notifications.read ? "text-gray-400" : "text-black"
            }`}
          >
            <p
              className={`${
                notificationObj.notifications.read ? "text-gray-500" : "text-slate-800 font-semibold"
              }`}
            >
              {notificationObj.notifications.content}
            </p>
            <p className="text-gray-500 text-sm">
              {new Date(notificationObj.notifications.createdAt).toLocaleString()}
            </p>
          </li>
        ))
      ) : (
        <p>No new notifications</p>
      )}
    </ul>
  </div>
</div>
    </>
  );
}

export default Sidebar;

