export type adminType={
   
    email:string;
    
    password:string;
   


}

export interface Admin {
    
  
    email: string;

    
  
  }
  
export interface AdminState {
    adminInfo: Admin | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
  }

  export interface MonthlyStats {
    users: number;         // Number of registered users in the month
    doctors: number;       // Number of registered doctors in the month
    revenue: number;       // Total revenue for the month
    totalFees: number;     // Total fees collected for completed appointments
    doctorRevenue: number; // Revenue credited to doctors
    adminRevenue: number;  // Revenue credited to admin
}