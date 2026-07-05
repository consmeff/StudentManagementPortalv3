export type StudentDashboardFeeInfo = {
  total_paid: number;
  total_due: number;
  number_of_payments: number;
};

export type StudentDashboardCoursesInfo = {
  registered_courses: number;
  units: number;
  failed_courses: number;
};

export type StudentDashboardAnnouncement = {
  title?: string | null;
  body?: string | null;
  message?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  time_ago?: string | null;
};

export type StudentDashboardResponse = {
  fee_info: StudentDashboardFeeInfo;
  courses_info: StudentDashboardCoursesInfo;
  cgpa: number;
  previous_cgpa: number;
  current_level: string;
  current_semester: string;
  academic_year: string;
  department: string;
  recent_announcements: StudentDashboardAnnouncement[];
  full_name: string;
  matriculation_number: string;
};
