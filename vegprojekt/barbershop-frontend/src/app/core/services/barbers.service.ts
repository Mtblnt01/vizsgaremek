import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Barber } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BarbersService extends ApiService {

  getAll(): Observable<Barber[]> {
    return this.get<Barber[]>('/barbers');
  }

  getById(id: number): Observable<Barber> {
    return this.get<Barber>(`/barbers/${id}`);
  }

  getNextSlot(barberId: number): Observable<{ barber_id: number; next_slot: string }> {
    return this.get(`/barbers/${barberId}/next-slot`);
  }

  getSchedule(barberId: number, dateFrom: string, dateTo: string): Observable<any> {
    return this.get(`/barbers/${barberId}/schedule`, { dateFrom, dateTo });
  }

  create(data: Partial<Barber>): Observable<Barber> {
    return this.post<Barber>('/barbers', data);
  }

  update(id: number, data: Partial<Barber>): Observable<Barber> {
    return this.put<Barber>(`/barbers/${id}`, data);
  }

  remove(id: number): Observable<any> {
    return this.delete(`/barbers/${id}`);
  }
}
