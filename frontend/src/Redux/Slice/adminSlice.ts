import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { Admin,AdminState } from "../../interfaces/adminInterface";
import { login } from "../Action/adminActions";


const initialState:AdminState = {
    adminInfo:null,
    error:null,
    loading:false


}

const adminSlice = createSlice({
    name:"Admin",
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        builder
        .addCase(login.pending,(state)=>{
            state.loading =true;
            state.error = null
            
        })
        .addCase(login.fulfilled,(state,action:PayloadAction<{ adminInfo: Admin }>)=>{
        const { adminInfo } = action.payload;
        state.adminInfo = adminInfo;  
        state.loading = false;

        
        localStorage.setItem('adminInfo', JSON.stringify(adminInfo));

        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || 'Login failed';
          })

    }
})

export default adminSlice.reducer
