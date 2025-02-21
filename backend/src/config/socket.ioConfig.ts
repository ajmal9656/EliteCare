import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { chatService } from "../services/chat/chat";

import { chatRepository } from "../repository/chat/chat";

const chatRepositoryInstance = new chatRepository()
const chatServices = new chatService(chatRepositoryInstance)


let io: SocketServer;
const onlineUser: { [key: string]: string } = {};

const userSocketMap: {
    [key: string]: string } = {};

export const getReceiverSocketId = (userId: string) => {
//   console.log('recienver and his socket id are ', userId, userSocketMap[userId])
  return userSocketMap[userId]
}



const configSocketIO = (server: HttpServer) => {
    try{
        
    
      io = new SocketServer(server, {
        cors: {
           origin: ["https://ajmals.site","http://localhost:5173"]
        },transports: ['polling', 'websocket']
     });
    
    
    
    
 
    io.on("connection", (socket) => {

      
       const userId = socket.handshake.query.userId
      
       
       if (userId != undefined){
         userSocketMap[userId as string] = socket.id
         onlineUser[userId as string] = socket.id;}
      
       
 
       socket.on("joinChatRoom", ({ doctorID, userID, online }) => {
          const roomName = [doctorID, userID].sort().join("-");
          if(online==="USER"){
            
            socket.join(roomName);
             if (onlineUser[doctorID]) {
                io.emit("receiverIsOnline", { user_id: doctorID });
             } else {
                io.emit("receiverIsOffline", { user_id: doctorID });
             }
            //  console.log(`User ${userID} joined room: ${roomName}`);

          }
          if(online==="DOCTOR"){
            
            socket.join(roomName);
             if (onlineUser[userID]) {
                io.emit("receiverIsOnline", { user_id: userID });
             } else {
                io.emit("receiverIsOffline", { user_id: userID });
             }
            //  console.log(`Doctor ${doctorID} joined room: ${roomName}`);

          }
          
        
       });
 
      //  socket.on("enterToChatScreen", ({ user_id }) => {
      //     onlineUser[user_id] = socket.id;
      //     io.emit("receiverIsOnline", { user_id });
      //  });
 
    //    socket.on("leaveFromChatScreen", ({ user_id }) => {
    //       if (onlineUser[user_id]) {
    //          delete onlineUser[user_id];
    //          io.emit("receiverIsOffline", { user_id });
    //       }
    //    });
 
    socket.on("sendMessage", async ({ messageDetails }) => {
      try {
        // console.log("Entered sendMessage handler");
    
        let savedMessage: any = null;
    
        // Create or retrieve chat connection details based on the message
        const connectionDetails: any = await chatServices.createChat(messageDetails);
        // console.log("Chat created/updated in database");
    
        // Save message details to the variable
        savedMessage = connectionDetails;
    
        // Determine the chat room based on sender type
        let chatRoom: string;
    
        if (messageDetails.sender === "doctor") {
          chatRoom = [messageDetails.senderID, messageDetails.receiverID].sort().join("-");
          // console.log(messageDetails.sender,chatRoom);
          
        } else if (messageDetails.sender === "user") {
          chatRoom = [messageDetails.receiverID, messageDetails.senderID].sort().join("-");
          // console.log(messageDetails.sender,chatRoom);
        } else {
          // console.log("Invalid sender type specified in messageDetails.");
          return;
        }
    
        // console.log("Chat room identified:", chatRoom);
        // console.log("messages:", savedMessage);

        await chatServices.createNotification(messageDetails);
    
        // Emit the message to the specified chat room
        io.to(chatRoom).emit("receiveMessage", savedMessage);
        // console.log("receiever",messageDetails.receiverID)
        const userSocketId = getReceiverSocketId(messageDetails.receiverID)
        io.to(userSocketId).emit("receiveNotification", {
          message: `You have a new message from ${messageDetails.sender === "doctor" ? "your doctor" : "your patient"}.`,
          messageDetails: connectionDetails
        });

        
    
        
    
      } catch (error) {
        console.error("Error in sendMessage handler:", error);
      }
    });
    socket.on("deleteMessage", async ({ messageDetails }) => {
      try {
        // console.log("Entered deleteMessage handler");
    
        let savedMessage: any = null;
    
        // Create or retrieve chat connection details based on the message
        const connectionDetails: any = await chatServices.deleteMessage(messageDetails);
        
    
        // Save message details to the variable
        savedMessage = connectionDetails;
    
        // Determine the chat room based on sender type
        let chatRoom: string;
    
        if (messageDetails.sender === "doctor") {
          chatRoom = [messageDetails.senderID, messageDetails.receiverID].sort().join("-");
          // console.log(messageDetails.sender,chatRoom);
          
        } else if (messageDetails.sender === "user") {
          chatRoom = [messageDetails.receiverID, messageDetails.senderID].sort().join("-");
          // console.log(messageDetails.sender,chatRoom);
        } else {
          // console.log("Invalid sender type specified in messageDetails.");
          return;
        }
    
        // console.log("Chat room identified:", chatRoom);
        // console.log("messages:", savedMessage);
    
        // Emit the message to the specified chat room
        io.to(chatRoom).emit("receiveMessage", savedMessage);
    
        
    
      } catch (error) {
        console.error("Error in sendMessage handler:", error);
      }
    });
    

 
    //    socket.on("joinTechnicianNoficationRoom", (technicianUserID) => {
    //       socket.join(`technicianNotificaionRoom${technicianUserID}`);
    //       console.log(`Technician ${technicianUserID} joined his notification room`);
    //    });
 
    //    socket.on("chatNotificationRoom", (user_id) => {
    //       socket.join(`chatNotificationRoom${user_id}`);
    //    });

    socket.on('outgoing-video-call', (data) => {
      const userSocketId = getReceiverSocketId(data.to)
      // console.log(userSocketId,"OUT")
      if (userSocketId) {
        //  console.log("dddddddddd",userSocketMap);
        //  console.log("cccccccc",data);
         console.log("calldata",data);
         
        socket.to(userSocketId).emit('incoming-video-call', {
          from: data.from,
          roomId: data.roomId,
          callType: data.callType,
          appointmentId:data.from.appointmentId
        })
      }
    })

    socket.on('accept-incoming-call', (data) => {
      const friendSocketId = getReceiverSocketId(data.to)
      if (friendSocketId) {
        socket.to(friendSocketId).emit('accept-call', (data))
      }
    })

    socket.on('leave-room', (data) => {
      // console.log('coming here')
      const friendSocketId = getReceiverSocketId(data.to)
      if (friendSocketId) {
        // console.log('coming here')
        socket.to(friendSocketId).emit('user-left');
      }
    });

    socket.on('reject-call', async (data) => {
      // console.log('data coming through reject call is ',data)
      const friendSocketId = getReceiverSocketId(data.to)
      if (friendSocketId) {
        socket.to(friendSocketId).emit('call-rejected')
      }

      await chatServices.createVideocallNotification(data);
    
        
      //   // console.log("receiever",messageDetails.receiverID)
        const recieverSocketId = getReceiverSocketId(data.to)
        const senderSocketId = getReceiverSocketId(data.senderId)
        io.to(recieverSocketId).emit("receiveNotification");
        io.to(senderSocketId).emit("receiveNotification");
    })
 
       socket.on("disconnect", () => {
          const disconnectUser = Object.keys(onlineUser).find((userId) => onlineUser[userId] === socket.id);
          if (disconnectUser) {
             delete onlineUser[disconnectUser];
             io.emit("receiverIsOffline", { user_id: disconnectUser });
          }
          console.log(`User disconnected: ${socket.id}`);
       });


    });

    }
    catch(error:any){
        console.log("error",error);
        
    }
    
 };

 const sendAppointmentNotification = (doctorId: any) => {
  const socketId = getReceiverSocketId(doctorId);
  if (socketId ) {
    io.to(socketId).emit("AppointmentNotification");
  } else {
    console.log(`doctor with ID ${doctorId} is not connected.`);
  }
};
const sendAppointmentCancellationNotification = (doctorId: any, userId: any) => {
  const doctorSocketId = getReceiverSocketId(doctorId);
  const userSocketId = getReceiverSocketId(userId);

  if (doctorSocketId) {
    io.to(doctorSocketId).emit("AppointmentCancellation");
  } else {
    console.log(`Doctor with ID ${doctorId} is not connected.`);
  }

  if (userSocketId) {
    io.to(userSocketId).emit("AppointmentCancellation");
  } else {
    console.log(`User with ID ${userId} is not connected.`);
  }
};
 
 export { configSocketIO, io,sendAppointmentNotification,sendAppointmentCancellationNotification };