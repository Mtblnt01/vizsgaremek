import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.forgotPassword({ email: this.email }).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message || 'Jelszó-visszaállító link elküldve!';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Hiba történt.';
      }
    });
  }
}
