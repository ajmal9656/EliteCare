import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { login, logoutUser, updateUserProfile,updateUserProfileImage } from "../Action/userActions";
import { User,UserState } from "../../interfaces/userInterface";



const initialState: UserState = {
    userInfo: null,
    accessToken: null,
    loading: false,
    error: null,
  };

const userSlice = createSlice({
    name:"User",
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        builder
        .addCase(login.pending,(state)=>{
            state.loading =true;
            state.error = null
            
        })
        .addCase(login.fulfilled,(state,action:PayloadAction<{ accessToken: string; userInfo: User }>)=>{
        const { accessToken, userInfo } = action.payload;
        state.userInfo = userInfo;
        state.accessToken = accessToken;  
        state.loading = false;

        localStorage.setItem('accessToken', accessToken);
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
            state.accessToken = null;
            state.loading = false;
    
            // Remove user info from localStorage
            localStorage.removeItem("userAccessToken");
            localStorage.removeItem("userInfo");
          })
          .addCase(logoutUser.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || "Logout failed";
          });
    }
})

export default userSlice.reducer