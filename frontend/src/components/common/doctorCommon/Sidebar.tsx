import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    
 
  <div className="hidden md:flex flex-col w-64 bg-gray-800 rounded-2xl">
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex flex-col flex-1 overflow-y-auto bg-gradient-to-b from-gray-700 to-blue-500 px-2 py-4 gap-10 rounded-2xl">
            {/* Logo */}
            <div className="flex items-center justify-center mb-6">
              <img src="your-logo-url.png" alt="Logo" className="h-12 w-12 rounded-full" />
              <span className="text-gray-100 text-xl font-semibold ml-2">YourBrand</span>
            </div>
            {/* Navigation Links */}
            <div className="flex flex-col flex-1 gap-3">
              <Link to="#" className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                Dashboard
              </Link>
              <Link
                to="#"
                className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  style={{ marginRight: "8px" }}
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Home
              </Link>
              <Link
                to="#"
                className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                  style={{ marginRight: "8px" }}
                >
                  <path
                    fill="currentColor"
                    d="M12 4a5 5 0 1 1-5 5 5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7 7 7 0 0 0-7-7m10 28h-2v-5a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v5H2v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7zm0-26h10v2H22zm0 5h10v2H22zm0 5h7v2h-7z"
                  />
                </svg>
                Profile
              </Link>
              <Link
                to="#"
                className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  style={{ marginRight: "8px" }}
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M16 7h3v4h-3zm-7 8h11M9 11h4M9 7h4M6 18.5a2.5 2.5 0 1 1-5 0V7h5.025M6 18.5V3h17v15.5a2.5 2.5 0 0 1-2.5 2.5h-17"
                  />
                </svg>
                Article
              </Link>
              <Link
                to="#"
                className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                  style={{ marginRight: "8px" }}
                >
                  <path
                    fill="currentColor"
                    d="M21.053 20.8c-1.132-.453-1.584-1.698-1.584-1.698s-.51.282-.51-.51.51.51 1.02-2.548c0 0 1.413-.397 1.13-3.68h-.34s.85-3.51 0-4.7c-.85-1.188-1.188-1.98-3.057-2.547s-1.188-.454-2.547-.396c-1.36.058-2.492.793-2.492 1.19 0 0-.85.056-1.188.396-.34.34-.906 1.924-.906 2.32s.283 3.06.566 3.625l-.337.114c-.284 3.283 1.13 3.68 1.13 3.68.51 3.058 1.02 1.756 1.02 2.548s-.51.51-.51.51-.452 1.245-1.584 1.698c-1.132.452-7.416 2.886-7.927 3.396-.512.51-.454 2.888-.454 2.888H29.43s.06-2.377-.452-2.888c-.51-.51-6.795-2.944-7.927-3.396zm-12.47-.172c-.1-.18-.148-.31-.148-.31s-.432.24-.432-.432.432.432.864-2.16c0 0 1.2-.335.96-3.118h-.29s.144-.59.238-1.334a10.01 10.01 0 0 1 .037-.996l.038-.426c-.02-.492-.107-.94-.312-1.226-.72-1.007-1.008-1.68-2.59-2.16-1.584-.48-1.01-.384-2.16-.335-1.152.05-2.112.672-2.112 1.01 0 0-.72.047-1.008.335-.27.27-.705 1.462-.757 1.885v.28c.048.654.26 2.45.47 2.873l-.286.096c-.24 2.782.96 3.118.96 3.118.43 2.59.863 1.488.863 2.16s-.432.43-.432.43-.383 1.058-1.343 1.44l-.232.092v5.234h.575c-.03-1.278.077-2.927.746-3.594.357-.355 1.524-.94 6.353-2.862zm22.33-9.056c-.04-.378-.127-.715-.292-.946-.718-1.008-1.007-1.682-2.588-2.162-1.582-.48-1.01-.384-2.16-.336-1.15.05-2.11.674-2.11 1.01 0 0-.72.05-1.008.338-.27.27-.705 1.464-.757 1.885v.282c.048.655.26 2.45.47 2.874l-.287.096c-.238 2.782.962 3.117.962 3.117.43 2.59.864 1.488.864 2.16s-.432.432-.432.432-.382 1.058-1.342 1.44l-.232.092v5.232h10.575v-5.232c-1.36-.52-7.32-2.867-7.927-3.396-.51-.51-6.795-2.944-7.927-3.396zm-5.903-6.002s.05-1.426-.24-2.16c-.29-.733-.768-1.054-.768-1.054-.29.322-.768 1.067-.768 1.067s-.337.12-.337 1.147.768 1.968 1.37 1.968c.61 0 .742-1.968.742-1.968zm-8.56 1.672c-.288.733-.24 2.16-.24 2.16s.13 1.968.742 1.968c.602 0 1.37-1.495 1.37-1.968 0-1.026-.337-1.147-.337-1.147s-.477-.745-.768-1.067c0 0-.478.32-.768 1.054z"
                  />
                </svg>
                Category
              </Link>
              <Link
                to="#"
                className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                  style={{ marginRight: "8px" }}
                >
                  <path
                    fill="currentColor"
                    d="M18 4v5.1l2-2V6h6v5.1l-3.6 3.6c1.2.9 2.1 2.3 2.5 3.8c.1.4.6.5.9.2c.2-.1.3-.3.3-.6c-.4-1.8-1.5-3.4-3.1-4.5l3.5-3.5l.7.7V5a1 1 0 0 0-1-1h-6.2L18 4zM4 12v15a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-5h1.1l3.7-3.7v-1.3L13 23H6V12l8-8h6v4.1l2-2V4c0-.3-.1-.5-.3-.7L19.4 2H5a1 1 0 0 0-1 1v9.4l-2 2l.7.7l1.3-1.3z"
                  />
                </svg>
                Blog
              </Link>
              <Link
                to="#"
                className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                  style={{ marginRight: "8px" }}
                >
                  <path
                    fill="currentColor"
                    d="M28 6h-5.7c.4-.6.7-1.3.7-2c0-2.2-1.8-4-4-4s-4 1.8-4 4c0 .7.2 1.4.7 2H8c-.6 0-1 .4-1 1v24c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V7c0-.6-.4-1-1-1zM19 4c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2zm6 26H9V8h4.5c.7 1.2 2 2 3.5 2s2.8-.8 3.5-2H25v22z"
                  />
                </svg>
                About Us
              </Link>
              <Link
                to="#"
                className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                  style={{ marginRight: "8px" }}
                >
                  <path
                    fill="currentColor"
                    d="M10 14h12v2H10zm0 8h8v-2h-8zm11.637-11.136l1.414 1.414l-8.48 8.48l-5.657-5.657l1.414-1.414l4.243 4.243l7.066-7.066zm-7.637-9.197c1.658 0 3 1.343 3 3c0 .551-.146 1.064-.392 1.515l-1.363-.272a1.998 1.998 0 0 0-1.245-2.239A2.98 2.98 0 0 0 15 2.981a3 3 0 1 0 0 6c.215 0 .421-.027.625-.063c.017.345.039.688.063 1.033c-.418.064-.855.063-1.297.063a4 4 0 1 1 4-4c0 .268-.015.531-.043.789A3 3 0 0 0 15 2.982zm-4.776 8.125l-.976 2.812l-2.618-2.619l-.772-.025L9.752 4.5l.226.772l-.413 1.195h3.46l-.753.753H10.5l-1.276 3.887zM7.5 11h1.5l1.5-4.5h-4.5z"
                  />
                </svg>
                Contact Us
              </Link>
            </div>
          </nav>
        </div>
      </div>

  
  

  

  )
}

export default Sidebar
