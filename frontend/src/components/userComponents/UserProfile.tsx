import { NavLink,useNavigate } from "react-router-dom";



function UserProfile() {

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();

    // Navigate to login page
    navigate("/login");
  };



    return (
      <div className="  h-screen flex pt-16">
         <div className="w-[25%] h-screen pl-24 pt-16">
        <div className="object-cover p-3 space-y-2 w-60 bg-white text-gray-100 border rounded-lg">
          <div className="flex items-center p-2 space-x-4">
            <img
              src="https://source.unsplash.com/100x100/?portrait"
              alt=""
              className="w-12 h-12 rounded-full bg-gray-500"
            />
            <div>
              <h2 className="text-lg font-semibold">Leroy Jenkins</h2>
              <span className="flex items-center space-x-1">
                <NavLink
                  to="/profile"
                  className="text-xs hover:underline text-gray-400"
                >
                  View profile
                </NavLink>
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-700">
            <ul className="pt-2 pb-4 space-y-1 text-sm">
              {/* Dashboard NavLink */}
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center p-2 space-x-3 rounded-md ${
                      isActive
                        ? "bg-gray-500 text-white"
                        : "text-gray-400 hover:bg-gray-300 hover:text-gray-600"
                    }`
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-5 h-5 fill-current"
                  >
                    <path d="M68.983,382.642l171.35,98.928a32.082,32.082,0,0,0,32,0l171.352-98.929a32.093,32.093,0,0,0,16-27.713V157.071a32.092,32.092,0,0,0-16-27.713L272.334,30.429a32.086,32.086,0,0,0-32,0L68.983,129.358a32.09,32.09,0,0,0-16,27.713V354.929A32.09,32.09,0,0,0,68.983,382.642ZM272.333,67.38l155.351,89.691V334.449L272.333,246.642ZM256.282,274.327l157.155,88.828-157.1,90.7L99.179,363.125ZM84.983,157.071,240.333,67.38v179.2L84.983,334.39Z"></path>
                  </svg>
                  <span>Dashboard</span>
                </NavLink>
              </li>

              {/* Search NavLink */}
              <li>
                <NavLink
                  to="/search"
                  className={({ isActive }) =>
                    `flex items-center p-2 space-x-3 rounded-md ${
                      isActive
                        ? "bg-gray-500 text-white"
                        : "text-gray-400 hover:bg-gray-300 hover:text-gray-600"
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
                  <span>Search</span>
                </NavLink>
              </li>

              {/* Chat NavLink */}
              <li>
                <NavLink
                  to="/chat"
                  className={({ isActive }) =>
                    `flex items-center p-2 space-x-3 rounded-md ${
                      isActive
                        ? "bg-gray-500 text-white"
                        : "text-gray-400 hover:bg-gray-300 hover:text-gray-600"
                    }`
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-5 h-5 fill-current"
                  >
                    <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.882,67.817A167.839,167.839,0,0,1,370.089,423Z"></path>
                  </svg>
                  <span>Chat</span>
                </NavLink>
              </li>

              {/* Add more NavLink items as needed */}

              {/* Logout button */}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 space-x-3 rounded-md text-gray-400 hover:bg-gray-300 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-5 h-5 fill-current"
                  >
                    <path d="M256,48C141.124,48,48,141.124,48,256S141.124,464,256,464,464,370.876,464,256,370.876,48,256,48ZM344,335.684,311.371,368,256,312.629,200.629,368,168,335.371,223.371,280,168,224.629,200.629,192,256,247.371,311.371,192,344,224.629,288.629,280Z"></path>
                  </svg>
                  <span>Log out</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

        <div className=" w-[75%] h-screen pt-16 pr-10 " >
          <div className="bg-white h-[95%] rounded-lg border ">

          </div>

        </div>
      
    </div>
    );
  }
  
  export default UserProfile;
  