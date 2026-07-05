import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CountryDTO, StatesDTO, LGADTO } from '../data/application/location.dto';
import {
  PaginatedPaymentsResponse,
  PaymentHistoryItem,
  PaymentRefResponse
} from '../data/application/payment.data';
import { PreRegistrationDataDTO } from '../data/application/preregistrationdatadto';
import { RegistrantDataDTO, StudentSingleResponse } from '../data/application/registrantdatadto';
import { StudentDashboardResponse } from '../data/application/student-dashboard.dto';
import { StudentCgpaTrendResponse } from '../data/application/student-cgpa-trend.dto';
import { StudentResultsResponse } from '../data/application/student-results.dto';
import {
  StudentFeePartPaymentConfig,
  StudentFeePartPaymentEntry,
  StudentFeePaymentPayload,
  StudentFeePlan,
  StudentFeePlanResponse,
  StudentSchoolFeePaymentStatus,
  StudentSchoolFeeStatus
} from '../data/application/student-fees.dto';
import { selectStudentFeePlan } from '../utility/student-fees-plan';
import {
  AvailableCoursesResponse,
  RegisterCoursesPayload,
  RegisteredCoursesResponse
} from '../data/application/courseregistration.dto';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private readonly apiRoot = environment.apiURL;

  private readonly paymentsEndpoint = `${this.apiRoot}/api/v1/payments/payments`;

  private readonly studentFeesEndpoint = `${this.apiRoot}/api/v1/payments/student-fees`;

  private readonly payStudentFeeEndpoint = `${this.apiRoot}/api/v1/students/pay-fee`;

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

  studentData(): Observable<StudentSingleResponse> {
    return this.http.get<unknown>(`${this.apiRoot}/api/v1/students/single`).pipe(
      map((response) => this.normalizeStudentSingleResponse(response))
    );
  }

  getStudentDashboard(): Observable<StudentDashboardResponse> {
    return this.http.get<unknown>(`${this.apiRoot}/api/v1/students/dashboard`).pipe(
      map((response) => this.normalizeStudentDashboardResponse(response))
    );
  }

  getStudentResults(): Observable<StudentResultsResponse> {
    return this.http.get<unknown>(`${this.apiRoot}/api/v1/students/student/my-results`).pipe(
      map((response) => this.normalizeStudentResultsResponse(response))
    );
  }

  getStudentCgpaTrend(): Observable<StudentCgpaTrendResponse> {
    return this.http.get<unknown>(`${this.apiRoot}/api/v1/students/cgpa-trend`).pipe(
      map((response) => this.normalizeStudentCgpaTrendResponse(response))
    );
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

  acceptanceFeePayment(refPayload: { application_no: string }): Observable<PaymentRefResponse> {
    return this.http.post<PaymentRefResponse>(`${this.apiRoot}/api/v1/applicants/acceptance-fee-payment`, refPayload);
  }

  getStudentFeePlans(): Observable<StudentFeePlanResponse> {
    return this.http.get<unknown>(this.studentFeesEndpoint).pipe(
      map((response) => this.normalizeStudentFeePlansResponse(response))
    );
  }

  getStudentSchoolFeeStatus(): Observable<StudentSchoolFeeStatus> {
    return this.http.get<unknown>(this.studentFeesEndpoint).pipe(
      map((response) => this.normalizeStudentSchoolFeeStatusResponse(response))
    );
  }

  initiateStudentFeePayment(payload: StudentFeePaymentPayload): Observable<PaymentRefResponse> {
    return this.http.post<PaymentRefResponse>(this.payStudentFeeEndpoint, payload);
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

  getAvailableCourses(): Observable<AvailableCoursesResponse> {
    return this.http.get<AvailableCoursesResponse>(`${this.apiRoot}/api/v1/students/register-courses`);
  }

  getCurrentCourses(): Observable<RegisteredCoursesResponse> {
    return this.http.get<RegisteredCoursesResponse>(`${this.apiRoot}/api/v1/students/current-courses`);
  }

  registerCourses(payload: RegisterCoursesPayload): Observable<any> {
    return this.http.post<any>(`${this.apiRoot}/api/v1/students/register-courses`, payload);
  }

  submitProfileDocuments(payload: {
    documents: {
      recommendation_letter_1: any;
      recommendation_letter_2: any;
      testimonial: any;
    };
  }): Observable<any> {
    return this.http.post<any>(`${this.apiRoot}/api/v1/students/profile/recommendation-letter`, payload);
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

  private normalizeRegistrantResponse(response: unknown): RegistrantDataDTO {
    const registrant = this.extractRegistrantRecord(response);
    return { data: registrant ? registrant as unknown as RegistrantDataDTO['data'] : undefined };
  }

  private normalizeStudentSingleResponse(response: unknown): StudentSingleResponse {
    const record = this.extractRegistrantRecord(response);
    return { data: record as unknown as StudentSingleResponse['data'] };
  }

  private normalizeStudentDashboardResponse(response: unknown): StudentDashboardResponse {
    const rawResponse = this.getNestedRecord(response, 'data') ?? this.toRecord(response);
    return {
      fee_info: {
        total_paid: this.readNumberFromUnknown(rawResponse['fee_info'], 'total_paid'),
        total_due: this.readNumberFromUnknown(rawResponse['fee_info'], 'total_due'),
        number_of_payments: this.readNumberFromUnknown(rawResponse['fee_info'], 'number_of_payments')
      },
      courses_info: {
        registered_courses: this.readNumberFromUnknown(rawResponse['courses_info'], 'registered_courses'),
        units: this.readNumberFromUnknown(rawResponse['courses_info'], 'units'),
        failed_courses: this.readNumberFromUnknown(rawResponse['courses_info'], 'failed_courses')
      },
      cgpa: this.readNumber(rawResponse, 'cgpa'),
      previous_cgpa: this.readNumber(rawResponse, 'previous_cgpa'),
      current_level: this.readString(rawResponse, 'current_level'),
      current_semester: this.readString(rawResponse, 'current_semester'),
      academic_year: this.readString(rawResponse, 'academic_year'),
      department: this.readString(rawResponse, 'department'),
      recent_announcements: Array.isArray(rawResponse['recent_announcements'])
        ? rawResponse['recent_announcements'] as StudentDashboardResponse['recent_announcements']
        : [],
      full_name: this.readString(rawResponse, 'full_name'),
      matriculation_number: this.readString(rawResponse, 'matriculation_number')
    };
  }

  private normalizeStudentResultsResponse(response: unknown): StudentResultsResponse {
    const rawResponse = this.getNestedRecord(response, 'data') ?? this.toRecord(response);
    const results = Array.isArray(rawResponse['results']) ? rawResponse['results'] : [];

    return {
      student_name: this.readString(rawResponse, 'student_name'),
      matric_no: this.readString(rawResponse, 'matric_no'),
      program: this.readNullableString(rawResponse, 'program'),
      level: this.readString(rawResponse, 'level'),
      total_student: this.readNumber(rawResponse, 'total_student'),
      semester: this.readString(rawResponse, 'semester'),
      session: this.readString(rawResponse, 'session'),
      semester_gpa: this.readNullableNumber(rawResponse, 'semester_gpa'),
      results: results.map((item) => {
        const row = this.toRecord(item);
        return {
          id: this.readNumber(row, 'id'),
          test_score: this.readNullableNumber(row, 'test_score'),
          exam_score: this.readNullableNumber(row, 'exam_score'),
          grade: this.readNullableString(row, 'grade'),
          course_name: this.readString(row, 'course_name'),
          course_code: this.readString(row, 'course_code')
        };
      })
    };
  }

  private normalizeStudentCgpaTrendResponse(response: unknown): StudentCgpaTrendResponse {
    const rawResponse = this.getNestedRecord(response, 'data') ?? this.toRecord(response);
    const trendSource = Array.isArray(rawResponse['trend']) ? rawResponse['trend'] : [];

    return {
      best_cgpa: this.readNumber(rawResponse, 'best_cgpa'),
      worst_cgpa: this.readNumber(rawResponse, 'worst_cgpa'),
      current_cgpa: this.readNumber(rawResponse, 'current_cgpa'),
      semester_completed: this.readNumber(rawResponse, 'semester_completed'),
      trend: trendSource.map((item) => {
        const row = this.toRecord(item);
        return {
          session: this.readString(row, 'session'),
          semester: this.readString(row, 'semester'),
          cgpa: this.readNumber(row, 'cgpa')
        };
      })
    };
  }

  private extractRegistrantRecord(response: unknown): Record<string, unknown> | null {
    let current = this.toRecord(response);
    for (let step = 0; step < 4; step += 1) {
      if (this.looksLikeRegistrant(current)) {
        return current;
      }
      const studentValue = current['student'];
      if (this.isRecord(studentValue)) {
        current = studentValue;
        continue;
      }
      const dataValue = current['data'];
      if (this.isRecord(dataValue)) {
        current = dataValue;
        continue;
      }
      break;
    }
    return null;
  }

  private looksLikeRegistrant(value: Record<string, unknown>): boolean {
    return (
      typeof value['application_no'] === 'string'
      || typeof value['matriculation_no'] === 'string'
      || typeof value['matriculation_number'] === 'string'
      || typeof value['first_name'] === 'string'
      || typeof value['last_name'] === 'string'
      || typeof value['id'] === 'number'
    );
  }

  private normalizePaginatedPaymentsResponse(response: unknown): PaginatedPaymentsResponse {
    const rawResponse = this.getNestedRecord(response, 'data') ?? this.toRecord(response);
    const resultsSource = Array.isArray(rawResponse['results'])
      ? rawResponse['results']
      : Array.isArray(rawResponse['data'])
        ? rawResponse['data']
        : [];
    const primaryCount = this.readNumber(rawResponse, 'count');
    const fallbackCount = this.readNumber(rawResponse, 'total');
    const count = primaryCount > 0 ? primaryCount : fallbackCount;
    const next = this.readNullableString(rawResponse, 'next') ?? this.readNullableString(rawResponse, 'next_page_url');
    const previous = this.readNullableString(rawResponse, 'previous') ?? this.readNullableString(rawResponse, 'prev_page_url');

    return {
      count,
      next,
      previous,
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

  private normalizeStudentFeePlansResponse(response: unknown): StudentFeePlanResponse {
    const rawResponse = this.toRecord(response);
    const source = Array.isArray(rawResponse['data'])
      ? rawResponse['data']
      : Array.isArray(response)
        ? response
        : [];

    return {
      data: source.map((plan) => this.normalizeStudentFeePlan(plan))
    };
  }

  private normalizeStudentFeePlan(response: unknown): StudentFeePlan {
    const rawResponse = this.toRecord(response);
    return {
      id: this.readNumber(rawResponse, 'id'),
      deleted_at: this.readNullableString(rawResponse, 'deleted_at'),
      created_at: this.readString(rawResponse, 'created_at'),
      updated_at: this.readString(rawResponse, 'updated_at'),
      display_order: this.readNumber(rawResponse, 'display_order'),
      label: this.readString(rawResponse, 'label'),
      name: this.readString(rawResponse, 'name'),
      amount: this.readNumber(rawResponse, 'amount'),
      allow_partial_payment: this.readBoolean(rawResponse, 'allow_partial_payment'),
      part_payment_config: this.readStudentFeePartPaymentConfig(rawResponse, 'part_payment_config'),
      created_by: this.readNullableNumber(rawResponse, 'created_by'),
      updated_by: this.readNullableNumber(rawResponse, 'updated_by'),
      deleted_by: this.readNullableNumber(rawResponse, 'deleted_by'),
      department: this.readNumber(rawResponse, 'department'),
      level: this.readNumber(rawResponse, 'level'),
    };
  }

  private normalizeStudentSchoolFeeStatusResponse(response: unknown): StudentSchoolFeeStatus {
    const rawResponse = this.selectStudentSchoolFeeRecord(response);
    return {
      ...this.normalizeStudentFeePlan(rawResponse),
      payment_status: this.readStudentSchoolFeePaymentStatus(rawResponse, 'payment_status')
    };
  }

  private selectStudentSchoolFeeRecord(response: unknown): Record<string, unknown> {
    const rawResponse = this.toRecord(response);
    const source = Array.isArray(rawResponse['data'])
      ? rawResponse['data']
      : Array.isArray(response)
        ? response
        : [];

    const normalizedPlans = source.map((plan) => this.normalizeStudentFeePlan(plan));
    const selectedPlan = selectStudentFeePlan(normalizedPlans);
    if (!selectedPlan) {
      return this.getNestedRecord(response, 'data') ?? rawResponse;
    }

    const selectedRecord = source.find((entry) => {
      const normalizedEntry = this.normalizeStudentFeePlan(entry);
      return normalizedEntry.id === selectedPlan.id;
    });
    return this.toRecord(selectedRecord);
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

  private readNumberFromUnknown(source: unknown, key: string): number {
    return this.readNumber(this.toRecord(source), key);
  }

  private readNullableNumber(source: Record<string, unknown>, key: string): number | null {
    const value = source[key];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  private readBoolean(source: Record<string, unknown>, key: string): boolean {
    return source[key] === true;
  }

  private readStudentFeePartPaymentConfig(
    source: Record<string, unknown>,
    key: string
  ): StudentFeePartPaymentConfig {
    const value = source[key];
    if (!this.isRecord(value)) {
      return {};
    }

    return Object.entries(value).reduce<StudentFeePartPaymentConfig>((accumulator, [configKey, configValue]) => {
      if (!Array.isArray(configValue) || configValue.length < 2) {
        return accumulator;
      }

      const [amount, mode] = configValue;
      if (typeof amount !== 'number' || !Number.isFinite(amount) || typeof mode !== 'string') {
        return accumulator;
      }

      accumulator[configKey] = [amount, mode] satisfies StudentFeePartPaymentEntry;
      return accumulator;
    }, {});
  }

  private readStudentSchoolFeePaymentStatus(
    source: Record<string, unknown>,
    key: string
  ): StudentSchoolFeePaymentStatus {
    const value = source[key];
    if (!this.isRecord(value)) {
      return {
        total_paid: 0,
        total_due: 0,
        number_of_payments: 0,
        status: ''
      };
    }

    return {
      total_paid: this.readNumber(value, 'total_paid'),
      total_due: this.readNumber(value, 'total_due'),
      number_of_payments: this.readNumber(value, 'number_of_payments'),
      status: this.readString(value, 'status')
    };
  }
}
