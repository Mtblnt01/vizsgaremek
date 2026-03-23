import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { User, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  get isBarber(): boolean {
    return this.currentUserSubject.value?.role === 'barber';
  }

  get token(): string | null {
    return localStorage.getItem('auth_token');
  }

  private saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private clearToken(): void {
    localStorage.removeItem('auth_token');
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  login(data: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, data).pipe(
      tap(res => {
        if (res.token) {
          this.saveToken(res.token);
        }
        if (res.user) {
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.clearToken();
        this.currentUserSubject.next(null);
      })
    );
  }

  me(): Observable<User> {
    if (!this.token) {
      return of(null as any);
    }
    return this.http.get<User>(`${this.baseUrl}/auth/me`).pipe(
      tap(user => this.currentUserSubject.next(user)),
      catchError(() => {
        this.clearToken();
        this.currentUserSubject.next(null);
        return of(null as any);
      })
    );
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/forgot-password`, data);
  }

  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/reset-password`, data);
  }

  resendVerification(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/email/resend`, {});
  }

  setUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }
}
