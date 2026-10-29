import { RegisteredCourse } from '../data/application/courseregistration.dto';
import { downloadBlob } from './file-download';

const FIRST_SEMESTER_MARKERS = ['first', '1st'];
const SECOND_SEMESTER_MARKERS = ['second', '2nd'];
const COURSE_SLIP_MIME_TYPE = 'text/plain;charset=utf-8';

function readSemesterKey(course: RegisteredCourse): string {
  return (course.course?.course?.school_semester ?? course.semester ?? '').toLowerCase();
}

function matchesSemester(course: RegisteredCourse, markers: string[]): boolean {
  const semesterKey = readSemesterKey(course);
  return markers.some((marker) => semesterKey.includes(marker));
}

export function isFirstSemesterRegisteredCourse(course: RegisteredCourse): boolean {
  return matchesSemester(course, FIRST_SEMESTER_MARKERS);
}

export function isSecondSemesterRegisteredCourse(course: RegisteredCourse): boolean {
  return matchesSemester(course, SECOND_SEMESTER_MARKERS);
}

export function formatRegisteredCourseLine(course: RegisteredCourse): string {
  const courseInfo = course.course?.course;
  return `${courseInfo?.code ?? 'N/A'} - ${courseInfo?.title ?? 'N/A'} (${course.units} Units)`;
}

export function downloadCourseSlipFile(headerLines: string[], courses: RegisteredCourse[], fileName: string): void {
  const totalUnits = courses.reduce((sum, course) => sum + course.units, 0);
  const lines = [
    ...headerLines,
    ...courses.map((course) => formatRegisteredCourseLine(course)),
    '',
    `Total Courses: ${courses.length}`,
    `Total Units: ${totalUnits}`,
  ];
  downloadBlob(new Blob([lines.join('\n')], { type: COURSE_SLIP_MIME_TYPE }), fileName);
}
