export type StudentCgpaTrendItem = {
  session: string;
  semester: string;
  cgpa: number;
};

export type StudentCgpaTrendResponse = {
  best_cgpa: number;
  worst_cgpa: number;
  current_cgpa: number;
  semester_completed: number;
  trend: StudentCgpaTrendItem[];
};
