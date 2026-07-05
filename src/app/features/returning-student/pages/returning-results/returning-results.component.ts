import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ReturningFlowService } from '../../returning-flow.service';

@Component({
  selector: 'app-returning-results',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './returning-results.component.html',
  styleUrl: './returning-results.component.scss'
})
export class ReturningResultsComponent implements OnInit {
  readonly flow = inject(ReturningFlowService);

  ngOnInit(): void {
    void Promise.allSettled([
      this.flow.loadStudentDashboard(),
      this.flow.loadStudentResults()
    ]);
  }

  downloadResultSlip(): void {
    const lines = [
      'Semester Result Slip',
      `Student Name: ${this.flow.studentName()}`,
      `Matric Number: ${this.flow.matricNo()}`,
      `Session: ${this.flow.session()}`,
      `Semester: ${this.flow.selectedSemesterLabel()}`,
      ''
    ];
    this.flow.semesterResultRows().forEach((row) => {
      lines.push(
        `${row.code} ${row.title} Units:${row.units ?? '—'} CA:${row.ca} EX:${row.exam} Total:${row.total} Grade:${row.grade ?? '—'}`
      );
    });
    lines.push('');
    lines.push(`Semester GPA: ${this.flow.formattedSemesterResultGpa()}`);
    lines.push(`CGPA: ${this.flow.formattedCurrentCgpa()}`);

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `result-slip-${this.flow.matricNo().replace(/[^\w-]/g, '-')}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
