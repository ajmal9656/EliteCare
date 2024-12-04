import { Router } from "express";
import multer from "multer";
import { S3Service } from "../config/s3client";
import { verifyToken } from "../config/jwtConfig";
import { AuthRepository } from "../repository/doctor/Auth";
import { AuthService } from "../services/doctor/Auth";
import { AuthController } from "../controllers/doctor/Auth";
import { SlotRepository } from "../repository/doctor/Slot";
import { SlotService } from "../services/doctor/Slot";
import { SlotController } from "../controllers/doctor/Slot";
import { AppointmentRepository } from "../repository/doctor/Appointment";
import { AppointmentService } from "../services/doctor/Appointment";
import { AppointmentController } from "../controllers/doctor/Appointment";
import { DoctorRepository } from "../repository/doctor/Doctor";
import { DoctorService } from "../services/doctor/Doctor";
import { DoctorController } from "../controllers/doctor/Doctor";


const storage = multer.memoryStorage();

const upload = multer({ storage: storage });


const uploadDoctorDataFiles = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'aadhaarFrontImage', maxCount: 1 },
  { name: 'aadhaarBackImage', maxCount: 1 },
  { name: 'certificateImage', maxCount: 1 },
  { name: 'qualificationImage', maxCount: 1 },
]);

const uploadUserFiles = upload.single('image');

const route = Router();
const DoctorRepositoryInstance = new DoctorRepository();
const S3ServiceInstance = new S3Service();
const DoctorServiceInstance = new DoctorService(DoctorRepositoryInstance,S3ServiceInstance);
const DoctorControllerInstance = new DoctorController(DoctorServiceInstance);


const AuthRepositoryInstance = new AuthRepository();
const AuthServiceInstance = new AuthService(AuthRepositoryInstance);
const AuthControllerInstance = new AuthController(AuthServiceInstance);

const SlotRepositoryInstance = new SlotRepository();
const SlotServiceInstance = new SlotService(SlotRepositoryInstance);
const SlotControllerInstance = new SlotController(SlotServiceInstance);

const AppointmentRepositoryInstance = new AppointmentRepository();
const AppointmentServiceInstance = new AppointmentService(AppointmentRepositoryInstance);
const AppointmentControllerInstance = new AppointmentController(AppointmentServiceInstance);


route.post('/signUp', AuthControllerInstance.createDoctor.bind(AuthControllerInstance));
route.post('/verifyOtp', AuthControllerInstance.verifyOtp.bind(AuthControllerInstance));
route.post('/resendOtp', AuthControllerInstance.resendOtp.bind(AuthControllerInstance));
route.post('/login', AuthControllerInstance.loginDoctor.bind(AuthControllerInstance));
route.post('/logout', AuthControllerInstance.logoutDoctor.bind(AuthControllerInstance));


route.post('/createSlot',verifyToken('doctor'), SlotControllerInstance.createTimeSlot.bind(SlotControllerInstance));
route.get('/getSlots',verifyToken('doctor'), SlotControllerInstance.getTimeSlot.bind(SlotControllerInstance));
route.post('/checkSlotAvailability',verifyToken('doctor'), SlotControllerInstance.checkSlotAvailability.bind(SlotControllerInstance));
route.delete('/deleteSlot',verifyToken('doctor'), SlotControllerInstance.deleteSlot.bind(SlotControllerInstance));


route.get('/getAppointments/:doctorId',verifyToken('doctor'), AppointmentControllerInstance.getAllAppointments.bind(AppointmentControllerInstance));
route.put('/cancelAppointment',verifyToken('doctor'), AppointmentControllerInstance.cancelAppointment.bind(AppointmentControllerInstance));
route.put('/addPrescription',verifyToken('doctor'), AppointmentControllerInstance.addPrescription.bind(AppointmentControllerInstance));
route.get('/getMedical-records/:userId',AppointmentControllerInstance.getMedicalRecords.bind(AppointmentControllerInstance));

route.post('/uploadDoctorData',verifyToken('doctor'), uploadDoctorDataFiles, DoctorControllerInstance.uploadDoctorData.bind(DoctorControllerInstance));
route.get('/getWallet/:doctorId',verifyToken('doctor'), DoctorControllerInstance.getWallet.bind(DoctorControllerInstance));
route.post('/withdraw/:doctorId',verifyToken('doctor'), DoctorControllerInstance.withdraw.bind(DoctorControllerInstance));
route.get('/getDoctorDetails/:doctorId',verifyToken('doctor'), DoctorControllerInstance.getDoctorDetails.bind(DoctorControllerInstance));
route.put('/updateDoctor',verifyToken('doctor'), DoctorControllerInstance.updateDoctorProfile.bind(DoctorControllerInstance));
route.get('/dashboardData',verifyToken('doctor'),DoctorControllerInstance.getDashboardData.bind(DoctorControllerInstance));
route.put('/updateProfileImage',verifyToken('doctor'), uploadUserFiles, DoctorControllerInstance.updateProfileImage.bind(DoctorControllerInstance));
route.get('/getDoctorData/:email',DoctorControllerInstance.getDoctorData.bind(DoctorControllerInstance));

export default route;
