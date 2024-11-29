import { useState, useEffect, useRef } from "react";
import { BsSendFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosUrl from "../../utils/axios";
import { FcVideoCall } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { setVideoCall } from "../../Redux/Slice/doctorSlice";
import { useSocket } from "../../Context/SocketIO";
import { MdDeleteOutline } from "react-icons/md";







const Chat = () => {
  const location = useLocation();
  const dispatch:any = useDispatch()

  

  const { appointment } = location.state || {};
  console.log("eeeeeeee",appointment);
  
  const [newMsg, setNewMsg] = useState(""); // State for new message input
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState<any>(null);
  const [chatDetails, setChatDetails] = useState<any>(null);
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; messageId: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
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
        console.log("whole chat front",response.data);
        
        if(response.data.chatResult!=null){
          setChatHistory(response.data.chatResult.messages);

        }else{
          setChatHistory([])
        }

        console.log("chat errr");
        
        
        
        setChatDetails(response.data)
        console.log("chat errr222");
        
      } catch (error:any) {
        if (error.response?.status === 401) {
          
          navigate("/login", { state: { message: "Authorization failed, please login" } });
        } else {
          toast.error("Ssssomething wrong, Can't fetch chat history. Please try again later");
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const sendMessage = (newMsg:string) => {
    if (newMsg.trim()) {
      try {
        const messageDetails = {
          senderID: appointment?.viewDetails?.docId,
          receiverID: appointment?.viewDetails?.userId?._id,
          appointmentId:appointment?.viewDetails?._id,
          name:chatDetails?.doctor?.name,
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
      console.log("doc recieved",messageDetails.messages);
       
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
  console.log("app",appointment);
  
  dispatch(setVideoCall({
    userID:appointment?.viewDetails?.userId?._id,
    type: "out-going",
    callType: "video",
    roomId: Date.now(),
    userImage:chatDetails?.signedUserImageUrl,
    doctorImage:chatDetails?.signedDoctorImageUrl,
    name:chatDetails?.user?.name,
    appointmentId:appointment?.viewDetails?._id

}))

}

const onDeleteMessage = async () => {
  try {

    const messageDetails = {
      senderID: appointment?.viewDetails?.docId,
      receiverID: appointment?.viewDetails?.userId?._id,
      messageId: contextMenu?.messageId,
      sender:"doctor"
    };

    socket?.emit("deleteMessage", { messageDetails});



    // const response = await axiosUrl.delete(`/chat/deleteMessage`, { data: { messageId } });
    // if (response.status === 200) {
    //   setChatHistory((prev: any) => ({
    //     ...prev,
    //     chatResult: {
    //       ...prev.chatResult,
    //       messages: prev.chatResult.messages.filter((message: any) => message._id !== messageId),
    //     },
    //   }));
    //   toast.success("Message deleted successfully");
    // }
  } catch (error) {
    toast.error("Failed to delete the message. Please try again.");
  }
  setContextMenu(null); // Close the context menu
};

const handleRightClick = (event: any, messageId: string) => {
  event.preventDefault();
  setContextMenu({
    mouseX: event.clientX,
    mouseY: event.clientY,
    messageId: messageId,
  });
};

const handleCloseContextMenu = () => {
  setContextMenu(null);
};



  return (
    <div className="flex flex-col w-full mx-auto pl-80 p-4 ml-3 mt-7 h-screen px-10 space-y-3">
      <div className="flex-1 sm:p-6 justify-between flex flex-col h-screen">
        {/* Chat header */}
        <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <span className="absolute text-green-500 right-0 bottom-0">
                <svg width="20" height="20">
                  <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                </svg>
              </span>
              <img src={chatDetails?.signedUserImageUrl} alt="User profile" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full" />
            </div>
            <div className="flex flex-col leading-tight">
              <div className="text-2xl mt-1 flex items-center">
                <span className="text-gray-700 mr-3">{chatDetails?.user?.name}</span>
              </div>
              <span className="text-lg text-gray-600">online</span>
            </div>
          </div>
          <button onClick={navigateVideoChat} className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition text-gray-500 hover:bg-gray-300">
            <FcVideoCall className="h-6 w-6" />
          </button>
        </div>

        {/* Chat messages */}
        <div id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto">
  {chatHistory?.length > 0 ? (
    chatHistory.map((chat: any, index: any) => {
      // Format the timestamp to show only the time (HH:mm)
      const time = new Date(chat.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      return (
        <div key={index} className="chat-message relative">
          {chat.sender === "doctor" ? (
            <div className="flex items-end justify-end">
              <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 items-end">
                <div
                  onContextMenu={(e) => handleRightClick(e, chat._id)}
                  className="relative"
                >
                  {chat.delete ? (
                    <span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-500 italic">
                      This message was deleted
                    </span>
                  ) : (
                    <span className="px-4 py-2 rounded-lg inline-block bg-blue-600 text-white">
                      {chat.message}
                    </span>
                  )}
                  {/* Delete button (positioned just above the message) */}
                  {contextMenu?.messageId === chat._id && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-30px',
                        right: '0',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '4px',
                        zIndex: 1000,
                      }}
                      onClick={() => onDeleteMessage()}
                    >
                      <button
                        style={{
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <MdDeleteOutline /> Delete
                      </button>
                    </div>
                  )}
                </div>
                {/* Display time below the message */}
                <span className="text-xs text-gray-500">{time}</span>
              </div>
              <img
                src={chatDetails?.signedDoctorImageUrl}
                alt="Doctor profile"
                className="w-6 h-6 rounded-full"
              />
            </div>
          ) : (
            <div className="flex items-end">
              <img
                src={chatDetails?.signedUserImageUrl}
                alt="User profile"
                className="w-6 h-6 rounded-full"
              />
              <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 items-start">
                <div
                  onContextMenu={(e) => handleRightClick(e, chat._id)}
                  className="relative"
                >
                  {chat.delete ? (
                    <span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-500 italic">
                      This message was deleted
                    </span>
                  ) : (
                    <span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
                      {chat.message}
                    </span>
                  )}
                  {/* Delete button (positioned just above the message) */}
                  {contextMenu?.messageId === chat._id && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-30px',
                        left: '0',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '4px',
                        zIndex: 1000,
                      }}
                      onClick={() => onDeleteMessage()}
                    >
                      <button
                        style={{
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <MdDeleteOutline /> Delete
                      </button>
                    </div>
                  )}
                </div>
                {/* Display time below the message */}
                <span className="text-xs text-gray-500">{time}</span>
              </div>
            </div>
          )}
        </div>
      );
    })
  ) : (
    <p>No messages yet...</p>
  )}
  <div ref={messagesEndRef} />
  
</div>
<div className="border-t-2 border-gray-200 px-2 pt-2">
          <div className="relative flex">
            <input
              type="text"
              className="w-full py-2 pl-12 pr-10 bg-gray-200 rounded-full"
              placeholder="Type a message..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(newMsg)}
            />
            <button onClick={() => sendMessage(newMsg)} className="text-blue-500 px-4">
              <BsSendFill />
            </button>
          </div>
        </div>


        {/* Context Menu for Deleting a Message */}
      {contextMenu && (
        <div
          onClick={handleCloseContextMenu}
          className="fixed inset-0"
        />
      )}

        {/* Chat input */}
       
      </div>
    </div>
  );
};

export default Chat;
