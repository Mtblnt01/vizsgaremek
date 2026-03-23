import { Routes } from '@angular/router';
import { authGuard, adminGuard, barberGuard, guestGuard } from './core/guards/auth.guard';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { VerifyEmailComponent } from './pages/auth/verify-email/verify-email.component';
import { BookingComponent } from './pages/booking/booking.component';
import { BookingSuccessComponent } from './pages/booking-success/booking-success.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { AboutComponent } from './pages/about/about.component';
import { AdminComponent } from './pages/admin/admin.component';
import { BarberDashboardComponent } from './pages/barber-dashboard/barber-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'verify-email/:id/:hash', component: VerifyEmailComponent },
  { path: 'booking/:barberId', component: BookingComponent },
  { path: 'booking-success', component: BookingSuccessComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'about', component: AboutComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: 'barber-dashboard', component: BarberDashboardComponent, canActivate: [barberGuard] },
  { path: '**', redirectTo: '' }
];
