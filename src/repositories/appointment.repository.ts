import { Appointment } from '../models/appointment.model';

export interface AppointmentRepository {
  findByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]>;
  save(appointment: Appointment): Promise<Appointment>;
}