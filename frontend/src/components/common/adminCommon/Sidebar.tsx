import { Link } from "react-router-dom";

function Sidebar() {
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
            Flowbite
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
                <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                  Settings
                </Link>
              </li>
              <li>
                <Link to="/earnings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                  Earnings
                </Link>
              </li>
              <li>
                <Link to="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                  Sign out
                </Link>
              </li>
            </ul>
          </div>
          <button
            type="button"
            className="ml-4 text-sm text-gray-900 dark:text-white"
            onClick={() => console.log('Logout')}
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
        className="fixed top-0 left-0 z-40 w-64  h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
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
              </Link>
            </li>
            <li>
              <Link
                to="/kanban"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286C10 17.169 10.831 18 11.857 18h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Doctors</span>
                
              </Link>
            </li>
            <li>
              <Link
                to="/inbox"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
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
                <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                
              </Link>
            </li>
            <li>
              <Link
                to="/admin/specializations"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
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
                <span className="flex-1 ms-3 whitespace-nowrap">Specilizations</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/applications"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a2 2 0 0 0-2 2v8.992l-3.528 4.94A2 2 0 0 0 6.237 20h7.526a2 2 0 0 0 1.765-4.068L12 10.992V2a2 2 0 0 0-2-2Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Pending Applications</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
