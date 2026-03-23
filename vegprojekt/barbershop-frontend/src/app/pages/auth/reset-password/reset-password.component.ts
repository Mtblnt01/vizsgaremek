import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  email = '';
  password = '';
  passwordConfirmation = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.resetPassword({
      token: this.token,
      email: this.email,
      password: this.password,
      password_confirmation: this.passwordConfirmation
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message || 'Jelszó sikeresen visszaállítva!';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Hiba történt.';
      }
    });
  }
}
