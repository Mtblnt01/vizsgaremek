import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking, BookingRequest } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BookingsService extends ApiService {

  getAll(): Observable<Booking[]> {
    return this.get<Booking[]>('/bookings');
  }

  getById(id: number): Observable<Booking> {
    return this.get<Booking>(`/bookings/${id}`);
  }

  create(data: BookingRequest): Observable<any> {
    return this.post('/bookings', data);
  }

  update(id: number, data: Partial<Booking>): Observable<Booking> {
    return this.put<Booking>(`/bookings/${id}`, data);
  }

  remove(id: number): Observable<any> {
    return this.delete(`/bookings/${id}`);
  }

  getAvailability(barberId: number, dateFrom: string, dateTo: string): Observable<any> {
    return this.get('/availability', { barberId, dateFrom, dateTo });
  }
}
