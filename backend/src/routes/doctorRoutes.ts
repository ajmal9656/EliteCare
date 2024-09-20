import { Router } from "express";
import multer from "multer";
import { doctorController } from "../controllers/doctorController";
import { doctorRepository } from "../repository/doctorRepository";
import { doctorService } from "../services/doctorService";
import { S3Service } from "../config/s3client";

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// Define the middleware for handling file uploads
const uploadDoctorDataFiles = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'aadhaarFrontImage', maxCount: 1 },
  { name: 'aadhaarBackImage', maxCount: 1 },
  { name: 'certificateImage', maxCount: 1 },
  { name: 'qualificationImage', maxCount: 1 },
]);

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
route.post('/uploadDoctorData', uploadDoctorDataFiles, doctorControllerInstance.uploadDoctorData.bind(doctorControllerInstance));
route.post('/createSlot', doctorControllerInstance.createTimeSlot.bind(doctorControllerInstance));
route.get('/getSlots', doctorControllerInstance.getTimeSlot.bind(doctorControllerInstance));
route.post('/checkSlotAvailability', doctorControllerInstance.checkSlotAvailability.bind(doctorControllerInstance));
route.delete('/deleteSlot', doctorControllerInstance.deleteSlot.bind(doctorControllerInstance));

export default route;
