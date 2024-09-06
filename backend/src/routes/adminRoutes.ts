import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { adminRepository } from "../repository/adminRepository";
import { adminService } from "../services/adminServices";




const route = Router()
const adminRepositoryInstance = new adminRepository
const adminServiceInstance = new adminService(adminRepositoryInstance)
const adminControllerInstance = new adminController(adminServiceInstance);



route.post('/login',adminControllerInstance.loginAdmin.bind(adminControllerInstance));
route.post('/addSpecialization',adminControllerInstance.addSpecialization.bind(adminControllerInstance));
route.get('/getSpecializations',adminControllerInstance.getSpecialization.bind(adminControllerInstance));
route.put('/updateSpecialization',adminControllerInstance.editSpecialization.bind(adminControllerInstance));
route.put('/listUnlistSpecialization',adminControllerInstance.listUnlistSpecialization.bind(adminControllerInstance));






export default route