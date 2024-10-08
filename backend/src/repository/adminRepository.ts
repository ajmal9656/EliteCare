import mongoose,{ Document } from "mongoose";
import adminModel from "../model/adminModel";
import { Console } from "console";
import specializationModel from "../model/SpecializationModel";
import doctorApplicationModel from "../model/doctorApplicationModel";
import doctorModel from "../model/doctorModel";
import RejectDoctorModel from "../model/RejectDoctorSchema";
import userModel from "../model/userModel";
import appointmentModel from "../model/AppoinmentModel";
import { MonthlyStats } from "../interface/adminInterface/adminInterface";



export class adminRepository {
    

    async adminCheck(email:string){
        try {
            console.log("login adminrep");
            const adminData = await adminModel.findOne({email:email})
            console.log(adminData)
            if(adminData){
                return adminData
            }
            throw new Error("Doctor Doesn't exist")
            
        
            

             
            
        } catch (error:any) {
            console.log("rep error")
            throw new Error(error.message)
        }
    }
    async createSpecialization(name:string,description:string){
        try {
          
            const newSpecialization = new specializationModel({
                name,
                description,
            });
    
          
            const savedSpecialization = await newSpecialization.save();
    
            return savedSpecialization;
        } catch (error: any) {
            console.error("Error creating specialization:", error.message);
            throw new Error(error.message);
        }
    }
    async getAllSpecialization(){
        try {
            
            const specializations = await specializationModel.find()
    
           
    
            
            return specializations
        } catch (error: any) {
            console.error("Error getting specialization:", error.message);
            throw new Error(error.message);
        }
    }
    async updateSpecialization(id:number,name:string,description:string){
        try {
            
            const specializations = await specializationModel.updateOne({_id:id},{name:name,description:description})
            console.log("qq",specializations)
           
    
            
            return specializations
        } catch (error: any) {
            console.error("Error update specialization:", error.message);
            throw new Error(error.message);
        }
    }
    async changeSpecializationStatus(id: number) {
        try {
            const specialization = await specializationModel.findOne({ _id: id });
            if (!specialization) {
                throw new Error("Specialization not found");
            }
    
            specialization.isListed = !specialization.isListed;
    
            const updatedSpecialization = await specialization.save();
            console.log("Updated Specialization:", updatedSpecialization);
    
            return updatedSpecialization;
        } catch (error: any) {
            console.error("Error updating specialization:", error.message);
            throw new Error(error.message);
        }
    }
    async getAllApplication(){
        try {
            
            const applications = await doctorApplicationModel.find()
    
           
    
            
            return applications
        } catch (error: any) {
            console.error("Error getting specialization:", error.message);
            throw new Error(error.message);
        }
    }
    async getApplication(doctorId:string){
        try {
            
            const application = await doctorApplicationModel.findById(doctorId).populate("department")
    
           console.log("pppp",application)
    
            
            return application
        } catch (error: any) {
            console.error("Error getting specialization:", error.message);
            throw new Error(error.message);
        }
    }
    async approveDoctorApplication(doctorId: string) {
        try {
            
            const application = await doctorApplicationModel.findOne({ doctorId: doctorId });
            if (!application) {
                throw new Error("Doctor application not found");
            }
            
            console.log("Doctor application:", application);
            
          
            const updatedDoctor = await doctorModel.findByIdAndUpdate(
                doctorId,
                {
                    name: application.name,
                    DOB: application.DOB,
                    department: application.department,
                    gender: application.gender,
                    image: application.image,
                    fees: application.fees,
                    kycDetails: application.kycDetails,
                    kycStatus: "approved", 
                },
                { new: true } 
            );
    
            if (!updatedDoctor) {
                throw new Error("Doctor not found");
            }
            
            console.log("Updated doctor details:", updatedDoctor);
            
            
            await doctorApplicationModel.deleteOne({ doctorId: doctorId });
            console.log("Doctor application deleted");
    
            return {status:true};
        } catch (error: any) {
            console.error("Error approving doctor application:", error.message);
            throw new Error(error.message);
        }
    }
    async rejectDoctorApplication(doctorId: string, reason: string) {
        try {
            
            const rejectEntry = new RejectDoctorModel({
                doctorId: new mongoose.Types.ObjectId(doctorId), 
                reason,
            });
    
            
            await rejectEntry.save();
            const doctorUpdation = await doctorModel.findByIdAndUpdate(doctorId,{kycStatus:"rejected"})

            await doctorApplicationModel.deleteOne({ doctorId: doctorId });
    
            
            return { success: true };
    
        } catch (error: any) {
            console.error("Error rejecting doctor application:", error.message);
            throw new Error("An error occurred while rejecting the doctor application.");
        }
    }

    async getAllUsers(){
        try {
            
            const users = await userModel.find();
            console.log("users",users);
            
    
           
    
            
            return users
        } catch (error: any) {
            console.error("Error getting users:", error.message);
            throw new Error(error.message);
        }
    }
    async getAllDoctors(){
        try {
            
            const doctors = await doctorModel.find({kycStatus:"approved"});
            console.log("doctors",doctors);
            
    
           
    
            
            return doctors
        } catch (error: any) {
            console.error("Error getting doctors:", error.message);
            throw new Error(error.message);
        }
    }

    async changeUserStatus(id: string) {
        try {
            const user = await userModel.findOne({ _id: id });
            if (!user) {
                throw new Error("user not found");
            }
    
            user.isBlocked = !user.isBlocked;
    
            const updatedUser = await user.save();
            console.log("Updated user:", updatedUser);
    
            return updatedUser;
        } catch (error: any) {
            console.error("Error updating user:", error.message);
            throw new Error(error.message);
        }
    }
    async changeDoctorStatus(id: string) {
        try {
            const doctor = await doctorModel.findOne({ _id: id });
            if (!doctor) {
                throw new Error("doctor not found");
            }
    
            doctor.isBlocked = !doctor.isBlocked;
    
            const updatedDoctor = await doctor.save();
            console.log("Updated doctor:", updatedDoctor);
    
            return updatedDoctor;
        } catch (error: any) {
            console.error("Error updating doctor:", error.message);
            throw new Error(error.message);
        }
    }
    async getAllStatistics() {
        try {
            // Fetch the count of total doctors
            const totalDoctors = await doctorModel.countDocuments();
        
            // Fetch the count of total users
            const totalUsers = await userModel.countDocuments();
        
            // Count active users (unblocked users)
            const activeUsers = await userModel.countDocuments({ isBlocked: false });
        
            // Count active doctors (unblocked doctors)
            const activeDoctors = await doctorModel.countDocuments({ isBlocked: false });
        
            // Sum of fees for completed appointments, calculating revenue split (90% to doctor, 10% to admin)
            const revenueData = await appointmentModel.aggregate([
                { $match: { status: "completed" } },  // Only consider completed appointments
                { 
                    $group: { 
                        _id: null,  // No grouping by fields, just sum total
                        totalFees: { $sum: "$fees" },  // Total fees
                        doctorRevenue: { $sum: { $multiply: ["$fees", 0.9] } },  // 90% to doctors
                        adminRevenue: { $sum: { $multiply: ["$fees", 0.1] } }  // 10% to admin
                    }
                }
            ]);
        
            // Extract the total revenue or default to 0 if no completed appointments
            const totalFees = revenueData.length > 0 ? revenueData[0].totalFees : 0;
            const doctorRevenue = revenueData.length > 0 ? revenueData[0].doctorRevenue : 0;
            const adminRevenue = revenueData.length > 0 ? revenueData[0].adminRevenue : 0;
    
            // Fetch registration data for users and doctors for the second chart
            const usersAndDoctorsRegistrationData = await Promise.all([
                userModel.aggregate([
                    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },  // Group by month and count users
                    { $sort: { "_id": 1 } }  // Sort by month
                ]),
                doctorModel.aggregate([
                    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },  // Group by month and count doctors
                    { $sort: { "_id": 1 } }  // Sort by month
                ])
            ]);
        
            // Create a map to hold the monthly statistics
            const monthlyStatistics: { [key: number]: MonthlyStats } = {}; // Use the defined interface here
        
            // Initialize each month with zero values
            for (let month = 1; month <= 12; month++) {
                monthlyStatistics[month] = {
                    users: 0,
                    doctors: 0,
                    revenue: 0,
                    totalFees: 0,
                    doctorRevenue: 0,
                    adminRevenue: 0,
                };
            }
    
            // Fill in registration data for users
            usersAndDoctorsRegistrationData[0].forEach(userData => {
                monthlyStatistics[userData._id].users = userData.count;
            });
        
            // Fill in registration data for doctors
            usersAndDoctorsRegistrationData[1].forEach(doctorData => {
                monthlyStatistics[doctorData._id].doctors = doctorData.count;
            });
        
            // Fill in revenue data for completed appointments
            const revenueByMonth = await appointmentModel.aggregate([
                { $match: { status: "completed" } },  // Only consider completed appointments
                { 
                    $group: { 
                        _id: { $month: "$date" },  // Group by month of the appointment date
                        totalFees: { $sum: "$fees" },  // Total fees
                        doctorRevenue: { $sum: { $multiply: ["$fees", 0.9] } },  // 90% to doctors
                        adminRevenue: { $sum: { $multiply: ["$fees", 0.1] } }  // 10% to admin
                    }
                },
                { $sort: { "_id": 1 } }  // Sort by month
            ]);
    
            // Update monthly statistics with revenue data
            revenueByMonth.forEach(revenueData => {
                monthlyStatistics[revenueData._id].revenue = revenueData.totalFees;
                monthlyStatistics[revenueData._id].totalFees = revenueData.totalFees;
                monthlyStatistics[revenueData._id].doctorRevenue = revenueData.doctorRevenue;
                monthlyStatistics[revenueData._id].adminRevenue = revenueData.adminRevenue;
            });
        
            // Convert the object into an array for easier use in charts
            const userDoctorChartData = Object.keys(monthlyStatistics).map(month => ({
                month: parseInt(month, 10), // Convert month from string to number
                users: monthlyStatistics[parseInt(month, 10)].users,
                doctors: monthlyStatistics[parseInt(month, 10)].doctors,
                revenue: monthlyStatistics[parseInt(month, 10)].revenue,
                totalFees: monthlyStatistics[parseInt(month, 10)].totalFees,
                doctorRevenue: monthlyStatistics[parseInt(month, 10)].doctorRevenue,
                adminRevenue: monthlyStatistics[parseInt(month, 10)].adminRevenue,
            }));
    
            // Return the object with all the statistics and chart data
            return {
                totalDoctors,
                totalUsers,
                activeDoctors,
                activeUsers,
                totalRevenue: totalFees,
                doctorRevenue,  // Revenue credited to doctors
                adminRevenue,   // Revenue credited to admin
                userDoctorChartData  // Data for the user/doctor registration chart
            };
        
        } catch (error: any) {
            console.error("Error fetching statistics:", error.message);
            throw new Error(error.message);
        }
    }
    
      
      
    
    
    
    
    
    
    
   
}
