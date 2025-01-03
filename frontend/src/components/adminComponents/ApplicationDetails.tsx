import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { approveApplication, rejectApplication } from "../../services/adminAxiosService";

function ApplicationDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const response = state?.response?.response;
  const files = state?.response?.files;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageModal, setImageModal] = useState({ isOpen: false, src: "" });

  const formik = useFormik({
    initialValues: {
      rejectionReason: "",
    },
    validationSchema: Yup.object({
      rejectionReason: Yup.string().required("Reason for rejection is required"),
    }),
    onSubmit: async (values) => {
      try {
        await rejectApplication(response.doctorId,values.rejectionReason) 
        setIsModalOpen(false);
        navigate("/admin/applications");
      } catch (error) {
        console.error("Error rejecting the application:", error);
      }
    },
  });

  const handleApprove = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to approve this application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await approveApplication(response.doctorId) 
          Swal.fire({
            title: "Success!",
            text: "Application approved successfully.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/admin/applications");
          });
        } catch (error) {
          console.error("Error approving the application:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to approve the application.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  const handleReject = () => {
    setIsModalOpen(true);
  };

  const handleImageClick = (src:any) => {
    setImageModal({ isOpen: true, src });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, src: "" });
  };

  return (
    <div className="flex flex-col pl-64 p-6 ml-3 mt-14 h-auto bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">Application Details</h1>
      </div>

      <main className="w-full h-[600px] py-6">
        <section className="w-full h-1/4 bg-white shadow-md flex justify-between gap-10 p-6 rounded-lg">
          <div className="w-1/2 flex-col">
            <div className="flex items-center mb-3">
              <h3 className="font-semibold text-gray-600">Name:</h3>
              <p className="pl-3 font-medium text-gray-700">{response?.name}</p>
            </div>
            <div className="flex items-center mb-3">
              <h3 className="font-semibold text-gray-600">Fees:</h3>
              <p className="pl-3 font-medium text-gray-700">${response?.fees}</p>
            </div>
            <div className="flex items-center">
              <h3 className="font-semibold text-gray-600">Gender:</h3>
              <p className="pl-3 font-medium text-gray-700">{response?.gender}</p>
            </div>
          </div>

          <div className="w-1/2 flex-col">
            <div className="flex items-center mb-3">
              <h3 className="font-semibold text-gray-600">Department:</h3>
              <p className="pl-3 font-medium text-gray-700">{response?.department.name}</p>
            </div>
            <div className="flex items-center mb-3">
              <h3 className="font-semibold text-gray-600">Date of Birth:</h3>
              <p className="pl-3 font-medium text-gray-700">{new Date(response?.DOB).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center">
              <h3 className="font-semibold text-gray-600">Aadhaar Number:</h3>
              <p className="pl-3 font-medium text-gray-700">{response?.kycDetails?.adharNumber}</p>
            </div>
          </div>
        </section>

        <section className="w-full h-3/5 bg-white shadow-md mt-5 p-6 pl-6 rounded-lg flex gap-8">
          {files.map((file:any, index:any) => (
            <div
              key={index}
              className="w-60 h-full rounded-md overflow-hidden border-2 border-gray-300 cursor-pointer"
              onClick={() => handleImageClick(file.signedUrl)}
            >
              <img
                src={file.signedUrl}
                alt={`Document ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </section>

        <div className="flex justify-end gap-5 pr-10 pt-6">
          <button
            className="w-44 h-12 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300"
            onClick={handleApprove}
          >
            Approve
          </button>
          <button
            className="w-44 h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
            onClick={handleReject}
          >
            Reject
          </button>
        </div>
      </main>

      {/* Rejection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Reject Application</h2>
            <form onSubmit={formik.handleSubmit}>
              <textarea
                name="rejectionReason"
                value={formik.values.rejectionReason}
                onChange={formik.handleChange}
                placeholder="Enter reason for rejection"
                rows={4}
                className={`w-full p-3 border rounded-lg mb-4 ${
                  formik.errors.rejectionReason
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:border-blue-500`}
              />
              {formik.errors.rejectionReason && (
                <div className="text-red-500 text-sm mb-2">
                  {formik.errors.rejectionReason}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {/* Image Modal */}
      {imageModal.isOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg w-[95%] max-w-2xl">
      <img
        src={imageModal.src}
        alt="Enlarged Document"
        className="w-full h-auto max-h-[600px] object-contain"
      />
      <button
        className="mt-6 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        onClick={closeImageModal}
      >
        Close
      </button>
    </div>
  </div>
)}



    </div>
  );
}

export default ApplicationDetails;
