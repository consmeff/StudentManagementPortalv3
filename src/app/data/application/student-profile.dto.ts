export type StudentAddressPayload = {
  address?: string;
  street_name?: string;
  land_mark?: string;
  city?: string;
};

export type StudentGuardianPayload = {
  title?: string;
  first_name?: string;
  last_name?: string;
  other_names?: string;
  email?: string;
  occupation?: string;
  phone_number?: string;
  alt_phone_number?: string;
  residential_address?: string;
  state_of_origin?: string;
  lga?: string;
};

export type StudentProfileUpdatePayload = {
  first_name?: string;
  last_name?: string;
  other_names?: string;
  email?: string;
  phone_number?: string;
  alt_phone_number?: string;
  dob?: string;
  gender?: string;
  marital_status?: string;
  nationality?: string;
  state_of_origin?: string;
  lga?: string;
  disability?: string | null;
  residential_address?: StudentAddressPayload;
  primary_parent_or_guardian?: StudentGuardianPayload;
};
