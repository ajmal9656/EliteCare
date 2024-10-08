import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axiosUrl from '../../utils/axios';
import { UserDetails } from '../../interfaces/userInterface';
import { useNavigate } from 'react-router-dom';

function UserListing() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserDetails[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await axiosUrl.get('/admin/getUsers');
            setUsers(response.data.response);
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleListState = async (id: string) => {
        await axiosUrl.put(`/admin/listUnlistUser/${id}`);
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
            )
        );
    };

    return (
        <div className="flex flex-col pl-64 p-4 ml-3 mt-14">
            <div className='flex flex-row justify-between'>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Users</h1>
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
        </div>
    );
}

export default UserListing;
