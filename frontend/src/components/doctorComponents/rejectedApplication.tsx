import React from 'react';

interface RejectionProps {
  reason: string;
}

const RejectedApplication: React.FC<RejectionProps> = ({ reason }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-2xl p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-semibold text-red-600 dark:text-red-400 mb-4">
          Your Application Has Been Rejected
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          We regret to inform you that your application has been rejected. 
          The reason for rejection is as follows:
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 italic">
          {reason}
        </p>
      </div>
    </div>
  );
}

export default RejectedApplication;
