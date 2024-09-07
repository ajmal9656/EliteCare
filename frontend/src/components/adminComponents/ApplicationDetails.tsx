import { useLocation } from "react-router-dom";

function ApplicationDetails() {
  const location = useLocation();
  const { state } = location;
  const response = state?.response.response;
  const files = state?.response.files;

  console.log("state", files[0]);

  return (
    <div className="flex flex-col pl-64 p-4 ml-3 mt-14 h-auto">
      <div className="flex flex-row justify-between">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Application Details</h1>
        </div>
      </div>

      <main className="w-full h-[560px] py-5">
        <section className="w-full h-1/4 bg-red-100 flex justify-between gap-10 rounded-lg">
          <div className="h-full w-1/2 flex-row px-2">
            <p className="pt-5">Name: {response?.name}</p>
            <p className="py-2">Fees: {response?.fees}</p>
            <p>Gender: {response?.gender}</p>
          </div>
          <div className="h-full w-1/2 flex-row px-2">
            <p className="pt-5">Department: {response?.department}</p>
            <p className="py-2">Date Of Birth: {new Date(response?.DOB).toLocaleDateString()}</p>
            <p>Aadhaar Number: {response?.kycDetails?.adharNumber}</p>
          </div>
        </section>

        <section className="h-3/5 w-full bg-gray-300 mt-5 rounded-lg flex gap-10 px-10 py-5 justify-between">
          <div className="h-full w-60 bg-violet-300 rounded-md overflow-hidden">
            <img
              src={files[0].signedUrl} // Certificate Image
              alt="Certificate"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-full w-60 bg-violet-300 rounded-md overflow-hidden">
            <img
              src={files?.[1]?.signedUrl} // Qualification Image
              alt="Qualification"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-full w-60 bg-violet-300 rounded-md overflow-hidden">
            <img
              src={files?.[2]?.signedUrl} // Aadhaar Front Image
              alt="Aadhaar Front"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-full w-60 bg-violet-300 rounded-md overflow-hidden">
            <img
              src={files?.[3]?.signedUrl} // Aadhaar Back Image
              alt="Aadhaar Back"
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <div className="flex justify-end gap-5 pr-10 pt-4">
          <button className="w-40 h-12 bg-green-600 rounded-lg">Accept</button>
          <button className="w-40 h-12 bg-red-600 rounded-lg">Reject</button>
        </div>
      </main>
    </div>
  );
}

export default ApplicationDetails;
