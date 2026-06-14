import { Component, OnDestroy, OnInit, ViewChildren, QueryList, ElementRef, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { TraceabilityModule } from '../../../shared/traceability.module';
import { ThemeService } from '../../../services/theme.service';
import { AuthSessionStore } from '../../../store/auth-session.store';
import { TECHNICAL_SUPPORT_MESSAGE } from '../../../constants/support.constants';

@Component({
  selector: 'app-otp-page',
  templateUrl: './otp-page.component.html',
  styleUrl: './otp-page.component.scss',
  imports:[TraceabilityModule],
  providers: [MessageService]
})
export class OtpPageComponent implements OnInit, OnDestroy {
  @ViewChildren('box1Input, box2Input, box3Input, box4Input, box5Input, box6Input')
  inputElements!: QueryList<ElementRef>;

  busy = false;

  resendBusy = false;

  isDarkMode = false;

  complete = false;
  readonly technicalSupportMessage = TECHNICAL_SUPPORT_MESSAGE;
  readonly resendCooldownSeconds = 30;
  otpForm!: FormGroup;

  email: string = '';

  isPasswordResetFlow = false;

  resendCountdown = 0;

  private themeSub?: Subscription;

  private resendCountdownIntervalId: ReturnType<typeof globalThis.setInterval> | null = null;

  private authSessionStore = inject(AuthSessionStore);

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.email = this.authSessionStore.profileEmail() || 'your email';
    this.isPasswordResetFlow = this.authSessionStore.authFlow() === 'password_reset';
    this.startResendCooldown();
    
    this.otpForm = new FormGroup({
      box1: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
      box2: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
      box3: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
      box4: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
      box5: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
      box6: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
    });

    this.otpForm.valueChanges.subscribe(() => {
      this.complete = this.otpForm.valid;
    });

    this.themeSub = this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  toggleDarkMode() {
    this.themeService.toggle();
  }

  onInput(event: Event, nextBox: number): void {
    const input = event.target as HTMLInputElement;
    const {value} = input;

    // Only allow digits
    if (!/^\d$/.test(value)) {
      input.value = '';
      return;
    }

    // Move to next input
    if (value && nextBox <= 6) {
      const inputs = this.inputElements.toArray();
      if (inputs[nextBox - 1]) {
        inputs[nextBox - 1].nativeElement.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, currentBox: number): void {
    const input = event.target as HTMLInputElement;

    // Handle backspace
    if (event.key === 'Backspace' && !input.value && currentBox > 1) {
      const inputs = this.inputElements.toArray();
      if (inputs[currentBox - 2]) {
        inputs[currentBox - 2].nativeElement.focus();
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';

    // Validate pasted data
    if (!/^\d{6}$/.test(pastedData.trim())) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid OTP',
        detail: 'Only 6-digit numeric values are allowed!',
        life: 3000
      });
      return;
    }

    // Fill all boxes
    const digits = pastedData.trim().split('');
    this.otpForm.controls['box1'].setValue(digits[0]);
    this.otpForm.controls['box2'].setValue(digits[1]);
    this.otpForm.controls['box3'].setValue(digits[2]);
    this.otpForm.controls['box4'].setValue(digits[3]);
    this.otpForm.controls['box5'].setValue(digits[4]);
    this.otpForm.controls['box6'].setValue(digits[5]);

    // Focus last box
    const inputs = this.inputElements.toArray();
    if (inputs[5]) {
      inputs[5].nativeElement.focus();
    }
  }

  submitOTP(): void {
    if (this.otpForm.invalid) return;

    this.busy = true;
    const otp = `${this.otpForm.controls['box1'].value}${this.otpForm.controls['box2'].value}${this.otpForm.controls['box3'].value}${this.otpForm.controls['box4'].value}${this.otpForm.controls['box5'].value}${this.otpForm.controls['box6'].value}`;
    const otpObj = { 
      email: this.authSessionStore.profileEmail(), 
      otp 
    };

    this.authService.verifyOtp(otpObj).subscribe({
      next: (result) => {
        this.busy = false;
        this.messageService.add({
          severity: 'success',
          summary: 'OTP Verification',
          detail: 'OTP Verified',
          life: 3000
        });
        
        setTimeout(() => {
          if (this.isPasswordResetFlow) {
            this.authSessionStore.setForgotOtp(otp);
            this.router.navigateByUrl('/auth/passwordreset');
          } else {
            this.authSessionStore.clearAuthFlow();
            this.router.navigateByUrl('/auth/login');
          }
        }, 1000);
      },
      error: () => {
        this.busy = false;
      }
    });
  }

  resendOtp(): void {
    if (!this.email || this.email === 'your email' || this.resendBusy || this.resendCountdown > 0) {
      return;
    }

    this.resendBusy = true;
    const resendRequest = this.isPasswordResetFlow
      ? this.authService.verifyEmail({ email: this.email })
      : this.authService.resendSignupOtp({ email: this.email });

    resendRequest.subscribe({
      next: () => {
        this.resendBusy = false;
        this.startResendCooldown();
        this.messageService.add({
          severity: 'success',
          summary: 'OTP Resent',
          detail: this.isPasswordResetFlow
            ? 'A new password reset OTP has been sent to your email.'
            : 'A new account verification OTP has been sent to your email.',
          life: 3000
        });
      },
      error: () => {
        this.resendBusy = false;
      }
    });
  }

  readResendButtonLabel(): string {
    if (this.resendBusy) {
      return 'Resending...';
    }
    if (this.resendCountdown > 0) {
      return `Resend OTP in ${this.resendCountdown}s`;
    }
    return 'Resend OTP';
  }

  private startResendCooldown(): void {
    this.clearResendCountdown();
    this.resendCountdown = this.resendCooldownSeconds;
    this.resendCountdownIntervalId = globalThis.setInterval(() => {
      if (this.resendCountdown <= 1) {
        this.resendCountdown = 0;
        this.clearResendCountdown();
        return;
      }
      this.resendCountdown -= 1;
    }, 1000);
  }

  private clearResendCountdown(): void {
    if (this.resendCountdownIntervalId === null) {
      return;
    }
    globalThis.clearInterval(this.resendCountdownIntervalId);
    this.resendCountdownIntervalId = null;
  }

  ngOnDestroy(): void {
    this.clearResendCountdown();
    this.themeSub?.unsubscribe();
  }
}
