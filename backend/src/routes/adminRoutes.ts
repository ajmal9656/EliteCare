import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { adminRepository } from "../repository/adminRepository";
import { adminService } from "../services/adminServices";
import { S3Service } from "../config/s3client";
import { verifyAdminToken } from "../config/jwtConfig";




const route = Router()
const adminRepositoryInstance = new adminRepository;
const S3ServiceInstance = new S3Service();
const adminServiceInstance = new adminService(adminRepositoryInstance,S3ServiceInstance)
const adminControllerInstance = new adminController(adminServiceInstance);



route.post('/login',adminControllerInstance.loginAdmin.bind(adminControllerInstance));
route.post('/addSpecialization',adminControllerInstance.addSpecialization.bind(adminControllerInstance));
route.get('/getSpecializations',adminControllerInstance.getSpecialization.bind(adminControllerInstance));
route.put('/updateSpecialization',adminControllerInstance.editSpecialization.bind(adminControllerInstance));
route.put('/listUnlistSpecialization',adminControllerInstance.listUnlistSpecialization.bind(adminControllerInstance));
route.get('/getApplications',verifyAdminToken,adminControllerInstance.getApplication.bind(adminControllerInstance));
route.get('/getDoctorApplication/:applicationId',adminControllerInstance.getDoctorApplication.bind(adminControllerInstance));
route.post('/approveApplication/:doctorId',adminControllerInstance.approveApplication.bind(adminControllerInstance));
route.delete('/rejectApplication/:doctorId',adminControllerInstance.rejectApplication.bind(adminControllerInstance));
route.get('/getUsers',verifyAdminToken,adminControllerInstance.getUsers.bind(adminControllerInstance));
route.put('/listUnlistUser/:userId',adminControllerInstance.listUnlistUser.bind(adminControllerInstance));
route.get('/getDoctors',verifyAdminToken,adminControllerInstance.getDoctors.bind(adminControllerInstance));
route.put('/listUnlistDoctor/:doctorId',adminControllerInstance.listUnlistDoctor.bind(adminControllerInstance));
route.get('/dashboardData',verifyAdminToken,adminControllerInstance.getDashboardData.bind(adminControllerInstance));
route.post('/logout', adminControllerInstance.logoutAdmin.bind(adminControllerInstance));
route.get('/getAppointments',verifyAdminToken, adminControllerInstance.getAllAppointments.bind(adminControllerInstance));
route.get('/getTransactionsDetails',verifyAdminToken, adminControllerInstance.getAllTransactions.bind(adminControllerInstance));






export default route