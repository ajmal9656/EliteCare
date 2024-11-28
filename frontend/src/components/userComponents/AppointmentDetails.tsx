import { useEffect, useState } from "react";
import { useLocation ,useNavigate} from "react-router-dom";
import moment from "moment";
import { Rating } from "@mui/material";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik"; 
import * as Yup from "yup";
import axiosUrl from "../../utils/axios";
import { toast } from "sonner";
import jsPDF from 'jspdf';


interface ReviewFormValues {
  rating: number | null;
  reviewText: string;
}

interface Appointment {
  _id: string;
  patientNAme: string;
  age: number;
  date: string;
  start: string;
  docId:any;
  paymentMethod:string;
  paymentStatus:string;
  paymentId:any
  end: string;
  description: string;
  status: string;
  reason?: string; // Optional field for cancellation reason
  review?: { // Optional review field
    rating: number; // Ensure rating is a number
    reviewText?: string; // Optional field for review text
    
  };
  prescription:string;
    fees:string
}

function AppointmentDetails() {
  const location = useLocation();
  const navigate = useNavigate()
  const appointmentId = location.state?.appointmentId; // Only the ID
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Fetch appointment details using appointmentId
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await axiosUrl.get(`/getAppointment/${appointmentId}`);
        console.log("Fetched appointment data:", response.data.data);
        console.log("appoin",response.data.data);
        
        
        setAppointment(response.data.data); // Assuming response.data contains appointment details
      } catch (error) {
        console.error("Error fetching appointment details:", error);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openReviewModal = () => {
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const validationSchema = Yup.object().shape({
    rating: Yup.number().required("Rating is required").min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5"),
    reviewText: Yup.string().required("Review is required"),
  });

  const handleSubmitReview = async (values: ReviewFormValues, { resetForm }: { resetForm: () => void }) => {
    try {
      const response = await axiosUrl.post('/addReview', {
        appointmentId: appointment?._id, // Ensure appointment is not null
        rating: values.rating,
        reviewText: values.reviewText,
      });
      setAppointment(response.data.data);
      console.log("Review submitted successfully:", response.data);
      toast.success("Your Review Added Successfully");
      resetForm();
      closeReviewModal();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const downloadPrescription = async () => {
    if (appointment?.prescription) {
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
      doc.text(`Patient Name: ${appointment.patientNAme}`, 10, 45);
      doc.text(`Age: ${appointment.age.toString()}`, 10, 55);
      doc.text(`Date: ${moment(appointment.date).format("MMMM Do YYYY")}`, 10, 65);
      doc.text(`Time: ${appointment.start} - ${appointment.end}`, 10, 75);
  
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
      const prescriptionLines = appointment.prescription.split('\n');
      prescriptionLines.forEach((line) => {
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
      doc.save(`Prescription_${appointment.patientNAme}.pdf`);
    }
  };
  
  const navigateChat = () =>{

    navigate("/userProfile/chat",{ state: { appointment: appointment } })


  }
  
  
  
  

  return (
    <div className="w-[75%] pr-10 pb-5">
  <div className="bg-white w-[100%] object-cover rounded-lg border flex flex-col justify-around p-5 space-y-6">
    <h2 className="text-2xl font-bold text-gray-700 border-b pb-4">Appointment Details</h2>

    {/* Patient Information */}
    <div className="flex justify-between items-center">
      <div className="text-lg font-medium text-gray-700">
        <p>
          Patient Name: <span className="text-indigo-600">{appointment?.patientNAme}</span>
        </p>
        <p>
          Age: <span className="text-indigo-600">{appointment?.age || "N/A"}</span>
        </p>
      </div>
      <div className="text-lg font-medium text-gray-700">
        <p>
          Date: <span className="text-indigo-600">{moment(appointment?.date).format("MMMM Do YYYY")}</span>
        </p>
        <p>
          Time: <span className="text-indigo-600">{appointment?.start} - {appointment?.end}</span>
        </p>
      </div>
    </div>
    <div className="text-lg font-medium text-gray-700">
      <p>Description:</p>
      <div className="mt-2 text-gray-600 w-[100%] italic h-32 overflow-y-scroll overflow-x-hidden border border-gray-300 p-3 rounded-lg">
        <p className="w-[100%]">{appointment?.description || "No description provided."}</p>
      </div>
    </div>

    {/* Doctor Information */}
    <div className="text-lg font-medium text-gray-700">
      <h3 className="text-xl font-semibold mt-4">Doctor Details</h3>
      <p>
        Name: <span className="text-indigo-600">{appointment?.docId?.name}</span>
      </p>
      <p>
        Email: <span className="text-indigo-600">{appointment?.docId?.email}</span>
      </p>
      
      
    </div>

    {/* Description */}
    

    {/* Payment Details */}
    <div className="text-lg font-medium text-gray-700">
      <h3 className="text-xl font-semibold mt-4">Payment Details</h3>
      <p>
        Method: <span className="text-indigo-600">{appointment?.paymentMethod}</span>
      </p>
      <p>
        Status: <span className="text-indigo-600">{appointment?.paymentStatus}</span>
      </p>
      <p>
        Fees: <span className="text-indigo-600">${appointment?.fees || "N/A"}</span>
      </p>
      <p>
        Payment ID: <span className="text-indigo-600">{appointment?.paymentId || "N/A"}</span>
      </p>
    </div>

    {/* Appointment Actions */}
    <div className="text-right">
      {appointment?.status === "completed" && (
        <>
          {appointment?.review?.rating === 0 ? (
            <button
              className="px-6 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full shadow-lg hover:from-green-500 hover:to-green-700 transform hover:scale-105 transition duration-300 ease-in-out"
              onClick={openReviewModal}
            >
              Add Review
            </button>
          ) : (
            <p className="text-green-600 pb-2">Review Added: {appointment?.review?.rating} ⭐</p>
          )}
          <button
            className="px-6 py-2 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white rounded-full shadow-lg hover:from-indigo-500 hover:to-indigo-700 transform hover:scale-105 transition duration-300 ease-in-out ml-2"
            onClick={downloadPrescription}
          >
            Download Prescription
          </button>
        </>
      )}

      {appointment?.status === "cancelled" && (
        <p className="px-4 py-2 text-red-600 rounded-lg">Cancelled</p>
      )}

      {appointment?.status === "cancelled by Dr" && (
        <button
          className="px-6 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-full shadow-lg hover:from-red-500 hover:to-red-700 transform hover:scale-105 transition duration-300 ease-in-out"
          onClick={openModal}
        >
          Cancelled by Dr
        </button>
      )}

      {appointment?.status === "prescription pending" && (
        <div>
          {moment(appointment.date).isSame(moment(), 'day') && moment(appointment.date).isBetween(
      moment().startOf('day'),
      moment().add(2, 'days').endOf('day'),
      undefined,
      '[]' // Includes boundary dates
    ) && (
      <button
        className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full shadow-lg hover:from-blue-500 hover:to-blue-700 transform hover:scale-105 transition duration-300 ease-in-out"
        onClick={navigateChat}
      >
        Chat
      </button>
    )}
          
        <p className="text-lg italic text-yellow-600">
          Prescription will be added soon...
        </p>
        </div>
      )}

{appointment?.status === "pending" && (
  <div>
    {/* Chat Button: Show only if appointment date is today and within the next 2 days */}
    {moment(appointment.date).isSame(moment(), 'day') && moment(appointment.date).isBetween(
      moment().startOf('day'),
      moment().add(2, 'days').endOf('day'),
      undefined,
      '[]' // Includes boundary dates
    ) && (
      <button
        className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full shadow-lg hover:from-blue-500 hover:to-blue-700 transform hover:scale-105 transition duration-300 ease-in-out"
        onClick={navigateChat}
      >
        Chat
      </button>
    )}

    {/* Cancel Button: Hide if appointment date is today */}
    {!moment(appointment.date).isBefore(moment(), 'day') && !moment(appointment.date).isSame(moment(), 'day') && (
  <button
    className="px-6 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-full shadow-lg hover:from-red-500 hover:to-red-700 transform hover:scale-105 transition duration-300 ease-in-out ml-2"
  >
    Cancel
  </button>
)}

  </div>
)}




    </div>
  </div>

  {/* Review Modal */}
  {isReviewModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-h-[80%] overflow-y-auto overflow-x-hidden">
      <h3 className="text-lg font-semibold mb-4">Submit Your Review</h3>
      <Formik
        initialValues={{ rating: null, reviewText: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitReview}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-gray-700">Rating:</label>
              <Field name="rating">
                {({ field }: FieldProps) => (
                  <Rating
                    {...field}
                    value={field.value}
                    onChange={(event, newValue) => {
                      setFieldValue("rating", newValue);
                    }}
                    precision={0.5}
                  />
                )}
              </Field>
              <ErrorMessage name="rating" component="div" className="text-red-600 text-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="reviewText">Review:</label>
              <Field
                id="reviewText"
                name="reviewText"
                as="textarea"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                rows={4}
              />
              <ErrorMessage name="reviewText" component="div" className="text-red-600 text-sm" />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition duration-200"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={closeReviewModal}
              className="mt-2 w-full text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </Form>
        )}
      </Formik>
    </div>
        </div>
  )}

  {/* Cancelled Modal */}
  {isModalOpen && (
   <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
   <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-h-[80%] overflow-y-auto overflow-x-hidden">
     <h3 className="text-lg font-semibold mb-4">Appointment Cancelled</h3>
     <p>{appointment?.reason || "No reason provided."}</p>
     <button
       onClick={closeModal}
       className="mt-4 w-full bg-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-400 transition duration-200"
     >
       Close
     </button>
   </div>
        </div>
  )}
</div>

  );
}

export default AppointmentDetails;
