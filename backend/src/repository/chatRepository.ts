import ChatModel from "../model/chatModel";
import doctorModel from "../model/doctorModel";
import userModel from "../model/userModel";

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
    
    

}