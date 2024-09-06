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