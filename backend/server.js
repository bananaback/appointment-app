import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import cors
import authRoutes from './routes/authRoutes.js';
import { isAuthenticated } from './middlewares/authMiddleware.js';

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Allow your frontend domain
    methods: 'GET,POST,PUT,DELETE', // Allow specific methods
    allowedHeaders: 'Content-Type, Authorization', // Allow specific headers
    credentials: true, // Allow cookies to be sent along with the requests
}));

// Body parsing middleware
app.use(express.json());
app.use(cookieParser());

// Use authentication routes
app.use('/auth', authRoutes);

// Use doctor routes
app.use('/doctors', doctorRoutes);


export default app;