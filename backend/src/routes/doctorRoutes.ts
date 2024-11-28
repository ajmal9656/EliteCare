import { Router } from "express";
import multer from "multer";
import { doctorController } from "../controllers/doctorController";
import { doctorRepository } from "../repository/doctorRepository";
import { doctorService } from "../services/doctorService";
import { S3Service } from "../config/s3client";
import { verifyDoctorToken } from "../config/jwtConfig";


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
const doctorRepositoryInstance = new doctorRepository();
const S3ServiceInstance = new S3Service();
const doctorServiceInstance = new doctorService(doctorRepositoryInstance,S3ServiceInstance);
const doctorControllerInstance = new doctorController(doctorServiceInstance);

// Routes
route.post('/signUp', doctorControllerInstance.createDoctor.bind(doctorControllerInstance));
route.post('/verifyOtp', doctorControllerInstance.verifyOtp.bind(doctorControllerInstance));
route.post('/resendOtp', doctorControllerInstance.resendOtp.bind(doctorControllerInstance));
route.post('/login', doctorControllerInstance.loginDoctor.bind(doctorControllerInstance));
route.post('/uploadDoctorData',verifyDoctorToken, uploadDoctorDataFiles, doctorControllerInstance.uploadDoctorData.bind(doctorControllerInstance));
route.post('/createSlot',verifyDoctorToken, doctorControllerInstance.createTimeSlot.bind(doctorControllerInstance));
route.get('/getSlots',verifyDoctorToken, doctorControllerInstance.getTimeSlot.bind(doctorControllerInstance));
route.post('/checkSlotAvailability',verifyDoctorToken, doctorControllerInstance.checkSlotAvailability.bind(doctorControllerInstance));
route.delete('/deleteSlot',verifyDoctorToken, doctorControllerInstance.deleteSlot.bind(doctorControllerInstance));
route.get('/getAppointments/:doctorId',verifyDoctorToken, doctorControllerInstance.getAllAppointments.bind(doctorControllerInstance));
route.put('/cancelAppointment',verifyDoctorToken, doctorControllerInstance.cancelAppointment.bind(doctorControllerInstance));
route.put('/addPrescription',verifyDoctorToken, doctorControllerInstance.addPrescription.bind(doctorControllerInstance));
route.get('/getWallet/:doctorId',verifyDoctorToken, doctorControllerInstance.getWallet.bind(doctorControllerInstance));
route.post('/withdraw/:doctorId',verifyDoctorToken, doctorControllerInstance.withdraw.bind(doctorControllerInstance));
route.post('/logout', doctorControllerInstance.logoutDoctor.bind(doctorControllerInstance));
route.get('/getDoctorDetails/:doctorId',verifyDoctorToken, doctorControllerInstance.getDoctorDetails.bind(doctorControllerInstance));
route.put('/updateDoctor',verifyDoctorToken, doctorControllerInstance.updateDoctorProfile.bind(doctorControllerInstance));
route.get('/dashboardData',verifyDoctorToken,doctorControllerInstance.getDashboardData.bind(doctorControllerInstance));
route.put('/updateProfileImage',verifyDoctorToken, uploadUserFiles, doctorControllerInstance.updateProfileImage.bind(doctorControllerInstance));
route.get('/getMedical-records/:userId',doctorControllerInstance.getMedicalRecords.bind(doctorControllerInstance));
route.get('/getDoctorData/:email',doctorControllerInstance.getDoctorData.bind(doctorControllerInstance));

export default route;
