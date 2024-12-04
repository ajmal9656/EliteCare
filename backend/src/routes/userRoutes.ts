import { Router } from "express";
import multer from 'multer';
import { verifyToken } from "../config/jwtConfig";
import { AuthRepository } from "../repository/user/Auth";
import { AuthService } from "../services/user/Auth";
import { AuthController } from "../controllers/user/Auth";
import { UserRepository } from "../repository/user/User";
import { UserService } from "../services/user/User";
import { UserController } from "../controllers/user/User";
import { AppointmentRepository } from "../repository/user/Appointment";
import { AppointmentService } from "../services/user/Appointment";
import { AppointmentController } from "../controllers/user/Appointment";
import { BookingRepository } from "../repository/user/Booking";
import { BookingService } from "../services/user/Booking";
import { BookingController } from "../controllers/user/Booking";



const storage = multer.memoryStorage();


const upload = multer({ storage: storage });


const uploadUserFiles = upload.single('image');

const route = Router();

const AuthRepositoryInstance = new AuthRepository();
const AuthServiceInstance = new AuthService(AuthRepositoryInstance);
const AuthControllerInstance = new AuthController(AuthServiceInstance);

const UserRepositoryInstance = new UserRepository();
const UserServiceInstance = new UserService(UserRepositoryInstance);
const UserControllerInstance = new UserController(UserServiceInstance);

const AppointmentRepositoryInstance = new AppointmentRepository();
const AppointmentServiceInstance = new AppointmentService(AppointmentRepositoryInstance);
const AppointmentControllerInstance = new AppointmentController(AppointmentServiceInstance);

const BookingRepositoryInstance = new BookingRepository();
const BookingServiceInstance = new BookingService(BookingRepositoryInstance);
const BookingControllerInstance = new BookingController(BookingServiceInstance);





route.post('/signUp', AuthControllerInstance.createUser.bind(AuthControllerInstance));
route.post('/verifyOtp', AuthControllerInstance.verifyOtp.bind(AuthControllerInstance));
route.post('/login', AuthControllerInstance.loginUser.bind(AuthControllerInstance));
route.post('/resendOtp', AuthControllerInstance.resendOtp.bind(AuthControllerInstance));
route.post('/logout', AuthControllerInstance.logoutUser.bind(AuthControllerInstance));


route.get('/getSpecializations', UserControllerInstance.getSpecializations.bind(UserControllerInstance));
route.get('/getDoctors', UserControllerInstance.getDoctors.bind(UserControllerInstance));
route.get('/getDoctorsWithSpecialization/:specializationId', UserControllerInstance.getDoctorsWithSpecialization.bind(UserControllerInstance));
route.get('/getSlots', UserControllerInstance.getDoctorSlots.bind(UserControllerInstance));
route.get('/getUserDetails/:userId', verifyToken('user'),UserControllerInstance.getUserDetails.bind(UserControllerInstance));
route.put('/updateUser',verifyToken('user'), UserControllerInstance.updateUserProfile.bind(UserControllerInstance));
route.put('/updateProfileImage',verifyToken('user'), uploadUserFiles, UserControllerInstance.updateProfileImage.bind(UserControllerInstance));
route.get('/doctordetails/:doctorId', UserControllerInstance.getDoctorDetails.bind(UserControllerInstance));


route.post('/checkSlotStatus',verifyToken('user'), AppointmentControllerInstance.checkSlotStatus.bind(AppointmentControllerInstance));
route.get('/getAppointments/:userId',verifyToken('user'), AppointmentControllerInstance.getAllAppointments.bind(AppointmentControllerInstance));
route.put('/cancelAppointment/:appointmentId',verifyToken('user'), AppointmentControllerInstance.cancelAppointment.bind(AppointmentControllerInstance));
route.post('/addReview',verifyToken('user'), AppointmentControllerInstance.addReview.bind(AppointmentControllerInstance));
route.get('/getAppointment/:appointmentId',verifyToken('user'), AppointmentControllerInstance.getAppointment.bind(AppointmentControllerInstance));


route.post('/create-checkout-session',verifyToken('user'), BookingControllerInstance.createCheckoutSession.bind(BookingControllerInstance));
route.post('/checkSessionStatus',verifyToken('user'), BookingControllerInstance.confirmPayment.bind(BookingControllerInstance));

export default route;

