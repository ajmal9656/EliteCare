import axiosUrl from "../../utils/axios"; // Import Axios
import Button from "../common/userCommon/Button";
import { RiMicroscopeLine } from "react-icons/ri";
import ServicesCard from "../common/userCommon/ServiceCard";
import { MdHealthAndSafety } from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface Specialization {
  _id: string;
  name: string;
  description: string;
  isListed: boolean;
}

const Services = () => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  const fetchSpecializations = async () => {
    try {
      console.log("enter");
      
      const response = await axiosUrl.get("/getSpecializations");
      console.log("spec", response.data);
      setSpecializations(response.data.response); // Store the fetched data in state
    } catch (error) {
      console.error("Error fetching specializations:", error);
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []); // Empty dependency array to run once on mount
  
  // Default description if no specialization is available
  const defaultDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

  return (
    <div id="services" className="flex flex-col justify-center lg:px-28 px-5 pt-24 lg:pt-32">
      <div className="flex flex-col items-center lg:flex-row justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-center lg:text-start">
            Our Services
          </h1>
          <p className="mt-2 text-center lg:text-start">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus,
            quidem.
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Link
            to="/specializations" // Update with the route you want to link to
            className="inline-block px-6 py-3 text-white bg-brightColor hover:bg-hoverColor rounded-md text-lg font-semibold"
          >
            See Services
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 pt-14">
        {specializations.slice(0, 3).map((specialization, index) => {
          let icon;
          switch (index) {
            case 0:
              icon = <RiMicroscopeLine size={35} className="text-backgroundColor" />;
              break;
            case 1:
              icon = <MdHealthAndSafety size={35} className="text-backgroundColor" />;
              break;
            case 2:
              icon = <FaHeartbeat size={35} className="text-backgroundColor" />;
              break;
            default:
              icon = null;
          }

          return (
            <ServicesCard
              key={specialization._id}
              icon={icon}
              title={specialization.name}
              description={specialization.description || defaultDescription}
              id={specialization._id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Services;
