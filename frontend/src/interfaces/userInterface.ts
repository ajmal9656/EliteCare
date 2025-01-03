interface UserImage {
  url: string;
  type: string;
}
export interface User {
  _id:string;
    userId: string;
    name: string;
    phone : string;
    email: string;
    isBlocked: boolean;
    address:string|null;
    DOB:Date|null;
    image:UserImage
    
  
  }
export interface UserDetails {
    _id:string
    userId: string;
    name: string;
    phone : string;
    email: string;
    isBlocked: boolean;
    
  
  }
  
export interface UserState {
    userInfo: User | null;
   
    loading: boolean;
    error: string | null;
    showIncomingVideoCall:any,
    videoCall:any,
    showVideoCallUser: Boolean;
    roomIdUser: string | null;
  }

 export interface UpdateUserProfilePayload {
    _id: string;
    name: string;
    dob: Date; // Adjust this if you want to handle a Date object
    address: string;
  }

