import { Component, OnDestroy, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { TraceabilityModule } from '../../../shared/traceability.module';
import { ThemeService } from '../../../services/theme.service';
import { AuthSessionStore } from '../../../store/auth-session.store';

@Component({
  selector: 'app-request-passwordreset',
  templateUrl: './request-passwordreset.component.html',
  imports: [TraceabilityModule],
  styleUrl: './request-passwordreset.component.scss',
  providers: [MessageService]
})
export class RequestPasswordresetComponent implements OnDestroy {
  busy = false;
  isDarkMode = false;
  private themeSub?: Subscription;
  private authSessionStore = inject(AuthSessionStore);

  resetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.themeSub = this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  toggleDarkMode() {
    this.themeService.toggle();
  }

  resetPass() {
    if (this.resetForm.invalid) return;

    this.busy = true;
    this.authService.verifyEmail({ 
      email: this.resetForm.controls.email.value 
    }).subscribe({
      next: (data: any) => {
        this.busy = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Password Reset',
          detail: data.message,
          life: 6000
        });
        
        this.authSessionStore.startPasswordResetFlow(this.resetForm.controls.email.value!.trim());
        
        // Navigate after showing message
        setTimeout(() => {
          this.router.navigateByUrl('/auth/otp-page');
        }, 1000);
      },
      error: () => {
        this.busy = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Password Reset',
          detail: 'Please contact admin!',
          life: 5000
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }
}
