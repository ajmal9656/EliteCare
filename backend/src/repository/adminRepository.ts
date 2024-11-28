import mongoose,{ Document, UpdateWriteOpResult } from "mongoose";
import adminModel from "../model/adminModel";
import specializationModel from "../model/SpecializationModel";
import doctorApplicationModel from "../model/doctorApplicationModel";
import doctorModel from "../model/doctorModel";
import RejectDoctorModel from "../model/RejectDoctorSchema";
import userModel from "../model/userModel";
import appointmentModel from "../model/AppoinmentModel";
import { AdminDetails, Application, Doctor, GetApplication, getAppointments, GetDoctor, getSpecialization, getTransaction, GetUser, MonthlyDashboardStats, MonthlyStats, Specialization, User} from "../interface/adminInterface/adminInterface";
import { refund } from "../config/stripeConfig";





export class adminRepository {
   
    

    async adminCheck(email:string):Promise<AdminDetails>{
        try {
            
            const adminData = await adminModel.findOne({email:email})
            
            if(adminData){
                
                
                return adminData
            }
            throw new Error("Doctor Doesn't exist")
            
        
            

             
            
        } catch (error:any) {
            console.log("rep error")
            throw new Error(error.message)
        }
    }
    async createSpecialization(name:string,description:string):Promise<Specialization>{
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
    async getAllSpecialization(page: number, limit: number):Promise<getSpecialization> {
        try {
            // Calculate the skip value to implement pagination
            const skip = (page - 1) * limit;

            // Fetch paginated specializations from the model
            const specializations = await specializationModel.find()
                .skip(skip)  // Skip records for pagination
                .limit(limit)  // Limit the number of records
                .exec();

            // Fetch the total count of specializations (for pagination info)
            const totalCount = await specializationModel.countDocuments();

            // If no specializations are found, throw an error
            if (!specializations || specializations.length === 0) {
                
                throw new Error("No specializations found");
            }

            // Return the paginated result along with total count for pagination info
            
          
            return {
                specializations,
                totalCount,
                page,
                totalPages: Math.ceil(totalCount / limit),
            };
        } catch (error: any) {
            // Handle error and throw with a custom message
            console.error("Error getting specializations:", error.message);
            throw new Error("An error occurred while fetching specializations.");
        }
    }
    async updateSpecialization(id:number,name:string,description:string):Promise<UpdateWriteOpResult>{
        try {
            
            const updateSpecialization = await specializationModel.updateOne({_id:id},{name:name,description:description})
            
           
            
            
            return updateSpecialization
        } catch (error: any) {
            console.error("Error update specialization:", error.message);
            throw new Error(error.message);
        }
    }
    async changeSpecializationStatus(id: number):Promise<Specialization> {
        try {
            const specialization = await specializationModel.findOne({ _id: id });
            if (!specialization) {
                throw new Error("Specialization not found");
            }
    
            specialization.isListed = !specialization.isListed;
    
            const updatedSpecialization = await specialization.save();

           
           
    
            return updatedSpecialization;
        } catch (error: any) {
            console.error("Error updating specialization:", error.message);
            throw new Error(error.message);
        }
    }
    async getAllApplication(page: number, limit: number) :Promise<GetApplication>{
        try {
            const skip = (page - 1) * limit;
            
            // Fetch applications with pagination
            const applications = await doctorApplicationModel.find().populate("department")
                .skip(skip)
                .limit(limit);
    
            // Calculate total pages
            const totalApplications = await doctorApplicationModel.countDocuments();
            const totalPages = Math.ceil(totalApplications / limit);

            
    
            return { applications, totalPages };
        } catch (error: any) {
            console.error("Error getting applications:", error.message);
            throw new Error(error.message);
        }
    }
    
    async getApplication(doctorId:string):Promise<Application|null>{
        try {
            
            const application = await doctorApplicationModel.findById(doctorId).populate("department")


            
            
    
          
    
            
            return application
        } catch (error: any) {
            console.error("Error getting specialization:", error.message);
            throw new Error(error.message);
        }
    }
    async approveDoctorApplication(doctorId: string) :Promise<{status:boolean}>{
        try {
            
            const application = await doctorApplicationModel.findOne({ doctorId: doctorId });
            if (!application) {
                throw new Error("Doctor application not found");
            }
            
            
          
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
            
            
            
            
            await doctorApplicationModel.deleteOne({ doctorId: doctorId });
            
    
            return {status:true};
        } catch (error: any) {
            console.error("Error approving doctor application:", error.message);
            throw new Error(error.message);
        }
    }
    async rejectDoctorApplication(doctorId: string, reason: string):Promise<{ success: boolean }> {
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

    async getAllUsers(skip: number, limit: number,search:string):Promise<GetUser> {
        try {
            const searchFilter = search
        ? {
            name: { $regex: search, $options: 'i' }, // Case-insensitive search
          }
        : {};

        
        
            // Fetch users with pagination
            const users = await userModel.find({...searchFilter})
                .skip(skip)        // Skip the first 'skip' documents
                .limit(limit);     // Limit the result to 'limit' documents

            // Count the total number of users to calculate totalPages
            const totalCount = await userModel.countDocuments({...searchFilter});

            const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

            
            

          

            // Return users and totalPages
            return { users, totalPages };

        } catch (error: any) {
            console.error("Error in AdminRepository:", error.message);
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }
    async getAllDoctors(skip: number, limit: number,search:string):Promise<GetDoctor> {
        try {
            
            
            // Fetch the total count of doctors with approved kycStatus
            const searchFilter = search
        ? {
            name: { $regex: search, $options: 'i' }, // Case-insensitive search
          }
        : {};
            const totalCount = await doctorModel.countDocuments({ kycStatus: "approved",...searchFilter});
    
            // Fetch the doctors with the "approved" kycStatus and apply pagination
            const doctors = await doctorModel.find({ kycStatus: "approved" ,...searchFilter })
                .skip(skip)          // Skip the first 'skip' documents
                .limit(limit);       // Limit the result to 'limit' documents
    
            // Calculate total pages based on the total count and limit
            const totalPages = Math.ceil(totalCount / limit);
    
            console.log("doctor",doctors);
    
            // Return the doctors, total count, and total pages
            return { doctors, totalCount, totalPages };
        } catch (error: any) {
            console.error("Error getting doctors:", error.message);
            throw new Error(`Failed to fetch doctors: ${error.message}`);
        }
    }
    
    

    async changeUserStatus(id: string):Promise<User> {
        try {
            const user = await userModel.findOne({ _id: id });
            if (!user) {
                throw new Error("user not found");
            }
    
            user.isBlocked = !user.isBlocked;
    
            const updatedUser = await user.save();
            
    
            return updatedUser;
        } catch (error: any) {
            console.error("Error updating user:", error.message);
            throw new Error(error.message);
        }
    }
    async changeDoctorStatus(id: string):Promise<Doctor> {
        try {
            const doctor = await doctorModel.findOne({ _id: id });
            if (!doctor) {
                throw new Error("doctor not found");
            }
    
            doctor.isBlocked = !doctor.isBlocked;
    
            const updatedDoctor = await doctor.save();
           
    
            return updatedDoctor;
        } catch (error: any) {
            console.error("Error updating doctor:", error.message);
            throw new Error(error.message);
        }
    }
    async getAllStatistics():Promise<MonthlyDashboardStats> {
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

            
            console.log("userDoctorChartData",userDoctorChartData);
            
            
    
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

    async getAllAppointments(status: string, page: number, limit: number, startDate?: string, endDate?: string):Promise<getAppointments> {
        try {
          // Calculate the number of documents to skip based on the current page
          const skip = (page - 1) * limit;
      
          // Build the query based on the status and optional date range
          const query: any = {};
      
          // Filter by status if specified
          if (status && status !== "All") {
            query.status = status;
          }
      
          // Filter by startDate if specified
          if (startDate) {
            const startOfDay = new Date(startDate);
            startOfDay.setUTCHours(0, 0, 0, 0); // Start at 00:00:00 UTC
            query.start = { $gte: startOfDay }; // Filter appointments starting on or after startDate
          }
      
          // Filter by endDate if specified
          if (endDate) {
            const endOfDay = new Date(endDate);
            endOfDay.setUTCHours(23, 59, 59, 999); // End at 23:59:59.999 UTC
            query.end = { $lte: endOfDay }; // Filter appointments ending on or before endDate
          }
      
          // Fetch appointments from the database with pagination, status, and date filtering
          const appointments = await appointmentModel
            .find(query)
            .skip(skip)
            .limit(limit)
            .populate("docId")
            .lean();
      
          // Get the total number of appointments for pagination
          const totalAppointments = await appointmentModel.countDocuments(query);
      
          // Calculate total pages
          const totalPages = Math.ceil(totalAppointments / limit);

          console.log("appoiny",appointments);
          
      
          return {
            appointments,
            totalPages,
          };
        } catch (error: any) {
          console.error("Error getting appointments:", error.message);
          throw new Error(error.message);
        }
      }
      
      
      

      async getAllTransactions(
        status: string,
        page: number = 1,
        limit: number = 5,
        startDate?: string,
        endDate?: string
      ) :Promise<getTransaction>{
        try {
          let appointments: any[] = [];
          const skip = (page - 1) * limit;
      
          // Build the base query based on the status
          const query: any = {};
      
          if (status === "Credit") {
            // No status filter needed; fetching all documents
          } else if (status === "Paid") {
            query.status = "completed";
          } else if (status === "Refunded") {
            query.status = { $in: ["cancelled", "cancelled by Dr"] };
          }
      
          // Add date range filtering if both startDate and endDate are provided
          if (startDate && endDate) {
            const start = new Date(startDate);
            start.setUTCHours(0, 0, 0, 0); // Start at 00:00:00 UTC
            const end = new Date(endDate);
            end.setUTCHours(23, 59, 59, 999); // End at 23:59:59 UTC
      
            query.createdAt = { $gte: start, $lte: end }; // Assuming createdAt is the date field
          }
      
          // Fetch appointments with pagination and filters
          appointments = await appointmentModel
            .find(query)
            .populate("docId")
            .skip(skip)
            .limit(limit)
            .lean();
      
          // Get the total count of filtered documents for pagination
          const totalCount = await appointmentModel.countDocuments(query);
          const totalPages = Math.ceil(totalCount / limit);
      
          return { appointments, totalPages, currentPage: page };
        } catch (error: any) {
          console.error("Error getting appointments:", error.message);
          throw new Error(error.message);
        }
      }

      static async getPendingAppointments(yesterday: any, now: any): Promise<any> {
        try {
          // Fetch appointments from yesterday
          const appointments = await appointmentModel.find({
            date: { $gte: yesterday, $lt: now }, // Match yesterday's date                              
          });
      
          console.log("Appointments from yesterday:", appointments);
      
          
          for (const appointment of appointments) {
            if (appointment.paymentId) { // Ensure the appointment has a paymentId
              try {
                if(appointment.paymentStatus!=="refunded"){
                     // Process the refund
                const refundResponse = await refund(appointment.paymentId, "appointment not completed");
                
                // Update the appointment's payment status to "refunded"
                await appointmentModel.updateOne(
                  { _id: appointment._id },
                  { $set: { paymentStatus: "refunded" } }
                );

                }
               
      
                
              } catch (error: any) {
                console.error(
                  `Error processing refund for appointment ID ${appointment._id}:`,
                  error.message
                );
                
              }
            } else {
              console.warn(`No paymentId found for appointment ID ${appointment._id}`);
            }
          }
      
          
        } catch (error: any) {
          console.error("Error getting appointments:", error.message);
          throw new Error(error.message);
        }
      }
      
      
    
    
    
      
      
    
    
    
    
    
    
    
   
}
