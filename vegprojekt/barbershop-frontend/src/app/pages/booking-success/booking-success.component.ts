import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-success.component.html',
  styleUrls: ['./booking-success.component.scss']
})
export class BookingSuccessComponent implements OnInit {
  booking: any = null;
  barber: any = null;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      this.booking = nav.extras.state['booking'];
      this.barber = nav.extras.state['barber'];
    }
  }

  ngOnInit(): void {
    if (!this.booking) {
      this.router.navigate(['/']);
    }
  }
}
