import { Barber } from './barber.model';

export interface Booking {
  id: number;
  barber_id: number;
  user_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_at: string;
  duration_min: number;
  note: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  barber?: Barber;
  created_at?: string;
  updated_at?: string;
}

export interface BookingRequest {
  barber_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_at: string;
  duration_min: number;
  note?: string;
}
