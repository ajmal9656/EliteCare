import Navbar from "../../components/common/userCommon/Navbar";
import Footer from "../../components/common/userCommon/Footer";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
      
    </>
  )
}

export default UserLayout
