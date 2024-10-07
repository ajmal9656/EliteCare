import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomTable from '../common/doctorCommon/Table';
import { RootState } from '../../Redux/store';
import axiosUrl from '../../utils/axios';
import Swal from 'sweetalert2';

interface Transaction {
  transactionId: string;
  amount: number;
  date: string;
  transactionType: 'credit' | 'debit';
}

function Wallet() {
  const DoctorData = useSelector((state: RootState) => state.doctor);
  const [status, setStatus] = useState('All');
  const [allTransactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const doctorId = DoctorData?.doctorInfo?.doctorId;

        if (doctorId) {
          const response = await axiosUrl.get(`/doctor/getWallet/${doctorId}`, {
            params: { status }
          });
          if (response.data.response.transactions.length === 0) {
            setTransactions([]);
          }

          const convertedData = response.data.response.transactions.map((walletData: any) => ({
            transactionId: walletData.transactionId,
            amount: walletData.amount,
            date: new Date(walletData.date).toISOString().split('T')[0],
            transactionType: walletData.transactionType,
          }));

          setBalance(response.data.response.balance);
          setTransactions(convertedData);
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    fetchWalletData();
  }, [DoctorData, status]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
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
