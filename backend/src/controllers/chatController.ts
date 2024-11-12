import { Request, Response } from "express";
import { chatRepository } from "../repository/chatRepository";
import { chatService } from "../services/chatService";

export class chatController {

    private chatService:chatService;

    constructor(chatService:chatService){
        this.chatService = chatService;

    }

    getChat = async (req: Request, res: Response) => {
        try {
          const doctorID = req.query.doctorID as string;
          const userID = req.query.userID as string;
          const sender = req.query.sender as string;
          const chatHistory = await this.chatService.getChat(doctorID, userID,sender);
          
          
          res.status(200).json(chatHistory);
        } catch (error) {
          
          res.status(400).json(error);
        };
      };
      getNotificationCount = async (req: Request, res: Response) => {
        try {
          const recieverID = req.params.recieverId as string;
         
          const count = await this.chatService.getNotificationCount(recieverID);
          console.log("sssss",count);
          
          res.status(200).json(count);
        } catch (error) {
          
          res.status(400).json(error);
        };
      };
      getAllNotifications = async (req: Request, res: Response) => {
        try {
          const recieverID = req.params.recieverId as string;
          
         
          const notifications = await this.chatService.getAllNotifications(recieverID);
          
          
          res.status(200).json(notifications);
        } catch (error) {
          
          res.status(400).json(error);
        };
      };
      readAllNotifications = async (req: Request, res: Response) => {
        try {
          const recieverID = req.params.recieverId as string;
          
         
          const notifications = await this.chatService.readAllNotifications(recieverID);
          
          
          res.status(200).json(notifications);
        } catch (error) {
          
          res.status(400).json(error);
        };
      };
      updateAppointment = async (req: Request, res: Response) => {
        try {
          const {appointmentId} = req.body;

          console.log("appoinmt",appointmentId);
          
          
         
          const response = await this.chatService.updateAppointment(appointmentId);
          // console.log("iiiiiiiii",notifications);
          
          res.status(200).json(response);
        } catch (error) {
          console.log("chat:= get chat error", error)
          res.status(400).json(error);
        };
      };

}