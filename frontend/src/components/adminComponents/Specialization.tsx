import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../Redux/store';
import { addSpecialization,updateSpecialization,listUnlistSpecialization} from '../../Redux/Action/adminActions'; // Assuming you have an updateSpecialization action
import { Specializations } from '../../interfaces/doctorinterface';

import axiosUrl from '../../utils/axios';

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

  const fetchSpecializations = async () => {
    try {
      const response = await axiosUrl.get('/admin/getSpecializations');
      setCategories(response.data.response);
    } catch (error) {
      toast.error('Failed to fetch specializations');
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const toggleAddModal = () => {
    setIsAddModalOpen(!isAddModalOpen);
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const openEditModal = (category: Specializations) => {
    setEditCategory(category);-
    toggleEditModal();
  };

  const addFormik = useFormik({
    initialValues: { name: '', description: '' },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await dispatch(addSpecialization(values));
        setCategories((prevCategories) => [...prevCategories, response.data.response]);
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
        console.log(editCategory?._id);
        console.log(values)
        const response = await dispatch(updateSpecialization({
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

  const toggleListState = async(id: number) => {
    const response = await dispatch(listUnlistSpecialization({
      id: id,  
       
    }));
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category._id === id ? { ...category, isListed: !category.isListed } : category
      )
    );
  };

  return (
    <div className="flex flex-col w-full mx-auto pl-64 p-4 ml-3 mt-14">
      <div className='flex flex-row justify-between'>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
      </div>

      <div className="">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={toggleAddModal}
        >
          Add Category
        </button>
      </div>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Name</th>
            
            <th className="py-2 px-4 border-b border-gray-300 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td className="py-2 px-4 border-b border-gray-300 text-center">
                {category.name}
              </td>
              
              <td className="py-2 px-4 border-b border-gray-300 text-center">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => openEditModal(category)}
                >
                  Edit
                </button>
                <button
                  className={`${category.isListed ? 'bg-green-500' : 'bg-red-500'} text-white px-2 py-1 rounded`}
                  onClick={() => toggleListState(category._id)}
                >
                  {category.isListed ? 'List' : 'Unlist'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add New Category</h2>
            <form onSubmit={addFormik.handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter category name"
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
