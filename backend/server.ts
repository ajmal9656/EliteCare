import express, { NextFunction,RequestHandler,Request,Response } from 'express';
import dotenv from 'dotenv';
import ConnectDB from './src/config/db';
import cors from 'cors';
import userRoute from './src/routes/userRoutes';
import doctorRoute from './src/routes/doctorRoutes'
import chatRoute from './src/routes/chatRoutes'
import cookieParser from 'cookie-parser';
import adminRoute from './src/routes/adminRoutes'
import { createServer } from 'http';
import { configSocketIO } from './src/config/socket.ioConfig';
import "./src/helper/nodeCron"






dotenv.config();

ConnectDB();

const app = express();

const server = createServer(app);


configSocketIO(server);

app.use(cookieParser());

app.use(express.json());
// const corsOptions = {
//   origin: 'http://localhost:5173', // Allow this origin
//   optionsSuccessStatus: 200, // Response status for successful OPTIONS request
//   credentials: true, // Allow credentials (cookies, authorization headers, etc.)
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
// };







app.use(cors);

app.use('/', userRoute);
app.use('/doctor', doctorRoute);
app.use('/admin', adminRoute);
app.use('/chat', chatRoute);



const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
