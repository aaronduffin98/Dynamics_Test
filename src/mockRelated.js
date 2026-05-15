/**
 * Mock relational data for list/detail prototypes (course links and lecturer assignments unused for developments).
 */

export const mockCourses = [
  {
    courseId: "CRS-COMP101",
    courseName: "Introduction to Computer Science",
    facultyDepartment: "School of Computing",
    duration: "1 semester",
    credits: 15,
  },
  {
    courseId: "CRS-MATH200",
    courseName: "Linear Algebra",
    facultyDepartment: "Mathematics",
    duration: "1 semester",
    credits: 15,
  },
  {
    courseId: "CRS-PHY150",
    courseName: "Physics for Scientists",
    facultyDepartment: "Physics",
    duration: "2 semesters",
    credits: 30,
  },
  {
    courseId: "CRS-ENG220",
    courseName: "Engineering Design Studio",
    facultyDepartment: "Engineering",
    duration: "1 semester",
    credits: 20,
  },
  {
    courseId: "CRS-BUS110",
    courseName: "Business Fundamentals",
    facultyDepartment: "Business School",
    duration: "1 semester",
    credits: 15,
  },
  {
    courseId: "CRS-STAT105",
    courseName: "Statistics and Data Literacy",
    facultyDepartment: "Mathematics",
    duration: "1 semester",
    credits: 15,
  },
];

export const mockLecturers = [
  {
    lecturerId: "LEC-1001",
    name: "Dr. Neil Smith",
    email: "n.smith@university.edu",
    department: "Computer Science",
  },
  {
    lecturerId: "LEC-1002",
    name: "Prof. Frank Brooks",
    email: "f.brooks@university.edu",
    department: "Mathematics",
  },
  {
    lecturerId: "LEC-1003",
    name: "Dr. Elena Vasquez",
    email: "e.vasquez@university.edu",
    department: "Physics",
  },
  {
    lecturerId: "LEC-1004",
    name: "Prof. James Okonkwo",
    email: "j.okonkwo@university.edu",
    department: "Engineering",
  },
];

/** studentId → courseIds[] (developments prototype: no course links) */
export const studentCourseLinks = {};

/** studentId → lecturerId (developments prototype: no lecturer assignments) */
export const studentLecturerLink = {};

function normalizeStudentKey(studentId) {
  return String(studentId).replace(/-/g, "");
}

const courseById = Object.fromEntries(mockCourses.map((c) => [c.courseId, c]));
const lecturerById = Object.fromEntries(mockLecturers.map((l) => [l.lecturerId, l]));

export function getCoursesForStudent(studentId, linksMap = studentCourseLinks) {
  const key = normalizeStudentKey(studentId);
  const ids = linksMap[key] ?? [];
  return ids.map((id) => courseById[id]).filter(Boolean);
}

export function getAssignedLecturer(studentId, lecturerMap = studentLecturerLink) {
  const key = normalizeStudentKey(studentId);
  const lid = lecturerMap[key];
  return lid ? lecturerById[lid] ?? null : null;
}
