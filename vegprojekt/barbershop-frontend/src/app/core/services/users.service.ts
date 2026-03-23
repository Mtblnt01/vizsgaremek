import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends ApiService {

  getAll(): Observable<User[]> {
    return this.get<User[]>('/users');
  }

  getById(id: number): Observable<User> {
    return this.get<User>(`/users/${id}`);
  }

  update(id: number, data: Partial<User & { password?: string }>): Observable<any> {
    return this.put(`/users/${id}`, data);
  }

  remove(id: number): Observable<any> {
    return this.delete(`/users/${id}`);
  }
}
