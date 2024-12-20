import axiosUrl from "../utils/axios";


export const rejectApplication=(doctorId:string,reason:string)=>{
   
    
    return axiosUrl.delete(`/admin/rejectApplication/${doctorId}`, {
        data: { reason: reason },
      });
    
}
export const approveApplication=(doctorId:string)=>{
   
    
    return axiosUrl.post(`/admin/approveApplication/${doctorId}`);
    
}
export const getDoctorApplication=(applicationId:string)=>{
   
    
    return axiosUrl.get(`/admin/getDoctorApplication/${applicationId}`);
    
}
export const getApplications=(page:number)=>{
   
    
    return axiosUrl.get('/admin/getApplications',{
        params: { page, limit: 7  }
      });
    
}
export const getAppointments=(params:any)=>{
   
    
    return axiosUrl.get('/admin/getAppointments',{
        params
      });
    
}
export const getdashboardData=()=>{
   
    
    return axiosUrl.get("/admin/dashboardData");
    
}
export const getDoctors=(page:number,search:string)=>{
   
    
    return axiosUrl.get('/admin/getDoctors',{
        params: { page, limit: 7,search  }
      });
    
}
export const getUsers=(page:number,search:string)=>{
   
    
    return axiosUrl.get('/admin/getUsers',{
        params: { page, limit: 7 ,search }
      });
    
}
export const listUnlistDoctor=(id:string)=>{
   
    
    return axiosUrl.put(`/admin/listUnlistDoctor/${id}`);
    
}
export const listUnlistUser=(id:string)=>{
   
    
    return axiosUrl.put(`/admin/listUnlistUser/${id}`);
    
}
export const getSpecializations=(page:number)=>{
   
    
    return axiosUrl.get('/admin/getSpecializations',{
        params: { page, limit: 7  }
      });
    
}
export const getTransactionsDetails=(params:any)=>{
   
    
    return axiosUrl.get(`/admin/getTransactionsDetails`,{
        params
      });
    
}