import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import axiosUrl from "../../utils/axios";

function Profile() {
  const DoctorData = useSelector((state: RootState) => state.doctor);

  const [profileData, setProfileData] = useState<any>(null); // State to store the fetched profile data

  // Fetch profile details when the component mounts
  useEffect(() => {
    if (DoctorData?.doctorInfo?.doctorId) {
      const fetchProfile = async () => {
        try {
          const response = await axiosUrl.get(`/doctor/getDoctorDetails/${DoctorData?.doctorInfo?.doctorId}`,{
            params: { reviewData: true }, // Include appointment parameter
          }); // Call backend API with doctorId
          console.log("sfdafa",response.data.response);
          
          setProfileData(response.data.response); // Update the state with fetched data
        } catch (error) {
          console.error("Error fetching profile details:", error);
        }
      };

      fetchProfile();
    }
  }, [DoctorData?.doctorInfo?.doctorId]); // Effect depends on doctorId

  console.log("Fetched Profile Data:", profileData);

  return (
    <div className="flex flex-col w-full mx-auto pl-80 p-4 ml-3 mt-14 h-screen px-10 space-y-6 ">
      <main className="profile-page mt-72">
        {/* Profile Content Section */}
        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64 min-h-[600px]">
              <div className="px-6">
              <div className="flex flex-wrap justify-center">
      <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
        <div className="relative">
        <img
  alt="Profile"
  src={profileData?.signedImageUrl || "default-image-url.jpg"} // Use the signedImageUrl from profileData or a default image
  className="shadow-xl rounded-full h-44 align-middle border-none -m-16 mx-auto max-w-100-px ml-44"
/>

        </div>
      </div>
      <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
        <div className="py-6 px-3 mt-32 sm:mt-0">
          <button
            className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
                <ProfileDetails profileData={profileData} />
              </div>
            </div>
          </div>
        </section>
      </main>
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
    <div className="text-center mt-12">
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

      {/* Date of Birth */}
      <div className="mb-2 text-blueGray-600 text-lg">
        <i className="fas fa-calendar-alt mr-2 text-lg text-blueGray-400"></i>
        <span className="font-medium">Date of Birth: </span>
        <span>{profileData?.DOB ? formatDate(profileData?.DOB) : "DOB not available"}</span> {/* Display DOB */}
      </div>
      <div className="mb-2 text-blue-600  text-lg">
        <i className="fas fa-envelope mr-2 text-lg"></i>
        
        <span>{profileData?.email || "email@example.com"}</span>
      </div>

      {/* Phone Number */}
      <div className="mb-2 text-blueGray-600 text-lg">
        <i className="fas fa-phone-alt mr-2 text-lg text-blueGray-400"></i>
        <span className="font-medium">Phone: </span>
        <span className="text-sky-400">{profileData?.phone || "Phone number not available"}</span> {/* Display Phone */}
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
