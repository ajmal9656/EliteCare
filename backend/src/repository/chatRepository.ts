import appointmentModel from "../model/AppoinmentModel";
import ChatModel from "../model/chatModel";
import doctorModel from "../model/doctorModel";
import NotificationModel from "../model/notificationModel";
import userModel from "../model/userModel";
import mongoose from 'mongoose';

export class chatRepository{

    async createChat(messageDetails: any) {
        try {
            // Determine whether the sender is a doctor or a user and adjust the query accordingly
            const query =
                messageDetails.sender === 'doctor'
                    ? {
                        doctorId: messageDetails.senderID,  // Sender is doctor
                        userId: messageDetails.receiverID,
                    }
                    : {
                        doctorId: messageDetails.receiverID, // Sender is user
                        userId: messageDetails.senderID,
                    };
    
            // Check if chat between the user and doctor exists, and update or create the chat document
            const existingChat = await ChatModel.findOneAndUpdate(
                query,
                {
                    // Push a new message to the messages array
                    $push: {
                        messages: {
                            sender: messageDetails.sender,
                            message: messageDetails.message,
                            type: "txt",
                        },
                    },
                },
                { new: true, upsert: true } // 'upsert' creates a new document if none exists
            );
    
            return existingChat;
        } catch (error: any) {
            console.error("Error in chatRepository:", error);
            throw error; // Propagate the error
        }
    }
    async createNotification(messageDetails: any) {
        try {
            

        const { receiverID, message,appointmentId } = messageDetails;
        let notificationMessage;

        if(messageDetails.sender ==="doctor"){
            notificationMessage = `You got a new message from Dr.${messageDetails.name}`

        }else{
            notificationMessage = `You got a new message from ${messageDetails.name}`

        }

        // Create notification content
        const notificationContent = {
            content: notificationMessage,
            type: "message",  // Assume "message" type for chat notifications; adjust as needed
            read: false,
            appointmentId:appointmentId
        };

        // Find the receiver's notification document, or create a new one if it doesn't exist
        const notification = await NotificationModel.findOneAndUpdate(
            { receiverId: new mongoose.Types.ObjectId(receiverID) },
            { $push: { notifications: notificationContent } },
            { new: true, upsert: true }  // Creates document if not found
        );

        console.log("Notification created/updated:", notification);
            
        } catch (error: any) {
            console.error("Error in chatRepository:", error);
            throw error; // Propagate the error
        }
    }
    async createVideocallNotification(messageDetails: any) {
        try {
            console.log("message data",messageDetails)
            

        const { to,from,name,sender,appointmentId,senderId} = messageDetails;
    

        
           let userNotificationMessage
           let doctorNotificationMessage
           if(messageDetails.sender === "doctor"){
            userNotificationMessage = `You Missed a video chat from Dr.${messageDetails.from}`
           doctorNotificationMessage = `${messageDetails.name} Missed your video chat`

           }else{
            userNotificationMessage = `You Missed a video chat from Dr.${messageDetails.name}`
           doctorNotificationMessage = `${messageDetails.from} Missed your video chat`

           }

        

        // Create notification content
        const userNotificationContent = {
            content: userNotificationMessage,
            type: "message",  // Assume "message" type for chat notifications; adjust as needed
            read: false,
            appointmentId:appointmentId
        };
        const doctorNotificationContent = {
            content: doctorNotificationMessage,
            type: "message",  // Assume "message" type for chat notifications; adjust as needed
            read: false,
            appointmentId:appointmentId
        };

        // Find the receiver's notification document, or create a new one if it doesn't exist

        if(messageDetails.sender === "doctor"){
            const userNotification = await NotificationModel.findOneAndUpdate(
                { receiverId: new mongoose.Types.ObjectId(to) },
                { $push: { notifications: userNotificationContent } },
                { new: true, upsert: true }  // Creates document if not found
            );
            const doctorNotification = await NotificationModel.findOneAndUpdate(
                { receiverId: new mongoose.Types.ObjectId(senderId) },
                { $push: { notifications: doctorNotificationContent } },
                { new: true, upsert: true }  // Creates document if not found
            );

        }else{
            const userNotification = await NotificationModel.findOneAndUpdate(
                { receiverId: new mongoose.Types.ObjectId(to) },
                { $push: { notifications: doctorNotificationContent } },
                { new: true, upsert: true }  // Creates document if not found
            );
            const doctorNotification = await NotificationModel.findOneAndUpdate(
                { receiverId: new mongoose.Types.ObjectId(senderId) },
                { $push: { notifications: userNotificationContent } },
                { new: true, upsert: true }  // Creates document if not found
            );

        }
       

        
            
        } catch (error: any) {
            console.error("Error in chatRepository:", error);
            throw error; // Propagate the error
        }
    }
    async deleteMessage(messageDetails: any) {
        try {
            const query =
                messageDetails.sender === 'doctor'
                    ? {
                        doctorId: messageDetails.senderID,  
                        userId: messageDetails.receiverID,
                    }
                    : {
                        doctorId: messageDetails.receiverID, 
                        userId: messageDetails.senderID,
                    };
    
            // Update the 'delete' field to true for the message with the matching messageId
            const updateChat = await ChatModel.findOneAndUpdate(
                query,
                {
                    $set: {
                        "messages.$[elem].delete": true
                    }
                },
                {
                    new: true, // Return the updated document
                    upsert: true, // Create if not found
                    arrayFilters: [{ "elem._id": messageDetails.messageId }] // Filter the message with the specific messageId
                }
            );
    
            return updateChat;
        } catch (error: any) {
            console.error("Error in chatRepository:", error);
            throw error; 
        }
    }
    
    

    getChat = async (doctorID: string, userID: string,sender:string): Promise<any> => {
        try {
          const chatResult = await ChatModel.findOne({doctorId:doctorID,userId:userID})
          

            const user = await userModel.findById(userID,{name:1,image:1})
            

          
          
            const doctor = await doctorModel.findById(doctorID,{name:1,image:1})
            return {
                doctor:doctor,
                user:user,
                chatResult
            };

          
          
        } catch (error) {
          throw error;
        }
      };
      getNotificationCount = async (receiverId: string): Promise<any> => {
        try {
            const notificationCount = await NotificationModel.aggregate([
                { $match: { receiverId: new mongoose.Types.ObjectId(receiverId) } },
                { $unwind: "$notifications" },
                { $match: { "notifications.read": false } },
                { $count: "unreadCount" }
            ]);
    
            return {
                notificationCount: notificationCount[0]?.unreadCount || 0
            };
        } catch (error) {
            throw error;
        }
    };
      getAllNotifications = async (receiverId: string): Promise<any> => {
        try {
            const notifications = await NotificationModel.aggregate([
                { $match: { receiverId: new mongoose.Types.ObjectId(receiverId) } },
                { $unwind: "$notifications" }
            ]);
           
    
            return notifications;
        } catch (error) {
            throw error;
        }
    };
    readAllNotifications = async (receiverId: string): Promise<any> => {
        try {
            const result = await NotificationModel.updateOne(
                { receiverId }, // Find the document by receiverId
                { $set: { "notifications.$[].read": true } } // Set 'read' to true for each item in 'notifications' array
            );
    
            return result;
        } catch (error) {
            throw error;
        }
    };
    updateAppointment = async (appointmentId: string): Promise<any> => {
        try {
            
            
            const result = await appointmentModel.findByIdAndUpdate(
                appointmentId,                 // Use appointmentId directly as the _id
                { status: "prescription pending" },
                { new: true }                   // Return the updated document
            );
    
            return result;
        } catch (error) {
            throw error;
        }
    };
    
    




      
    
    

}