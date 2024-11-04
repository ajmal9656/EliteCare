import { useState, useEffect, useRef } from "react";
import { BsSendFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import io from "socket.io-client";
import axiosUrl from "../../utils/axios";
import { FcVideoCall } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { setVideoCall } from "../../Redux/Slice/doctorSlice";
import { useSocket } from "../../Context/SocketIO";






const Chat = () => {
  const location = useLocation();
  const dispatch:any = useDispatch()

  

  const { appointment } = location.state || {};
  const [newMsg, setNewMsg] = useState(""); // State for new message input
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState<any>(null);
  let {socket} = useSocket()
 
  // useEffect(()=>{
   
   
  //   socket.on('connection',()=>{
  //     console.log('Client connected')
  //   })
    
  // },[])
  


  useEffect(() => {
    (async () => {
      try {
        const response = await axiosUrl.get(`/chat/fetchTwoMembersChat`, { params: { doctorID: appointment?.viewDetails?.docId, userID: appointment?.viewDetails?.userId?._id,sender:"DOCTOR" } });
        console.log("aaaaaa.data",response.data );
        
        
        setChatHistory(response.data);
        
      } catch (error:any) {
        if (error.response?.status === 401) {
          
          navigate("/login", { state: { message: "Authorization failed, please login" } });
        } else {
          toast.error("Something wrong, Can't fetch chat history. Please try again later");
        }
      }
    })();
  }, []);

  useEffect(()=>{
    console.log("SOCKKK",socket)
    if(socket){
      socket?.emit("joinChatRoom", { doctorID: appointment?.viewDetails?.docId, userID: appointment?.viewDetails?.userId?._id,online:"DOCTOR" });
    }    
  },[socket])

  const sendMessage = (newMsg:string) => {
    if (newMsg.trim()) {
      try {
        const messageDetails = {
          senderID: appointment?.viewDetails?.docId,
          receiverID: appointment?.viewDetails?.userId?._id,
          message: newMsg,
          sender:"doctor"
        };

        
        socket?.emit("sendMessage", { messageDetails});

        setNewMsg(""); // Clear the message input
      } catch (error:any) {
        if (error.response && error.response.status === 401) {
          navigate("/login", { state: { message: "Authorization failed, please login" } });
        } else {
          toast.error("Something went wrong, please try again later");
        }
      }
    }
  };

  // useEffect(() => {
  //   // Example of receiving messages
  //   socket.on("receiveMessage", (message:any) => {
  //     console.log("New message received:", message);
  //   });

  //   return () => {
  //     socket.off("receiveMessage"); // Clean up listener
  //   };
  // }, [socket]);
  useEffect(() => {
    socket?.on("receiveMessage", (messageDetails:any) => {
      console.log("gggggggggg",messageDetails);
       
      setChatHistory(messageDetails.messages);
    });
    return () => {
      socket?.off("receiveMessage");
    };
  }, []);

  

//   const invite = async (userData: User) => {
//     const { ZegoUIKitPrebuilt } = await import(
//         '@zegocloud/zego-uikit-prebuilt'
//     )

//     const targetUser = {
//         userID: userData?._id,
//         userName: userData?.username,
//         image: userData?.image,
//     };

//     if (targetUser.userID && targetUser?.userName && targetUser?.image) {
//         const data = {
//             callees: [targetUser],
//             callType: ZegoUIKitPrebuilt.InvitationTypeVideoCall,
//             timeout: 60,

//         };
//         zp.sendCallInvitation(data)
//     } else {
//         console.error("Invalid target user data");
//     }
// }

const navigateVideoChat=()=>{
  dispatch(setVideoCall({
    userID:appointment?.viewDetails?.userId?._id,
    type: "out-going",
    callType: "video",
    roomId: Date.now(),
    userImage:chatHistory?.signedUserImageUrl,
    doctorImage:chatHistory?.signedDoctorImageUrl,
    name:chatHistory?.user?.name,

}))

}

  return (
    <div className="flex flex-col w-full mx-auto pl-80 p-4 ml-3 mt-4 h-screen px-10 space-y-3">
      
    <div className="flex-1  sm:p-6 justify-between flex flex-col h-screen">
      {/* Chat header */}
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <span className="absolute text-green-500 right-0 bottom-0">
              <svg width="20" height="20">
                <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
              </svg>
            </span>
            <img
              src={chatHistory?.signedUserImageUrl}
              alt="User profile"
              className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-2xl mt-1 flex items-center">
              <span className="text-gray-700 mr-3">{chatHistory?.user?.name}</span>
            </div>
            <span className="text-lg text-gray-600">Junior Developer</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
         
        <button
  type="button"
  className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
  onClick={navigateVideoChat}  // Trigger the meeting on button click
>
  <FcVideoCall className="h-6 w-6" />
</button>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div
  id="messages"
  className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
>
  {/* Ensure chatHistory is always an array */}
  {chatHistory?.chatResult.messages.length > 0 ? (
    chatHistory.chatResult.messages.map((chat:any, index:any) => (
      <div key={index} className="chat-message">
        {chat.sender === "doctor" ? (
          <div className="flex items-end justify-end">
            <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
              <div>
                <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white">
                  {chat.message}
                </span>
              </div>
            </div>
            <img
              src={chatHistory?.signedDoctorImageUrl}
              alt="Doctor profile"
              className="w-6 h-6 rounded-full order-2"
            />
          </div>
        ) : (
          <div className="flex items-end">
            <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
              <div>
                <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                  {chat.message}
                </span>
              </div>
            </div>
            <img
              src={chatHistory?.signedUserImageUrl}
              alt="User profile"
              className="w-6 h-6 rounded-full order-1"
            />
          </div>
        )}
      </div>
    ))
  ) : (
    <p>No messages yet...</p>
  )}
</div>



      {/* Chat input */}
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex">
          <span className="absolute inset-y-0 flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.752 11.168l-3.197-2.132A4.992 4.992 0 0112 4.667c0-1.105-.448-2.105-1.248-2.902A4.968 4.968 0 008 1.333c-1.105 0-2.105.448-2.902 1.248A4.968 4.968 0 004 5.667c0 1.104.448 2.105 1.248 2.902l3.197 2.132a4.992 4.992 0 00-2.248 4.67h2a4.992 4.992 0 014.752-4.67zm0 0A4.992 4.992 0 0112 19.333h2a4.992 4.992 0 01-2.248-4.67z"
                />
              </svg>
            </button>
          </span>
          <input
            type="text"
            placeholder="Write your message!"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
          />
          <div className="absolute right-0 items-center inset-y-0 flex space-x-2">
            
            {/* <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h11m0 0V3m0 7l7 7-7 7"
                />
              </svg>
            </button> */}
            <button
            onClick={() => sendMessage(newMsg)}
            className="absolute right-0 inset-y-0 flex items-center justify-center h-full w-12 text-gray-500"
          >
            <BsSendFill className="text-xl" />
          </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Chat;
