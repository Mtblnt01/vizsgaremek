import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BarbersService } from '../../core/services/barbers.service';
import { BookingsService } from '../../core/services/bookings.service';
import { HairstylesService } from '../../core/services/hairstyles.service';
import { Barber, Hairstyle } from '../../core/models';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  barber: Barber | null = null;
  hairstyles: Hairstyle[] = [];

  customerName = '';
  customerEmail = '';
  customerPhone = '';
  startAt = '';
  durationMin = 30;
  note = '';
  selectedHairstyle: number | null = null;

  loading = false;
  loadingBarber = true;
  errorMessage = '';
  errors: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private barbersService: BarbersService,
    private bookingsService: BookingsService,
    private hairstylesService: HairstylesService
  ) {}

  ngOnInit(): void {
    const barberId = Number(this.route.snapshot.paramMap.get('barberId'));

    this.barbersService.getById(barberId).subscribe({
      next: (barber) => {
        this.barber = barber;
        this.loadingBarber = false;
      },
      error: () => {
        this.loadingBarber = false;
        this.errorMessage = 'Borbély nem található.';
      }
    });

    this.hairstylesService.getAll().subscribe({
      next: (styles) => this.hairstyles = styles
    });
  }

  onSubmit(): void {
    if (!this.barber) return;

    this.loading = true;
    this.errorMessage = '';
    this.errors = {};

    // Format start_at to Y-m-dTH:i:s (backend expects date_format:Y-m-d\TH:i:s)
    let formattedStartAt = this.startAt;
    if (formattedStartAt && !formattedStartAt.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
      formattedStartAt = formattedStartAt + ':00';
    }

    this.bookingsService.create({
      barber_id: this.barber.id,
      customer_name: this.customerName,
      customer_email: this.customerEmail,
      customer_phone: this.customerPhone,
      start_at: formattedStartAt,
      duration_min: this.durationMin,
      note: this.note || undefined
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate(['/booking-success'], {
          state: { booking: res.booking, barber: this.barber }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Foglalás sikertelen.';
        this.errors = err.error?.errors || {};
      }
    });
  }
}
