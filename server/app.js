import express from 'express';
import cors from 'cors';
import borrowingRoutes from './routes/borrowingRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Standard middleware setup
app.use(cors());
app.use(express.json());

// API Base Endpoints declaration
app.use('/api/borrowings', borrowingRoutes);

// Global operational fallback centralized boundary
app.use(errorHandler);

export default app;
