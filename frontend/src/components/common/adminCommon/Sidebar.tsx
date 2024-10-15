import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../../Redux/Action/adminActions";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch:any = useDispatch()


  const handleLogout = async () => {
    
  
    try {
      await dispatch(logoutAdmin());
     
      // await axiosUrl.post('/logout', {}, { 
      //   withCredentials: true 
      // });
  
      // Remove user info from localStorage
      localStorage.removeItem('adminInfo');
  
      // Redirect to login page
      navigate("/admin/login");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <>
      <nav className=" fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
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
        <a href="https://flowbite.com" className="flex ms-2 md:me-24">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8 me-3"
            alt="FlowBite Logo"
          />
          <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
            EliteCare
          </span>
        </a>
      </div>
      <div className="flex items-center">
        <div className="flex items-center ms-3">
          <div>
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              aria-expanded="false"
              data-dropdown-toggle="dropdown-user"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                alt="user photo"
              />
            </button>
          </div>
          <div className="hidden z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
            <div className="px-4 py-3" role="none">
              <p className="text-sm text-gray-900 dark:text-white" role="none">Neil Sims</p>
              <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">neil.sims@flowbite.com</p>
            </div>
            <ul className="py-1" role="none">
              <li>
                <NavLink to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                  Settings
                </NavLink>
              </li>
              <li>
                <NavLink to="/earnings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                  Earnings
                </NavLink>
              </li>
              <li>
                <NavLink to="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                  Sign out
                </NavLink>
              </li>
            </ul>
          </div>
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
  className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
  aria-label="Sidebar"
>
  <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
    <ul className="space-y-2 font-medium">
      <li>
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive
              ? "flex items-center p-2 text-gray-900 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-white"
              : "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          }
        >
          <svg
            className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
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
          to="/admin/doctorsList"
          className={({ isActive }) =>
            isActive
              ? "flex items-center p-2 text-gray-900 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-white"
              : "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          }
        >
          <svg
            className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 10C6.346 10 0 11.022 0 13v2.98C0 16.548 0 17 0 17h12c0 0 0-.452 0-1.02V13c0-1.978-6.346-3-8-3Zm6.5-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm-1.882 1.598A5.028 5.028 0 0 1 16.048 12H20v4.98C20 16.548 20 17 20 17h-6v-1.02a5.992 5.992 0 0 0-1.382-4.382Z" />
          </svg>
          <span className="ms-3">Doctors</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/admin/usersList"
          className={({ isActive }) =>
            isActive
              ? "flex items-center p-2 text-gray-900 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-white"
              : "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          }
        >
          <svg
            className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 10C6.346 10 0 11.022 0 13v2.98C0 16.548 0 17 0 17h12c0 0 0-.452 0-1.02V13c0-1.978-6.346-3-8-3Zm6.5-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm-1.882 1.598A5.028 5.028 0 0 1 16.048 12H20v4.98C20 16.548 20 17 20 17h-6v-1.02a5.992 5.992 0 0 0-1.382-4.382Z" />
          </svg>
          <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/admin/specializations"
          className={({ isActive }) =>
            isActive
              ? "flex items-center p-2 text-gray-900 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-white"
              : "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          }
        >
          <svg
            className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 16"
          >
            <path d="M17.618 4.078 10 .335a2.015 2.015 0 0 0-1.968 0L.618 4.078A1.969 1.969 0 0 0 0 5.82v6.36a1.969 1.969 0 0 0 .618 1.742l7.414 4.035a2.015 2.015 0 0 0 1.968 0l7.414-4.035A1.969 1.969 0 0 0 18 12.179V5.82a1.969 1.969 0 0 0-.382-1.742ZM9 14a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm7-7h-4a.5.5 0 1 1 0-1h4a.5.5 0 0 1 0 1Z" />
          </svg>
          <span className="flex-1 ms-3 whitespace-nowrap">Specializations</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/admin/applications"
          className={({ isActive }) =>
            isActive
              ? "flex items-center p-2 text-gray-900 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-white"
              : "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          }
        >
          <svg
            className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a2 2 0 0 0-2 2v4h4V2a2 2 0 0 0-2-2Zm-5 7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5Zm1 2h8v8H6V9Zm2-7a.5.5 0 0 0-1 0v3.5A.5.5 0 0 0 7.5 6h5a.5.5 0 0 0 0-1H8V2Z" />
          </svg>
          <span className="flex-1 ms-3 whitespace-nowrap">Applications</span>
        </NavLink>
      </li>
    </ul>
  </div>
</aside>

    </>
  );
}

export default Sidebar;
