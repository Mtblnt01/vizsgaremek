import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BarbersService } from '../../core/services/barbers.service';
import { Barber } from '../../core/models';
import { BarberCardComponent } from '../../shared/components/barber-card/barber-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, BarberCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  barbers: Barber[] = [];
  nextSlots: { [barberId: number]: string } = {};
  loading = true;

  constructor(private barbersService: BarbersService) {}

  ngOnInit(): void {
    this.barbersService.getAll().subscribe({
      next: (barbers) => {
        this.barbers = barbers;
        this.loading = false;
        barbers.forEach(b => {
          this.barbersService.getNextSlot(b.id).subscribe({
            next: (res) => {
              this.nextSlots[b.id] = res.next_slot;
            }
          });
        });
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
