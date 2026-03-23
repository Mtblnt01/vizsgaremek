import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  passwordConfirmation = '';
  errorMessage = '';
  errors: any = {};
  loading = false;
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.errors = {};

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.passwordConfirmation
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message || 'Sikeres regisztráció! Kérjük, erősítsd meg az e-mail címedet.';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Regisztráció sikertelen.';
        this.errors = err.error?.errors || {};
      }
    });
  }
}
