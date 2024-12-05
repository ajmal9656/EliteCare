import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../Redux/store';
import { addSpecialization, updateSpecialization, listUnlistSpecialization, logoutAdmin } from '../../Redux/Action/adminActions';
import { Specializations } from '../../interfaces/doctorinterface';
import { getSpecializations } from '../../services/adminAxiosService';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
});

const Specialization: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Specializations[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editCategory, setEditCategory] = useState<Specializations | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchSpecializations = async (page:number) => {
    try {
      const response = await getSpecializations(page)
      console.log("specia",response.data.response);
      
      setCategories(response.data.response.specializations);
      setTotalPages(response.data.response.totalPages)
    } catch (error:any) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Redirecting to login page.");
        await dispatch(logoutAdmin());
          navigate("/admin/login"); // Navigate to the login page if unauthorized
      } else {
        console.error("Error fetching user details:", error);
      }
    }
  };

  useEffect(() => {
    fetchSpecializations(currentPage);
  }, [currentPage]);

  const toggleAddModal = () => {
    setIsAddModalOpen(!isAddModalOpen);
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const openEditModal = (category: Specializations) => {
    setEditCategory(category);
    toggleEditModal();
  };

  const addFormik = useFormik({
    initialValues: { name: '', description: '' },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await dispatch(addSpecialization(values));
        if(totalPages==1 || currentPage==totalPages&&categories.length<5){
          setCategories((prevCategories) => [...prevCategories, response.data.response]);

        }if(currentPage==totalPages&&categories.length==5){
          setTotalPages(totalPages+1)
        }
        
        toggleAddModal();
        toast.success('Specialization added successfully');
      } catch (error: any) {
        toast.error(error.message || 'An error occurred');
      }
    },
  });

  const editFormik = useFormik({
    initialValues: { name: editCategory?.name || '', description: editCategory?.description || '' },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(updateSpecialization({
          id: editCategory?._id!,
          name: values.name,
          description: values.description
        }));
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category._id === editCategory?._id
              ? { ...category, name: values.name, description: values.description }
              : category
          )
        );
        toggleEditModal();
        toast.success('Specialization updated successfully');
      } catch (error: any) {
        toast.error(error.message || 'An error occurred');
      }
    },
  });

  const toggleListState = async (id: number) => {
    await dispatch(listUnlistSpecialization({
      id: id,
    }));
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category._id === id ? { ...category, isListed: !category.isListed } : category
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

  return (
    <div className="flex flex-col w-full mx-auto pl-64 p-10 ml-3 mt-14">
      <div className='flex flex-row justify-between '>
        <div className="flex justify-between items-center mb-4">
          
        </div>

        <div className="">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={toggleAddModal}
          >
            Add Specialization
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden mt-3">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b border-gray-300 text-center  text-gray-700">Name</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center  text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id} className={`hover:bg-gray-50 transition-colors 'bg-white'}`}>
              <td className="py-2 px-4 border-b border-gray-300 text-center">
                {category.name}
              </td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 transition hover:bg-yellow-600"
                  onClick={() => openEditModal(category)}
                >
                  Edit
                </button>
                <button
                  className={`${category.isListed ? 'bg-green-500' : 'bg-red-500'} text-white px-2 py-1 rounded transition hover:bg-opacity-80`}
                  onClick={() => toggleListState(category._id)}
                >
                  {category.isListed ? 'List' : 'Unlist'}
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

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add New Specialization</h2>
            <form onSubmit={addFormik.handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Specialization name"
                  value={addFormik.values.name}
                  onChange={addFormik.handleChange}
                  onBlur={addFormik.handleBlur}
                  className="mt-1 block w-full px-3 py-2 border rounded"
                />
                {addFormik.touched.name && addFormik.errors.name && (
                  <div className="text-red-500 text-sm mt-1">{addFormik.errors.name}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  placeholder="Enter description"
                  value={addFormik.values.description}
                  onChange={addFormik.handleChange}
                  onBlur={addFormik.handleBlur}
                  className="mt-1 block w-full px-3 py-2 border rounded"
                />
                {addFormik.touched.description && addFormik.errors.description && (
                  <div className="text-red-500 text-sm mt-1">{addFormik.errors.description}</div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={toggleAddModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Category</h2>
            <form onSubmit={editFormik.handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter category name"
                  value={editFormik.values.name}
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  className="mt-1 block w-full px-3 py-2 border rounded"
                />
                {editFormik.touched.name && editFormik.errors.name && (
                  <div className="text-red-500 text-sm mt-1">{editFormik.errors.name}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  placeholder="Enter description"
                  value={editFormik.values.description}
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  className="mt-1 block w-full px-3 py-2 border rounded"
                />
                {editFormik.touched.description && editFormik.errors.description && (
                  <div className="text-red-500 text-sm mt-1">{editFormik.errors.description}</div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={toggleEditModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Specialization;
