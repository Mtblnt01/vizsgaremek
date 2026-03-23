import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BarbersService } from '../../core/services/barbers.service';
import { BookingsService } from '../../core/services/bookings.service';
import { HairstylesService } from '../../core/services/hairstyles.service';
import { GalleryService } from '../../core/services/gallery.service';
import { UsersService } from '../../core/services/users.service';
import { Barber, Booking, Hairstyle, GalleryImage, User } from '../../core/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  activeTab = 'barbers';

  barbers: Barber[] = [];
  bookings: Booking[] = [];
  hairstyles: Hairstyle[] = [];
  galleryImages: GalleryImage[] = [];
  users: User[] = [];

  loading = false;

  // Edit state
  editingUser: User | null = null;
  editUserRole: string = 'user';

  constructor(
    private barbersService: BarbersService,
    private bookingsService: BookingsService,
    private hairstylesService: HairstylesService,
    private galleryService: GalleryService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.loadBarbers();
    this.loadBookings();
    this.loadHairstyles();
    this.loadGallery();
    this.loadUsers();
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  loadBarbers(): void {
    this.barbersService.getAll().subscribe(data => this.barbers = data);
  }

  loadBookings(): void {
    this.bookingsService.getAll().subscribe(data => this.bookings = data);
  }

  loadHairstyles(): void {
    this.hairstylesService.getAll().subscribe(data => this.hairstyles = data);
  }

  loadGallery(): void {
    this.galleryService.getAll().subscribe(data => this.galleryImages = data);
  }

  loadUsers(): void {
    this.usersService.getAll().subscribe(data => this.users = data);
  }

  deleteBarber(id: number): void {
    if (confirm('Biztosan törlöd ezt a borbélyt?')) {
      this.barbersService.remove(id).subscribe(() => this.loadBarbers());
    }
  }

  deleteBooking(id: number): void {
    if (confirm('Biztosan törlöd/lemondod ezt a foglalást?')) {
      this.bookingsService.remove(id).subscribe(() => this.loadBookings());
    }
  }

  deleteHairstyle(id: number): void {
    if (confirm('Biztosan törlöd ezt a hajstílust?')) {
      this.hairstylesService.remove(id).subscribe(() => this.loadHairstyles());
    }
  }

  deleteGalleryImage(id: number): void {
    if (confirm('Biztosan törlöd ezt a képet?')) {
      this.galleryService.remove(id).subscribe(() => this.loadGallery());
    }
  }

  deleteUser(id: number): void {
    if (confirm('Biztosan törlöd ezt a felhasználót?')) {
      this.usersService.remove(id).subscribe(() => this.loadUsers());
    }
  }

  startEditUser(user: User): void {
    this.editingUser = { ...user };
    this.editUserRole = user.role;
  }

  cancelEditUser(): void {
    this.editingUser = null;
  }

  saveUserRole(): void {
    if (!this.editingUser) return;
    this.usersService.update(this.editingUser.id, { role: this.editUserRole as any }).subscribe({
      next: () => {
        this.editingUser = null;
        this.loadUsers();
      },
      error: () => {
        alert('Hiba a felhasználó frissítésekor.');
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'bg-success';
      case 'pending': return 'bg-warning text-dark';
      case 'completed': return 'bg-info';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'confirmed': return 'Megerősített';
      case 'pending': return 'Függőben';
      case 'completed': return 'Teljesített';
      case 'cancelled': return 'Lemondott';
      default: return status;
    }
  }
}
