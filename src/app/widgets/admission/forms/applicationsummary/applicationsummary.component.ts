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
  personalInfoItems: Array<{ label: string; value: any }> = [];
  nextOfKinItems: Array<{ label: string; value: any }> = [];
  documentItems: Array<{ label: string; imageUrl: string | undefined }> = [];
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

  getValue(value: any): string {
    return value || '—';
  }

  private updateSummaryItems(): void {
    const data = this.registrantData.data;
    this.personalInfoItems = [
      { label: 'First Name', value: data?.first_name },
      { label: 'Last Name', value: data?.last_name },
      { label: 'Middle Name', value: data?.other_names },
      { label: 'Email Address', value: data?.email },
      { label: 'Phone Number', value: data?.phone_number },
      { label: 'Alternate Phone Number', value: data?.alt_phone_number },
      { label: 'Date of Birth', value: data?.dob },
      { label: 'Gender', value: data?.gender },
      { label: 'Marital Status', value: data?.marital_status },
      { label: 'Nationality', value: data?.nationality },
      { label: 'State of Origin', value: data?.state_of_origin },
      { label: 'Local Government', value: data?.lga },
      { label: 'Do you live with a disability?', value: data?.disability },
      { label: 'Address', value: this.fullAddress(data?.residential_address) }
    ];
 
    const nok = this.registrantData.data?.primary_parent_or_guardian;
    this.nextOfKinItems = [
      { label: 'Title', value: nok?.title },
      { label: 'First Name', value: nok?.first_name },
      { label: 'Last Name', value: nok?.last_name },
      { label: 'Middle Name', value: nok?.other_names },
      { label: 'Gender', value: nok?.gender },
      { label: 'Relationship', value: '—' },
      { label: 'Occupation', value: nok?.occupation },
      { label: 'Phone Number', value: nok?.phone_number },
      { label: 'Email Address (optional)', value: nok?.email },
      { label: 'Nationality', value: nok?.nationality },
      { label: 'State of Origin', value: nok?.state_of_origin },
      { label: 'Local Government', value: nok?.lga },
      { label: 'Address', value: nok?.correspondence_address }
    ];

    this.documentItems = [
      { 
        label: 'Certificate of Birth', 
        imageUrl: data?.certificate_of_birth?.file_url 
      },
      { 
        label: "O' Level Result", 
        imageUrl: data?.o_level_result?.[0]?.file?.file_url 
      },
      { 
        label: 'Passport Photograph', 
        imageUrl: data?.passport_photo?.file_url 
      },
      { 
        label: 'UTME Result', 
        imageUrl: data?.utme_result?.file?.file_url 
      },
      { 
        label: 'Certificate of Origin', 
        imageUrl: data?.certificate_of_origin?.file_url 
      }
    ];
  }
}
