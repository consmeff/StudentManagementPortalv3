export interface CourseInfo {
  id: number;
  code: string;
  title: string;
  description: string;
  units: string;
  department: number;
  school_semester?: string;
}

export interface AvailableCourse {
  id: number;
  department_name: string;
  level_name: string;
  semester: unknown;
  course: CourseInfo;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  is_elective: boolean;
  units: number;
  created_by: number;
  updated_by: number;
  deleted_by: number | null;
  department: number;
  level: number;
}

export interface RegisteredCourse {
  id: number;
  course: AvailableCourse;
  semester: string;
  level: string;
  department: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  is_elective: boolean;
  is_outstanding: boolean;
  units: number;
  test_score: number;
  exam_score: number;
  grade: string | null;
  status: string;
  is_approved: boolean;
  result_approved: boolean;
  result_released: boolean;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
  student: number;
  approved_by: number | null;
}

export interface AvailableCoursesResponse {
  data: AvailableCourse[];
}

export interface RegisteredCoursesResponse {
  first_semester: RegisteredCourse[];
  second_semester: RegisteredCourse[];
}

export function flattenRegisteredCoursesResponse(response: RegisteredCoursesResponse): RegisteredCourse[] {
  return [
    ...(response.first_semester ?? []),
    ...(response.second_semester ?? [])
  ];
}

export interface RegisterCoursesPayload {
  course_ids: number[];
}
