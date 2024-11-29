                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { login, logoutUser, updateUserProfile,updateUserProfileImage } from "../Action/userActions";
import { User,UserState } from "../../interfaces/userInterface";




const initialState: UserState = {
    userInfo: null,
    loading: false,
    error: null,
    showIncomingVideoCall:null,
    videoCall:null,
    showVideoCallUser: false,
    roomIdUser: null
  };

const userSlice = createSlice({
    name:"User",
    initialState,
    reducers:{

        setShowIncomingVideoCall: (state, action) => {
            // console.log('action is ',action)
            state.showIncomingVideoCall = action.payload
        },
        setVideoCall: (state, action) => {
            // console.log('action is ',action)
            state.videoCall = action.payload
        },
        setShowVideoCall: (state, action) => {
            state.showVideoCallUser = action.payload
            
        },
        setRoomId: (state, action) => {
            state.roomIdUser = action.payload
            
        },
        endCallUser: (state) => {
            state.videoCall = null
            state.showIncomingVideoCall = null
            localStorage.removeItem('IncomingVideoCall')
        }
        

    },
    extraReducers:(builder)=>{
        builder
        .addCase(login.pending,(state)=>{
            state.loading =true;
            state.error = null
            
        })
        .addCase(login.fulfilled,(state,action:PayloadAction<{  userInfo: User }>)=>{
        const {  userInfo } = action.payload;
        state.userInfo = userInfo;
          
        state.loading = false;

        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || 'Login failed';
        }).addCase(updateUserProfile.pending,(state)=>{
            state.loading =true;
            state.error = null
            
        })
        .addCase(updateUserProfile.fulfilled,(state,action:PayloadAction<{ userInfo: User }>)=>{
        const { userInfo } = action.payload;
        state.userInfo = userInfo;  
        state.loading = false;

        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        })
        .addCase(updateUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || 'Login failed';
        }).addCase(updateUserProfileImage.pending,(state)=>{
            state.loading =true;
            state.error = null
            
        })
        .addCase(updateUserProfileImage.fulfilled,(state,action:PayloadAction<{ userInfo: User }>)=>{
            console.log("aaa",action.payload)
        const { userInfo } = action.payload;
        state.userInfo = userInfo;  
        state.loading = false;

        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        })
        .addCase(updateUserProfileImage.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || 'Login failed';
        }).addCase(logoutUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(logoutUser.fulfilled, (state) => {
            // Reset the user state on logout
            state.userInfo = null;
            
            state.loading = false;
    
            
            localStorage.removeItem("userInfo");
          })
          .addCase(logoutUser.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || "Logout failed";
          });
    }
})

export const {setShowIncomingVideoCall,setVideoCall,setShowVideoCall,setRoomId,endCallUser} = userSlice.actions;
export default userSlice.reducer