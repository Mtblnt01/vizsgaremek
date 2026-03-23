import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BarberBookingsService } from '../../core/services/barber-bookings.service';
import { Barber, Booking } from '../../core/models';

@Component({
  selector: 'app-barber-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './barber-dashboard.component.html',
  styleUrls: ['./barber-dashboard.component.scss']
})
export class BarberDashboardComponent implements OnInit {
  barber: Barber | null = null;
  bookings: Booking[] = [];
  loading = true;
  errorMessage = '';

  constructor(private barberBookingsService: BarberBookingsService) {}

  ngOnInit(): void {
    this.barberBookingsService.getMyBarberProfile().subscribe({
      next: (barber) => {
        this.barber = barber;
        this.loadBookings();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Nincs hozzárendelt borbély profil.';
      }
    });
  }

  loadBookings(): void {
    this.barberBookingsService.getMyBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  cancelBooking(id: number): void {
    if (confirm('Biztosan lemondod ezt a foglalást?')) {
      this.barberBookingsService.cancelBooking(id).subscribe(() => this.loadBookings());
    }
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
