import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService } from '../../core/services/gallery.service';
import { GalleryImage } from '../../core/models';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  images: GalleryImage[] = [];
  loading = true;
  selectedImage: GalleryImage | null = null;

  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.galleryService.getAll().subscribe({
      next: (images) => {
        this.images = images;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openImage(image: GalleryImage): void {
    this.selectedImage = image;
  }

  closeImage(): void {
    this.selectedImage = null;
  }
}
