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
            const totalDoctors = await doctorModel.countDocuments();
            const totalUsers = await userModel.countDocuments();
            const activeUsers = await userModel.countDocuments({ isBlocked: false });
            const activeDoctors = await doctorModel.countDocuments({ isBlocked: false });
    
            const revenueData = await appointmentModel.aggregate([
                { $match: { status: "completed" } },
                {
                    $group: {
                        _id: null,
                        totalFees: { $sum: "$fees" },
                        doctorRevenue: { $sum: { $multiply: ["$fees", 0.9] } },
                        adminRevenue: { $sum: { $multiply: ["$fees", 0.1] } }
                    }
                }
            ]);
    
            const totalFees = revenueData.length > 0 ? revenueData[0].totalFees : 0;
            const doctorRevenue = revenueData.length > 0 ? revenueData[0].doctorRevenue : 0;
            const adminRevenue = revenueData.length > 0 ? revenueData[0].adminRevenue : 0;
    
            // Get current date and calculate the start date (12 months ago)
            const currentDate = new Date();
            const startDate = new Date();
            startDate.setMonth(currentDate.getMonth() - 12); // 12 months ago
    
            const usersAndDoctorsRegistrationData = await Promise.all([
                userModel.aggregate([
                    { $match: { createdAt: { $gte: startDate } } }, // Filter by createdAt date
                    {
                        $group: {
                            _id: {
                                year: { $year: "$createdAt" },  // Separate year and month
                                month: { $month: "$createdAt" } // Separate month
                            },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1 } }
                ]),
                doctorModel.aggregate([
                    { $match: { createdAt: { $gte: startDate } } }, // Filter by createdAt date
                    {
                        $group: {
                            _id: {
                                year: { $year: "$createdAt" },  // Separate year and month
                                month: { $month: "$createdAt" } // Separate month
                            },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1 } }
                ])
            ]);
    
            // Create a map to hold the monthly statistics
            const monthlyStatistics: { [key: string]: MonthlyStats } = {};
    
            // Initialize each month with zero values for the last 12 months
            for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
                const monthDate = new Date();
                monthDate.setMonth(currentDate.getMonth() - monthOffset);
                const year = monthDate.getFullYear();
                const month = monthDate.getMonth() + 1; // Months are 0-indexed
                const key = `${year}-${month < 10 ? '0' : ''}${month}`; // Format as YYYY-MM
    
                monthlyStatistics[key] = {
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
                const key = `${userData._id.year}-${userData._id.month < 10 ? '0' : ''}${userData._id.month}`;
                if (monthlyStatistics[key]) {
                    monthlyStatistics[key].users = userData.count;
                }
            });
    
            // Fill in registration data for doctors
            usersAndDoctorsRegistrationData[1].forEach(doctorData => {
                const key = `${doctorData._id.year}-${doctorData._id.month < 10 ? '0' : ''}${doctorData._id.month}`;
                if (monthlyStatistics[key]) {
                    monthlyStatistics[key].doctors = doctorData.count;
                }
            });
    
            // Revenue by month for completed appointments
            const revenueByMonth = await appointmentModel.aggregate([
                { $match: { status: "completed", date: { $gte: startDate } } }, // Filter by date
                {
                    $group: {
                        _id: {
                            year: { $year: "$date" },   // Separate year and month
                            month: { $month: "$date" }  // Separate month
                        },
                        totalFees: { $sum: "$fees" },
                        doctorRevenue: { $sum: { $multiply: ["$fees", 0.9] } },
                        adminRevenue: { $sum: { $multiply: ["$fees", 0.1] } }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]);
    
            // Update monthly statistics with revenue data
            revenueByMonth.forEach(revenueData => {
                const key = `${revenueData._id.year}-${revenueData._id.month < 10 ? '0' : ''}${revenueData._id.month}`;
                if (monthlyStatistics[key]) {
                    monthlyStatistics[key].revenue = revenueData.totalFees;
                    monthlyStatistics[key].totalFees = revenueData.totalFees;
                    monthlyStatistics[key].doctorRevenue = revenueData.doctorRevenue;
                    monthlyStatistics[key].adminRevenue = revenueData.adminRevenue;
                }
            });
    
            // Convert the object into an array for easier use in charts
            const userDoctorChartData = Object.keys(monthlyStatistics).map(key => {
                const [year, month] = key.split('-');
                return {
                    year: parseInt(year, 10),
                    month: parseInt(month, 10),
                    users: monthlyStatistics[key].users,
                    doctors: monthlyStatistics[key].doctors,
                    revenue: monthlyStatistics[key].revenue,
                    totalFees: monthlyStatistics[key].totalFees,
                    doctorRevenue: monthlyStatistics[key].doctorRevenue,
                    adminRevenue: monthlyStatistics[key].adminRevenue,
                };
            });
    
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

    async getAllAppointments(status:string) {
        try {
          
          
        
      
          
         
            
            let appointments = [];
    
        
            if (status === "All") {
              appointments = await appointmentModel.find().populate("docId").lean();
            } else {
              
              appointments = await appointmentModel.find({status: status }).populate("docId").lean();
            }
          
      
          
          
          
          return appointments;
        } catch (error: any) {
          console.error("Error getting appointments:", error.message);
          throw new Error(error.message);
        }
      }
    
    
    
      
      
    
    
    
    
    
    
    
   
}
