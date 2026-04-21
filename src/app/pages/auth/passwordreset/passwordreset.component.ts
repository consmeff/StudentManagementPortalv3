import { Component, OnDestroy, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { validationCheckDTO } from '../../../data/auth/auth.data';
import { passwordStrength } from '../../../utility/formvalidators';
import { TraceabilityModule } from '../../../shared/traceability.module';
import { ThemeService } from '../../../services/theme.service';
import { AuthSessionStore } from '../../../store/auth-session.store';



@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrl: './passwordreset.component.scss',
  imports: [TraceabilityModule],
  providers: [MessageService]
})
export class PasswordresetComponent implements OnDestroy {
  busy = false;
  isDarkMode = false;
  visible = false;
  private themeSub?: Subscription;
  private authSessionStore = inject(AuthSessionStore);

  validationCheck: validationCheckDTO[] = [
    { title: "Minimum of 8 characters", status: false },
    { title: "At least one special character", status: false },
    { title: "At least one uppercase letter", status: false },
    { title: "At least one lowercase letter", status: false },
    { title: "At least one number", status: false }
  ];

  resetForm = new FormGroup({
    password: new FormControl('', [Validators.required, passwordStrength()]),
    cpassword: new FormControl('', Validators.required)
  });

  readonly passwordControl: AbstractControl = this.resetForm.controls.password;
  readonly cpasswordControl: AbstractControl = this.resetForm.controls.cpassword;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.themeSub = this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
    this.passwordControl.valueChanges.subscribe((val: string | null) => {
      if (val) {
        this.updateValidationStatus(val);
      }
    });
  }

  toggleDarkMode() {
    this.themeService.toggle();
  }

  updateValidationStatus(password: string) {
    this.validationCheck = this.validationCheck.map((item) => {
      switch (item.title) {
        case "Minimum of 8 characters":
          return { ...item, status: password.length >= 8 };
        case "At least one special character":
          return { ...item, status: /[!@#$%^&*(),.?":{}|<>]/.test(password) };
        case "At least one uppercase letter":
          return { ...item, status: /[A-Z]/.test(password) };
        case "At least one lowercase letter":
          return { ...item, status: /[a-z]/.test(password) };
        case "At least one number":
          return { ...item, status: /[0-9]/.test(password) };
        default:
          return item;
      }
    });
  }

  resetPass() {
    if (this.resetForm.invalid) return;

    if (this.resetForm.controls.password.value !== this.resetForm.controls.cpassword.value) {
      this.messageService.add({
        severity: 'error',
        summary: 'Password Mismatch',
        detail: 'Passwords should be equal',
        life: 5000
      });
      return;
    }

    const otp = this.authSessionStore.forgotOtp();
    if (!otp) {
      this.messageService.add({
        severity: 'error',
        summary: 'Password Reset',
        detail: 'OTP session missing. Please verify OTP again.',
        life: 5000
      });
      this.router.navigateByUrl('/auth/otp-page');
      return;
    }

    this.busy = true;
    const payload = {
      email: this.authSessionStore.profileEmail(),
      password: this.resetForm.controls.password.value,
      otp
    };

    this.authService.updatePassword(payload).subscribe({
      next: (data: any) => {
        this.busy = false;
        this.authSessionStore.clearAuthFlow();
        this.messageService.add({
          severity: 'success',
          summary: 'Password Reset',
          detail: data.message,
          life: 3000
        });
        
        // Show success dialog
        setTimeout(() => {
          this.visible = true;
        }, 500);
      },
      error: (err) => {
        this.busy = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Password Reset',
          detail: 'Reset failed! Try again or contact admin!',
          life: 5000
        });
      }
    });
  }

  toLogin() {
    this.visible = false;
    setTimeout(() => {
      this.router.navigateByUrl('/auth/login');
    }, 300);
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }
}
