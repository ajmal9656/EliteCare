import { UpdateWriteOpResult } from "mongoose"
import { Appointment, chatData, GetChatResult, NotificationData } from "./chatInterface/chatInterface"



export interface IChatRepository {
    createChat(messageDetails: any):Promise<chatData>
    createNotification(messageDetails: any):Promise<void>
    createVideocallNotification(messageDetails: any):Promise<void>
    deleteMessage(messageDetails: any):Promise<chatData>
    getChat (doctorID: string, userID: string,sender:string): Promise<GetChatResult>
    getNotificationCount (receiverId: string): Promise<{notificationCount:number}>
    getAllNotifications (receiverId: string): Promise<NotificationData[]>
    readAllNotifications (receiverId: string): Promise<UpdateWriteOpResult>
    updateAppointment (appointmentId: string): Promise<Appointment>
    
    

    

    
    
 };