import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse, ProfilePayload, ProfileSuccessResponse } from '../data/auth/auth.data';
import { AuthSessionStore } from '../store/auth-session.store';



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
        console.log(tokens);
      }),
      map((tokens) => tokens),
      catchError((error) => throwError(() => error)));

  }

  create(payload: ProfilePayload): Observable<ProfileSuccessResponse> {
    return this.http.post<ProfileSuccessResponse>(`${this.apiRoot}/api/v1/auth/signup`, payload, { headers: this.headers });
  }

  verifyOtp(otpObj: any): Observable<boolean> {
    return this.http.post<any>(`${this.apiRoot}/api/v1/auth/signup/verify-otp`, otpObj)
      .pipe(
        tap(responseObj => { this.storeTokenFromOTP(this.authSessionStore.profileEmail(), responseObj); }),
        map(() => true),
        catchError(error => {
          // alert(error.error);
          return of(false);
        }));
  }

  verifyEmail(emailObj: any): Observable<boolean> {
    return this.http.post<any>(`${this.apiRoot}/api/v1/auth/password/forgot`, emailObj)

  }

  updatePassword(otpObj: any): Observable<boolean> {

    return this.http.post<any>(`${this.apiRoot}/api/v1/auth/password/reset`, otpObj, { headers: this.headers })

  }

  storeTokenFromOTP(username: string, token: any) {
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
    return this.http.post<any>(`${this.apiRoot}/refresh`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((tokens: any) => {
      this.storeJwtToken(tokens.jwt);
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

  private storeTokens(tokens: any) {
    this.authSessionStore.setTokens(tokens.access_token ?? '', tokens.refresh_token ?? '');
  }

  private removeTokens() {
    this.authSessionStore.setTokens('', '');
  }

  private doLoginUser(username: string, tokens: any) {
    this.loggedUser = username;
    this.storeTokens(tokens);
    this.storeRole(tokens.user_type);

    if (tokens.application_no) {
      this.storeAppNo(tokens.application_no);
      this.authSessionStore.setName(tokens.name ?? '');
    }
    if (tokens.matriculation_no) {
      this.storeMatricNo(tokens.matriculation_no);
    }
    this.authSessionStore.setPaymentStatus(tokens.payment_status ?? '');

  }
}
