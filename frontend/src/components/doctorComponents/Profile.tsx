import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import axiosUrl from "../../utils/axios";
import { Rating, Typography, Modal, Box, TextField, Button } from "@mui/material"; // Import Modal, TextField, Button
import { FaEdit } from "react-icons/fa";
import { updateDoctorProfile } from "../../Redux/Action/doctorActions";
import Swal from 'sweetalert2';



function Profile() {

const dispatch:any = useDispatch()
  const DoctorData = useSelector((state: RootState) => state.doctor);
  console.log("doc",DoctorData);
  

  const [profileData, setProfileData] = useState<any>(null); // State to store the fetched profile data
  const [reviews, setReviews] = useState<any[]>([]); // Set the state to store reviews
  const [averageRating, setAverageRating] = useState(0); // State to store the average rating
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility
  const [editFields, setEditFields] = useState({
    DOB: "",
    fees: "",
    phone: "",
  }); // State for modal input fields
  const [errors, setErrors] = useState({ // State for error messages
    DOB: "",
    fees: "",
    phone: "",
  });

  // Fetch profile details when the component mounts
  useEffect(() => {
    if (DoctorData?.doctorInfo?.doctorId) {
      const fetchProfile = async () => {
        try {
          const response = await axiosUrl.get(
            `/doctor/getDoctorDetails/${DoctorData?.doctorInfo?.doctorId}`,
            {
              params: { reviewData: true },
            }
          );
  
          const profile = response.data.response;
          setProfileData(profile); // Update the state with fetched data
          setReviews(profile.appointments);
          calculateAverageRating(profile.appointments);
  
          // Format the DOB to YYYY-MM-DD for the input field
          const formattedDOB = profile.DOB
            ? new Date(profile.DOB).toISOString().split("T")[0]
            : ""; // If DOB exists, format it to YYYY-MM-DD, otherwise leave it as an empty string
  
          setEditFields({
            DOB: formattedDOB,
            fees: profile.fees || "",
            phone: profile.phone || "",
          }); // Prefill edit fields with profile data
        } catch (error) {
          console.error("Error fetching profile details:", error);
        }
      };
  
      fetchProfile();
    }
  }, [DoctorData?.doctorInfo?.doctorId]);
  

  // Function to calculate the average rating
  const calculateAverageRating = (reviews: any[]) => {
    if (reviews.length === 0) return 0; // Return 0 if there are no reviews
    const totalRating = reviews.reduce((acc, review) => acc + review.review.rating, 0);
    const average = totalRating / reviews.length;
    setAverageRating(Number(average.toFixed(1))); // Set average rating with one decimal point
  };

  const handleOpenModal = () => {
    const formattedDOB = profileData?.DOB
      ? new Date(profileData.DOB).toISOString().split("T")[0]
      : ""; // Ensure this variable is defined
    setEditFields({
      DOB: formattedDOB,
      fees: profileData.fees || "",
      phone: profileData.phone || "",
    });
    setOpenModal(true);
  };
  

  // Handle closing the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setErrors({ DOB: "", fees: "", phone: "" }); // Clear errors when modal closes
  };

  // Handle form input changes inside the modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear the error for the field being edited
  };

  // Handle form submission to update the profile data
  const handleFormSubmit = async () => {
    let hasError = false; // Flag to track if there are validation errors
  
    // Validation: Check if fields are empty, validate fees and phone
    const newErrors = { DOB: "", fees: "", phone: "" }; // Create a new error object
  
    if (!editFields.DOB) {
      newErrors.DOB = "Date of Birth is required.";
      hasError = true;
    }
    if (!editFields.fees) {
      newErrors.fees = "Fees are required.";
      hasError = true;
    } else if (isNaN(Number(editFields.fees)) || Number(editFields.fees) <= 0) {
      // Check if fees are a valid number and greater than 0
      newErrors.fees = "Fees must be a positive number.";
      hasError = true;
    }
    if (!editFields.phone) {
      newErrors.phone = "Phone number is required.";
      hasError = true;
    } else if (!/^\d{10}$/.test(editFields.phone)) {
      // Validate phone number: must be numeric and exactly 10 digits
      newErrors.phone = "Phone number must be a valid 10-digit number.";
      hasError = true;
    }
  
    setErrors(newErrors); // Update the error state
  
    if (hasError) return; // Exit the function if validation fails
  
    // Prepare updated values for the dispatch call
    const updatedValues = {
      doctorId: DoctorData?.doctorInfo?.doctorId, // Assuming you have doctorId in the data
      DOB: editFields.DOB,
      fees: Number(editFields.fees), // Convert fees to a number before sending
      phone: editFields.phone,
    };
  
    try {
      // Dispatch the updateUserProfile action
      const response = await dispatch(updateDoctorProfile(updatedValues)).unwrap(); // Ensure proper error handling
  
      // Refresh the profile data after update
      setProfileData({ ...profileData, ...editFields });
      handleCloseModal();
  
      // Show success SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been successfully updated!',
        confirmButtonText: 'OK',
      });
    } catch (error:any) {
      // Show error SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error || 'Something went wrong!',
        confirmButtonText: 'Try Again',
      });
    }
  };
  


  return (
    <div className="flex flex-col w-full mx-auto pl-80 p-4 ml-3 mt-14 h-screen px-10 space-y-6">
      <main className="profile-page mt-64">
        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64 min-h-[600px]">
              <div className="px-6">
                <div className="flex justify-center items-start">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-56 px-4 lg:order-2 flex justify-center mr-52">
                      <div className="relative">
                        <img
                          alt="Profile"
                          src={profileData?.signedImageUrl || "default-image-url.jpg"}
                          className="shadow-xl rounded-3xl h-44 align-middle border-none -m-16 mx-auto max-w-150-px ml-52"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating and Review Count */}
                  <div className="flex flex-col pt-5 pl-1">
                    <Rating value={averageRating || 0} precision={0.1} readOnly />
                    <Typography color="blue-gray" className="font-medium text-blue-gray-500">
                      Out of {reviews.length} Reviews
                    </Typography>
                  </div>

                  {/* Edit Button */}
                  <div className="flex flex-col pt-5 pl-16">
                    <FaEdit className="text-2xl cursor-pointer" onClick={handleOpenModal} />
                  </div>
                </div>

                <ProfileDetails profileData={profileData} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal for Editing Profile */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Edit Profile
          </Typography>
          <TextField
            label="Date of Birth"
            type="date"
            name="DOB"
            value={editFields.DOB}
            fullWidth
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{
              shrink: true, // Ensure the label doesn't overlap
            }}
            error={!!errors.DOB} // Set error state
            helperText={errors.DOB} // Display error message
          />
          <TextField
            label="Fees"
            name="fees"
            value={editFields.fees}
            fullWidth
            onChange={handleInputChange}
            margin="normal"
            error={!!errors.fees} // Set error state
            helperText={errors.fees} // Display error message
          />
          <TextField
            label="Mobile Number"
            name="phone"
            value={editFields.phone}
            fullWidth
            onChange={handleInputChange}
            margin="normal"
            error={!!errors.phone} // Set error state
            helperText={errors.phone} // Display error message
          />
          <Button variant="contained" color="primary" onClick={handleFormSubmit} fullWidth>
            Update Profile
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

// Profile Details Component
const ProfileDetails = ({ profileData }: { profileData: any }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="text-center mt-16">
      <h3 className="text-4xl font-bold leading-normal mb-2 text-blueGray-800">
        Dr. {profileData?.name || "Dr. Jenna Stones"} {/* Display profile name */}
      </h3>
      <div className="text-2xl leading-normal mt-0 mb-2 text-blueGray-600 font-semibold uppercase">
        <i className="fas fa-map-marker-alt mr-2 text-blueGray-400"></i>
        {profileData?.department || "Specialization"}
      </div>

      <div className="mb-2 text-blueGray-600 text-lg mt-10">
        <i className="fas fa-dollar-sign mr-2 text-lg text-blueGray-400"></i>
        <span className="font-medium">Fees: </span>
        <span>{profileData?.fees ? `$${profileData?.fees}` : "$500"}</span>
      </div>

      <div className="mb-2 text-blueGray-600 text-lg">
        <i className="fas fa-calendar-alt mr-2 text-lg text-blueGray-400"></i>
        <span className="font-medium">Date of Birth: </span>
        <span>{profileData?.DOB ? formatDate(profileData?.DOB) : "DOB not available"}</span> {/* Display DOB */}
      </div>
      <div className="mb-2 text-blue-600  text-lg">
        <i className="fas fa-envelope mr-2 text-lg"></i>
        <span>{profileData?.email || "email@example.com"}</span>
      </div>

      <div className="mb-2 text-blueGray-600 text-lg">
        <i className="fas fa-phone-alt mr-2 text-lg text-blueGray-400"></i>
        <span className="font-medium">Phone: </span>
        <span className="text-sky-400">{profileData?.phone || "Phone number not available"}</span>
      </div>

      <ProfileBio profileData={profileData} />
    </div>
  );
};

// Profile Bio Component
const ProfileBio = ({ profileData }: { profileData: any }) => {
  return (
    <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
      <div className="flex flex-wrap justify-center">
        <div className="w-full lg:w-9/12 px-4">
          <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
            Dr. {profileData?.name || "Jenna Stones"} is a board-certified physician specializing in {profileData?.department || "Specialization"} with over 15 years of experience. 
            As the head of the Department of {profileData?.department || "Specialization"}, 
            Dr. {profileData?.name || "Jenna Stones"} is known for a patient-centered approach, blending evidence-based practices with compassionate care. 
            Dr. {profileData?.name || "Jenna Stones"} completed their medical degree at the prestigious Harvard Medical School and is deeply committed to advancing healthcare through innovation and research. 
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
