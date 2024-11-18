import { useState, useEffect } from "react";
import axiosUrl from "../../utils/axios";
import DatePicker from "react-datepicker";

const Transactions = () => {
  const [status, setStatus] = useState("Credit");
  const [transactions, setTransactions] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1);
    

    

  };

  const fetchTransactions = async (status:string,page:number,startDate: Date | null, endDate: Date | null) => {
    try {
      const params: { [key: string]: any } = { status, page, limit: 2 };
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      console.log("paramss",params);
      const response = await axiosUrl.get(`/admin/getTransactionsDetails`,{
        params
      });
      console.log("transacti",response.data);
      
      setTransactions(response.data.data);
      setTotalPages(response.data.totalPages)
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions(status,currentPage, startDate, endDate);
  }, [status,currentPage]);

  const calculateFee = (transaction: any) => {
    if (status === "Credit") {
      return transaction.fees; // Full fee for Credit
    }
    if (status === "Paid") {
      return transaction.fees * 0.9; // 90% of the fee for Paid
    }
    if (status === "Refunded") {
      if (transaction.status === "cancelled") {
        return transaction.fees * 0.95; // 95% of the fee for cancelled
      }
      if (transaction.status === "cancelled by Dr") {
        return transaction.fees; // Full fee for cancelled by Dr
      }
    }
    return transaction.fees; // Default case, full fee
  };

  const handlePagination = (direction: string) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "previous" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on search
    fetchTransactions(status, currentPage, startDate, endDate);
  };

  return (
    <div className="flex flex-col pl-64 p-10 ml-3 mt-14">
      <div className="flex flex-row justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded border border-transparent text-sm font-medium ${
              status === "Credit" ? "bg-green-600 text-white" : "bg-white text-gray-500"
            }`}
            onClick={() => handleStatusChange("Credit")}
          >
            Credit
          </button>

          <button
            className={`px-3 py-1 rounded border border-transparent text-sm font-medium ${
              status === "Paid" ? "bg-yellow-600 text-white" : "bg-white text-gray-500"
            }`}
            onClick={() => handleStatusChange("Paid")}
          >
            Paid
          </button>

          <button
            className={`px-3 py-1 rounded border border-transparent text-sm font-medium ${
              status === "Refunded" ? "bg-orange-600 text-white" : "bg-white text-gray-500"
            }`}
            onClick={() => handleStatusChange("Refunded")}
          >
            Refunded
          </button>
        </div>
        <div className="flex space-x-4 items-center ">
        
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            placeholderText="Start Date"
            className="text-sm px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-28"
          />
          <DatePicker
            selected={endDate}
            onChange={(date: Date|null) => setEndDate(date)}
            placeholderText="End Date"
            className="text-sm px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-28"
          />
          <button
            className="text-sm px-2 py-1 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b border-gray-300 text-gray-700">AppointmentId</th>
            <th className="py-2 px-4 border-b border-gray-300 text-gray-700">Amount</th>
            <th className="py-2 px-4 border-b border-gray-300 text-gray-700">Date</th>
            <th className="py-2 px-4 border-b border-gray-300 text-gray-700">Current Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction: any) => (
            <tr
              key={transaction._id}
              className="hover:bg-gray-100 transition duration-200 text-center"
            >
              <td className="py-2 px-4 border-b border-gray-300">{transaction.appointmentId}</td>
              <td className="py-2 px-4 border-b border-gray-300">
                {/* Calculate the fee based on the selected status */}
                {calculateFee(transaction)}
              </td>
              <td className="py-2 px-4 border-b border-gray-300">{new Date(transaction.date).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b border-gray-300">{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
          : "bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 text-white hover:scale-105 hover:shadow-xl hover:from-blue-600 hover:to-cyan-600"
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
          : "bg-gradient-to-br from-gray-800 via-gray-600 to-gray-700 text-white hover:scale-105 hover:shadow-xl hover:from-cyan-600 hover:to-blue-600"
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
  );
};

export default Transactions;
