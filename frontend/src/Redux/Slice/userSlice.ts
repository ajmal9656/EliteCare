import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { login } from "../Action/userActions";
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
          })

    }
})

export default userSlice.reducer