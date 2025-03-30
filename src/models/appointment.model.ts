export interface Customer {
    firstName: string;
    lastName: string;
    phone: number;
    email: string;
  }
  
  export interface Location {
    line1: string;
    line2: string;
    zipCode: string;
    state: string;
    city: string;
  }
  
  export interface Vehicle {
    vin: string;
  }
  
  export interface Appointment {
    id?: string;
    appointmentDateTime: Date;
    customer: Customer;
    location: Location;
    vehicle: Vehicle;
    appointmentDuration: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  