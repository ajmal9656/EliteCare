import React from "react";
import Button from "../common/userCommon/Button";

import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate()
  const handleClick = async () => {
    try {
      navigate("/doctor/login")
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 text-white bg-[url('/src/assets/home.png')] bg-no-repeat bg-cover opacity-90">
      <div className="w-full lg:w-4/5 space-y-5 mt-10">
        <h1 className="text-5xl font-bold leading-tight">
          Empowering Health Choices for a Vibrant Life Your Trusted..
        </h1>
        <p>
        EliteCare is here to support your health needs. From trusted information to booking appointments and managing records, we provide personalized care to make your healthcare experience simple and accessible.
        </p>

        <Button title="Are you a Doctor?" onClick={handleClick} />
        
      </div>
    </div>
  );
};

export default Home;
