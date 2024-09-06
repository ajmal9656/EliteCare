import { Document,model, Schema } from "mongoose"


interface Ispecialization extends Document{
   name: string;
   description: string;
   createdAt: Date; 
   isListed: boolean;
   

}

const specializationSchema = new Schema<Ispecialization>({
    
      
      name: { 
        type: String,
        required: true 
      },
      description: { 
        type: String, 
        required: true, 
      },
      createdAt: {
         type: Date, 
         default: Date.now 
      },
      isListed: {
         type: Boolean, 
         default: true 
      },
      
})

const specializationModel = model<Ispecialization>("Specialization", specializationSchema);
 
export default specializationModel;