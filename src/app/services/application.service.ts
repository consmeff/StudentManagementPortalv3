import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CountryDTO, StatesDTO, LGADTO } from '../data/application/location.dto';
import {
  PaginatedPaymentsResponse,
  PaymentHistoryItem,
  PaymentRefResponse
} from '../data/application/payment.data';
import { PreRegistrationDataDTO } from '../data/application/preregistrationdatadto';
import { RegistrantDataDTO } from '../data/application/registrantdatadto';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private readonly apiRoot = environment.apiURL;
  private readonly paymentsEndpoint = `${this.apiRoot}/api/v1/payments/payments`;

  constructor(private http: HttpClient) { }

  openApplications(): Observable<any> {
    return this.http.get<any>(`${this.apiRoot}/api/v1/setup/applications?status=open`);
  }
  departments(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiRoot}/api/v1/setup/departments?program_id=${id}`);
  }
  initializeApplication(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiRoot}/api/v1/applicants`, payload);
  }

  personalDetails(app_no: string, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.apiRoot}/api/v1/applicants/single?applicant_no=${app_no}`, payload);
  }
  makePayment(app_no: string, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.apiRoot}/api/v1/applicants/single?applicant_no=${app_no}`, payload);
  }


  registrationData(): Observable<PreRegistrationDataDTO> {
    return this.http.get<any>(`${this.apiRoot}/api/v1/data/pre-registration-data`).pipe(
      map((response) => this.normalizePreRegistrationResponse(response))
    );
  }
  countries(): Observable<CountryDTO> {
    return this.http.get<any>(`${this.apiRoot}/api/v1/data/countries`).pipe(
      map((response) => this.normalizeCollectionResponse(response))
    );
  }
  states(): Observable<StatesDTO> {
    return this.http.get<any>(`${this.apiRoot}/api/v1/data/countries/NGA/states`).pipe(
      map((response) => this.normalizeCollectionResponse(response))
    );
  }
  lgas(id: number): Observable<LGADTO> {
    return this.http.get<any>(`${this.apiRoot}/api/v1/data/states/${id}/lgas`).pipe(
      map((response) => this.normalizeCollectionResponse(response))
    );
  }
  registrantData(app_no: string): Observable<RegistrantDataDTO> {
    return this.http.get<RegistrantDataDTO>(`${this.apiRoot}/api/v1/applicants/single?applicant_no=${app_no}`);
  }

  uploadFile(fileData: any): Observable<any> {
    return this.http.post<any>(`${this.apiRoot}/api/v1/uploads`, fileData);
  }
  verifyPayment(ref: { ref_id: string }): Observable<any> {
    return this.http.post<any>(`${this.apiRoot}/api/v1/callbacks/verify-payment-status`, ref);
  }
  getPaymentRef(refPayload: { application_no: string }): Observable<PaymentRefResponse> {
    return this.http.post<PaymentRefResponse>(`${this.apiRoot}/api/v1/applicants/initiate-payment`, refPayload);
  }
  getPayments(query: { page: number; pageSize: number; ordering: string | null; search: string | null }): Observable<PaginatedPaymentsResponse> {
    let params = new HttpParams()
      .set('page', String(query.page))
      .set('page_size', String(query.pageSize));
    if (query.ordering) {
      params = params.set('ordering', query.ordering);
    }
    if (query.search) {
      params = params.set('search', query.search);
    }

    return this.http.get<unknown>(`${this.paymentsEndpoint}/users`, { params }).pipe(
      map((response) => this.normalizePaginatedPaymentsResponse(response))
    );
  }
  getPaymentReceipt(refId: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.apiRoot}/api/v1/payments/payments/${encodeURIComponent(refId)}/receipt`, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  submitApplication(payload: { applicant_no: string }): Observable<any> {
    return this.http.post<any>(`${this.apiRoot}/api/v1/applicants/submit-application`, payload);
  }

  private normalizeCollectionResponse(response: any): { data: any[] } {
    if (Array.isArray(response)) {
      return { data: response };
    }
    if (Array.isArray(response?.data)) {
      return { data: response.data };
    }
    if (Array.isArray(response?.results)) {
      return { data: response.results };
    }
    return { data: [] };
  }

  private normalizePreRegistrationResponse(response: any): PreRegistrationDataDTO {
    const raw = response?.data ?? response ?? {};
    return {
      titles: Array.isArray(raw.titles) ? raw.titles : [],
      marital_statuses: Array.isArray(raw.marital_statuses) ? raw.marital_statuses : [],
      id_types: Array.isArray(raw.id_types) ? raw.id_types : [],
      certificate_types: Array.isArray(raw.certificate_types) ? raw.certificate_types : [],
      subject_grades: Array.isArray(raw.subject_grades) ? raw.subject_grades : [],
      relationship_types: Array.isArray(raw.relationship_types) ? raw.relationship_types : [],
      gender: Array.isArray(raw.gender) ? raw.gender : [],
      occupations: Array.isArray(raw.occupations) ? raw.occupations : []
    };
  }

  private normalizePaginatedPaymentsResponse(response: unknown): PaginatedPaymentsResponse {
    const rawResponse = this.getNestedRecord(response, 'data') ?? this.toRecord(response);
    const resultsSource = Array.isArray(rawResponse['results'])
      ? rawResponse['results']
      : Array.isArray(rawResponse['data'])
        ? rawResponse['data']
        : [];

    return {
      count: this.readNumber(rawResponse, 'count'),
      next: this.readNullableString(rawResponse, 'next'),
      previous: this.readNullableString(rawResponse, 'previous'),
      results: resultsSource.map((item) => this.normalizePaymentItem(item))
    };
  }

  private normalizePaymentItem(response: unknown): PaymentHistoryItem {
    const rawResponse = this.toRecord(response);
    return {
      ref_id: this.readString(rawResponse, 'ref_id'),
      payment_type: this.readString(rawResponse, 'payment_type'),
      amount: this.readNumber(rawResponse, 'amount'),
      amount_paid: this.readNullableNumber(rawResponse, 'amount_paid'),
      status: this.readString(rawResponse, 'status'),
      summary: this.readString(rawResponse, 'summary'),
      created_at: this.readString(rawResponse, 'created_at'),
      applicant_no: this.readString(rawResponse, 'applicant_no'),
      applicant_name: this.readString(rawResponse, 'applicant_name')
    };
  }

  private getNestedRecord(source: unknown, key: string): Record<string, unknown> | null {
    const record = this.toRecord(source);
    const nestedValue = record[key];
    if (this.isRecord(nestedValue)) {
      return nestedValue;
    }
    return null;
  }

  private toRecord(value: unknown): Record<string, unknown> {
    if (this.isRecord(value)) {
      return value;
    }
    return {};
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private readString(source: Record<string, unknown>, key: string): string {
    const value = source[key];
    return typeof value === 'string' ? value : '';
  }

  private readNullableString(source: Record<string, unknown>, key: string): string | null {
    const value = source[key];
    return typeof value === 'string' && value.trim().length > 0 ? value : null;
  }

  private readNumber(source: Record<string, unknown>, key: string): number {
    const value = source[key];
    return typeof value === 'number' && Number.isFinite(value) ? value : 0;
  }

  private readNullableNumber(source: Record<string, unknown>, key: string): number | null {
    const value = source[key];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }
}
