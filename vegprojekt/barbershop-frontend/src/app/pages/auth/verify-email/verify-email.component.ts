import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  loading = true;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const hash = this.route.snapshot.paramMap.get('hash');
    const queryParams = this.route.snapshot.queryParams;

    if (id && hash) {
      const url = `${environment.apiUrl}/email/verify/${id}/${hash}`;
      this.http.get(url, { params: queryParams }).subscribe({
        next: (res: any) => {
          this.loading = false;
          this.successMessage = res.message || 'E-mail sikeresen megerősítve!';
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'A megerősítés sikertelen.';
        }
      });
    } else {
      this.loading = false;
      this.errorMessage = 'Érvénytelen link.';
    }
  }
}
