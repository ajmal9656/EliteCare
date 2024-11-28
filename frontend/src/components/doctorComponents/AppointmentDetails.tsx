import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import axiosUrl from "../../utils/axios";
import jsPDF from "jspdf";
import moment from "moment";

function AppointmentDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointment } = location.state || {};
  console.log("idddd", appointment);
  // Retrieve appointment data from location state

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentStatus, setAppointmentStatus] = useState(
    appointment?.status
  ); // Track the status locally
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false); // Track prescription modal status
  const [medicalRecords, setMedicalRecords] = useState<any>([]);

  // Open the modal for cancellation reason
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    formik.resetForm(); // Reset the form when closing the modal
  };

  // Open modal to show the cancellation reason
  const showCancellationReasonModal = () => {
    setIsModalOpen(true);
  };

  // Open modal for prescription input
  const openPrescriptionModal = () => {
    setIsPrescriptionModalOpen(true);
  };

  // Close the prescription modal
  const closePrescriptionModal = () => {
    setIsPrescriptionModalOpen(false);
    prescriptionFormik.resetForm(); // Reset form when closing modal
  };

  // Formik setup for cancellation reason
  const formik = useFormik({
    initialValues: {
      cancelReason: "",
    },
    validationSchema: Yup.object({
      cancelReason: Yup.string()
        .min(5, "Reason must be at least 5 characters")
        .required("Cancellation reason is required"),
    }),
    onSubmit: (values) => {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to cancel this appointment?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, cancel it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosUrl
            .put("/doctor/cancelAppointment", {
              appointmentId: appointment.viewDetails._id,
              reason: values.cancelReason,
            })
            .then((response) => {
              setAppointmentStatus("cancelled by Dr");
              Swal.fire(
                "Cancelled!",
                "Your appointment has been cancelled.",
                "success"
              );
              closeModal();
            })
            .catch((error) => {
              Swal.fire(
                "Error!",
                "There was an error cancelling your appointment.",
                "error"
              );
            });
        }
      });
    },
  });

  const navigateChat = () => {
    navigate("/doctor/chat", { state: { appointment: appointment } });
  };

  // Formik setup for prescription input
  const prescriptionFormik = useFormik({
    initialValues: {
      prescription: "",
    },
    validationSchema: Yup.object({
      prescription: Yup.string()
        .min(5, "Prescription must be at least 5 characters")
        .required("Prescription is required"),
    }),
    onSubmit: (values) => {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to submit this prescription?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, submit it!",
      }).then((result) => {
        if (result.isConfirmed) {
          // Ensure appointment and _id exist before making the request
          if (
            appointment &&
            appointment.viewDetails &&
            appointment.viewDetails._id
          ) {
            axiosUrl
              .put("/doctor/addPrescription", {
                appointmentId: appointment.viewDetails._id, // Passing appointment ID
                prescription: values.prescription, // Passing prescription details
              })
              .then((response) => {
                setAppointmentStatus("completed"); // Update the local status
                Swal.fire(
                  "Submitted!",
                  "The prescription has been added.",
                  "success"
                );
                closePrescriptionModal(); // Close the modal after submission
              })
              .catch((error) => {
                Swal.fire(
                  "Error!",
                  "There was an error adding the prescription.",
                  "error"
                );
              });
          } else {
            Swal.fire("Error!", "Appointment data is missing.", "error");
          }
        }
      });
    },
  });

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await axiosUrl.get(
          `/doctor/getMedical-records/${appointment.viewDetails.userId._id}`
        ); // Adjust the API endpoint as needed

        console.log("medfical", response.data.response);

        setMedicalRecords(response.data.response);
      } catch (error:any) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized: Redirecting to login page.");
          navigate("/doctor/login"); // Navigate to the login page if unauthorized
        } else {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchMedicalRecords();
  }, []);

  const downloadPrescription = async (record: any) => {
    if (record) {
      const doc = new jsPDF();

      // Set fonts
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(12);

      // Define Colors
      const darkBlue = "rgb(0, 51, 102)";
      const lightBlue = "rgb(0, 102, 204)";
      const darkGrey = "rgb(50, 50, 50)";
      const lightGrey = "rgb(150, 150, 150)";

      // Website Name
      doc.setFontSize(18);
      doc.setTextColor(darkBlue);
      doc.text("EliteCare", 10, 15); // Position it at the top

      // Header
      doc.setFontSize(22);
      doc.setTextColor(lightBlue);
      doc.text("Prescription", 10, 30); // Adjusted Y position to make room for website name

      // Draw a line under the header
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(1);
      doc.line(10, 35, 200, 35); // Adjusted line position

      // Patient Information
      doc.setFontSize(14);
      doc.setTextColor(darkGrey);
      doc.text(`Patient Name: ${record.patientNAme}`, 10, 45);
      doc.text(`Age: ${record.age.toString()}`, 10, 55);
      doc.text(`Date: ${moment(record.date).format("MMMM Do YYYY")}`, 10, 65);
      doc.text(`Time: ${record.start} - ${record.end}`, 10, 75);

      // Add some space
      doc.setLineWidth(0.5);
      doc.line(10, 80, 200, 80); // Separator line

      // Prescription Section
      doc.setFontSize(16);
      doc.setTextColor(darkBlue);
      doc.text("Prescription Details:", 10, 90);

      // Increase spacing before prescription content
      const prescriptionSpacing = 10; // Adjust this value to increase or decrease spacing
      let yPosition = 90 + prescriptionSpacing; // Starting position for the content

      // Prescription Details in a structured format
      const prescriptionLines = record.prescription.split("\n");
      prescriptionLines.forEach((line: any) => {
        doc.setTextColor(darkGrey);
        doc.text(line, 10, yPosition);
        yPosition += 8; // Move down for each line
      });

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(lightGrey);
      doc.text("Thank you for choosing our service!", 10, 280);
      doc.text("For any questions, please contact us.", 10, 285);
      doc.text("EliteCare | elitecare@gmail.com", 10, 290); // Optional company details

      // Save the PDF
      doc.save(`Prescription_${record.patientNAme}.pdf`);
    }
  };

  // Helper function to check if the chat button should be displayed
const shouldShowChatButton = (appointmentDate: string) => {
  if (!appointmentDate) return false;

  const today = moment().startOf("day"); // Current date (start of the day)
  const appointmentMoment = moment(appointmentDate).startOf("day"); // Appointment date
  const daysDiff = today.diff(appointmentMoment, "days"); // Difference in days

  return daysDiff >= 0 && daysDiff <= 2; // Show button if today or within 2 days after
};

// Helper function to check if the cancel button should be displayed
const shouldShowCancelButton = (appointmentDate: string) => {
  if (!appointmentDate) return false;

  const now = moment(); // Current date and time
  const appointmentMoment = moment(appointmentDate); // Appointment date and time

  return now.isBefore(appointmentMoment); // Show button if the current time is before the appointment time
};

// Updated renderButtons function
const renderButtons = () => {
  const isChatButtonVisible =
    appointment?.date && shouldShowChatButton(appointment.date);

  const isCancelButtonVisible =
    appointment?.date && shouldShowCancelButton(appointment.date);

  switch (appointmentStatus) {
    case "pending":
      return (
        <>
          {isChatButtonVisible && (
            <button
              className="bg-blue-500 w-[30%] h-[70%] rounded-md text-white font-medium hover:bg-blue-600 transition duration-200 ease-in-out"
              onClick={navigateChat}
            >
              Chat
            </button>
          )}
          {isCancelButtonVisible && (
            <button
              className="bg-red-500 w-[30%] h-[70%] rounded-md text-white font-medium hover:bg-red-600 transition duration-200 ease-in-out"
              onClick={openModal}
            >
              Cancel
            </button>
          )}
        </>
      );
    case "prescription pending":
      return (
        <>
          {isChatButtonVisible && (
            <button
              className="bg-blue-500 w-[30%] h-[70%] rounded-md text-white font-medium hover:bg-blue-600 transition duration-200 ease-in-out"
              onClick={navigateChat}
            >
              Chat
            </button>
          )}
          <button
            className="bg-green-500 w-[60%] h-[70%] rounded-md text-white font-medium hover:bg-green-600 transition duration-200 ease-in-out"
            onClick={openPrescriptionModal}
          >
            Add Prescription
          </button>
        </>
      );
    case "cancelled":
      return (
        <p className="text-red-600 text-lg font-medium">
          Cancelled By Patient
        </p>
      );
    case "cancelled by Dr":
      return (
        <button
          className="bg-red-500 w-[60%] h-[70%] rounded-md text-white font-medium hover:bg-red-600 transition duration-200 ease-in-out"
          onClick={showCancellationReasonModal}
        >
          Cancelled by You
        </button>
      );
    case "completed":
      return <p className="text-green-600 text-lg font-medium">Completed</p>;
    default:
      return null;
  }
};

  return (
    <>
      <div className="flex flex-col w-full mx-auto pl-80 p-4 ml-3 mt-20 h-screen px-10 space-y-3">
        <div>
          {/* Appointment details card */}
          <div className="w-[100%] h-[240px] flex flex-col">
            <div className="h-[240px] w-[100%] flex gap-3">
              {/* Left Section - Patient Info */}
              <div className="w-[35%] h-[240px] bg-white rounded-lg shadow-md">
                <div className="h-[200px] w-[90%] flex ml-8 items-center space-x-2">
                  <ul className="space-y-4 mt-10">
                    <li className="space-x-3 flex">
                      <h1 className="text-lg font-semibold text-gray-800">
                        Name:
                      </h1>
                      <p className="text-lg text-gray-700">
                        {appointment?.patientName || "N/A"}
                      </p>
                    </li>
                    <li className="space-x-3 flex">
                      <h1 className="text-lg font-semibold text-gray-800">
                        Age:
                      </h1>
                      <p className="text-lg text-gray-700">
                        {appointment?.viewDetails?.age || "N/A"}
                      </p>
                    </li>
                    <li className="space-x-3 flex">
                      <h1 className="text-lg font-semibold text-gray-800">
                        Date:
                      </h1>
                      <p className="text-lg text-gray-700">
                        {appointment?.date || "N/A"}
                      </p>
                    </li>
                    <li className="space-x-3 flex">
                      <h1 className="text-lg font-semibold text-gray-800">
                        Time:
                      </h1>
                      <p className="text-lg text-gray-700">
                        {appointment?.time || "N/A"}
                      </p>
                    </li>
                    <li className="space-x-3 flex">
                      <h1 className="text-lg font-semibold text-gray-800">
                        Fees:
                      </h1>
                      <p className="text-lg text-gray-700">
                        {appointment?.viewDetails?.fees || "N/A"}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Section - Description */}
              <div className="w-[65%] h-[240px] flex flex-col items-center bg-white rounded-lg shadow-md gap-4">
                <div className="w-[95%] h-[45px] mt-4 flex items-center">
                  <h1 className="text-xl font-semibold text-gray-800">
                    Description
                  </h1>
                </div>
                <div className="overflow-y-auto px-6 w-[95%] h-[130px] bg-gray-100 rounded-lg shadow-inner">
                  <p className="w-[100%] text-lg font-serif text-gray-700 break-words">
                    {appointment?.viewDetails?.description ||
                      "No description available"}
                  </p>
                </div>
                {/* Buttons Section */}
                <div className="h-[70px] w-[100%] flex justify-end">
                  <div className="w-[35%] flex space-x-5 justify-end mr-4 mt-1">
                    {renderButtons()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional section (Medical records, etc.) */}
          <div className="w-full h-[500px] bg-white rounded-md shadow-xl flex flex-col mt-4">
            <h2 className="text-2xl font-semibold mb-1 p-4 text-gray-800">
              Medical Records
            </h2>

            {/* Table structure */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                      Patient Name
                    </th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold flex justify-end mr-9">
                      Prescription
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {medicalRecords.map((record: any) => (
                    <tr key={record._id} className="border-b border-gray-200">
                      <td className="px-6 py-4 text-gray-700">
                        {record.patientNAme}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 flex justify-end mr-8">
                        {/* Only show the download button if there is a prescription */}
                        {record.prescription ? (
                          <button
                            onClick={() => downloadPrescription(record)}
                            className="bg-blue-600 text-white py-2 px-5 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out text-sm font-medium"
                          >
                            Download
                          </button>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No Prescription
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal for cancellation reason */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 sm:p-0">
            <div className="bg-white w-full max-w-lg p-6 rounded-md shadow-lg">
              {appointmentStatus === "cancelled by Dr" ? (
                <>
                  <h2 className="text-xl font-semibold mb-4">
                    Cancellation Reason
                  </h2>
                  <div className="max-h-60 overflow-y-auto overflow-x-hidden">
                    <p className="break-words text-gray-700">
                      {appointment?.viewDetails?.reason}
                    </p>
                  </div>
                </>
              ) : (
                <form onSubmit={formik.handleSubmit}>
                  <h2 className="text-xl font-semibold mb-4">
                    Cancel Appointment
                  </h2>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-3 mb-4 text-sm"
                    name="cancelReason"
                    rows={4}
                    placeholder="Enter cancellation reason..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.cancelReason}
                  />
                  {formik.touched.cancelReason &&
                    formik.errors.cancelReason && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.cancelReason}
                      </p>
                    )}
                  <div className="flex justify-end space-x-4">
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm"
                      type="button"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Modal for adding prescription */}
        {isPrescriptionModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 sm:p-0">
            <div className="bg-white w-full max-w-lg p-6 rounded-md shadow-lg">
              <form onSubmit={prescriptionFormik.handleSubmit}>
                <h2 className="text-xl font-semibold mb-4">Add Prescription</h2>
                <p className="text-lg font-semibold mb-2">
                  Patient: {appointment?.patientName || "N/A"}
                </p>
                <p className="text-lg font-semibold mb-4">
                  Age: {appointment?.viewDetails?.age || "N/A"}
                </p>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 mb-4 text-sm"
                  name="prescription"
                  rows={4}
                  placeholder="Enter prescription..."
                  onChange={prescriptionFormik.handleChange}
                  onBlur={prescriptionFormik.handleBlur}
                  value={prescriptionFormik.values.prescription}
                />
                {prescriptionFormik.touched.prescription &&
                  prescriptionFormik.errors.prescription && (
                    <p className="text-red-500 text-sm">
                      {prescriptionFormik.errors.prescription}
                    </p>
                  )}
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm"
                    type="button"
                    onClick={closePrescriptionModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md text-sm"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AppointmentDetails;
