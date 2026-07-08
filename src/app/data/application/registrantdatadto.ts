

export interface RegistrantDataDTO {
  data?: RegistrantData;
}

export interface RegistrantData {
  gender: string;

  id:                           number;
  application_no:               string;
  matriculation_no?:            string | null;
  user_type?:                   string | null;
  first_name:                   string;
  last_name:                    string;
  other_names:                  string;
  email:                        string;
  phone_number:                 string;
  alt_phone_number:             string;
  certificate_of_birth:         CertificateOfBirth|undefined;
  o_level_result:               OLevelResult[];
  certificate_of_origin:        CertificateOfBirth|undefined;
  passport_photo:               CertificateOfBirth|undefined;
  payment_slip:               CertificateOfBirth|undefined;
  marital_status:               string;
  disability:               string;
  payment_status:               string;
  acceptance_fee_status?:       string | null;
  is_admitted?:                 boolean | null;
  utme_result:                  UtmeResult|undefined;
  utme_reg_no?:                 string | null;
  residential_address:          Address|undefined;
  correspondence_address:       Address|undefined;
  nationality:                  string;
  dob: string;
  state_of_origin:              string;
  lga:                          string;
  primary_parent_or_guardian:   AryParentOrGuardian|undefined;
  secondary_parent_or_guardian: AryParentOrGuardian|undefined;
  approval_status:              string;
  compliance_directive?:        string | null;
  payment_record:               null;
  program:                      Department;
  session:                      Session;
  academic_history?:             AcademicHistory[];
  department:                   Department;
  deleted_at:                   null;
  created_at:                   Date|undefined;
  updated_at:                   Date|undefined;
}

export interface AcademicHistory {
  institution:      string;
  certificate_type: string;
  from_date:        string;
  to_date:          string;
  certificate:      CertificateOfBirth;
}

export interface CertificateOfBirth {
  file_url?:  string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
}

export interface Address {
  address:     string;
  street_name: string;
  land_mark:   string;
  city:        string;
  lga:         LGA;
  state:       State;
  country:     Country;
}

export interface Country {
  id:   number;
  name: string;
}
export interface LGA {
  id:   number;
  name: string;
}



export interface State {
  id:      number;
  name:    string;
  capital: string;
}

export interface Department {
  id:   number;
  name: string;
  code: string;
}

export interface OLevelResult {
  name:string;
  subjects: Subject[];
  file:     CertificateOfBirth;
}

export interface Subject {
  subject: string;
  grade:   string;
}

export interface AryParentOrGuardian {
  lga: string;
  title:                  string;
  first_name:             string;
  last_name:              string;
  other_names:            string;
  email:                  string;
  gender:                 string;
  phone_number:           string;
  alt_phone_number:       string;
  occupation:             string;
  residential_address:    string;
  correspondence_address: string;
  nationality:            string;
  state_of_origin:        string;
}

export interface Session {
  id:         number;
  name:       string;
  start_date: Date;
  end_date:   Date;
}

export interface UtmeResult {
  score?: number;
  file:  CertificateOfBirth;
}

export type StudentSingleResponse = {
  data: StudentSingleData | null;
};

export type StudentLevel = {
  id: number;
  name: string;
  is_active: boolean;
};

export type StudentDepartment = {
  id: number;
  name: string;
  code: string;
};

export type StudentAdmissionDocuments = {
  testimonial: CertificateOfBirth | null;
  recommendation_letter_1: CertificateOfBirth | null;
  recommendation_letter_2: CertificateOfBirth | null;
};

export type StudentSingleData = {
  id: number;
  matriculation_number: string;
  first_name: string;
  last_name: string;
  other_names: string;
  email: string;
  phone_number: string;
  alt_phone_number: string;
  level: StudentLevel | null;
  session: Session | null;
  semester: unknown;
  department: StudentDepartment | null;
  program: unknown;
  admission_documents: StudentAdmissionDocuments | null;
  admission_document_verified: boolean;
  dob: string | null;
  certificate_of_birth: CertificateOfBirth | null;
  o_level_result: OLevelResult[] | null;
  certificate_of_origin: CertificateOfBirth | null;
  passport_photo: CertificateOfBirth | null;
  utme_reg_no: string | null;
  utme_result: UtmeResult | null;
  residential_address: Address | null;
  correspondence_address: Address | null;
  nationality: string | null;
  state_of_origin: string | null;
  lga: string | null;
  marital_status: string | null;
  primary_parent_or_guardian: AryParentOrGuardian | null;
  secondary_parent_or_guardian: AryParentOrGuardian | null;
  activities: unknown[];
  disability: string | null;
  compliance_directive: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};
