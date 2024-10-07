import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import axiosUrl from '../../utils/axios';

function AppointmentDetails() {
  const location = useLocation();
  const { appointment } = location.state || {}; // Retrieve appointment data from location state

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentStatus, setAppointmentStatus] = useState(appointment?.status); // Track the status locally
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false); // Track prescription modal status

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
      cancelReason: '',
    },
    validationSchema: Yup.object({
      cancelReason: Yup.string()
        .min(5, 'Reason must be at least 5 characters')
        .required('Cancellation reason is required'),
    }),
    onSubmit: (values) => {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you really want to cancel this appointment?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!',
      }).then((result) => {
        if (result.isConfirmed) {
          axiosUrl
            .put('/doctor/cancelAppointment', {
              appointmentId: appointment.viewDetails._id,
              reason: values.cancelReason,
            })
            .then((response) => {
              setAppointmentStatus('cancelled by Dr');
              Swal.fire('Cancelled!', 'Your appointment has been cancelled.', 'success');
              closeModal();
            })
            .catch((error) => {
              Swal.fire('Error!', 'There was an error cancelling your appointment.', 'error');
            });
        }
      });
    },
  });

  // Formik setup for prescription input
  const prescriptionFormik = useFormik({
    initialValues: {
      prescription: '',
    },
    validationSchema: Yup.object({
      prescription: Yup.string()
        .min(5, 'Prescription must be at least 5 characters')
        .required('Prescription is required'),
    }),
    onSubmit: (values) => {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to submit this prescription?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit it!',
      }).then((result) => {
        if (result.isConfirmed) {
          // Ensure appointment and _id exist before making the request
          if (appointment && appointment.viewDetails && appointment.viewDetails._id) {
            axiosUrl
              .put('/doctor/addPrescription', {
                appointmentId: appointment.viewDetails._id, // Passing appointment ID
                prescription: values.prescription, // Passing prescription details
              })
              .then((response) => {
                setAppointmentStatus('completed'); // Update the local status
                Swal.fire('Submitted!', 'The prescription has been added.', 'success');
                closePrescriptionModal(); // Close the modal after submission
              })
              .catch((error) => {
                Swal.fire('Error!', 'There was an error adding the prescription.', 'error');
              });
          } else {
            Swal.fire('Error!', 'Appointment data is missing.', 'error');
          }
        }
      });
    },
  });
  

  // Helper function to render buttons based on appointment status
  const renderButtons = () => {
    switch (appointmentStatus) {
      case 'pending':
        return (
          <>
            <button className='bg-blue-500 w-[30%] h-[70%] rounded-md text-white'>
              Chat
            </button>
            <button
              className='bg-red-500 w-[30%] h-[70%] rounded-md text-white'
              onClick={openModal}
            >
              Cancel
            </button>
          </>
        );
      case 'prescription pending':
        return (
          <button
            className='bg-green-500 w-[60%] h-[70%] rounded-md text-white'
            onClick={openPrescriptionModal}
          >
            Add Prescription
          </button>
        );
      case 'cancelled':
        return <p className='text-red-600 text-lg font-medium'>Cancelled By Patient</p>;
      case 'cancelled by Dr':
        return (
          <button
            className='bg-red-500 w-[60%] h-[70%] rounded-md text-white'
            onClick={showCancellationReasonModal}
          >
            Cancelled by You
          </button>
        );
      case 'completed':
        return <p className='text-green-600 text-lg font-medium'>Completed</p>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col w-full mx-auto pl-80 p-4 ml-3 mt-14 h-screen px-10 space-y-3">
        <div>
          <h1 className="text-2xl font-bold">Appointment Details</h1>
        </div>

        {/* Appointment details card */}
        <div className='w-[100%] h-[240px]  flex flex-col  '>
          <div className='h-[240px] w-[100%] flex gap-3'>
            {/* Left Section - Patient Info */}
            <div className='w-[35%] h-[240px] bg-white rounded-md shadow-xl'>
              <div className='h-[200px] w-[90%] flex ml-8 items-center space-x-2'>
                <ul className='space-y-3 mt-10'>
                  <li className='space-x-3 flex'>
                    <h1 className='text-lg font-semibold'>Name: </h1>
                    <p className='text-lg font-semibold'>{appointment?.patientName || 'N/A'}</p>
                  </li>
                  <li className='space-x-3 flex'>
                    <h1 className='text-lg font-semibold'>Age: </h1>
                    <p className='text-lg font-semibold'>{appointment?.viewDetails?.age || 'N/A'}</p>
                  </li>
                  <li className='space-x-3 flex'>
                    <h1 className='text-lg font-semibold'>Date: </h1>
                    <p className='text-lg font-semibold'>{appointment?.date || 'N/A'}</p>
                  </li>
                  <li className='space-x-3 flex'>
                    <h1 className='text-lg font-semibold'>Time: </h1>
                    <p className='text-lg font-semibold'>{appointment?.time || 'N/A'}</p>
                  </li>
                  <li className='space-x-3 flex'>
                    <h1 className='text-lg font-semibold'>Fees: </h1>
                    <p className='text-lg font-semibold'>{appointment?.viewDetails?.fees || 'N/A'}</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Section - Description */}
            
            <div className='w-[65%] h-[240px] flex flex-col items-center bg-white rounded-md shadow-xl gap-4'>
              <div className='w-[95%] h-[45px] mt-4 flex items-center'>
                <h1 className='text-xl font-semibold'>Description</h1>
              </div>
              <div className='overflow-y-auto px-6 w-[95%] h-[130px] bg-gray-100 rounded-lg  '>
                <p className='w-[100%] text-lg font-serif text-gray-700 break-words'>
                  {appointment?.viewDetails?.description || 'No description available'}
                </p>
              </div>
              {/* Buttons Section */}
          <div className='h-[70px] w-[100%] flex justify-end'>
            <div className='w-[35%] flex space-x-5 justify-end mr-4 mt-1'>
              {renderButtons()}
            </div>
          </div>
            </div>
          </div>

          
        </div>

        {/* Additional section (Medical records, etc.) */}
        <div className='w-full h-[450px] bg-white rounded-md shadow-xl flex flex-col mt-4'>
          {/* Render other sections like Medical records or additional info */}
        </div>
      </div>

      {/* Modal for cancellation reason */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 sm:p-0">
          <div className="bg-white w-full max-w-lg p-6 rounded-md shadow-lg">
            {appointmentStatus === 'cancelled by Dr' ? (
              <> <h2 className="text-xl font-bold mb-4">Cancellation Reason</h2> {/* Constrain the content to prevent horizontal overflow */} <div className="max-h-60 overflow-y-auto overflow-x-hidden"> <p className="break-words">{appointment?.viewDetails?.reason}</p> </div> </>
            ) : (
              <form onSubmit={formik.handleSubmit}>
                <h2 className="text-xl font-semibold mb-4">Cancel Appointment</h2>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 mb-4"
                  name="cancelReason"
                  rows={4}
                  placeholder="Enter cancellation reason..."
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.cancelReason}
                />
                {formik.touched.cancelReason && formik.errors.cancelReason && (
                  <p className="text-red-500 text-sm">{formik.errors.cancelReason}</p>
                )}
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    type="button"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
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
              <p className="text-lg font-semibold mb-2">Patient: {appointment?.patientName || 'N/A'}</p>
              <p className="text-lg font-semibold mb-4">Age: {appointment?.viewDetails?.age || 'N/A'}</p>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                name="prescription"
                rows={4}
                placeholder="Enter prescription..."
                onChange={prescriptionFormik.handleChange}
                onBlur={prescriptionFormik.handleBlur}
                value={prescriptionFormik.values.prescription}
              />
              {prescriptionFormik.touched.prescription && prescriptionFormik.errors.prescription && (
                <p className="text-red-500 text-sm">{prescriptionFormik.errors.prescription}</p>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  type="button"
                  onClick={closePrescriptionModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AppointmentDetails;





