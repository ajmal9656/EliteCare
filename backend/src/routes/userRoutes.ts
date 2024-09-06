import { Router } from "express";
import { userController } from "../controllers/userController";
import { userService } from "../services/userService";
import { userRepository } from "../repository/userRepository";




const route = Router()
const userRepositoryInstance = new userRepository
const userServiceInstance = new userService(userRepositoryInstance)
const userControllerInstance = new userController(userServiceInstance);




route.post('/signUp',userControllerInstance.createUser.bind(userControllerInstance));
route.post('/verifyOtp',userControllerInstance.verifyOtp.bind(userControllerInstance));
route.post('/login',userControllerInstance.loginUser.bind(userControllerInstance));
route.post('/resendOtp',userControllerInstance.resendOtp.bind(userControllerInstance));


export default route