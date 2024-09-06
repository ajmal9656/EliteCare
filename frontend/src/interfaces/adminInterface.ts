export interface Admin {
    
    email: string;
    
    
  
  }
  
export interface AdminState {
    adminInfo: Admin | null;
    loading: boolean;
    error: string | null;
  }


  
