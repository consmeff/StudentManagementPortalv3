import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CountryDTO, StatesDTO, LGADTO } from '../data/application/location.dto';
import { PaymentRefResponse } from '../data/application/payment.data';
import { PreRegistrationDataDTO } from '../data/application/preregistrationdatadto';
import { RegistrantDataDTO } from '../data/application/registrantdatadto';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  apiRoot = environment.apiURL;

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
  registratantData(app_no: string): Observable<RegistrantDataDTO> {
    return this.http.get<RegistrantDataDTO>(`${this.apiRoot}/api/v1/applicants/single?applicant_no=${app_no}`);
  }

  uploadFile(fileData: any): Observable<any> {
    return this.http.post<any>(`${this.apiRoot}/api/v1/uploads`, fileData);
  }
  verifyPayment(ref: { ref_id: string }): Observable<any> {
    return this.http.post<any>(`${this.apiRoot}/api/v1/callbacks/verify-payment-status`, ref);
  }
  getPaymentRef( refPayload:{ application_no: string }): Observable<PaymentRefResponse> {
    return this.http.post<PaymentRefResponse>(`${this.apiRoot}/api/v1/applicants/initiate-payment`, refPayload);
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
}
