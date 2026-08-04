
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { AuthSessionStore } from '../../../store/auth-session.store';
import { ThemeService } from '../../../services/theme.service';
import { UserPortalService } from '../../../services/user-portal.service';
import { TECHNICAL_SUPPORT_MESSAGE } from '../../../constants/support.constants';
import { extractHttpErrorMessage } from '../../../services/error.interceptor';
import { PENDING_VERIFICATION_REDIRECT_REASON } from '../../../constants/auth.constants';

import { TraceabilityModule } from '../../../shared/traceability.module';

const LOGIN_CAROUSEL_IMAGES = [
  '/assets/images/carousel-image-1.jpeg',
  '/assets/images/carousel-image-2.jpeg'
];
const LOGIN_CAROUSEL_INTERVAL_MS = 6000;

/** Statuses the API uses when the account exists but the email has never been verified. */
const PENDING_VERIFICATION_STATUSES = [403, 422];
const PENDING_VERIFICATION_PATTERN = /pending verification|awaiting verification|not verified|unverified|verify your (account|email)/i;

@Component({
  selector: 'app-consmeff-login',
  standalone: true,
  imports: [TraceabilityModule],
  templateUrl: './consmeff-login.component.html',
  styleUrls: ['./consmeff-login.component.scss'],
  providers: [MessageService]
})
export class ConsmeffLoginComponent implements OnInit, OnDestroy {
  email = '';

  password = '';

  readonly technicalSupportMessage = TECHNICAL_SUPPORT_MESSAGE;

  readonly carouselImages = LOGIN_CAROUSEL_IMAGES;

  showPassword = signal(false);

  isDarkMode = signal(false);

  isLoading = signal(false);

  activeSlideIndex = signal(0);

  errorMessage = '';

  private returnUrl = '/';

  loginForm!: FormGroup;

  private carouselIntervalId: ReturnType<typeof setInterval> | null = null;

  private router = inject(Router);

  private route = inject(ActivatedRoute);

  private authSessionStore = inject(AuthSessionStore);

  private themeService = inject(ThemeService);

  private userPortalService = inject(UserPortalService);

  private themeSub?: Subscription;

  constructor(private authService: AuthService, private messageService: MessageService) {
    this.themeSub = this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode.set(isDark);
    });
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(false, Validators.required)
    });
    this.startCarousel();
  }

  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }

  toggleDarkMode() {
    this.themeService.toggle();
  }

  async login() {
    this.isLoading.set(true);
    this.errorMessage = '';
    const payload: { username: string, password: string } = {
      password: this.loginForm.controls["password"].value,
      username: this.loginForm.controls["email"].value,
    }

    this.authService.login(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Login', detail: 'Login Successful' });
        this.isLoading.set(false);
        this.router.navigateByUrl(this.userPortalService.landingUrl());
      },
      error: (error: unknown) => {
        this.isLoading.set(false);

        if (this.isPendingVerificationError(error)) {
          this.redirectToOtpVerification(payload.username);
          return;
        }

        this.errorMessage = extractHttpErrorMessage(error);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    })


  }

  private isPendingVerificationError(error: unknown): boolean {
    if (!(error instanceof HttpErrorResponse)) {
      return false;
    }
    if (!PENDING_VERIFICATION_STATUSES.includes(error.status)) {
      return false;
    }

    return PENDING_VERIFICATION_PATTERN.test(extractHttpErrorMessage(error));
  }

  private redirectToOtpVerification(email: string): void {
    this.authSessionStore.startSignupVerificationFlow((email ?? '').trim());
    this.router.navigate(['/auth/otp-page'], {
      state: { reason: PENDING_VERIFICATION_REDIRECT_REASON }
    });
  }

  ngOnDestroy(): void {
    if (this.carouselIntervalId !== null) {
      clearInterval(this.carouselIntervalId);
    }
    this.themeSub?.unsubscribe();
  }

  setActiveSlide(index: number): void {
    this.activeSlideIndex.set(index);
  }

  private startCarousel(): void {
    if (this.carouselImages.length <= 1) {
      return;
    }

    this.carouselIntervalId = setInterval(() => {
      const nextSlideIndex = (this.activeSlideIndex() + 1) % this.carouselImages.length;
      this.activeSlideIndex.set(nextSlideIndex);
    }, LOGIN_CAROUSEL_INTERVAL_MS);
  }
}
