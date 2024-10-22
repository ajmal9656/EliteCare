import { Router } from "express";
import { chatService } from "../services/chatService";
import { chatRepository } from "../repository/chatRepository";
import { chatController } from "../controllers/chatController";




const route = Router()

const chatRepositoryInstance = new chatRepository()
const chatServiceInstance = new chatService(chatRepositoryInstance)
const chatControllerInstance = new chatController(chatServiceInstance)


route.get('/fetchTwoMembersChat', chatControllerInstance.getChat.bind(chatControllerInstance));

export default route;


