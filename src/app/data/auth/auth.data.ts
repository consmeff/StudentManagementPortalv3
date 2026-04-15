export interface validationCheckDTO{
  title:string;
  status:boolean;
}

export interface ProfilePayload {
  first_name:       string;
  last_name:        string;
  other_names:      string;
  email:            string;
  phone_number:     string;
  alt_phone_number: string;
  password:         string;
}

export interface ProfileSuccessResponse {
  message:      string;
  email:        string;
  phone_number: string;
}
export interface ProfileFailResponse {
  non_field_errors: string[];
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  name: string;
  roles: string[];
  permissions: string[];
  user_type: string;
  password_reset_required: boolean;
  matriculation_no: string;
  application_no: string;
  payment_status: string;
}
