
import axiosUrl from "../../utils/axios"; // Import Axios
import Button from "../common/userCommon/Button";
import { RiMicroscopeLine } from "react-icons/ri";
import ServicesCard from "../common/userCommon/ServiceCard";
import { MdHealthAndSafety } from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";
import { useNavigate,Link } from "react-router-dom";


const Services = () => {
  
  const description = "dtjhnfthbdrtgbsdrgdrgdrjhdj";

  

  const icon1 = <RiMicroscopeLine size={35} className="text-backgroundColor" />;
  const icon2 = <MdHealthAndSafety size={35} className="text-backgroundColor" />;
  const icon3 = <FaHeartbeat size={35} className="text-backgroundColor" />;

  return (
    <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 pt-24 lg:pt-16">
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
    <ServicesCard icon={icon1} title="Lab Test" description={description} />
    <ServicesCard icon={icon2} title="Health Check" description={description} />
    <ServicesCard icon={icon3} title="Heart Health" description={description} />
  </div>
</div>

  );
};

export default Services;
