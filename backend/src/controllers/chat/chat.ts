import { Request, Response } from "express";
import { chatRepository } from "../../repository/chat/chat";
import { chatService } from "../../services/chat/chat";
import { IChatService } from "../../interface/chat/chat.service.interface";
import HTTP_statusCode from "../../enums/HttpStatusCode";


export class chatController {

    private chatService:IChatService;

    constructor(chatService:chatService){
        this.chatService = chatService;

    }

    async getChat (req: Request, res: Response)  {
        try {
          console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
          
          const doctorID = req.query.doctorID as string;
          const userID = req.query.userID as string;
          const sender = req.query.sender as string;
          console.log("rrrrrrrrrr",doctorID,userID,sender);
          const chatHistory = await this.chatService.getChat(doctorID, userID,sender);
          

          console.log("whole chat res",chatHistory);
          
          
          res.status(HTTP_statusCode.OK).json(chatHistory);
        } catch (error) {
          
          res.status(HTTP_statusCode.BadRequest).json(error);
        };
      };
       async getNotificationCount (req: Request, res: Response)  {
        try {
          const recieverID = req.params.recieverId as string;
         
          const count = await this.chatService.getNotificationCount(recieverID);
          console.log("sssss",count);
          
          res.status(HTTP_statusCode.OK).json(count);
        } catch (error) {
          
          res.status(HTTP_statusCode.BadRequest).json(error);
        };
      };
       async getAllNotifications (req: Request, res: Response) {
        try {
          const recieverID = req.params.recieverId as string;
          
         
          const notifications = await this.chatService.getAllNotifications(recieverID);
          
          
          res.status(HTTP_statusCode.OK).json(notifications);
        } catch (error) {
          
          res.status(HTTP_statusCode.BadRequest).json(error);
        };
      };
       async readAllNotifications (req: Request, res: Response)  {
        try {
          const recieverID = req.params.recieverId as string;
          
         
          const notifications = await this.chatService.readAllNotifications(recieverID);
          
          
          res.status(HTTP_statusCode.OK).json(notifications);
        } catch (error) {
          
          res.status(HTTP_statusCode.BadRequest).json(error);
        };
      };
       async updateAppointment (req: Request, res: Response) {
        try {
          const {appointmentId} = req.body;

          console.log("appoinmt",appointmentId);
          
          
         
          const response = await this.chatService.updateAppointment(appointmentId);
          // console.log("iiiiiiiii",notifications);
          
          res.status(HTTP_statusCode.OK).json(response);
        } catch (error) {
          console.log("chat:= get chat error", error)
          res.status(HTTP_statusCode.BadRequest).json(error);
        };
      };

}