import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { Rating } from "@mui/material";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik"; 
import * as Yup from "yup";
import axiosUrl from "../../utils/axios";
import { toast } from "sonner";


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
  end: string;
  description: string;
  status: string;
  reason?: string; // Optional field for cancellation reason
  review?: { // Optional review field
    rating: number; // Ensure rating is a number
    reviewText?: string; // Optional field for review text
  };
}
function AppointmentDetails() {
  const location = useLocation();
  const appointmentId = location.state?.appointmentId; // Only the ID
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Fetch appointment details using appointmentId
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await axiosUrl.get(`/getAppointment/${appointmentId}`);
        console.log("ww", response.data);
        
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
      setAppointment(response.data.data)

      console.log("Review submitted successfully:", response.data);
      toast.success("Your Review Added Successfully")
      resetForm();
      closeReviewModal();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  
  
  return (
    <div className="w-[75%] mt-10 pr-10 pb-5">
      <div className="bg-white w-[100%] object-cover rounded-lg border flex flex-col justify-around p-5 space-y-6">
        <h2 className="text-2xl font-bold text-gray-700 border-b pb-4">Appointment Details</h2>

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

        

<div className="text-right">
  {appointment?.status === "completed" && (
    <>
      {appointment?.review?.rating === 0 ? ( // Check if the rating is 0
        <button
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          onClick={openReviewModal}
        >
          Add Review
        </button>
      ) : (
        <p className="text-green-600 pb-2">Review Added: {appointment?.review?.rating} ⭐</p> // Show review added text
      )}
      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 ml-2">
        Download Prescription
      </button>
    </>
  )}
  {appointment?.status === "cancelled" && (
    <p className="px-4 py-2 text-red-600 rounded-lg">Cancelled</p>
  )}
  {appointment?.status === "cancelled by Dr" && (
    <button
      className="px-4 py-2 bg-red-600 text-white rounded-lg"
      onClick={openModal}
    >
      Cancelled by Dr
    </button>
  )}
  {appointment?.status === "prescription pending" && (
    <>
      <p className="text-lg italic text-yellow-600">Prescription will be added soon...</p>
      
    </>
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
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 ml-2"
                    onClick={closeReviewModal}
                  >
                    Close
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Modal for Cancellation Reason */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Cancellation Reason</h3>
            <p>Reason: {appointment?.reason || "No reason provided."}</p>
            <button className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentDetails;
