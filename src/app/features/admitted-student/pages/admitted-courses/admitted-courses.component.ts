import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdmittedFlowService } from '../../admitted-flow.service';
import { TraceabilityModule } from '../../../../shared/traceability.module';

type CourseItem = {
  code: string;
  title: string;
  units: number;
  semester: 'First Semester' | 'Second Semester';
  locked?: boolean;
};

@Component({
  selector: 'app-admitted-courses',
  standalone: true,
  imports: [CommonModule, TraceabilityModule],
  templateUrl: './admitted-courses.component.html',
  styleUrl: './admitted-courses.component.scss'
})
export class AdmittedCoursesComponent {
  private readonly router = inject(Router);
  readonly flow = inject(AdmittedFlowService);

  readonly registrationSubmitted = signal(false);
  readonly selectedCodes = signal<string[]>([]);

  readonly courses = signal<CourseItem[]>([
    { code: 'NUR 101', title: 'Introduction to Nursing Science', units: 3, semester: 'First Semester' },
    { code: 'ANA 101', title: 'General Human Anatomy', units: 3, semester: 'First Semester' },
    { code: 'PHY 101', title: 'General Physics for Health Sciences', units: 3, semester: 'First Semester' },
    { code: 'CHM 101', title: 'Basic Chemistry', units: 3, semester: 'First Semester' },
    { code: 'GST 111', title: 'Communication in English', units: 2, semester: 'First Semester' },
    { code: 'NUR 102', title: 'Foundations of Professional Nursing', units: 3, semester: 'Second Semester' },
    { code: 'BIO 102', title: 'General Biology', units: 3, semester: 'Second Semester' },
    { code: 'BCH 102', title: 'Introduction to Biochemistry', units: 3, semester: 'Second Semester' },
    { code: 'GST 112', title: 'Logic and Critical Thinking', units: 2, semester: 'Second Semester' },
    {
      code: 'NUR 201',
      title: 'Clinical Nursing Practice I',
      units: 3,
      semester: 'Second Semester',
      locked: true
    }
  ]);

  readonly selectedCourses = computed(() => {
    const selected = this.selectedCodes();
    return this.courses().filter((course) => selected.includes(course.code));
  });
  readonly selectedUnits = computed(() =>
    this.selectedCourses().reduce((sum, course) => sum + course.units, 0)
  );
  readonly selectedCount = computed(() => this.selectedCourses().length);
  readonly firstSemesterSelected = computed(() =>
    this.selectedCourses().filter((course) => course.semester === 'First Semester')
  );
  readonly secondSemesterSelected = computed(() =>
    this.selectedCourses().filter((course) => course.semester === 'Second Semester')
  );
  readonly canSubmit = computed(() => this.selectedCount() > 0 && !this.registrationSubmitted());

  toggleCourse(course: CourseItem, checked: boolean): void {
    if (course.locked || this.registrationSubmitted()) {
      return;
    }
    const current = this.selectedCodes();
    if (checked) {
      if (!current.includes(course.code)) {
        this.selectedCodes.set([...current, course.code]);
      }
      return;
    }
    this.selectedCodes.set(current.filter((code) => code !== course.code));
  }

  isChecked(code: string): boolean {
    return this.selectedCodes().includes(code);
  }

  submitRegistration(): void {
    if (!this.canSubmit()) {
      return;
    }
    this.registrationSubmitted.set(true);
  }

  goToPayment(): void {
    void this.router.navigateByUrl('/admitted/payment');
  }

  downloadCourseSlip(): void {
    const lines = [
      'Course Registration Slip',
      `Student Name: ${this.flow.applicantName()}`,
      `Matric Number: ${this.flow.applicationNo()}`,
      `Programme: ${this.flow.programmeName()}`,
      `Academic Session: ${this.flow.academicSession()}`,
      '',
      'Selected Courses:'
    ];
    this.selectedCourses().forEach((course) => {
      lines.push(`${course.semester} - ${course.code} - ${course.title} (${course.units} Units)`);
    });
    lines.push('');
    lines.push(`Total Courses: ${this.selectedCount()}`);
    lines.push(`Total Units: ${this.selectedUnits()}`);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `course-slip-${this.flow.applicationNo()}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
