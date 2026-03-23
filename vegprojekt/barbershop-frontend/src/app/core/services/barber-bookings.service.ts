import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Barber, Booking } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BarberBookingsService extends ApiService {

  getMyBarberProfile(): Observable<Barber> {
    return this.get<Barber>('/barber/me');
  }

  getMyBookings(): Observable<Booking[]> {
    return this.get<Booking[]>('/barber/bookings');
  }

  updateBooking(id: number, data: Partial<Booking>): Observable<any> {
    return this.put(`/barber/bookings/${id}`, data);
  }

  cancelBooking(id: number): Observable<any> {
    return this.delete(`/barber/bookings/${id}`);
  }
}
