export type StudentResultItem = {
  id: number;
  test_score: number | null;
  exam_score: number | null;
  grade: string | null;
  course_name: string;
  course_code: string;
};

export type StudentResultsResponse = {
  student_name: string;
  matric_no: string;
  program: string | null;
  level: string;
  total_student: number;
  semester: string;
  session: string;
  semester_gpa: number | null;
  results: StudentResultItem[];
};
