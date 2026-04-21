import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

// PrimeNG Imports
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';

// Services & DTOs
import { RegistrantDataDTO } from '../../../../data/application/registrantdatadto';
import { ApplicationService } from '../../../../services/application.service';
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { AuthSessionStore } from '../../../../store/auth-session.store';
import { formatFileSize } from '../../../../utility/yearutil';

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

@Component({
  selector: 'app-applicationsummary',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    CardModule,
    DividerModule,
    ImageModule,
    SkeletonModule,
    TraceabilityModule
  ],
  templateUrl: './applicationsummary.component.html',
  styleUrl: './applicationsummary.component.scss'
})
export class ApplicationsummaryComponent implements OnInit {

  registrantData: RegistrantDataDTO = {};
  personalInfoItems: LabelValueRow[] = [];
  nextOfKinItems: LabelValueRow[] = [];
  academicItems: LabelValueRow[] = [];
  documentItems: DocumentRow[] = [];
  activeAccordionIndexes = [0, 1, 2, 3];
  placeholder: string = "../../../../assets/doc.png";
  isLoading: boolean = true;

  private authSessionStore = inject(AuthSessionStore);

  constructor(
    private appservice: ApplicationService
  ) { }

  ngOnInit(): void {
    this.dataIntitialization();
  }

  async dataIntitialization(): Promise<boolean> {
    let result = false;
    let app_no = this.authSessionStore.applicationNo() || "";
    
    if (app_no != "") {
      this.isLoading = true;
      await firstValueFrom(this.appservice.registratantData(app_no))
        .then(async (data) => {
          this.registrantData = data;
          this.updateSummaryItems();
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
${residential_address.land_mark ? residential_address.land_mark + ', ' : ''}
${residential_address.city}, 
${residential_address.lga?.name || ''}, 
${residential_address.state?.name || ''}, 
${residential_address.country?.name || ''}
`.replace(/\n/g, ' ').replace(/ ,/g, ',').trim();
  }

  getImageUrl(url: string | undefined): string {
    return url || this.placeholder;
  }

  private updateSummaryItems(): void {
    const data = this.registrantData.data;
    const disability = data?.disability || '';
    const hasDisabilityDetails = disability.toLowerCase().includes('yes') && disability.includes(',');
    const disabilityDetails = hasDisabilityDetails
      ? disability.split(',').slice(1).join(',').trim()
      : '—';

    this.personalInfoItems = [
      { label: 'First Name', value: this.toDisplay(data?.first_name) },
      { label: 'Last Name', value: this.toDisplay(data?.last_name) },
      { label: 'Middle Name', value: this.toDisplay(data?.other_names) },
      { label: 'Email Address', value: this.toDisplay(data?.email) },
      { label: 'Phone Number', value: this.toDisplay(data?.phone_number) },
      { label: 'Alternate Phone Number', value: this.toDisplay(data?.alt_phone_number) },
      { label: 'Date of Birth', value: this.formatDate(data?.dob) },
      { label: 'Gender', value: this.toDisplay(data?.gender) },
      { label: 'Marital Status', value: this.toDisplay(data?.marital_status) },
      { label: 'Nationality', value: this.toDisplay(data?.nationality) },
      { label: 'State of Origin', value: this.toDisplay(data?.state_of_origin) },
      { label: 'Local Government Area', value: this.toDisplay(data?.lga) },
      { label: 'Do you live with a disability?', value: this.toDisplay(disability.split(',')[0]) },
      { label: 'If yes, please specify', value: disabilityDetails },
      { label: 'Address', value: this.toDisplay(this.fullAddress(data?.residential_address)) }
    ];
 
    const nok = this.registrantData.data?.primary_parent_or_guardian;
    this.nextOfKinItems = [
      { label: 'Title', value: this.toDisplay(nok?.title) },
      { label: 'First Name', value: this.toDisplay(nok?.first_name) },
      { label: 'Last Name', value: this.toDisplay(nok?.last_name) },
      { label: 'Middle Name', value: this.toDisplay(nok?.other_names) },
      { label: 'Gender', value: this.toDisplay(nok?.gender) },
      { label: 'Relationship', value: '—' },
      { label: 'Occupation', value: this.toDisplay(nok?.occupation) },
      { label: 'Phone Number', value: this.toDisplay(nok?.phone_number) },
      { label: 'Email address (optional)', value: this.toDisplay(nok?.email) },
      { label: 'Nationality', value: this.toDisplay(nok?.nationality) },
      { label: 'State of Origin', value: this.toDisplay(nok?.state_of_origin) },
      { label: 'Local Government Area', value: this.toDisplay(nok?.lga) },
      { label: 'Address', value: this.toDisplay(nok?.correspondence_address) }
    ];

    this.academicItems = this.buildAcademicRows();
    this.documentItems = [
      {
        label: 'Certificate of Birth',
        fileName: this.extractFileName(data?.certificate_of_birth?.file_url),
        fileSize: this.toFileSize(data?.certificate_of_birth?.file_size),
        fileUrl: data?.certificate_of_birth?.file_url || ''
      },
      {
        label: "O' Level Result",
        fileName: this.extractFileName(data?.o_level_result?.[0]?.file?.file_url),
        fileSize: this.toFileSize(data?.o_level_result?.[0]?.file?.file_size),
        fileUrl: data?.o_level_result?.[0]?.file?.file_url || ''
      },
      {
        label: 'Passport Photograph',
        fileName: this.extractFileName(data?.passport_photo?.file_url),
        fileSize: this.toFileSize(data?.passport_photo?.file_size),
        fileUrl: data?.passport_photo?.file_url || ''
      },
      {
        label: 'UTME Result',
        fileName: this.extractFileName(data?.utme_result?.file?.file_url),
        fileSize: this.toFileSize(data?.utme_result?.file?.file_size),
        fileUrl: data?.utme_result?.file?.file_url || ''
      },
      {
        label: 'Certificate of Origin',
        fileName: this.extractFileName(data?.certificate_of_origin?.file_url),
        fileSize: this.toFileSize(data?.certificate_of_origin?.file_size),
        fileUrl: data?.certificate_of_origin?.file_url || ''
      }
    ].filter((doc) => !!doc.fileUrl);
  }

  private buildAcademicRows(): LabelValueRow[] {
    const data = this.registrantData.data;
    const history = data?.academic_history || [];
    const primary = history.find((item) =>
      item.certificate_type?.toLowerCase().includes('primary')
    );
    const secondary = history.find((item) =>
      item.certificate_type?.toLowerCase().includes('sss')
      || item.certificate_type?.toLowerCase().includes('ssce')
    );
    const others = history.filter((item) => item !== primary && item !== secondary);
    const attempts = data?.o_level_result || [];

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

    return rows;
  }

  openDocument(fileUrl: string): void {
    if (!fileUrl) {
      return;
    }
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  }

  private toDisplay(value: unknown): string {
    if (typeof value === 'string') {
      return value.trim() ? value : '—';
    }
    return value === null || value === undefined ? '—' : String(value);
  }

  private formatDate(value: string | Date | undefined): string {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
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
