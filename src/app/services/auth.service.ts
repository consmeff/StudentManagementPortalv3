import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse, ProfilePayload, ProfileSuccessResponse } from '../data/auth/auth.data';
import { AuthSessionStore } from '../store/auth-session.store';

type AuthOtpPayload = Record<string, unknown>;

type AuthOtpTokenResponse = {
  jwt?: string;
  refreshToken?: string;
};

type RefreshTokenResponse = {
  jwt?: string;
};



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiRoot = environment.apiURL;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  private loggedUser: string | null | undefined;

  private readonly authSessionStore = inject(AuthSessionStore);

  constructor(private http: HttpClient) { }

  login(user: { username: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiRoot}/api/v1/auth/login`, user)
    .pipe(
      tap(tokens => {
        this.doLoginUser(user.username, tokens);
      }),
      map((tokens) => tokens),
      catchError((error) => throwError(() => error)));

  }

  create(payload: ProfilePayload): Observable<ProfileSuccessResponse> {
    return this.http.post<ProfileSuccessResponse>(`${this.apiRoot}/api/v1/auth/signup`, payload, { headers: this.headers });
  }

  verifyOtp(otpObj: AuthOtpPayload): Observable<boolean> {
    return this.http.post<AuthOtpTokenResponse>(`${this.apiRoot}/api/v1/auth/signup/verify-otp`, otpObj)
      .pipe(
        tap(responseObj => { this.storeTokenFromOTP(this.authSessionStore.profileEmail(), responseObj); }),
        map(() => true));
  }

  verifyEmail(emailObj: AuthOtpPayload): Observable<boolean> {
    return this.http.post(`${this.apiRoot}/api/v1/auth/password/forgot`, emailObj).pipe(map(() => true));
  }

  updatePassword(otpObj: AuthOtpPayload): Observable<boolean> {
    return this.http.post(`${this.apiRoot}/api/v1/auth/password/reset`, otpObj, { headers: this.headers }).pipe(map(() => true));
  }

  storeTokenFromOTP(username: string, token: AuthOtpTokenResponse) {
    this.loggedUser = username;
    this.authSessionStore.setTokens(token.jwt ?? '', token.refreshToken ?? '');
  }

  storeAppNo(application_no: string) {
    this.authSessionStore.setApplicationNo(application_no);
  }

  storeMatricNo(matric_no: string) {
    this.authSessionStore.setMatriculationNo(matric_no);
  }

  storeRole(user_type: string) {
    this.authSessionStore.setUserType(user_type);
  }

  refreshToken() {
    return this.http.post<RefreshTokenResponse>(`${this.apiRoot}/refresh`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((tokens) => {
      this.storeJwtToken(tokens.jwt ?? '');
    }));
  }

  private getRefreshToken() {
    return this.authSessionStore.refreshToken();
  }

  private storeJwtToken(jwt: string) {
    this.authSessionStore.setJwtToken(jwt);
  }

  getJwtToken() {
    return this.authSessionStore.jwtToken();
  }

  private storeTokens(tokens: LoginResponse) {
    this.authSessionStore.setTokens(tokens.access_token ?? '', tokens.refresh_token ?? '');
  }

  private removeTokens() {
    this.authSessionStore.setTokens('', '');
  }

  private doLoginUser(username: string, tokens: LoginResponse) {
    this.loggedUser = username;
    this.authSessionStore.setSessionFromLogin(tokens);
  }
}
