import { Router } from "express";
import { S3Service } from "../config/s3client";
import { verifyToken } from "../config/jwtConfig";
import { AuthRepository } from "../repository/admin/Auth";
import { AuthService } from "../services/admin/Auth";
import { AuthController } from "../controllers/admin/Auth";
import { AdminRepository } from "../repository/admin/Admin";
import { AdminService } from "../services/admin/Admin";
import { AdminController } from "../controllers/admin/Admin";




const route = Router()
const AdminRepositoryInstance = new AdminRepository;
const S3ServiceInstance = new S3Service();
const AdminServiceInstance = new AdminService(AdminRepositoryInstance,S3ServiceInstance)
const AdminControllerInstance = new AdminController(AdminServiceInstance);


const AuthRepositoryInstance = new AuthRepository;
const AuthServiceInstance = new AuthService(AuthRepositoryInstance)
const AuthControllerInstance = new AuthController(AuthServiceInstance);



route.post('/login',AuthControllerInstance.loginAdmin.bind(AuthControllerInstance));
route.post('/logout', AuthControllerInstance.logoutAdmin.bind(AuthControllerInstance));

route.post('/addSpecialization',AdminControllerInstance.addSpecialization.bind(AdminControllerInstance));
route.get('/getSpecializations',AdminControllerInstance.getSpecialization.bind(AdminControllerInstance));
route.put('/updateSpecialization',AdminControllerInstance.editSpecialization.bind(AdminControllerInstance));
route.put('/listUnlistSpecialization',AdminControllerInstance.listUnlistSpecialization.bind(AdminControllerInstance));

route.get('/getApplications',verifyToken('admin'),AdminControllerInstance.getApplication.bind(AdminControllerInstance));
route.get('/getDoctorApplication/:applicationId',AdminControllerInstance.getDoctorApplication.bind(AdminControllerInstance));
route.post('/approveApplication/:doctorId',AdminControllerInstance.approveApplication.bind(AdminControllerInstance));
route.delete('/rejectApplication/:doctorId',AdminControllerInstance.rejectApplication.bind(AdminControllerInstance));

route.get('/getUsers',verifyToken('admin'),AdminControllerInstance.getUsers.bind(AdminControllerInstance));
route.put('/listUnlistUser/:userId',AdminControllerInstance.listUnlistUser.bind(AdminControllerInstance));

route.get('/getDoctors',verifyToken('admin'),AdminControllerInstance.getDoctors.bind(AdminControllerInstance));
route.put('/listUnlistDoctor/:doctorId',AdminControllerInstance.listUnlistDoctor.bind(AdminControllerInstance));

route.get('/dashboardData',verifyToken('admin'),AdminControllerInstance.getDashboardData.bind(AdminControllerInstance));
route.get('/getAppointments',verifyToken('admin'), AdminControllerInstance.getAllAppointments.bind(AdminControllerInstance));
route.get('/getTransactionsDetails',verifyToken('admin'), AdminControllerInstance.getAllTransactions.bind(AdminControllerInstance));






export default route