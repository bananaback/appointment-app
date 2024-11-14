import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import { isAuthenticated } from './middlewares/authMiddleware.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

// Auth routes
app.use(authRoutes);

export default app;
