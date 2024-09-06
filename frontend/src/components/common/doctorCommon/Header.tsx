import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
  <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200">
    
    <div className="flex items-center space-x-4 ml-auto mr-4">
      <Link to="/profile" className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-300">
        <img
          src="path/to/profile-image.jpg"  // Replace with your image source
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </Link>

      <Link
        to="#"
        className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M5 11h8v2H5v3l-5-4l5-4zm-1 7h2.708a8 8 0 1 0 0-12H4a9.985 9.985 0 0 1 8-4c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.985 9.985 0 0 1-8-4"
          />
        </svg>
        <span className="font-bold">Logout</span>
      </Link>
    </div>

  </div>
</div>
  )
}

export default Header
