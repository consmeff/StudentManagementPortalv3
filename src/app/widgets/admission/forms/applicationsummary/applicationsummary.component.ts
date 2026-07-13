import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { AccordionModule } from 'primeng/accordion';
import { SkeletonModule } from 'primeng/skeleton';

import { RegistrantDataDTO } from '../../../../data/application/registrantdatadto';
import { ApplicationService } from '../../../../services/application.service';
import { FormService } from '../../../services/form.service';
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { AuthSessionStore } from '../../../../store/auth-session.store';
import { TAcademicHistory, TNextOfKinDTO, TOLevelResult, TPersonalDetailDTO, TUploadFile, TUtmeResultPayload } from '../../../../data/application/transformer.dto';
import { LGA, States } from '../../../../data/application/location.dto';
import { formatFileSize } from '../../../../utility/yearutil';
import { parseDateOnly } from '../../../../utility/date-only';

interface LabelValueRow {
  label: string;
  value: string;
}

interface DocumentRow {
  label: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
}

const SUMMARY_ACCORDION_PANEL_VALUES = {
  personalInformation: 'personal-information',
  nextOfKinInformation: 'next-of-kin-information',
  academicHistory: 'academic-history',
  documents: 'documents'
} as const;

const ACTIVE_SUMMARY_ACCORDION_VALUES = Object.values(SUMMARY_ACCORDION_PANEL_VALUES);

@Component({
  selector: 'app-applicationsummary',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    SkeletonModule,
    TraceabilityModule
  ],
  templateUrl: './applicationsummary.component.html',
  styleUrl: './applicationsummary.component.scss'
})
export class ApplicationSummaryComponent implements OnInit {

  registrantData: RegistrantDataDTO = {};

  personalInfoItems: LabelValueRow[] = [];

  nextOfKinItems: LabelValueRow[] = [];

  academicItems: LabelValueRow[] = [];

  documentItems: DocumentRow[] = [];

  readonly accordionPanelValues = SUMMARY_ACCORDION_PANEL_VALUES;

  readonly activeAccordionValues = ACTIVE_SUMMARY_ACCORDION_VALUES;

  isLoading: boolean = true;

  personalDraft: TPersonalDetailDTO | null = null;

  nextOfKinDraft: TNextOfKinDTO | null = null;

  academicDraft: TAcademicHistory[] | null = null;

  oLevelDraft: TOLevelResult[] | null = null;

  utmeDraft: TUtmeResultPayload | null = null;

  uploadDraft: TUploadFile | null = null;

  private stateOptions: States[] = [];

  private readonly lgaCache = new Map<number, LGA[]>();

  private authSessionStore = inject(AuthSessionStore);

  private formService = inject(FormService);

  private router = inject(Router);

  private route = inject(ActivatedRoute);

  constructor(
    private appservice: ApplicationService
  ) { }

  ngOnInit(): void {
    this.observeDraftChanges();
    void this.dataInitialization();
  }

  async dataInitialization(): Promise<boolean> {
    let result = false;
    const app_no = this.authSessionStore.applicationNo() || "";
    
    if (app_no != "") {
      this.isLoading = true;
      await this.ensureStateOptions();
      await firstValueFrom(this.appservice.registrantData(app_no))
        .then(async (data) => {
          this.registrantData = data;
          await this.updateSummaryItems();
          result = true;
          this.isLoading = false;
        })
        .catch((err) => {
          console.error('Error loading application data:', err);
          this.isLoading = false;
        });
    }

    return result;
  }

  fullAddress(residential_address: any): string {
    if (residential_address == null) {
      return "";
    }
    return `
${residential_address.address}, 
${residential_address.street_name}, 
${residential_address.land_mark ? `${residential_address.land_mark  }, ` : ''}
${residential_address.city}, 
${residential_address.lga?.name || ''}, 
${residential_address.state?.name || ''}, 
${residential_address.country?.name || ''}
`.replace(/\n/g, ' ').replace(/ ,/g, ',').trim();
  }

  private async updateSummaryItems(): Promise<void> {
    const {data} = this.registrantData;
    const disability = this.personalDraft !== null
      ? this.resolveDisabilityDisplayValue(this.personalDraft)
      : data?.disability || '';
    const hasDisabilityDetails = disability.toLowerCase().includes('yes') && disability.includes(',');
    const disabilityDetails = hasDisabilityDetails
      ? disability.split(',').slice(1).join(',').trim()
      : '—';
    const personalStateOfOrigin = await this.resolveStateName(
      this.personalDraft?.stateOfOrigin,
      data?.state_of_origin
    );
    const personalLga = await this.resolveLgaName(
      this.personalDraft?.stateOfOrigin,
      this.personalDraft?.localGovernment,
      data?.lga
    );

    this.personalInfoItems = [
      { label: 'First Name', value: this.toDisplay(this.personalDraft?.firstname ?? data?.first_name) },
      { label: 'Last Name', value: this.toDisplay(this.personalDraft?.lastname ?? data?.last_name) },
      { label: 'Middle Name', value: this.toDisplay(this.personalDraft?.middlename ?? data?.other_names) },
      { label: 'Email Address', value: this.toDisplay(this.personalDraft?.email ?? data?.email) },
      { label: 'Phone Number', value: this.toDisplay(this.personalDraft?.phonenumber ?? data?.phone_number) },
      { label: 'Alternate Phone Number', value: this.toDisplay(this.personalDraft?.alternativePhoneNumber ?? data?.alt_phone_number) },
      { label: 'Date of Birth', value: this.formatDate(this.personalDraft?.dateOfBirth ?? data?.dob) },
      { label: 'Gender', value: this.toDisplay(this.personalDraft?.gender ?? data?.gender) },
      { label: 'Marital Status', value: this.toDisplay(this.personalDraft?.maritalStatus ?? data?.marital_status) },
      { label: 'Nationality', value: this.toDisplay(this.personalDraft?.nationality ?? data?.nationality) },
      { label: 'State of Origin', value: this.toDisplay(personalStateOfOrigin) },
      { label: 'Local Government Area', value: this.toDisplay(personalLga) },
      { label: 'Do you live with a disability?', value: this.toDisplay(disability.split(',')[0]) },
      { label: 'If yes, please specify', value: disabilityDetails },
      { label: 'Address', value: this.toDisplay(this.resolvePersonalAddress(data)) }
    ];
 
    const nok = this.registrantData.data?.primary_parent_or_guardian;
    const nextOfKinStateOfOrigin = await this.resolveStateName(
      this.nextOfKinDraft?.stateOfOrigin,
      nok?.state_of_origin
    );
    const nextOfKinLga = await this.resolveLgaName(
      this.nextOfKinDraft?.stateOfOrigin,
      this.nextOfKinDraft?.localGovernment,
      nok?.lga
    );
    this.nextOfKinItems = [
      { label: 'Title', value: this.toDisplay(this.nextOfKinDraft?.title ?? nok?.title) },
      { label: 'First Name', value: this.toDisplay(this.nextOfKinDraft?.firstname ?? nok?.first_name) },
      { label: 'Last Name', value: this.toDisplay(this.nextOfKinDraft?.lastname ?? nok?.last_name) },
      { label: 'Middle Name', value: this.toDisplay(this.nextOfKinDraft?.middlename ?? nok?.other_names) },
      { label: 'Gender', value: this.toDisplay(this.nextOfKinDraft?.gender ?? nok?.gender) },
      { label: 'Relationship', value: this.toDisplay(this.nextOfKinDraft?.relationship ?? '—') },
      { label: 'Occupation', value: this.toDisplay(this.nextOfKinDraft?.occupation ?? nok?.occupation) },
      { label: 'Phone Number', value: this.toDisplay(this.nextOfKinDraft?.phonenumber ?? nok?.phone_number) },
      { label: 'Email address (optional)', value: this.toDisplay(this.nextOfKinDraft?.email ?? nok?.email) },
      { label: 'Nationality', value: this.toDisplay(this.nextOfKinDraft?.nationality ?? nok?.nationality) },
      { label: 'State of Origin', value: this.toDisplay(nextOfKinStateOfOrigin) },
      { label: 'Local Government Area', value: this.toDisplay(nextOfKinLga) },
      { label: 'Address', value: this.toDisplay(this.resolveNextOfKinAddress(nok?.correspondence_address)) }
    ];

    this.academicItems = this.buildAcademicRows();
    const uploadData = this.uploadDraft;
    this.documentItems = [
      {
        label: 'Certificate of Birth',
        fileName: this.extractFileName(uploadData?.certificateofbirth?.file_url ?? data?.certificate_of_birth?.file_url),
        fileSize: this.toFileSize(uploadData?.certificateofbirth?.file_size ?? data?.certificate_of_birth?.file_size),
        fileUrl: uploadData?.certificateofbirth?.file_url ?? data?.certificate_of_birth?.file_url ?? ''
      },
      {
        label: "O' Level Result",
        fileName: this.extractFileName(uploadData?.olevels?.[0]?.file_url ?? data?.o_level_result?.[0]?.file?.file_url),
        fileSize: this.toFileSize(uploadData?.olevels?.[0]?.file_size ?? data?.o_level_result?.[0]?.file?.file_size),
        fileUrl: uploadData?.olevels?.[0]?.file_url ?? data?.o_level_result?.[0]?.file?.file_url ?? ''
      },
      {
        label: 'Passport Photograph',
        fileName: this.extractFileName(uploadData?.passport?.file_url ?? data?.passport_photo?.file_url),
        fileSize: this.toFileSize(uploadData?.passport?.file_size ?? data?.passport_photo?.file_size),
        fileUrl: uploadData?.passport?.file_url ?? data?.passport_photo?.file_url ?? ''
      },
      {
        label: 'UTME Result',
        fileName: this.extractFileName(uploadData?.utme?.file_url ?? data?.utme_result?.file?.file_url),
        fileSize: this.toFileSize(uploadData?.utme?.file_size ?? data?.utme_result?.file?.file_size),
        fileUrl: uploadData?.utme?.file_url ?? data?.utme_result?.file?.file_url ?? ''
      },
      {
        label: 'Certificate of Origin',
        fileName: this.extractFileName(uploadData?.origin?.file_url ?? data?.certificate_of_origin?.file_url),
        fileSize: this.toFileSize(uploadData?.origin?.file_size ?? data?.certificate_of_origin?.file_size),
        fileUrl: uploadData?.origin?.file_url ?? data?.certificate_of_origin?.file_url ?? ''
      }
    ].filter((doc) => !!doc.fileUrl);
  }

  private buildAcademicRows(): LabelValueRow[] {
    const {data} = this.registrantData;
    const history = this.academicDraft ?? data?.academic_history ?? [];
    const primary = history.find((item) =>
      item.certificate_type?.toLowerCase().includes('primary')
    );
    const secondary = history.find((item) =>
      item.certificate_type?.toLowerCase().includes('sss')
      || item.certificate_type?.toLowerCase().includes('ssce')
    );
    const others = history.filter((item) => item !== primary && item !== secondary);
    const attempts = this.oLevelDraft ?? data?.o_level_result ?? [];

    const rows: LabelValueRow[] = [
      { label: 'Primary School', value: this.toDisplay(primary?.institution) },
      {
        label: 'Duration',
        value: `${this.formatDate(primary?.from_date)} to ${this.formatDate(primary?.to_date)}`
      },
      { label: 'Secondary School', value: this.toDisplay(secondary?.institution) },
      {
        label: 'Duration',
        value: `${this.formatDate(secondary?.from_date)} to ${this.formatDate(secondary?.to_date)}`
      },
      { label: 'Qualification', value: this.toDisplay(secondary?.certificate_type) },
      { label: 'Number of Attempts', value: `${attempts.length || 0}` }
    ];

    attempts.forEach((attempt, index) => {
      const [examName, examYear] = (attempt.name || '').split('/');
      const grades = (attempt.subjects || [])
        .map((subject) => `${subject.subject} - ${subject.grade}`)
        .join(', ');

      rows.push({ label: `Examination Name${attempts.length > 1 ? ` (${index + 1})` : ''}`, value: this.toDisplay(examName) });
      rows.push({ label: `Examination Year${attempts.length > 1 ? ` (${index + 1})` : ''}`, value: this.toDisplay(examYear) });
      rows.push({ label: `Grades${attempts.length > 1 ? ` (${index + 1})` : ''}`, value: this.toDisplay(grades) });
    });

    others.forEach((item, index) => {
      rows.push({ label: `Qualification Name${others.length > 1 ? ` (${index + 1})` : ''}`, value: this.toDisplay(item.institution) });
      rows.push({ label: `Qualification Type${others.length > 1 ? ` (${index + 1})` : ''}`, value: this.toDisplay(item.certificate_type) });
      rows.push({
        label: `Duration${others.length > 1 ? ` (${index + 1})` : ''}`,
        value: `${this.formatDate(item.from_date)} to ${this.formatDate(item.to_date)}`
      });
    });

    rows.push({
      label: 'UTME Registration Number',
      value: this.toDisplay(this.utmeDraft?.utme_reg_no ?? data?.utme_reg_no)
    });
    rows.push({
      label: 'UTME Score',
      value: this.toDisplay(this.utmeDraft?.score ?? data?.utme_result?.score)
    });

    return rows;
  }

  private observeDraftChanges(): void {
    this.formService.personalform$.subscribe((data) => {
      this.personalDraft = data;
      this.refreshSummaryItems();
    });

    this.formService.nextofkinform$.subscribe((data) => {
      this.nextOfKinDraft = data;
      this.refreshSummaryItems();
    });

    this.formService.academicHistory$.subscribe((data) => {
      this.academicDraft = data;
      this.refreshSummaryItems();
    });

    this.formService.olevelResult$.subscribe((data) => {
      this.oLevelDraft = data;
      this.refreshSummaryItems();
    });

    this.formService.utmeResult$.subscribe((data) => {
      this.utmeDraft = data;
      this.refreshSummaryItems();
    });

    this.formService.uploadFile$.subscribe((data) => {
      this.uploadDraft = data;
      this.refreshSummaryItems();
    });
  }

  private refreshSummaryItems(): void {
    if (this.isLoading || !this.registrantData.data) {
      return;
    }

    void this.updateSummaryItems();
  }

  private async ensureStateOptions(): Promise<void> {
    if (this.stateOptions.length > 0) {
      return;
    }
    const response = await firstValueFrom(this.appservice.states());
    this.stateOptions = response.data ?? [];
  }

  private async resolveStateName(rawStateValue: string | undefined, fallbackStateName: string | undefined): Promise<string> {
    if (!rawStateValue) {
      return fallbackStateName ?? '';
    }
    const stateId = Number(rawStateValue);
    if (!Number.isFinite(stateId)) {
      return rawStateValue;
    }
    await this.ensureStateOptions();
    const matchedState = this.stateOptions.find((state) => state.id === stateId);
    return matchedState?.name ?? fallbackStateName ?? rawStateValue;
  }

  private async resolveLgaName(
    rawStateValue: string | undefined,
    rawLgaValue: string | undefined,
    fallbackLgaName: string | undefined
  ): Promise<string> {
    if (!rawLgaValue) {
      return fallbackLgaName ?? '';
    }
    const lgaId = Number(rawLgaValue);
    if (!Number.isFinite(lgaId)) {
      return rawLgaValue;
    }
    const stateId = Number(rawStateValue);
    if (!Number.isFinite(stateId)) {
      return fallbackLgaName ?? rawLgaValue;
    }
    const lgaOptions = await this.readLgaOptions(stateId);
    const matchedLga = lgaOptions.find((lga) => lga.id === lgaId);
    return matchedLga?.name ?? fallbackLgaName ?? rawLgaValue;
  }

  private async readLgaOptions(stateId: number): Promise<LGA[]> {
    const cachedLgas = this.lgaCache.get(stateId);
    if (cachedLgas) {
      return cachedLgas;
    }
    const response = await firstValueFrom(this.appservice.lgas(stateId));
    const lgaOptions = response.data ?? [];
    this.lgaCache.set(stateId, lgaOptions);
    return lgaOptions;
  }

  private resolveDisabilityDisplayValue(data: TPersonalDetailDTO): string {
    if (data.disability !== 'Yes') {
      return data.disability;
    }

    return data.disabilityDetails.trim().length > 0
      ? `${data.disability}, ${data.disabilityDetails}`
      : data.disability;
  }

  private resolvePersonalAddress(data: RegistrantDataDTO['data']): string {
    if (this.personalDraft === null) {
      return this.fullAddress(data?.residential_address);
    }

    return [
      this.personalDraft.houseNumber,
      this.personalDraft.streetName,
      this.personalDraft.landmark,
      this.personalDraft.areaTown
    ].filter((value) => value.trim().length > 0).join(', ');
  }

  private resolveNextOfKinAddress(fallbackAddress: string | undefined): string {
    if (this.nextOfKinDraft === null) {
      return fallbackAddress ?? '—';
    }

    return [
      this.nextOfKinDraft.houseNumber,
      this.nextOfKinDraft.streetName,
      this.nextOfKinDraft.landmark,
      this.nextOfKinDraft.areaTown
    ].filter((value) => value.trim().length > 0).join(', ');
  }

  openDocument(fileUrl: string): void {
    if (!fileUrl) {
      return;
    }
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  }

  editSection(step: number): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { step },
      queryParamsHandling: 'merge'
    });
  }

  private toDisplay(value: unknown): string {
    if (typeof value === 'string') {
      return value.trim() ? value : '—';
    }
    return value === null || value === undefined ? '—' : String(value);
  }

  // private formatDate(value: string | Date | undefined): string {
  //   if (!value) {
  //     return '—';
  //   }
  //   const date = new Date(value);
  //   if (Number.isNaN(date.getTime())) {
  //     return this.toDisplay(value);
  //   }
  //   return date.toLocaleDateString('en-GB');
  // }

  private formatDate(value: string | Date | undefined): string {
  if (!value) {
    return '—';
  }

  const date = parseDateOnly(value);

  if (!date) {
    return this.toDisplay(value);
  }

  return date.toLocaleDateString('en-GB');
}

  private toFileSize(value: number | undefined): string {
    if (!value) {
      return '—';
    }
    return formatFileSize(value);
  }

  private extractFileName(url: string | undefined): string {
    if (!url) {
      return 'Document';
    }
    const parts = url.split('/');
    return parts[parts.length - 1] || 'Document';
  }
}
