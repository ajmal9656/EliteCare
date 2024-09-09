import React from "react";
import Button from "../common/userCommon/Button";
import axiosUrl from "../../utils/axios";

const Home: React.FC = () => {
  const handleClick = async () => {
    try {
      // Replace this with your actual backend endpoint
      const response = await axiosUrl.get("/getSpecializations");
      console.log("Backend response:", response.data);
      // Handle the response data as needed
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam magnam
          omnis natus accusantium quos. Reprehenderit incidunt expedita
          molestiae impedit at sequi dolorem iste sit culpa, optio voluptates
          fugiat vero consequatur?
        </p>

        <Button title="See Services" onClick={handleClick} />
      </div>
    </div>
  );
};

export default Home;
