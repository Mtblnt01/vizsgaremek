import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GalleryImage } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GalleryService extends ApiService {

  getAll(): Observable<GalleryImage[]> {
    return this.get<GalleryImage[]>('/gallery');
  }

  create(data: Partial<GalleryImage>): Observable<GalleryImage> {
    return this.post<GalleryImage>('/gallery', data);
  }

  remove(id: number): Observable<any> {
    return this.delete(`/gallery/${id}`);
  }
}
