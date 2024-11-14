import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../index.css";
import UserRoutes from "./Routes/UserRoutes";
import AdminRoutes from "./Routes/adminRoutes";
import DoctorRoutes from "./Routes/doctorRoutes";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "./Redux/store";
import VideochatPage from "./pages/doctorPages/VideochatPage";
import IncomingVideocallPage from "./pages/userPages/IncomingVideocallPage";
import OutgoingVideocallPage from "./pages/doctorPages/OutgoingVideocallPage";
import VideoChatPage from "./pages/userPages/VideoChatPage";

function App() {
  const { videoCall, showVideoCallDoctor } = useSelector(
    (state: RootState) => state.doctor
  );
  const { showIncomingVideoCall, showVideoCallUser } = useSelector(
    (state: RootState) => state.user
  );

  return (
    <>
      <Router>
        {videoCall && <OutgoingVideocallPage />}
        {showIncomingVideoCall && <IncomingVideocallPage />}
        {showVideoCallDoctor && <VideochatPage />}
        {showVideoCallUser && <VideoChatPage />}
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/admin*" element={<AdminRoutes />} />
          <Route path="/doctor*" element={<DoctorRoutes />} />
        </Routes>
      </Router>
      <Toaster position="top-center" expand={false} richColors />
    </>
  );
}
export default App;
