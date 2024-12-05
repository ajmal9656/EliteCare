import cron from 'node-cron'


import { AdminRepository } from '../repository/admin/Admin';


const AdminRepositoryInstance = new AdminRepository()

// Schedule a cron job to run every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    // Calculate yesterday's date
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const response = await AdminRepository.getPendingAppointments(yesterday,now)

    

    
    // Add your logic to process the appointments here
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }
});

