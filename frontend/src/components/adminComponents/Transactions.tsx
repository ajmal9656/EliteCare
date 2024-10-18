import { useState, useEffect } from "react";
import axiosUrl from "../../utils/axios";

const Transactions = () => {
  const [status, setStatus] = useState("Credit");
  const [transactions, setTransactions] = useState<any>([]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const fetchTransactions = async () => {
    try {
      const response = await axiosUrl.get(`/admin/getTransactionsDetails`, {
        params: { status },
      });
      setTransactions(response.data.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [status]);

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

  return (
    <div className="flex flex-col pl-64 p-4 ml-3 mt-14">
      <div className="flex flex-row justify-end items-center mb-4">
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
              <td className="py-2 px-4 border-b border-gray-300">{transaction.date}</td>
              <td className="py-2 px-4 border-b border-gray-300">{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
