import { v4 as uuidv4 } from 'uuid';

import { Appointment } from '../models/appointment.model';
import { AppointmentRepository } from './appointment.repository';

export class InMemoryAppointmentRepository implements AppointmentRepository {
  private appointments: Appointment[] = [];

  async findByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    return this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDateTime);
      return appointmentDate >= startDate && appointmentDate <= endDate;
    });
  }

  async save(appointment: Appointment): Promise<Appointment> {
    const newAppointment = {
      ...appointment,
      id: appointment.id || uuidv4(),
      createdAt: appointment.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (appointment.id) {
      // Update existing appointment
      const index = this.appointments.findIndex(a => a.id === appointment.id);
      if (index !== -1) {
        this.appointments[index] = newAppointment;
      } else {
        this.appointments.push(newAppointment);
      }
    } else {
      // Create new appointment
      this.appointments.push(newAppointment);
    }

    return newAppointment;
  }
}