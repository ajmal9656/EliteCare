import { UpdateWriteOpResult } from "mongoose"
import { Appointment, chatData, GetChatResult, NotificationData } from "../chatInterface/chatInterface"


export interface IChatService {

    createChat(messageDetails: any):Promise<chatData>
    createNotification(messageDetails: any):Promise<void>
    createVideocallNotification(notificationDetails: any):Promise<void>
    deleteMessage(messageDetails: any):Promise<any>
    getChat (doctorID: string, userID: string,sender:string): Promise<GetChatResult>
    getNotificationCount (receiverId: string): Promise<{notificationCount:{notificationCount:number}}>
    getAllNotifications (receiverId: string): Promise<NotificationData[]>
    readAllNotifications (receiverId: string): Promise<UpdateWriteOpResult>
    updateAppointment (appointmentId: string): Promise<Appointment>
    

    

    
    
};