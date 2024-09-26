import { Router } from "express";
import { userController } from "../controllers/userController";
import { userService } from "../services/userService";
import { userRepository } from "../repository/userRepository";
import multer from 'multer';

// Multer configuration to use memory storage
const storage = multer.memoryStorage();

// Configuration for handling multiple fields (like image)
const upload = multer({ storage: storage });

// Middleware to handle file upload (image field with maxCount 1)
const uploadUserFiles = upload.single('image');

const route = Router();
const userRepositoryInstance = new userRepository();
const userServiceInstance = new userService(userRepositoryInstance);
const userControllerInstance = new userController(userServiceInstance);

route.post('/signUp', userControllerInstance.createUser.bind(userControllerInstance));
route.post('/verifyOtp', userControllerInstance.verifyOtp.bind(userControllerInstance));
route.post('/login', userControllerInstance.loginUser.bind(userControllerInstance));
route.post('/resendOtp', userControllerInstance.resendOtp.bind(userControllerInstance));
route.get('/getSpecializations', userControllerInstance.getSpecializations.bind(userControllerInstance));
route.get('/getDoctorsWithSpecialization/:specializationId', userControllerInstance.getDoctorsWithSpecialization.bind(userControllerInstance));
route.get('/getSlots', userControllerInstance.getDoctorSlots.bind(userControllerInstance));
route.put('/updateUser', userControllerInstance.updateUserProfile.bind(userControllerInstance));

// Update the updateProfileImage route to use the uploadUserFiles middleware
route.put('/updateProfileImage', uploadUserFiles, userControllerInstance.updateProfileImage.bind(userControllerInstance));
route.post('/checkSlotStatus', userControllerInstance.checkSlotStatus.bind(userControllerInstance));
route.post('/create-checkout-session', userControllerInstance.createCheckoutSession.bind(userControllerInstance));
route.post('/checkSessionStatus', userControllerInstance.confirmPayment.bind(userControllerInstance));
route.get('/doctordetails/:doctorId', userControllerInstance.getDoctorDetails.bind(userControllerInstance));

export default route;
