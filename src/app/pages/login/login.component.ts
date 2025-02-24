import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../components/loading/loading.component';
import { CommonModule, NgClass } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth-service.service';
import { NotificationsService } from '../../services/notifications-service/notifications.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgClass, LoadingComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
  public router = inject(Router);
  public authService = inject(AuthService);
  private _notificationsService = inject(NotificationsService);

  loginForm!: FormGroup;
  private subscriptions$ = new Subject<void>();
  loadingLoginButton = signal(false);

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.loadingLoginButton.set(true);

    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(takeUntil(this.subscriptions$)).subscribe({
        next: (res) => {
          this.router.navigate(['/'])
          this.loadingLoginButton.set(false);
        },
        error: (err) => {
          console.log(err);
          this._notificationsService.showNotification(err, true);
          this.loadingLoginButton.set(false);
        }
      });
  }
}
