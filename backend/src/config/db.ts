import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()

const ConnectDB = async () => {
    try {
        console.log(process.env.MONGO_URL)
        await mongoose.connect(process.env.MONGO_URL as string );
        console.log("Database connected....");
        
    } catch (error) {
        console.log("Database  betrayed bro");
        
    }
}


export default ConnectDB;

