import { useState, useEffect } from "react";
import { BsSendFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosUrl from "../../utils/axios";
import { useSocket } from "../../Context/SocketIO";
import { MdDeleteOutline } from "react-icons/md";

function Chat() {
  const location = useLocation();

  const { appointment } = location.state || {};
  
  

  const [newMsg, setNewMsg] = useState(""); // State for new message input
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState<any>(null);
  const [chatDetails, setChatDetails] = useState<any>(null);
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; messageId: string } | null>(null);
  let {socket} = useSocket()


  useEffect(() => {
    (async () => {
      try {

        
        const response = await axiosUrl.get(`/chat/fetchTwoMembersChat`, { params: { doctorID: appointment?.docId._id, userID: appointment?.userId , sender:"USER" } });
        console.log("aaaaaa.data",response.data);
        
        
        setChatHistory(response.data.chatResult.messages);
        setChatDetails(response.data)
        
      } catch (error:any) {
        if (error.response.status === 401) {
          
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
      socket?.emit("joinChatRoom", { doctorID: appointment?.docId._id, userID: appointment?.userId ,online:"USER"});

    }    
  },[socket])

  const sendMessage = (newMsg:string) => {
    if (newMsg.trim()) {
      try {
        const messageDetails = {
          senderID: appointment?.userId,
          receiverID: appointment?.docId._id,
          appointmentId:appointment?._id,
          name:chatDetails?.user?.name,
          message: newMsg,
          sender:"user"
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
  //   socket.on("receiveMessage", (message) => {
  //     console.log("New message received:", message);
  //   });

  //   return () => {
  //     socket.off("receiveMessage"); // Clean up listener
  //   };
  // }, [socket]);
  useEffect(() => {
    socket?.on("receiveMessage", (messageDetails:any) => {
      console.log("user recieved",messageDetails.messages);
       
      setChatHistory(messageDetails.messages);
    });
    return () => {
      socket?.off("receiveMessage");
    };
  }, []);

  useEffect(()=>{
   
   
    console.log("chatt",chatHistory);
    
    
  },[chatHistory])

  const onDeleteMessage = async (messageId: string) => {
    try {

      const messageDetails = {
        senderID: appointment?.userId,
        receiverID: appointment?.docId._id,
        messageId: contextMenu?.messageId,
        sender:"user"
      };

      console.log("sssssssssssssssssssssssssss",messageDetails);
      
  
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
    <div className="w-[75%]  pr-10 pb-5">
  <div className="bg-white h-[700px] rounded-lg border flex flex-col justify-around p-5">
    <div className="flex-1 sm:p-6 justify-between flex flex-col h-full">
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
              src={chatDetails?.signedDoctorImageUrl}
              alt="User profile"
              className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-2xl mt-1 flex items-center">
              <span className="text-gray-700 mr-3">Dr.{chatDetails?.doctor?.name}</span>
            </div>
            <span className="text-lg text-gray-600">Junior Developer</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Buttons (if needed) */}
        </div>
      </div>

      {/* Chat messages */}
      <div id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto">
          {chatHistory?.length > 0 ? (
            chatHistory.map((chat: any, index: any) => (
              <div key={index} className="chat-message">
                {chat.sender === "user" ? (
                  <div className="flex items-end justify-end">
                  <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 items-end">
                      <div onContextMenu={(e) => handleRightClick(e, chat._id)}>
                          {chat.delete ? (
                              <span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-500 italic">
                                  This message was deleted
                              </span>
                          ) : (
                              <span className="px-4 py-2 rounded-lg inline-block bg-blue-600 text-white">
                                  {chat.message}
                              </span>
                          )}
                      </div>
                  </div>
                  <img src={chatDetails.signedDoctorImageUrl} alt="Doctor profile" className="w-6 h-6 rounded-full" />
              </div>
              
                ) : (
                  <div className="flex items-end">
                  <img src={chatDetails?.signedUserImageUrl} alt="User profile" className="w-6 h-6 rounded-full" />
                  <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 items-start">
                      <div>
                          {chat.delete ? (
                              <span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-500 italic">
                                  This message was deleted
                              </span>
                          ) : (
                              <span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
                                  {chat.message}
                              </span>
                          )}
                      </div>
                  </div>
              </div>
              
                )}
              </div>
            ))
          ) : (
            <p>No messages yet...</p>
          )}
        </div>

        {/* Context Menu for Deleting a Message */}
        {contextMenu && (
          <>
           <div
  style={{
    position: "absolute",
    top: contextMenu.mouseY,
    left: contextMenu.mouseX,
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "4px",
    zIndex: 1000,
  }}
  onClick={() => onDeleteMessage(contextMenu.messageId)}
>
  <button style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
    <MdDeleteOutline /> Delete Message
  </button>
</div>
            <div onClick={handleCloseContextMenu} className="fixed inset-0" />
          </>
        )}

      {/* Chat input */}
      <div className="border-t-2 border-gray-200 px-4 pt-4">
        <div className="relative flex">
          <span className="absolute inset-y-0 flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300"
            >
              {/* Icon if needed */}
            </button>
          </span>
          <input
            type="text"
            placeholder="Write your message!"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
          />
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

  )
}

export default Chat
