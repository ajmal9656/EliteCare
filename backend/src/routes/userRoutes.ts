import { Router } from "express";
import { userController } from "../controllers/userController";
import { userService } from "../services/userService";
import { userRepository } from "../repository/userRepository";
import multer from 'multer';
import { verifyToken } from "../config/jwtConfig";



const storage = multer.memoryStorage();


const upload = multer({ storage: storage });


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
route.get('/getDoctors', userControllerInstance.getDoctors.bind(userControllerInstance));
route.get('/getDoctorsWithSpecialization/:specializationId', userControllerInstance.getDoctorsWithSpecialization.bind(userControllerInstance));
route.get('/getSlots', userControllerInstance.getDoctorSlots.bind(userControllerInstance));
route.get('/getUserDetails/:userId', verifyToken('user'),userControllerInstance.getUserDetails.bind(userControllerInstance));
route.put('/updateUser',verifyToken('user'), userControllerInstance.updateUserProfile.bind(userControllerInstance));
route.put('/updateProfileImage',verifyToken('user'), uploadUserFiles, userControllerInstance.updateProfileImage.bind(userControllerInstance));
route.post('/checkSlotStatus',verifyToken('user'), userControllerInstance.checkSlotStatus.bind(userControllerInstance));
route.post('/create-checkout-session',verifyToken('user'), userControllerInstance.createCheckoutSession.bind(userControllerInstance));
route.post('/checkSessionStatus',verifyToken('user'), userControllerInstance.confirmPayment.bind(userControllerInstance));
route.get('/doctordetails/:doctorId', userControllerInstance.getDoctorDetails.bind(userControllerInstance));
route.get('/getAppointments/:userId',verifyToken('user'), userControllerInstance.getAllAppointments.bind(userControllerInstance));
route.put('/cancelAppointment/:appointmentId',verifyToken('user'), userControllerInstance.cancelAppointment.bind(userControllerInstance));
route.post('/addReview',verifyToken('user'), userControllerInstance.addReview.bind(userControllerInstance));
route.get('/getAppointment/:appointmentId',verifyToken('user'), userControllerInstance.getAppointment.bind(userControllerInstance));
route.post('/logout', userControllerInstance.logoutUser.bind(userControllerInstance));

export default route;

