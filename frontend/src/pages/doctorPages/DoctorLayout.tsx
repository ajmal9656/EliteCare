import Sidebar from "../../components/common/doctorCommon/Sidebar";
import { Outlet } from "react-router-dom";

function DoctorLayout() {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default DoctorLayout
