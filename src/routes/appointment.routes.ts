import { Router } from 'express';

import { AppointmentController } from '../controllers/appointment.controller';
import { InMemoryAppointmentRepository } from '../repositories/in-memory-appointment.repository';
import { AppointmentService } from '../services/appointment.service';

const router = Router();

// Setup dependencies
const appointmentRepository = new InMemoryAppointmentRepository();
const appointmentService = new AppointmentService(appointmentRepository);
const appointmentController = new AppointmentController(appointmentService);

// Define routes
router.post('/appointments', (req, res, next) => appointmentController.bookAppointment(req, res, next));

export default router;