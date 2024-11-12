import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { IoNotificationsOutline } from "react-icons/io5";
import axiosUrl from "../../../utils/axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { useSocket } from "../../../Context/SocketIO";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any>([]);
  let {socket} = useSocket()
  const navigate = useNavigate()

  const userData = useSelector((state: RootState) => state.user.userInfo);

  const handleMenuChange = () => {
    setMenu(!menu);
  };

  const closeMenu = () => {
    setMenu(false);
  };

  const fetchUnreadNotifications = async () => {
    
    try {
      console.log("hellow");
      
      const response = await axiosUrl.get(`/chat/getAllNotifications/${userData?._id}`);
      console.log("wwwwwww",response.data);
       // Adjust endpoint as needed
      setNotifications(response.data);

      await axiosUrl.get(`/chat/readAllNotifications/${userData?._id}`);
    } catch (error) {
      console.error("Error fetching notifications:", error);
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
        const response = await axiosUrl.get(`/chat/notificationCount/${userData?._id}`);
        
        console.log("no",response.data.notificationCount.notificationCount);
        
        setNotificationCount(response.data.notificationCount.notificationCount);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();
  }, [userData?._id]);

  useEffect(()=>{

    socket?.on('receiveNotification', (notificationData:any) => {
      
      setNotificationCount((prevCount) => {console.log("hhhhhhhhhhhhhhhhh",prevCount);
        return prevCount + 1});
      console.log('Notification received:', notificationData);
      // dispatch(addNotification(notificationData)); 
    });
    socket?.on('AppointmentCancellation', () => {
      
      setNotificationCount((prevCount) => {console.log("hhhhhhhhhhhhhhhhh",prevCount);
        return prevCount + 1});
      
      // dispatch(addNotification(notificationData)); 
    });

  },[socket])

  const navigateAppointment = (appointment: any) => {
    navigate("/userProfile/viewAppointment", { state: { appointmentId:appointment } });
  };

  return (
    <div className="fixed w-screen z-20 text-white">
      <div className="flex flex-row justify-between p-5 md:px-32 px-5 bg-backgroundColor shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <div className="flex flex-row items-center cursor-pointer">
          <Link to="home" spy={true} smooth={true} duration={500}>
            <h1 className="text-2xl font-semibold">EliteCare</h1>
          </Link>
        </div>

        <nav className="hidden lg:flex flex-row items-center text-lg font-medium gap-8">
          <Link to="home" spy={true} smooth={true} duration={500} className="hover:text-hoverColor transition-all cursor-pointer">Home</Link>
          <Link to="about" spy={true} smooth={true} duration={500} className="hover:text-hoverColor transition-all cursor-pointer">About Us</Link>
          <Link to="services" spy={true} smooth={true} duration={500} className="hover:text-hoverColor transition-all cursor-pointer">Services</Link>
          <Link to="doctors" spy={true} smooth={true} duration={500} className="hover:text-hoverColor transition-all cursor-pointer">Doctors</Link>
          <Link to="blog" spy={true} smooth={true} duration={500} className="hover:text-hoverColor transition-all cursor-pointer">Blog</Link>
        </nav>

        {/* Profile and Notification Links */}
        <div className="hidden lg:flex items-center gap-4">
          <RouterLink to="/userProfile/profile" className="bg-brightColor text-white px-4 py-2 rounded-md hover:bg-hoverColor transition duration-300 ease-in-out">Profile</RouterLink>
          
          {/* Notification Button with Count */}
          <button onClick={toggleNotificationDrawer} className="relative text-white text-2xl hover:text-hoverColor transition duration-300">
            <IoNotificationsOutline size={36}  />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="lg:hidden flex items-center">
          {menu ? (
            <AiOutlineClose size={28} onClick={handleMenuChange} />
          ) : (
            <AiOutlineMenu size={28} onClick={handleMenuChange} />
          )}
        </div>
      </div>

      {/* Notification Drawer */}
      {/* Notification Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-20 ${isNotificationOpen ? "translate-x-0" : "translate-x-full"}`}>
  <div className="p-4 border-b flex justify-between items-center bg-backgroundColor text-white">
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
        onClick={() => navigateAppointment(notificationObj.notifications.appointmentId)}
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


    </div>
  );
};

export default Navbar;
