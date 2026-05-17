import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FloatLabelModule } from 'primeng/floatlabel';

// Services
import { FormService } from '../../../services/form.service';
import { RegStoreService } from '../../../../services/regstore.service';
import { ApplicationService } from '../../../../services/application.service';
import { formstepDTO } from '../../../../data/application/form.dto';
import { LGA, RegistrantDataDTO } from '../../../../data/application/registrantdatadto';
import { Countries, States } from '../../../../data/application/location.dto';
import { TPersonalDetailDTO } from '../../../../data/application/transformer.dto';

@Component({
  selector: 'app-personaldetails',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    RadioButtonModule,
    FloatLabelModule
  ],
  templateUrl: './personaldetails.component.html',
  styleUrl: './personaldetails.component.scss',
  providers: []
})
export class PersonalDetailsComponent {
  _formStepService = inject(FormService);
  regstore = inject(RegStoreService);
  appservice = inject(ApplicationService);

  formStepStatus: formstepDTO = {
    academicValid: false,
    docUploadValid: false,
    nextofkinValid: false,
    personalinfoValid: false
  };

  personalInfoForm!: FormGroup;
  backendRegistrationData!: RegistrantDataDTO;
  draftPersonalData: TPersonalDetailDTO | null = null;
  
  maritalStatusOptions = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorced', value: 'Divorced' },
    { label: 'Widowed', value: 'Widowed' }
  ];
  
  genderOptions = ['Male', 'Female', 'Other'];
  categories: any[] = [
    { name: 'Cheese', key: 'C' },
    { name: 'Mushroom', key: 'M' },
    { name: 'Pepper', key: 'P' },
    { name: 'Onion', key: 'O' }
];
  
  disabilityOptions = ['Yes', 'No', 'Prefer not to say'];

  nationalityOptions: Countries[] | undefined = undefined;
  stateOptions: States[] | undefined = undefined;
  localGovOptions: LGA[] | undefined = undefined;
  residentialLocalGovernment: LGA[] | undefined = undefined;

  // Transformed options for PrimeNG dropdowns
  nationalityDropdownOptions: any[] = [];
  stateDropdownOptions: any[] = [];
  localGovDropdownOptions: any[] = [];
  residentialLGADropdownOptions: any[] = [];

  // Date constraints
  maxDate: Date = this.createMaxDobDate();
  minDate: Date = new Date(1940, 0, 1);
  maxBirthYear: number = this.maxDate.getFullYear();
  isEditable = true;

  private formInitialized = false;
  private formSubscriptions = new Subscription();
  private dropdownsHydrated = false;
  private lgaCache = new Map<number, LGA[]>();

  constructor(private fb: FormBuilder) {
    this.setupSubscriptions();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private setupSubscriptions() {
    this._formStepService.formsteps$.subscribe((step: formstepDTO) => {
      this.formStepStatus = step;
    });

    this._formStepService.applicationEditable$.subscribe((editable) => {
      this.isEditable = editable;
      this.applyEditableState();
    });

    this._formStepService.personalform$.subscribe((data) => {
      this.draftPersonalData = data;
    });

    this.regstore.countryData$.subscribe(data => {
      if (data?.data) {
        this.nationalityOptions = data.data;
        this.nationalityDropdownOptions = data.data.map(country => ({
          label: country.name,
          value: country.name
        }));
        this.setDropdownValuesIfReady();
      }
    });

    this.regstore.preRegData$.subscribe(data => {
      if (!data) return;

      this.maritalStatusOptions = data.marital_statuses.map((status) => ({
        label: status,
        value: status
      }));

      if (Array.isArray(data.gender) && data.gender.length > 0) {
        this.genderOptions = data.gender;
      }
    });

    this.regstore.stateData$.subscribe(data => {
      if (data?.data) {
        this.stateOptions = data.data;
        this.stateDropdownOptions = data.data.map(state => ({
          label: state.name,
          value: state.id
        }));
        this.setDropdownValuesIfReady();
      }
    });

    this.regstore.regData$.subscribe(data => {
      if (data) {
        this.backendRegistrationData = data;
        console.log(this.backendRegistrationData);
        this.initializeForm();
      }
    });
  }

  initializeForm() {
    this.formSubscriptions.unsubscribe();
    this.formSubscriptions = new Subscription();
    this.dropdownsHydrated = false;

    const data = this.backendRegistrationData?.data;
    const draftData = this.draftPersonalData;
    
    this.personalInfoForm = this.fb.group({
      // Personal Information
      firstname: [draftData?.firstname ?? data?.first_name ?? '', Validators.required],
      lastname: [draftData?.lastname ?? data?.last_name ?? '', Validators.required],
      middlename: [draftData?.middlename ?? data?.other_names ?? ''],
      email: [draftData?.email ?? data?.email ?? '', [Validators.required, Validators.email]],
      phonenumber: [draftData?.phonenumber ?? data?.phone_number ?? '', [Validators.required, Validators.pattern(/^\+?\(?[0-9]{1,4}\)?[-.\s]?[0-9]{1,15}$/)]],
      alternativePhoneNumber: [draftData?.alternativePhoneNumber ?? data?.alt_phone_number ?? '', Validators.pattern(/^\+?\(?[0-9]{1,4}\)?[-.\s]?[0-9]{1,15}$/)],
      dateOfBirth: [draftData?.dateOfBirth ?? (data?.dob ? new Date(data.dob) : null), [Validators.required, this.minimumAgeValidator(16)]],
      maritalStatus: [draftData?.maritalStatus ?? data?.marital_status ?? null, Validators.required],
      gender: [draftData?.gender ?? data?.gender ?? null, Validators.required],
      nationality: [draftData?.nationality ?? data?.nationality ?? 'Nigeria', Validators.required],
      stateOfOrigin: [draftData?.stateOfOrigin ?? null, Validators.required],
      localGovernment: [draftData?.localGovernment ?? null, Validators.required],
      disability: [draftData?.disability ?? (data?.disability?.toLowerCase().includes("no") ? 'No' : 'Yes'), Validators.required],
      disabilityDetails: [draftData?.disabilityDetails ?? ''],
      // Residential Information
      houseNumber: [draftData?.houseNumber ?? this.getAddressPart(data?.residential_address?.address, 0), Validators.required],
      streetName: [draftData?.streetName ?? data?.residential_address?.street_name ?? '', Validators.required],
      landmark: [draftData?.landmark ?? data?.residential_address?.land_mark ?? '', Validators.required],
      areaTown: [draftData?.areaTown ?? data?.residential_address?.city ?? '', Validators.required],
      residentialState: [draftData?.residentialState ?? null, Validators.required],
      residentialLocalGovernment: [draftData?.residentialLocalGovernment ?? null, Validators.required],
      
    });


    if (draftData === null) {
      this.handleDisabilityField(data);
    }
    this.setupFormSubscriptions();
    this.formInitialized = true;
    
    this.setDropdownValuesIfReady();
    this.applyEditableState();
  }

  private createMaxDobDate(): Date {
    const current = new Date();
    return new Date(current.getFullYear() - 16, current.getMonth(), current.getDate());
  }

  private minimumAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const date = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(date.getTime())) {
        return null;
      }

      const threshold = this.createMaxDobDate();
      return date > threshold ? { minAge: { requiredAge: minAge } } : null;
    };
  }

  private applyEditableState(): void {
    if (!this.personalInfoForm) {
      return;
    }

    if (this.isEditable) {
      this.personalInfoForm.enable({ emitEvent: false });
      return;
    }

    this.personalInfoForm.disable({ emitEvent: false });
  }

  private handleDisabilityField(data: any) {
    if (data?.disability) {
      if (data.disability.toLowerCase().includes("yes")) {
        this.personalInfoForm.get('disability')?.setValue("Yes");
        const details = data.disability.split(',').slice(1).join(',').trim();
        this.personalInfoForm.get('disabilityDetails')?.setValue(details || '');
      } else if (data.disability.toLowerCase().includes("no")) {
        this.personalInfoForm.get('disability')?.setValue("No");
      } else {
        this.personalInfoForm.get('disability')?.setValue(data.disability);
      }
    }
  }

  private setDropdownValuesIfReady() {
    if (!this.formInitialized || this.dropdownsHydrated || this.draftPersonalData !== null) return;
    if (!this.backendRegistrationData?.data) return;

    const data = this.backendRegistrationData.data;

    // Set nationality
    if (this.nationalityOptions) {
      const preferredNationality = data?.nationality || 'Nigeria';
      const nationality = this.findNationalityByName(preferredNationality);
      if (nationality) {
        this.personalInfoForm.get('nationality')?.setValue(nationality.name, { emitEvent: false });
      }
    }

    // Set state of origin and trigger LGA loading
    if (this.stateOptions && data?.state_of_origin) {
      const stateId = this.getStateIDByName(data.state_of_origin);
      if (stateId) {
        this.personalInfoForm.get('stateOfOrigin')?.setValue(stateId, { emitEvent: false });
        this.getLocalGovtByStateID(stateId);
      }
    }

    // Set residential state and trigger LGA loading
    if (this.stateOptions && data?.residential_address?.state) {
      const residentialStateName = data.residential_address.state.name;
      const residentialStateId = residentialStateName
        ? this.getStateIDByName(residentialStateName)
        : data.residential_address.state.id;
      if (residentialStateId) {
        this.personalInfoForm.get('residentialState')?.setValue(residentialStateId, { emitEvent: false });
        this.getLocalGovtByStateID2(residentialStateId);
      }
    }

    this.dropdownsHydrated = true;
  }

  private findNationalityByName(nationalityName: string): Countries | undefined {
    return this.nationalityOptions?.find(option => 
      option.name?.toLowerCase() === nationalityName.toLowerCase()
    );
  }

  getLocalGovtByStateID(val: number) {
    if (!val || val <= 0) {
      return;
    }
    const cached = this.lgaCache.get(val);
    if (cached) {
      this.localGovOptions = cached;
      this.localGovDropdownOptions = cached.map(lga => ({
        label: lga.name,
        value: lga.id
      }));
      this.regstore.setLGAData(this.localGovOptions);

      const backendLga = this.draftPersonalData === null ? this.backendRegistrationData?.data?.lga : null;
      if (backendLga) {
        const lgaId = this.getLocalGovtIDByName(backendLga);
        if (lgaId && this.personalInfoForm.get('localGovernment')?.value !== lgaId) {
          this.personalInfoForm.get('localGovernment')?.setValue(lgaId, { emitEvent: false });
        }
      }
      return;
    }

    this.appservice.lgas(val).subscribe(data => {
      if (data?.data) {
        this.lgaCache.set(val, data.data);
        this.localGovOptions = data.data;
        this.localGovDropdownOptions = data.data.map(lga => ({
          label: lga.name,
          value: lga.id
        }));
        this.regstore.setLGAData(this.localGovOptions);
        
        const backendLga = this.draftPersonalData === null ? this.backendRegistrationData?.data?.lga : null;
        if (backendLga) {
          const lgaId = this.getLocalGovtIDByName(backendLga);
          if (lgaId && this.personalInfoForm.get('localGovernment')?.value !== lgaId) {
            this.personalInfoForm.get('localGovernment')?.setValue(lgaId, { emitEvent: false });
          }
        }
      }
    });
  }

  getLocalGovtByStateID2(val: number) {
    if (!val || val <= 0) {
      return;
    }
    const cached = this.lgaCache.get(val);
    if (cached) {
      this.residentialLocalGovernment = cached;
      this.residentialLGADropdownOptions = cached.map(lga => ({
        label: lga.name,
        value: lga.id
      }));

      const backendResLga = this.draftPersonalData === null ? this.backendRegistrationData?.data?.residential_address?.lga?.id : null;
      if (backendResLga && this.personalInfoForm.get('residentialLocalGovernment')?.value !== backendResLga) {
        this.personalInfoForm.get('residentialLocalGovernment')?.setValue(backendResLga, { emitEvent: false });
      }
      return;
    }

    this.appservice.lgas(val).subscribe(data => {
      if (data?.data) {
        this.lgaCache.set(val, data.data);
        this.residentialLocalGovernment = data.data;
        this.residentialLGADropdownOptions = data.data.map(lga => ({
          label: lga.name,
          value: lga.id
        }));
        
        const backendResLga = this.draftPersonalData === null ? this.backendRegistrationData?.data?.residential_address?.lga?.id : null;
        if (backendResLga && this.personalInfoForm.get('residentialLocalGovernment')?.value !== backendResLga) {
          this.personalInfoForm.get('residentialLocalGovernment')?.setValue(backendResLga, { emitEvent: false });
        }
      }
    });
  }

  getStateIDByName(val: string): number | null {
    if (val && this.stateOptions) {
      const state = this.stateOptions.find(s => s.name.toLowerCase() === val.toLowerCase());
      return state?.id ?? null;
    }
    return null;
  }

  getLocalGovtIDByName(val: string): number | null {
    if (val && this.localGovOptions) {
      const lga = this.localGovOptions.find(l => l.name.toLowerCase() === val.toLowerCase());
      return lga?.id ?? null;
    }
    return null;
  }

  private getAddressPart(address: string | undefined, index: number): string {
    return address?.split(',')[index]?.trim() ?? '';
  }

  setupFormSubscriptions() {
    if (!this.personalInfoForm) return;

    // Disability field validation
    this.formSubscriptions.add(this.personalInfoForm.get('disability')?.valueChanges.subscribe((value) => {
      const disabilityDetailsControl = this.personalInfoForm.get('disabilityDetails');
      if (value === 'Yes') {
        disabilityDetailsControl?.setValidators(Validators.required);
      } else {
        disabilityDetailsControl?.clearValidators();
        disabilityDetailsControl?.setValue('');
      }
      disabilityDetailsControl?.updateValueAndValidity();
    }) ?? new Subscription());

    // State of origin changes
    this.formSubscriptions.add(this.personalInfoForm.get("stateOfOrigin")?.valueChanges.subscribe((val: number) => {
      if (val > 0) {
        this.personalInfoForm.get('localGovernment')?.setValue(null, { emitEvent: false });
        this.getLocalGovtByStateID(val);
      }
    }) ?? new Subscription());

    // Residential state changes
    this.formSubscriptions.add(this.personalInfoForm.get("residentialState")?.valueChanges.subscribe((val: number) => {
      if (val > 0) {
        this.personalInfoForm.get('residentialLocalGovernment')?.setValue(null, { emitEvent: false });
        this.getLocalGovtByStateID2(val);
      }
    }) ?? new Subscription());

    // Form validation and data setting
    this.formSubscriptions.add(this.personalInfoForm.valueChanges.subscribe(() => {
      if (this.personalInfoForm.valid) {
        this._formStepService.setPersonalFormData(this.personalInfoForm.value);
        this.formStepStatus.personalinfoValid = true;
        this._formStepService.setFormSteps(this.formStepStatus);
      } else {
        this.formStepStatus.personalinfoValid = false;
        this._formStepService.setFormSteps(this.formStepStatus);
      }
    }));
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.personalInfoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.personalInfoForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['pattern']) return 'Please enter a valid phone number';
      if (field.errors['minAge']) return 'Applicant must be at least 16 years old';
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstname: 'First Name',
      lastname: 'Last Name',
      email: 'Email Address',
      phonenumber: 'Phone Number',
      dateOfBirth: 'Date of Birth',
      maritalStatus: 'Marital Status',
      gender: 'Gender',
      nationality: 'Nationality',
      stateOfOrigin: 'State of Origin',
      localGovernment: 'Local Government',
      disability: 'Disability Status',
      disabilityDetails: 'Disability Details',
      houseNumber: 'House Number',
      streetName: 'Street Name',
      landmark: 'Landmark',
      areaTown: 'Area/Town',
      residentialState: 'Residential State',
      residentialLocalGovernment: 'Residential Local Government'
    };
    return labels[fieldName] || fieldName;
  }
}
