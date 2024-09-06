export interface User {
    userId: string;
    name: string;
    phone : string;
    email: string;
    isBlocked: boolean;
    
  
  }
  
export interface UserState {
    userInfo: User | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
  }

