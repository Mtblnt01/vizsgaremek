import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hairstyle } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class HairstylesService extends ApiService {

  getAll(): Observable<Hairstyle[]> {
    return this.get<Hairstyle[]>('/hairstyles');
  }

  getById(id: number): Observable<Hairstyle> {
    return this.get<Hairstyle>(`/hairstyles/${id}`);
  }

  create(data: Partial<Hairstyle>): Observable<Hairstyle> {
    return this.post<Hairstyle>('/hairstyles', data);
  }

  update(id: number, data: Partial<Hairstyle>): Observable<Hairstyle> {
    return this.put<Hairstyle>(`/hairstyles/${id}`, data);
  }

  remove(id: number): Observable<any> {
    return this.delete(`/hairstyles/${id}`);
  }
}
