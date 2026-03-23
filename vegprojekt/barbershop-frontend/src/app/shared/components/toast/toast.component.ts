import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ToastMessage {
  text: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  @Input() message: ToastMessage | null = null;
  @Output() dismissed = new EventEmitter<void>();

  get iconClass(): string {
    switch (this.message?.type) {
      case 'success': return 'bi-check-circle-fill';
      case 'error': return 'bi-exclamation-triangle-fill';
      case 'warning': return 'bi-exclamation-circle-fill';
      case 'info': return 'bi-info-circle-fill';
      default: return 'bi-info-circle-fill';
    }
  }

  get bgClass(): string {
    switch (this.message?.type) {
      case 'success': return 'bg-success';
      case 'error': return 'bg-danger';
      case 'warning': return 'bg-warning text-dark';
      case 'info': return 'bg-info';
      default: return 'bg-info';
    }
  }

  dismiss(): void {
    this.dismissed.emit();
  }
}
