import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { chatService } from "../services/chatService";

import { chatRepository } from "../repository/chatRepository";

const chatRepositoryInstance = new chatRepository()
const chatServices = new chatService(chatRepositoryInstance)


let io: SocketServer;
let onlineUser: { [key: string]: string } = {};



const configSocketIO = (server: HttpServer) => {
    try{
        console.log("socket");
    
    io = new SocketServer(server, {
       cors: {
          origin: ["http://localhost:5173"],
          methods: ["GET", "POST"],
       },
    });
    
 
    io.on("connection", (socket) => {
       console.log(`User connected: ${socket.id}`);
 
       socket.on("joinChatRoom", ({ doctorID, userID }) => {
          const roomName = [doctorID, userID].sort().join("-");
         //  onlineUser[senderID] = socket.id;
          socket.join(roomName);
         //  if (onlineUser[receiverID]) {
         //     io.emit("receiverIsOnline", { user_id: receiverID });
         //  } else {
         //     io.emit("receiverIsOffline", { user_id: receiverID });
         //  }
          console.log(`User ${doctorID} joined room: ${roomName}`);
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
 
       socket.on("sendMessage", async ({ messageDetails}) => {
          try {
             let savedMessage: null | any = null;
            
                
                
                const connectionDetails: any = await chatServices.createChat(messageDetails)
                savedMessage = connectionDetails
              
             const chatRoom = [messageDetails.senderID, messageDetails.receiverID].sort().join("-");
             console.log("sss",savedMessage);
             
             io.to(chatRoom).emit("receiveMessage", savedMessage);
            //  io.to(`chatNotificationRoom${savedMessage?.receiverID}`).emit("newChatNotification", savedMessage?.message);
          } catch (error) {
             console.log(error);
          }
       });
 
    //    socket.on("joinTechnicianNoficationRoom", (technicianUserID) => {
    //       socket.join(`technicianNotificaionRoom${technicianUserID}`);
    //       console.log(`Technician ${technicianUserID} joined his notification room`);
    //    });
 
    //    socket.on("chatNotificationRoom", (user_id) => {
    //       socket.join(`chatNotificationRoom${user_id}`);
    //    });
 
       socket.on("disconnect", () => {
          const disconnectUser = Object.keys(onlineUser).find((user_id) => onlineUser[user_id] === socket.id);
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
 
 export { configSocketIO, io };