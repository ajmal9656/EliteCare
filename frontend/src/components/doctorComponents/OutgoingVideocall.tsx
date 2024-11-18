import { MdCallEnd } from "react-icons/md";
import { useSocket } from "../../Context/SocketIO";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { RootState } from "../../Redux/store";
import { endCallDoctor } from "../../Redux/Slice/doctorSlice";

function OutgoingVideocall() {
  const { videoCall, doctorInfo } = useSelector((state: RootState) => state.doctor);
  const { socket } = useSocket();
  const dispatch = useDispatch();

  // Reference to hold the timeout ID
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (videoCall?.type === "out-going") {
      // Emit outgoing call to the socket
      socket?.emit("outgoing-video-call", {
        to: videoCall.userID,
        from: {
          _id: doctorInfo?.doctorId,
          profilePic: videoCall?.doctorImage,
          name: doctorInfo?.name,
          appointmentId: videoCall?.appointmentId
          ,
        },
        callType: videoCall.callType,
        roomId: videoCall.roomId,
      });

      // Set a timeout to end the call after 30 seconds (or any desired time)
      timeoutRef.current = setTimeout(() => {
        handleEndCall(); // Automatically end the call
      }, 30000); // 30 seconds
    }

    // Clean up the timeout when the component unmounts or when videoCall changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [videoCall]);
  console.log("out",doctorInfo);
  

  const handleEndCall =async () => {
    // Emit the reject-call event to the socket
    await socket?.emit("reject-call", { to: videoCall.userID,sender:"doctor",name:videoCall.name,from:doctorInfo?.name,appointmentId:videoCall.appointmentId,senderId:doctorInfo?.doctorId });

    dispatch(endCallDoctor());
    // Clear the timeout if the user ends the call manually
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <div className="w-full h-full fixed flex justify-center items-center z-50 top-1">
      <div className="w-96 bg-cyan-950 flex justify-center items-center z-50 rounded-xl shadow-2xl shadow-black">
        <div className="flex flex-col gap-6 items-center">
          <span className="text-lg text-white mt-3"></span>
          <span className="text-3xl text-white">{videoCall.name}</span>
          <div className="flex">
            <img className="w-24 h-24 rounded-full" src={videoCall?.userImage} alt="profile" />
          </div>
          <div className="bg-red-500 w-12 h-12 text-white rounded-full flex justify-center items-center m-5">
            <MdCallEnd onClick={handleEndCall} className="text-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutgoingVideocall;
