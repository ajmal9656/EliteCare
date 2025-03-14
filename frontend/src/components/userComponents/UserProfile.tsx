import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { FaCamera, FaEdit } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { logoutUser, updateUserProfile,updateUserProfileImage } from "../../Redux/Action/userActions";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../services/userAxiosService";


function UserProfile() {
  const userData = useSelector((state: RootState) => state.user.userInfo);

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null); 
  const [userImage, setUserImage] = useState<any>(null);

  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const today = new Date();
const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split("T")[0];

  
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
        console.log("Updated Data:", response);
        

        setIsModalOpen(false);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    },
  });

  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setPreviewImage(null); 
  };

 
  const formikImage = useFormik({
    initialValues: {
      image: null,
    },
  
   
    validationSchema: Yup.object({
      image: Yup.mixed().required("An image is required."), 
    }),
  
    onSubmit: async (values) => {
      try {
        if (!userData || !values.image) {
          console.log(userData);
          console.log(values.image)
          console.error("Image not selected or user data is missing.");
          return; 
        }
  
        const formData = new FormData();
        formData.append("image", values.image); 
        formData.append("_id", userData._id); 
  
       
        for (const pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
  
        const response = await dispatch(updateUserProfileImage(formData));
        console.log("Image uploaded:", response.payload.userInfo.image.url);
        if (response.payload.userInfo.image.url) {
          setUserImage({ signedImageUrl: response.payload.userInfo.image.url });
        }
  
  
        setIsImageModalOpen(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },
  });
  


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formikImage.setFieldValue("image", file);
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL); 
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        
        const response = await getUserData(userData?._id)  // Replace with your backend endpoint
        console.log("userrrrr",response);
        
        setUserImage(response.data.response); // Assuming response data has the list of doctors
      } catch (error:any) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized: Redirecting to login page.");
          await dispatch(logoutUser());
        navigate("/login"); // Navigate to the login page if unauthorized
        } else {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUser();
  }, []);

  
 
  

  return (
    <div className="w-[75%] h-screen  pr-14">
      <div className="bg-white h-[85%] rounded-lg border flex flex-col">
        <div className="w-[100%] h-[25%] rounded-md border bg-gradient-to-r from-[#D2EFEA] to-[#ADE9DC] flex place-content-center">
        <div className="w-[15%] h-[165px] mt-16 relative flex">
  <img
    className="rounded-full"
    src={
      userImage?.signedImageUrl && userImage.signedImageUrl!== ''
        ? userImage.signedImageUrl
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
            </div>
          </div>
          
        </div>
      </div>

      
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
                max={maxDate} // Set max date to 18 years ago
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
            onChange={handleImageChange} 
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          {formikImage.errors.image && formikImage.touched.image && (
            <p className="text-red-600 text-sm">{formikImage.errors.image}</p> 
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
