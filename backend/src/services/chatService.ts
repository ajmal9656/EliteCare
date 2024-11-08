import mongoose from "mongoose";
import { S3Service } from "../config/s3client";
import { chatRepository } from "../repository/chatRepository";
import NotificationModel from "../model/notificationModel";

const chatRepositoryInstance = new chatRepository()
const S3Services = new S3Service()
export class chatService{

    private chatRepository:chatRepository

    constructor(chatRepository:chatRepository){
        this.chatRepository = chatRepository

    }

    async createChat(messageDetails: any) {
        try {
            // Call the repository to save the chat
            const savedChat = await chatRepositoryInstance.createChat(messageDetails);
            return savedChat;
        } catch (error: any) {
            console.error("Error in chatService:", error);
            throw error; // Propagate the error for further handling
        }
    }
    async createNotification(messageDetails: any) {
        try {
            // Call the repository to save the chat
            const savedNotification = await chatRepositoryInstance.createNotification(messageDetails);
            return savedNotification;
        } catch (error: any) {
            console.error("Error in chatService:", error);
            throw error; // Propagate the error for further handling
        }
    }
    async deleteMessage(messageDetails: any) {
        try {
            // Call the repository to save the chat
            const savedChat = await chatRepositoryInstance.deleteMessage(messageDetails);
            return savedChat;
        } catch (error: any) {
            console.error("Error in chatService:", error);
            throw error; // Propagate the error for further handling
        }
    }

    getChat = async (doctorID: string, userID: string,sender:string): Promise<any> => {
        try {
          const response = await this.chatRepository.getChat(doctorID, userID,sender);
          console.log("aaaaaaaaa",response)

          let signedDoctorUrl: string | undefined;
          let signedUserUrl: string | undefined;
          if (response?.doctor.image && response.doctor.image.url && response.doctor.image.type) {
            const folderPath = this.getFolderPathByFileType(response.doctor.image.type);
            signedDoctorUrl = await S3Services.getFile(response.doctor.image.url, folderPath);

           
            
          }
          if (response?.user.image && response.user.image.url && response.user.image.type) {
            const folderPath = this.getFolderPathByFileType(response.user.image.type);
            signedUserUrl = await S3Services.getFile(response.user.image.url, folderPath);

           
            
          }
          return {
            ...response,
            signedDoctorImageUrl: signedDoctorUrl, 
            signedUserImageUrl: signedUserUrl 
            
          };
        } catch (error) {
          throw error;
        };
      };
      getNotificationCount = async (receiverId: string): Promise<any> => {
        try {
            const notificationCount = await chatRepositoryInstance.getNotificationCount(receiverId)
    
            return {
                notificationCount: notificationCount
            };
        } catch (error) {
            throw error;
        }
    };
    getAllNotifications = async (receiverId: string): Promise<any> => {
        try {

            const notifications = await chatRepositoryInstance.getAllNotifications(receiverId)
            
    
            return notifications;
        } catch (error) {
            throw error;
        }
    };
    readAllNotifications = async (receiverId: string): Promise<any> => {
        try {

            const notifications = await chatRepositoryInstance.readAllNotifications(receiverId)
            
    
            return notifications;
        } catch (error) {
            throw error;
        }
    };

      private getFolderPathByFileType(fileType: string): string {
        
        
        switch (fileType) {
            case 'profile image':
                return 'eliteCare/doctorProfileImages';
            case 'document':
                return 'eliteCare/doctorDocuments';
            case 'user profile image':
                return 'eliteCare/userProfileImages';
            
            default:
                throw new Error(`Unknown file type: ${fileType}`);
        }
    }
    

     





}