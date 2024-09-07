import React from 'react';

const VerificationProcessing = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-2xl p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
          Your Documents Are Under Processing
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Thank you for submitting your details. Our team is currently reviewing your documents. 
          This process may take some time, and we appreciate your patience. You will receive a 
          notification once your documents have been successfully verified.
        </p>
      </div>
    </div>
  );
};

export default VerificationProcessing;
