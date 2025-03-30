import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { errorHandler } from './middleware/error.middleware';
import appointmentRoutes from './routes/appointment.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', appointmentRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;