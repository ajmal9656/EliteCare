import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axiosUrl from '../../utils/axios';
import { UserDetails } from '../../interfaces/userInterface';
import { useNavigate } from 'react-router-dom';

function UserListing() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserDetails[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");


    const fetchUsers = async (page:number,search:string) => {
        try {
          console.log("searchhh",search);
          
            const response = await axiosUrl.get('/admin/getUsers',{
                params: { page, limit: 1 ,search }
              });
            setUsers(response.data.response.users);
            setTotalPages(response.data.response.totalPages)
        } catch (error:any) {
          if (error.response && error.response.status === 401) {
            console.error("Unauthorized: Redirecting to login page.");
            navigate("/admin/login"); // Navigate to the login page if unauthorized
          } else {
            console.error("Error fetching user details:", error);
          }
        }
    };

    useEffect(() => {
        fetchUsers(currentPage,searchQuery);
    }, [currentPage]);

    const toggleListState = async (id: string) => {
        await axiosUrl.put(`/admin/listUnlistUser/${id}`);
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
            )
        );
    };

    const handlePagination = (direction: string) => {
        if (direction === "next" && currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        } else if (direction === "previous" && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };

      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value); // Update search query as user types
      };
    
      const handleSearch = () => {
        setCurrentPage(1); // Reset to the first page when searching
        fetchUsers(currentPage, searchQuery); // Re-fetch with search query
      };

    return (
        <div className="flex flex-col pl-64 p-10 ml-3 mt-14">
            <div className='flex flex-row justify-end '>
            <div className="flex space-x-4 items-center mb-4">
            <input
              type="text"
              placeholder="Search Doctors"
              value={searchQuery} // Controlled input
              onChange={handleSearchChange} // Update state on input change
              className="p-1 rounded-lg border border-gray-300"
            />
          <button
            className="text-sm px-2 py-1 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            onClick={handleSearch}
          >
            Search
          </button>
        </div> 
            </div>

            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-300 text-center text-gray-700">Name</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-center text-gray-700">Email</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-center text-gray-700">View Details</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-center text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-2 px-4 border-b border-gray-300 text-center">
                                {user.name}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-300 text-center">
                                {user.email}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-300 text-center">
                                <button
                                    className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors'
                                    // onClick={() => viewUser(user._id)}
                                >
                                    View
                                </button>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-300 text-center">
                                <button
                                    className={`${user.isBlocked ? 'bg-green-500' : 'bg-red-500'} text-white px-2 py-1 rounded hover:opacity-80 transition-opacity`}
                                    onClick={() => toggleListState(user._id)}
                                >
                                    {user.isBlocked ? 'List' : 'Unlist'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex flex-col items-center">
  {/* Help text */}
  <span className="text-sm text-slate-500 dark:text-slate-400 mt-5">
    Showing <span className="font-semibold text-gray-900 dark:text-slate-300">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-slate-300">{totalPages}</span> Entries
  </span>

  {/* Buttons */}
  <div className="inline-flex mt-4 space-x-2">
    <button
      className={`flex items-center justify-center px-5 py-2 h-10 text-base font-medium ${
        currentPage === 1 
          ? "bg-slate-500 text-gray-100 cursor-not-allowed" 
          : "bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 text-white hover:scale-105 hover:shadow-xl hover:from-blue-600 hover:to-cyan-600"
      } rounded-l-md shadow-lg transform transition duration-300 ease-in-out dark:bg-slate-500 dark:text-gray-200`}
      onClick={() => handlePagination("previous")}
      disabled={currentPage === 1}
    >
      <svg className="w-4 h-4 mr-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
      </svg>
      Prev
    </button>

    <button
      className={`flex items-center justify-center px-5 py-2 h-10 text-base font-medium ${
        currentPage === totalPages 
          ? "bg-slate-500 text-gray-100 cursor-not-allowed" 
          : "bg-gradient-to-br from-gray-800 via-gray-600 to-gray-700 text-white hover:scale-105 hover:shadow-xl hover:from-cyan-600 hover:to-blue-600"
      } rounded-r-md shadow-lg transform transition duration-300 ease-in-out dark:bg-slate-500 dark:text-gray-200`}
      onClick={() => handlePagination("next")}
      disabled={currentPage === totalPages}
    >
      Next
      <svg className="w-4 h-4 ml-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
      </svg>
    </button>
  </div>
</div>
        </div>
    );
}

export default UserListing;
