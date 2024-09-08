import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosUrl from "../../utils/axios";
import { useFormik } from "formik";
import * as Yup from "yup";

function ApplicationDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { state } = location;
  const response = state?.response?.response;
  const files = state?.response?.files;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      rejectionReason: ""
    },
    validationSchema: Yup.object({
      rejectionReason: Yup.string().required("Reason for rejection is required")
    }),
    onSubmit: async (values) => {
      try {
        const result = await axiosUrl.delete(`/admin/rejectApplication/${response.doctorId}`, {data:{ reason: values.rejectionReason }});
        console.log("Rejection successful");
        setIsModalOpen(false);
        navigate("/admin/applications");
      } catch (error) {
        console.error("Error rejecting the application:", error);
      }
    }
  });

  const handleApprove = async () => {
    try {
      const result = await axiosUrl.post(`/admin/approveApplication/${response.doctorId}`);
      console.log("Approval successful:", result.data);
      navigate("/admin/applications");
    } catch (error) {
      console.error("Error approving the application:", error);
    }
  };

  const handleReject = () => {
    setIsModalOpen(true);
  };

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
            <p className="py-2">
              Date Of Birth: {new Date(response?.DOB).toLocaleDateString()}
            </p>
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
          <button
            className="w-40 h-12 bg-green-600 rounded-lg"
            onClick={handleApprove}
          >
            Accept
          </button>
          <button
            className="w-40 h-12 bg-red-600 rounded-lg"
            onClick={handleReject}
          >
            Reject
          </button>
        </div>
      </main>

      {/* Rejection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Reject Application</h2>
            <form onSubmit={formik.handleSubmit}>
              <textarea
                name="rejectionReason"
                value={formik.values.rejectionReason}
                onChange={formik.handleChange}
                placeholder="Enter reason for rejection"
                rows={4}
                className={`w-full border rounded-md p-2 mb-4 ${formik.errors.rejectionReason ? 'border-red-500' : ''}`}
              />
              {formik.errors.rejectionReason && (
                <div className="text-red-500 text-sm mb-2">{formik.errors.rejectionReason}</div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationDetails;
