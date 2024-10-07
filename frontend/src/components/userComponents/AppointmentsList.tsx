import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import axiosUrl from "../../utils/axios";
import Swal from "sweetalert2";
import { toast } from "sonner";

interface Appointment {
  _id: string;
  patientNAme: string;
  appointmentTime: string;
  doctorName: string;
  status: string;
}

function AppointmentsList() {
  const userData = useSelector((state: RootState) => state.user.userInfo);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [status, setStatus] = useState<string>("All"); // Default status is 'All'

  // Function to fetch appointments based on status
  const fetchAppointments = (status: string) => {
    if (userData?._id) {
      console.log("statusssssss", status);

      axiosUrl
        .get(`/getAppointments/${userData._id}`, {
          params: { status }, // Send status as a query parameter
        })
        .then((response) => {
          console.log(response.data.data);
          setAppointments(response.data.data); // Assuming response contains appointments data
        })
        .catch((error) => {
          console.error("Error fetching appointments:", error);
        });
    }
  };

  useEffect(() => {
    // Fetch appointments on component mount
    fetchAppointments(status);
  }, [status]); // Fetch appointments when status changes

  // Button click handler
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus); // Update status
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
        // Make API call to cancel the appointment
        axiosUrl
          .put(`/cancelAppointment/${appointmentId}`) // Assuming you're using PUT for canceling
          .then(() => {
            toast.success("Appointment cancelled");
            Swal.fire("Cancelled!", "The appointment has been cancelled.", "success");
            // Refresh the appointments list
            fetchAppointments(status); // Fetch appointments again after cancellation
          })
          .catch((error) => {
            console.error("Error canceling appointment:", error);
            Swal.fire("Failed!", "Failed to cancel the appointment. Please try again.", "error");
          });
      }
    });
  };

  return (
    <div className="w-[75%] mt-10 pr-10 pb-5">
      <div className="bg-white h-full rounded-lg border flex flex-col justify-around p-5">
        {/* Buttons for sorting */}
        <div className="flex justify-end items-center space-x-2 mb-2">
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
              status === "cancelled by doctor" ? "bg-red-500 text-white" : "bg-white text-gray-500"
            } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            onClick={() => handleStatusChange("cancelled by doctor")}
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
                  Appointment Time: {appointment.appointmentTime}
                </p>
                <p className="mt-2 text-gray-500">Doctor: Dr. {appointment.doctorName}</p>
              </div>
              <div className="flex flex-row p-8 space-x-3">
                <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  View Details
                </button>
                {/* Conditionally render Cancel button or 'Cancelled' label */}
                {appointment.status === "cancelled" ? (
                  <span className="px-4 py-2 text-sm font-medium text-red-500">Cancelled</span>
                ) : (
                  <button
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => handleCancelAppointment(appointment._id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppointmentsList;
