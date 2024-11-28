import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomTable from '../common/doctorCommon/Table';
import { RootState } from '../../Redux/store';
import axiosUrl from '../../utils/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

interface Transaction {
  transactionId: string;
  amount: number;
  date: string;
  transactionType: 'credit' | 'debit';
}

function Wallet() {

  const navigate = useNavigate()
  const DoctorData = useSelector((state: RootState) => state.doctor);
  const [status, setStatus] = useState('All');
  const [allTransactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWalletData = async (status:string,page:number) => {
    try {
      const doctorId = DoctorData?.doctorInfo?.doctorId;

      if (doctorId) {
        const response = await axiosUrl.get(`/doctor/getWallet/${doctorId}`, {
          params: { status, page, limit: 7 }
        });
        if (response.data.response.transactions.length === 0) {
          setTransactions([]);
        }

        console.log("walleeeeee",response.data.response);
        

        const convertedData = response.data.response.transactions.map((walletData: any) => ({
          transactionId: walletData.transactionId,
          amount: walletData.amount,
          date: new Date(walletData.date).toISOString().split('T')[0],
          transactionType: walletData.transactionType,
        }));

        setBalance(response.data.response.balance);
        setTransactions(convertedData);
        setTotalPages(response.data.response.totalPages)
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };
  useEffect(() => {
    

    fetchWalletData(status,currentPage);
  }, [DoctorData, status, currentPage]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    formik.resetForm();
  };

  const columns = [
    { id: 'transactionId', label: 'Transaction ID' },
    { id: 'amount', label: 'Amount' },
    { id: 'date', label: 'Date' },
    { id: 'transactionType', label: 'Transaction Type' },
  ];

  // Formik setup
  const formik = useFormik({
    initialValues: {
      withdrawAmount: '',
    },
    validationSchema: Yup.object({
      withdrawAmount: Yup.number()
        .required('Amount is required')
        .min(100, 'Amount must be at least 100')
        .max(balance, `Amount cannot exceed ${balance}`)
        .typeError('Enter a valid Amount'), // Ensures only numbers are allowed
    }),
    onSubmit: (values) => {
      // Show confirmation dialog before proceeding
      Swal.fire({
        title: 'Confirm Withdrawal',
        text: `Are you sure you want to withdraw $${values.withdrawAmount}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, withdraw it!',
        cancelButtonText: 'No, cancel!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const doctorId = DoctorData?.doctorInfo?.doctorId; // Assuming you get doctorId from Redux or props
            console.log("aaaaaaaaaaaaaaaaa");
            
            // Make the axios call to the backend to process the withdrawal
            const response = await axiosUrl.post(`/doctor/withdraw/${doctorId}`, {
              
              withdrawAmount: values.withdrawAmount,
            });
            console.log("mne",response.data.response);
            
  
            if (response.status === 200) {
              const convertedData = response.data.response.transactions.map((walletData: any) => ({
                transactionId: walletData.transactionId,
                amount: walletData.amount,
                date: new Date(walletData.date).toISOString().split('T')[0],
                transactionType: walletData.transactionType,
              }));
    
              setBalance(response.data.response.balance);
              setTransactions(convertedData);
              // Show success alert after successful backend call
              Swal.fire({
                title: 'Success!',
                text: `You have successfully withdrawn $${values.withdrawAmount}`,
                icon: 'success',
                confirmButtonText: 'OK',
              }).then(() => {
                toggleModal(); // Close the modal after SweetAlert
                // Optionally refresh the wallet balance or transactions here
              });
            } else {
              // Handle failure response (if needed)
              Swal.fire({
                title: 'Error!',
                text: 'There was a problem with your withdrawal. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
          } catch (error) {
            // Handle error (e.g., network error, server error)
            Swal.fire({
              title: 'Error!',
              text: 'There was a problem processing your withdrawal. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
            console.error('Error during withdrawal:', error);
          }
        } else {
          // Handle the cancellation case if needed
          console.log('Withdrawal canceled');
        }
      });
    },
  });

  const handlePagination = (direction: string) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "previous" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  useEffect(()=>{
    try{
      fetchWalletData(status,currentPage);

    }catch(error:any){
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Redirecting to login page.");
        navigate("/doctor/login"); // Navigate to the login page if unauthorized
      } else {
        console.error("Error fetching user details:", error);
      }
    }
    

  },[balance])
  

  return (
    <>
      <div className="flex flex-col w-full mx-auto pl-80 p-4 ml-3 mt-14 h-screen px-10 space-y-6">
        <div className="w-[95%] h-[140px] bg-white mt-8 flex shadow-md rounded-lg">
          <div className="w-[50%] flex place-items-center ml-10">
            <h1 className="text-2xl">Available Balance:</h1>
            <p className="text-2xl font-medium">${balance}</p>
          </div>
          <div className="w-[50%] flex place-items-center justify-end mr-14">
          {balance >= 100 && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={toggleModal}
              >
                Withdraw
              </button>
            )}
          </div>
        </div>

        <div className="w-[95%] h-[520px] mt-8">
          <div className="flex space-x-4 mb-4 justify-end pt-2">
            <button
              className={`px-3 py-1 border border-transparent text-sm font-medium ${status === 'All' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500'} rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              onClick={() => handleStatusChange('All')}
            >
              All
            </button>
            <button
              className={`px-3 py-1 border border-transparent text-sm font-medium ${status === 'credit' ? 'bg-green-500 text-white' : 'bg-white text-gray-500'} rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              onClick={() => handleStatusChange('credit')}
            >
              Credit
            </button>
            <button
              className={`px-3 py-1 border border-transparent text-sm font-medium ${status === 'debit' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-500'} rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
              onClick={() => handleStatusChange('debit')}
            >
              Debit
            </button>
          </div>

          <CustomTable columns={columns} rows={allTransactions} onViewDetails={(row: any) => console.log(row)} />
          <div className="flex flex-col items-center">
  {/* Help text */}
  <span className="text-sm text-slate-500 dark:text-slate-400 mt-5">
    Showing <span className="font-semibold text-gray-900 dark:text-slate-300">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-slate-300">{totalPages}</span> Entries
  </span>

  {/* Buttons */}
  <div className="inline-flex mt-4 space-x-2">
    <button
      className={`flex items-center justify-center px-5 py-2 h-10 text-base font-medium ${
        currentPage === 1 
          ? "bg-slate-500 text-gray-100 cursor-not-allowed" 
          : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-105 hover:shadow-xl hover:from-blue-600 hover:to-cyan-600"
      } rounded-l-md shadow-lg transform transition duration-300 ease-in-out dark:bg-slate-500 dark:text-gray-200`}
      onClick={() => handlePagination("previous")}
      disabled={currentPage === 1}
    >
      <svg className="w-4 h-4 mr-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
      </svg>
      Prev
    </button>

    <button
      className={`flex items-center justify-center px-5 py-2 h-10 text-base font-medium ${
        currentPage === totalPages 
          ? "bg-slate-500 text-gray-100 cursor-not-allowed" 
          : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:scale-105 hover:shadow-xl hover:from-cyan-600 hover:to-blue-600"
      } rounded-r-md shadow-lg transform transition duration-300 ease-in-out dark:bg-slate-500 dark:text-gray-200`}
      onClick={() => handlePagination("next")}
      disabled={currentPage === totalPages}
    >
      Next
      <svg className="w-4 h-4 ml-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
      </svg>
    </button>
  </div>
</div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Withdraw Money</h2>

            {/* Formik Form */}
            <form onSubmit={formik.handleSubmit}>
      <input
        type="number"
        id="withdrawAmount"
        name="withdrawAmount"
        value={formik.values.withdrawAmount}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Enter amount"
        className="border rounded-lg p-2 w-full mb-4"
      />
      {formik.touched.withdrawAmount && formik.errors.withdrawAmount ? (
        <div className="text-red-500 text-sm">{formik.errors.withdrawAmount}</div>
      ) : null}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          onClick={toggleModal} // Close modal
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Withdraw
        </button>
      </div>
    </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Wallet;
