import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Barber } from '../../../core/models';

@Component({
  selector: 'app-barber-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './barber-card.component.html',
  styleUrls: ['./barber-card.component.scss']
})
export class BarberCardComponent {
  @Input() barber!: Barber;
  @Input() nextSlot: string | null = null;
}
