import { Document,model, Schema } from "mongoose"


interface Iadmin extends Document{
   email: string;
   password: string;
  
   

}

const adminSchema = new Schema<Iadmin>({
    
      email: { 
        type: String, 
        required: true, 
      },
      password: {
         type: String, 
         required: true 
      }
      
})

const adminModel = model<Iadmin>("Admin", adminSchema);
 
export default adminModel;