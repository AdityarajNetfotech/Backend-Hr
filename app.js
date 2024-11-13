import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import errorHandler from './middleware/error.js'; 

// Import routes
import jdRoute from './routes/jdRoutes.js'; 
import CandidateRoutes from './routes/CandidateRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sendemail from "./routes/sendemail.js";
import InformationRoutes from './routes/InformationRoutes.js';

// import jdTypeRoutes from './routes/jdTypeRoutes.js'

const app = express();

// Configure environment variables
dotenv.config({ path: './config/config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { 
    dbName: 'HR_Based_Project', // Ensure this matches your actual database name
    // useNewUrlParser: true,
    // useUnifiedTopology: true 
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB', err));

// Middleware setup
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('dev'));

// Body parser middleware (optional, based on your needs)
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '5mb',
}));

// Routes setup
app.use('/api', jdRoute);
app.use('/api', CandidateRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api',sendemail);
app.use('/api',InformationRoutes);

// app.use('/api', jdTypeRoutes);



// Root route
app.get('/', (req, res) => {
    res.send('Hello from Node.js');
});




// Error handling middleware
app.use(errorHandler);

export default app;
