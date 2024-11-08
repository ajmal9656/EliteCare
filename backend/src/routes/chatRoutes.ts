import { Router } from "express";
import { chatService } from "../services/chatService";
import { chatRepository } from "../repository/chatRepository";
import { chatController } from "../controllers/chatController";




const route = Router()

const chatRepositoryInstance = new chatRepository()
const chatServiceInstance = new chatService(chatRepositoryInstance)
const chatControllerInstance = new chatController(chatServiceInstance)


route.get('/fetchTwoMembersChat', chatControllerInstance.getChat.bind(chatControllerInstance));
route.get('/notificationCount/:recieverId', chatControllerInstance.getNotificationCount.bind(chatControllerInstance));
route.get('/getAllNotifications/:recieverId', chatControllerInstance.getAllNotifications.bind(chatControllerInstance));
route.get('/readAllNotifications/:recieverId', chatControllerInstance.getAllNotifications.bind(chatControllerInstance));

export default route;


