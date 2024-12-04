import { Router } from "express";
import { chatService } from "../services/chat/chat";
import { chatRepository } from "../repository/chat/chat";
import { chatController } from "../controllers/chat/chat";




const route = Router()

const chatRepositoryInstance = new chatRepository()
const chatServiceInstance = new chatService(chatRepositoryInstance)
const chatControllerInstance = new chatController(chatServiceInstance)


route.get('/fetchTwoMembersChat', chatControllerInstance.getChat.bind(chatControllerInstance));
route.get('/notificationCount/:recieverId', chatControllerInstance.getNotificationCount.bind(chatControllerInstance));
route.get('/getAllNotifications/:recieverId', chatControllerInstance.getAllNotifications.bind(chatControllerInstance));
route.get('/readAllNotifications/:recieverId', chatControllerInstance.readAllNotifications.bind(chatControllerInstance));
route.post('/end-call', chatControllerInstance.updateAppointment.bind(chatControllerInstance));

export default route;


