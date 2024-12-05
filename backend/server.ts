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
import "./src/helper/refundNodeCron"
import morgan from 'morgan';
import * as rfs from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';



 


dotenv.config();

ConnectDB();

const app = express();

const server = createServer(app);


configSocketIO(server);

app.use(cookieParser());

const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const errorLogStream = rfs.createStream('error.log', {
  interval: '1d',     
  path: logDirectory,
  maxFiles: 7,        
});



app.use(
  morgan('combined', {
    stream: errorLogStream,
    skip: (req: Request, res: Response) => res.statusCode < 400, 
  })
);



app.use(express.json({ limit: '10mb' })); // For JSON payloads
app.use(express.urlencoded({ limit: '10mb', extended: true }));
const corsOptions = {
  origin: 'http://localhost:5173', // Frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'], // Allowed headers
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 204, // For OPTIONS preflight requests
};

app.use(cors(corsOptions));









app.use('/', userRoute);
app.use('/doctor', doctorRoute);
app.use('/admin', adminRoute);
app.use('/chat', chatRoute);



const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
