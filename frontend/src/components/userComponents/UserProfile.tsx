<<<<<<< HEAD
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { FaCamera, FaEdit } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateUserProfile,updateUserProfileImage } from "../../Redux/Action/userActions";

function UserProfile() {
  const userData = useSelector((state: RootState) => state.user.userInfo);

  // State to control modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // New state for image preview

  const dispatch: any = useDispatch();

  // Formik setup for profile info
  const formik = useFormik({
    initialValues: {
      name: userData?.name || "",
      dob: userData?.DOB || "",
      address: userData?.address || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      dob: Yup.date().required("Date of Birth is required"),
      address: Yup.string().required("Address is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (!userData) return;

        const updatedValues = {
          ...values,
          dob: new Date(values.dob),
          _id: userData._id,
        };

        const response = await dispatch(updateUserProfile(updatedValues));
        console.log("Updated Data:", response.data);

        setIsModalOpen(false);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    },
  });

  // Handle opening and closing modals
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setPreviewImage(null); // Reset preview when modal closes
  };

  // Formik for image upload
  const formikImage = useFormik({
    initialValues: {
      image: null,
    },
  
    // Optional: Yup schema validation
    validationSchema: Yup.object({
      image: Yup.mixed().required("An image is required."), // Ensures image is not empty
    }),
  
    onSubmit: async (values) => {
      try {
        if (!userData || !values.image) {
          console.log(userData);
          console.log(values.image)
          console.error("Image not selected or user data is missing.");
          return; // Ensure image is selected
        }
  
        const formData = new FormData();
        formData.append("image", values.image); // Append the image
        formData.append("_id", userData._id); // Append user ID
  
        // Log formData key-value pairs
        for (const pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
  
        const response = await dispatch(updateUserProfileImage(formData));
        console.log("Image uploaded:", response.data);
  
        setIsImageModalOpen(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },
  });
  

  // Handle image selection and preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formikImage.setFieldValue("image", file);
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL); // Set preview image
    }
  };

  return (
    <div className="w-[75%] h-screen mt-10 pr-14">
      <div className="bg-white h-[88%] rounded-lg border flex flex-col">
        <div className="w-[100%] h-[25%] rounded-md border bg-gradient-to-r from-[#D2EFEA] to-[#ADE9DC] flex place-content-center">
        <div className="w-[15%] h-[165px] mt-16 relative flex">
  <img
    className="rounded-full"
    src={
      userData?.image?.url && userData.image.url !== ''
        ? userData.image.url
        : "https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg"
    }
    alt="User Profile"
  />
  <div className="z-10 relative flex-col bottom-0 top-32 right-9">
    <FaCamera size={28} className="cursor-pointer" onClick={openImageModal} />
  </div>
</div>
        </div>

        <div className="w-[100%] h-[75%] flex flex-col justify-center items-center mt-12">
          <div className="w-[90%] h-[10%] flex flex-row justify-end mr-16">
            <FaEdit className="text-2xl cursor-pointer" onClick={openModal} />
          </div>
          <div className="w-[90%] h-[70%] grid grid-cols-2 grid-rows-3 gap-4 p-6">
            <div className="p-4 rounded-md">
              <label className="block text-black text-lg font-semibold">Name</label>
              <p className="border-b-2 border-gray-500 pb-1">{userData?.name || "N/A"}</p>
            </div>
            <div className="p-4 rounded-md">
              <label className="block text-black text-lg font-semibold">Email</label>
              <p className="border-b-2 border-gray-500 pb-1">{userData?.email || "N/A"}</p>
            </div>
            <div className="p-4 rounded-md">
              <label className="block text-black text-lg font-semibold">Phone</label>
              <p className="border-b-2 border-gray-500 pb-1">{userData?.phone || "N/A"}</p>
            </div>
            <div className="p-4 rounded-md">
              <label className="block text-black text-lg font-semibold">DOB</label>
              <p className="border-b-2 border-gray-500 pb-1">
                {userData?.DOB ? new Date(userData.DOB).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div className="p-4 rounded-md">
              <label className="block text-black text-lg font-semibold">Address</label>
              <p className="border-b-2 border-gray-500 pb-1">{userData?.address || "N/A"}</p>
=======
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
>>>>>>> 10b7c48f1592b2eaa5cf789c67e0b422e7233e93
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

<<<<<<< HEAD
      {/* Profile Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[400px]">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-sm">{formik.errors.name}</div>
                ) : null}
              </div>

              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">DOB</label>
                <input
                  type="date"
                  name="dob"
                  value={formik.values.dob ? new Date(formik.values.dob).toISOString().split("T")[0] : ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
                {formik.touched.dob && formik.errors.dob ? (
                  <div className="text-red-500 text-sm">{formik.errors.dob}</div>
                ) : null}
              </div>

              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
                {formik.touched.address && formik.errors.address ? (
                  <div className="text-red-500 text-sm">{formik.errors.address}</div>
                ) : null}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brightColor text-white py-2 px-4 rounded-md hover:bg-hoverColor transition duration-300 ease-in-out"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {isImageModalOpen && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg w-[400px]">
      <h2 className="text-2xl font-bold mb-4">Update Profile Image</h2>

      <form onSubmit={formikImage.handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Select Image</label>
          <input
            type="file"
            name="image"
            accept="image/*" // Accept only image files
            onChange={handleImageChange} // Updated to handle image change
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          {formikImage.errors.image && formikImage.touched.image && (
            <p className="text-red-600 text-sm">{formikImage.errors.image}</p> // Error message for validation
          )}
          {previewImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
              <img src={previewImage} alt="Preview" className="h-40 w-40 object-cover rounded-md" />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={closeImageModal}
            className="bg-gray-500 text-white py-2 px-4 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-brightColor text-white py-2 px-4 rounded-md hover:bg-hoverColor transition duration-300 ease-in-out"
          >
            Save Image
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}

export default UserProfile;
=======
        <div className=" w-[75%] h-screen pt-16 pr-10 " >
          <div className="bg-white h-[95%] rounded-lg border ">

          </div>

        </div>
      
    </div>
    );
  }
  
  export default UserProfile;
  
>>>>>>> 10b7c48f1592b2eaa5cf789c67e0b422e7233e93
