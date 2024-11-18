import { useSelector,useDispatch } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../Redux/store";
import { logoutUser } from "../../Redux/Action/userActions";
import Navbar from "../../components/common/userCommon/Navbar";
import { useEffect, useState } from "react";
import axiosUrl from "../../utils/axios";




function UserProfilesLayout() {
  const [userImage, setUserImage] = useState<any>(null);
    const navigate = useNavigate();
    const dispatch:any = useDispatch()
  const userData = useSelector((state: RootState) => state.user.userInfo);
  console.log("User Data:", userData);

  const handleLogout = async () => {
    
  
    try {
      await dispatch(logoutUser());
     
      // await axiosUrl.post('/logout', {}, { 
      //   withCredentials: true 
      // });
  
      // Remove user info from localStorage
      localStorage.removeItem('userInfo');
  
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  console.log("kjsvbkjsbvs")

  const fetchUser = async () => {
    try {
      const response = await axiosUrl.get(`/getUserDetails/${userData?._id}`); // Replace with your backend endpoint
      console.log("userrrrr",response.data.response);
      
      setUserImage(response.data.response); // Assuming response data has the list of doctors
    } catch (error:any) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Redirecting to login page.");
        navigate("/login"); // Navigate to the login page if unauthorized
      } else {
        console.error("Error fetching user details:", error);
      }
    }
  };

  useEffect(() => {
    if (userData?._id) {
      fetchUser();
    }
  }, [userData]);
  
  return (
    <>
    <Navbar/>
    <div className="bg-gray-100 h-auto flex overflow-hidden pt-24">
      <div className="w-[25%] h-full pl-20  ">
      <div className="object-cover p-3 space-y-2 w-60 bg-white text-gray-100 border rounded-lg">
          <div className="flex items-center p-2 space-x-4">
            <img
              src={
                userImage?.signedImageUrl && userImage.signedImageUrl!== ''
                  ? userImage.signedImageUrl
                  : "https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg"
              }
              alt=""
              className="w-12 h-12 rounded-full bg-gray-500"
            />
            <div>
              <h2 className="text-lg font-semibold text-black">{userData?.name}</h2>
              
            </div>
          </div>
          <div className="divide-y divide-gray-700">
            <ul className="pt-2 pb-4 space-y-1 text-sm">
              {/* Dashboard NavLink */}
              <li>
              <NavLink
  to="/userProfile/profile"
  className={({ isActive }) =>
    `flex items-center p-2 space-x-3 rounded-md ${
      isActive
        ? "bg-gradient-to-r from-[#ADE9DC] to-[#D2EFEA] text-slate-600"
        : "text-gray-500 hover:bg-gradient-to-r from-[#ADE9DC] to-[#D2EFEA] hover:text-gray-600"
    }`
  }
  end
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className="w-5 h-5 fill-current"
  >
    <path d="M68.983,382.642l171.35,98.928a32.082,32.082,0,0,0,32,0l171.352-98.929a32.093,32.093,0,0,0,16-27.713V157.071a32.092,32.092,0,0,0-16-27.713L272.334,30.429a32.086,32.086,0,0,0-32,0L68.983,129.358a32.09,32.09,0,0,0-16,27.713V354.929A32.09,32.09,0,0,0,68.983,382.642ZM272.333,67.38l155.351,89.691V334.449L272.333,246.642ZM256.282,274.327l157.155,88.828-157.1,90.7L99.179,363.125ZM84.983,157.071,240.333,67.38v179.2L84.983,334.39Z"></path>
  </svg>
  <span>Profile</span>
</NavLink>

              </li>

              {/* Search NavLink */}
              <li>
                <NavLink
                  to="/userProfile/appointments"
                  className={({ isActive }) =>
                    `flex items-center p-2 space-x-3 rounded-md ${
                      isActive
                        ? "bg-gradient-to-r from-[#ADE9DC] to-[#D2EFEA] text-slate-600"
                        : "text-gray-500 hover:bg-gradient-to-r from-[#ADE9DC] to-[#D2EFEA] hover:text-gray-600"
                    }`
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-5 h-5 fill-current"
                  >
                    <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                  </svg>
                  <span>Appoinments</span>
                </NavLink>
              </li>

              

              

              

              {/* Logout button */}
              <li> 
  <button
    onClick={handleLogout}
    className="flex items-center p-2 space-x-3 rounded-md text-gray-500 hover:bg-gradient-to-r from-[#ADE9DC] to-[#D2EFEA] hover:text-gray-600"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="w-5 h-5 fill-current"
    >
      <path d="M256,48C141.124,48,48,141.124,48,256S141.124,464,256,464,464,370.876,464,256,370.876,48,256,48Zm0,32c93.732,0,176,76.476,176,176s-76.476,176-176,176S80,333.732,80,256,162.268,80,256,80ZM207.742,128.143a16,16,0,1,0-22.627,22.628L245.172,211H152a16,16,0,0,0,0,32h93.172l-60.057,60.057a16,16,0,1,0,22.628,22.627l80-80a16,16,0,0,0,0-22.628Z"/>
    </svg>
    <span>Logout</span>
  </button> 
</li>

            </ul>
          </div>
        </div>
      </div>

      
  <Outlet/>


    </div>
    </>
  )
}

export default UserProfilesLayout
