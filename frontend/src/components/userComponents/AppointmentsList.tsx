import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import axiosUrl from "../../utils/axios";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import moment from "moment";

interface Appointment {
  _id: string;
  patientNAme: string;
  appointmentTime: string;
  doctorName: string;
  status: string;
  date: any;
  start: string;
  end: string;
  docId: any;
}

function AppointmentsList() {
  const userData = useSelector((state: RootState) => state.user.userInfo);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [status, setStatus] = useState<string>("All"); // Default status is 'All'
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const navigate = useNavigate();

  // Function to fetch appointments based on status and pagination
  const fetchAppointments = (status: string, page: number) => {
    if (userData?._id) {
      axiosUrl
        .get(`/getAppointments/${userData._id}`, {
          params: { status, page, limit: 3 }, // Adding page and limit to the API request
        })
        .then((response) => {
          setAppointments(response.data.data);
          setTotalPages(response.data.totalPages); // Assuming response contains totalPages
        })
        .catch((error) => {
          console.error("Error fetching appointments:", error);
        });
    }
  };

  useEffect(() => {
    fetchAppointments(status, currentPage); // Fetch appointments on component mount
  }, [status, currentPage]); // Fetch appointments when status or page changes

  // Button click handler for status change
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1); // Reset to first page when status changes
  };

  // Function to cancel an appointment
  const handleCancelAppointment = (appointmentId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosUrl
          .put(`/cancelAppointment/${appointmentId}`)
          .then(() => {
            toast.success("Appointment cancelled");
            Swal.fire(
              "Cancelled!",
              "The appointment has been cancelled. Your money will be refunded to your bank account.",
              "success"
            );
            
            

            console.log("cancalled appointment" ,result);
            fetchAppointments(status, currentPage); // Refresh the appointments list
          })
          .catch((error) => {
            console.error("Error canceling appointment:", error);
            Swal.fire("Failed!", "Failed to cancel the appointment. Please try again.", "error");
          });
      }
    });
  };

  const handleViewAppointment = (appointment: any) => {
    navigate("/userProfile/viewAppointment", { state: { appointmentId: appointment._id } });
  };

  // Handle pagination logic
  const handlePagination = (direction: string) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "previous" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-[75%] pr-10 pb-5">
      <div className="bg-white min-h-[85vh]  rounded-lg border flex flex-col justify-between p-5">
        {/* Buttons for sorting */}
        <div className="flex justify-end items-center space-x-2 mb-2">
          {/* Sorting buttons */}
          <button
            className={`px-3 py-1 border border-transparent text-sm font-medium ${
              status === "All" ? "bg-backgroundColor text-white" : "bg-white text-gray-500"
            } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-backgroundColor`}
            onClick={() => handleStatusChange("All")}
          >
            All
          </button>
          <button
            className={`px-3 py-1 border border-transparent text-sm font-medium ${
              status === "pending" ? "bg-yellow-500 text-white" : "bg-white text-gray-500"
            } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
            onClick={() => handleStatusChange("pending")}
          >
            Pending
          </button>
          <button
            className={`px-3 py-1 border border-transparent text-sm font-medium ${
              status === "prescription pending" ? "bg-yellow-500 text-white" : "bg-white text-gray-500"
            } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
            onClick={() => handleStatusChange("prescription pending")}
          >
            Prescription Pending
          </button>
          <button
            className={`px-3 py-1 border border-transparent text-sm font-medium ${
              status === "completed" ? "bg-blue-500 text-white" : "bg-white text-gray-500"
            } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            onClick={() => handleStatusChange("completed")}
          >
            Completed
          </button>
          <button
            className={`px-3 py-1 border border-transparent text-sm font-medium ${
              status === "cancelled" ? "bg-red-500 text-white" : "bg-white text-gray-500"
            } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            onClick={() => handleStatusChange("cancelled")}
          >
            Cancelled
          </button>
          <button
            className={`px-3 py-1 border border-transparent text-sm font-medium ${
              status === "cancelled by Dr" ? "bg-red-500 text-white" : "bg-white text-gray-500"
            } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            onClick={() => handleStatusChange("cancelled by Dr")}
          >
            Cancelled by Dr
          </button>
        </div>

        {/* Appointment cards */}
        {appointments.map((appointment) => (
          <div key={appointment._id} className="w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden m-4">
            <div className="md:flex justify-between items-start">
              <div className="p-4">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  Patient: {appointment.patientNAme}
                </div>
                <p className="block mt-1 text-lg leading-tight font-medium text-black">
                  Appointment Time:{" "}
                  <span className="font-normal">
                    {moment(appointment.date).format("MMMM Do YYYY")} from {appointment.start} to {appointment.end}
                  </span>
                </p>

                <p className="mt-2 text-gray-500">Doctor: Dr. {appointment.docId.name}</p>
              </div>
              <div className="flex flex-row p-8 space-x-3">
                <button
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:bg-indigo-500 transition bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  onClick={() => handleViewAppointment(appointment)}
                >
                  View Details
                </button>
                {appointment.status === "cancelled" || appointment.status === "cancelled by Dr"  ? (
                  <span className="px-4 py-2 text-sm font-medium text-red-500">cancelled</span>
                ) : appointment.status === "completed" || appointment.status === "prescription pending" ? (
                  <span className="px-4 py-2 text-sm font-medium text-green-500">{appointment.status}</span>
                ) : (

                  <span className="px-4 py-2 text-sm font-medium text-green-500">pending</span>
                  
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 space-x-4">
  <button
    className={`px-6 py-3 text-sm font-medium rounded-md transition duration-300 ease-in-out transform ${
      currentPage === 1
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    }`}
    disabled={currentPage === 1}
    onClick={() => handlePagination("previous")}
  >
    <i className="fas fa-arrow-left mr-2"></i> {/* Left Arrow Icon */}
    Previous
  </button>
  <button
    className={`px-6 py-3 text-sm font-medium rounded-md transition duration-300 ease-in-out transform ${
      currentPage === totalPages
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    }`}
    disabled={currentPage === totalPages}
    onClick={() => handlePagination("next")}
  >
    Next
    <i className="fas fa-arrow-right ml-2"></i> {/* Right Arrow Icon */}
  </button>
</div>



      </div>
    </div>
  );
}

export default AppointmentsList;
