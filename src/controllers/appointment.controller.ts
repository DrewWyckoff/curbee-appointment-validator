import { NextFunction, Request, Response } from 'express';

import { Appointment } from '../models/appointment.model';
import { AppointmentService } from '../services/appointment.service';
import { BadRequestError } from '../utils/errors';

export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  async bookAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const appointmentData: Appointment = {
        ...req.body,
        appointmentDateTime: new Date(req.body.appointmentDateTime)
      };

      this.validateAppointmentData(appointmentData);

      const bookedAppointment = await this.appointmentService.bookAppointment(appointmentData);

      res.status(200).json({
        success: true,
        data: bookedAppointment
      });
    } catch (error) {
      next(error);
    }
  }

  private validateAppointmentData(data: Appointment): void {
    // Basic validation for required fields
    if (!data.appointmentDateTime) {
      throw new BadRequestError('Appointment date and time is required');
    }

    if (!data.appointmentDuration || data.appointmentDuration <= 0) {
      throw new BadRequestError('Valid appointment duration is required');
    }

    if (!data.customer || !data.customer.firstName || !data.customer.lastName || !data.customer.email) {
      throw new BadRequestError('Customer information is incomplete');
    }

    if (!data.location || !data.location.line1 || !data.location.zipCode || !data.location.city || !data.location.state) {
      throw new BadRequestError('Location information is incomplete');
    }

    if (!data.vehicle || !data.vehicle.vin) {
      throw new BadRequestError('Vehicle information is incomplete');
    }
  }
}