import { Appointment } from '../models/appointment.model';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { BadRequestError } from '../utils/errors';

export class AppointmentService {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async bookAppointment(appointment: Appointment): Promise<Appointment> {
    // Validate appointment time is within business hours (9am - 5pm)
    if (!this.isWithinBusinessHours(appointment.appointmentDateTime, appointment.appointmentDuration)) {
      throw new BadRequestError('Appointment must be scheduled between 9:00 AM and 5:00 PM');
    }

    // Check for conflicts with existing appointments
    const isAvailable = await this.isTimeSlotAvailable(
      appointment.appointmentDateTime,
      appointment.appointmentDuration
    );

    if (!isAvailable) {
      throw new BadRequestError('The requested time slot is already booked');
    }

    // Save the appointment
    return this.appointmentRepository.save(appointment);
  }

  private isWithinBusinessHours(dateTime: Date, durationMinutes: number): boolean {
    const appointmentDate = new Date(dateTime);
    const appointmentHour = appointmentDate.getHours();
    const appointmentMinutes = appointmentDate.getMinutes();
    
    // Could potentially handle location time zone here
    // Business hours: 9:00 AM - 5:00 PM
    const startHour = 9;
    const endHour = 17; // 5:00 PM in 24-hour format
    
    // Check start time is within business hours
    if (appointmentHour < startHour || appointmentHour >= endHour) {
      return false;
    }
    
    // Check end time is within business hours
    const endTimeMinutes = appointmentHour * 60 + appointmentMinutes + durationMinutes;
    const endBusinessMinutes = endHour * 60;
    
    return endTimeMinutes <= endBusinessMinutes;
  }

  private async isTimeSlotAvailable(dateTime: Date, durationMinutes: number): Promise<boolean> {
    const appointmentDate = new Date(dateTime);
    
    // Create start and end of the day for querying existing appointments
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Get all appointments for the day
    const existingAppointments = await this.appointmentRepository.findByDateRange(startOfDay, endOfDay);
    
    // Calculate the start and end times of the requested appointment in minutes since the start of the day
    const requestedStartMinutes = appointmentDate.getHours() * 60 + appointmentDate.getMinutes();
    const requestedEndMinutes = requestedStartMinutes + durationMinutes;
    
    // Check for conflicts with existing appointments
    for (const existingAppointment of existingAppointments) {
      const existingDateTime = new Date(existingAppointment.appointmentDateTime);
      const existingStartMinutes = existingDateTime.getHours() * 60 + existingDateTime.getMinutes();
      const existingEndMinutes = existingStartMinutes + existingAppointment.appointmentDuration;
      
      // Check if there is an overlap
      if (requestedStartMinutes < existingEndMinutes && existingStartMinutes < requestedEndMinutes) {
        return false;
      }
    }
    
    return true;
  }
}