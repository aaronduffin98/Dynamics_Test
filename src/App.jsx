import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { useCallback, useMemo, useState } from "react";
import ContractDetailView from "./ContractDetailView.jsx";
import ContractsGrid from "./ContractsGrid.jsx";
import CourseDetailView from "./CourseDetailView.jsx";
import CoursesGrid from "./CoursesGrid.jsx";
import DepartmentDetailView from "./DepartmentDetailView.jsx";
import DepartmentsGrid from "./DepartmentsGrid.jsx";
import LecturerDetailView from "./LecturerDetailView.jsx";
import LecturersGrid from "./LecturersGrid.jsx";
import SalesStaffDetailView from "./SalesStaffDetailView.jsx";
import SalesStaffGrid from "./SalesStaffGrid.jsx";
import StaffDetailView from "./StaffDetailView.jsx";
import StaffGrid from "./StaffGrid.jsx";
import BuyerDetailView from "./BuyerDetailView.jsx";
import BuyersGrid from "./BuyersGrid.jsx";
import PropertiesGrid from "./PropertiesGrid.jsx";
import PropertyDetailView from "./PropertyDetailView.jsx";
import StudentDetailView from "./StudentDetailView.jsx";
import StudentsGrid from "./StudentsGrid.jsx";
import UniversityApplicationForm from "./UniversityApplicationForm.jsx";
import { mockDepartments } from "./mockDepartments.js";
import { mockInstitutionCourses } from "./mockInstitutionCourses.js";
import { mockInstitutionLecturers } from "./mockInstitutionLecturers.js";
import { studentCourseLinks, studentLecturerLink } from "./mockRelated.js";
import { mockSalesStaff } from "./mockSalesStaff.js";
import { mockStaff } from "./mockStaff.js";
import { mockContracts } from "./mockContracts.js";
import { mockBuyers } from "./mockBuyers.js";
import { mockProperties } from "./mockProperties.js";
import { mockStudents } from "./mockStudents.js";

function studentRecordKey(studentId) {
  return String(studentId).replace(/-/g, "");
}

export default function App() {
  const [students, setStudents] = useState(() => [...mockStudents]);
  const [properties] = useState(() => [...mockProperties]);
  const [buyers] = useState(() => [...mockBuyers]);
  const [contracts] = useState(() => [...mockContracts]);
  const [staff] = useState(() => [...mockStaff]);
  const [salesStaff] = useState(() => [...mockSalesStaff]);
  const [departments] = useState(() => [...mockDepartments]);
  const [institutionCourses] = useState(() => [...mockInstitutionCourses]);
  const [institutionLecturers] = useState(() => [...mockInstitutionLecturers]);
  const [courseLinksByStudent, setCourseLinksByStudent] = useState(() => ({
    ...studentCourseLinks,
  }));
  const [lecturerByStudent, setLecturerByStudent] = useState(() => ({
    ...studentLecturerLink,
  }));

  /** students | studentDetail | properties | propertyDetail | buyers | buyerDetail | contracts | contractDetail | staffList | staffDetail | salesStaffList | salesStaffDetail | lecturers | lecturerDetail | courses | courseDetail | departments | departmentDetail | application */
  const [view, setView] = useState({ type: "students" });

  const [sitemapCollapsed, setSitemapCollapsed] = useState(false);
  const toggleSitemap = useCallback(() => {
    setSitemapCollapsed((prev) => !prev);
  }, []);

  const detailStudent = useMemo(() => {
    if (view.type !== "studentDetail") return null;
    return students.find((s) => s.studentId === view.studentId) ?? null;
  }, [view, students]);

  const detailProperty = useMemo(() => {
    if (view.type !== "propertyDetail") return null;
    const p = properties.find((x) => x.propertyId === view.propertyId) ?? null;
    if (!p) return null;
    const dev = students.find((s) => s.studentId === p.developmentId);
    return {
      ...p,
      developmentRegion: dev?.region ?? "—",
    };
  }, [view, properties, students]);

  const detailBuyer = useMemo(() => {
    if (view.type !== "buyerDetail") return null;
    const b = buyers.find((x) => x.buyerId === view.buyerId) ?? null;
    if (!b) return null;
    const dev = students.find((s) => s.studentId === b.interestedDevelopmentId);
    return {
      ...b,
      developmentRegion: dev?.region ?? "—",
    };
  }, [view, buyers, students]);

  const detailContract = useMemo(() => {
    if (view.type !== "contractDetail") return null;
    return contracts.find((c) => c.contractId === view.contractId) ?? null;
  }, [view, contracts]);

  const detailStaff = useMemo(() => {
    if (view.type !== "staffDetail") return null;
    return staff.find((s) => s.staffId === view.staffId) ?? null;
  }, [view, staff]);

  const detailSalesStaff = useMemo(() => {
    if (view.type !== "salesStaffDetail") return null;
    return salesStaff.find((s) => s.staffId === view.salesStaffId) ?? null;
  }, [view, salesStaff]);

  const detailDepartment = useMemo(() => {
    if (view.type !== "departmentDetail") return null;
    return departments.find((d) => d.departmentId === view.departmentId) ?? null;
  }, [view, departments]);

  const detailCourse = useMemo(() => {
    if (view.type !== "courseDetail") return null;
    return institutionCourses.find((c) => c.courseId === view.courseId) ?? null;
  }, [view, institutionCourses]);

  const lecturersEnriched = useMemo(
    () =>
      institutionLecturers.map((l) => {
        const taughtCourses = l.taughtCourseIds
          .map((id) => institutionCourses.find((c) => c.courseId === id))
          .filter(Boolean);
        return {
          ...l,
          taughtCourses,
          coursesLabel: taughtCourses.map((c) => c.courseId).join(", "),
        };
      }),
    [institutionLecturers, institutionCourses]
  );

  const detailLecturer = useMemo(() => {
    if (view.type !== "lecturerDetail") return null;
    return lecturersEnriched.find((x) => x.lecturerId === view.lecturerId) ?? null;
  }, [view, lecturersEnriched]);

  const openStudent = useCallback((studentId) => {
    setView({ type: "studentDetail", studentId });
  }, []);

  const closeStudent = useCallback(() => {
    setView({ type: "students" });
  }, []);

  const openProperty = useCallback((propertyId) => {
    setView({ type: "propertyDetail", propertyId });
  }, []);

  const closeProperty = useCallback(() => {
    setView({ type: "properties" });
  }, []);

  const goPropertiesList = useCallback(() => {
    setView({ type: "properties" });
  }, []);

  const openBuyer = useCallback((buyerId) => {
    setView({ type: "buyerDetail", buyerId });
  }, []);

  const closeBuyer = useCallback(() => {
    setView({ type: "buyers" });
  }, []);

  const goBuyersList = useCallback(() => {
    setView({ type: "buyers" });
  }, []);

  const openContract = useCallback((contractId) => {
    setView({ type: "contractDetail", contractId });
  }, []);

  const closeContract = useCallback(() => {
    setView({ type: "contracts" });
  }, []);

  const goContractsList = useCallback(() => {
    setView({ type: "contracts" });
  }, []);

  const openStaff = useCallback((staffId) => {
    setView({ type: "staffDetail", staffId });
  }, []);

  const closeStaff = useCallback(() => {
    setView({ type: "staffList" });
  }, []);

  const goStudentsList = useCallback(() => {
    setView({ type: "students" });
  }, []);

  const goStaffList = useCallback(() => {
    setView({ type: "staffList" });
  }, []);

  const openSalesStaff = useCallback((salesStaffId) => {
    setView({ type: "salesStaffDetail", salesStaffId });
  }, []);

  const closeSalesStaff = useCallback(() => {
    setView({ type: "salesStaffList" });
  }, []);

  const goSalesStaffList = useCallback(() => {
    setView({ type: "salesStaffList" });
  }, []);

  const goDepartmentsList = useCallback(() => {
    setView({ type: "departments" });
  }, []);

  const openDepartment = useCallback((departmentId) => {
    setView({ type: "departmentDetail", departmentId });
  }, []);

  const closeDepartment = useCallback(() => {
    setView({ type: "departments" });
  }, []);

  const goCoursesList = useCallback(() => {
    setView({ type: "courses" });
  }, []);

  const openCourse = useCallback((courseId) => {
    setView({ type: "courseDetail", courseId });
  }, []);

  const closeCourse = useCallback(() => {
    setView({ type: "courses" });
  }, []);

  const goLecturersList = useCallback(() => {
    setView({ type: "lecturers" });
  }, []);

  const openLecturer = useCallback((lecturerId) => {
    setView({ type: "lecturerDetail", lecturerId });
  }, []);

  const closeLecturer = useCallback(() => {
    setView({ type: "lecturers" });
  }, []);

  const openApplication = useCallback(() => {
    setView({ type: "application" });
  }, []);

  const cancelApplication = useCallback(() => {
    setView({ type: "students" });
  }, []);

  const handleApplicationSubmit = useCallback(
    ({ student, courseIds, lecturerId }) => {
      const key = studentRecordKey(student.studentId);
      setStudents((prev) => [...prev, student]);
      setCourseLinksByStudent((prev) => ({ ...prev, [key]: courseIds }));
      setLecturerByStudent((prev) => ({ ...prev, [key]: lecturerId }));
      setView({ type: "students" });
    },
    []
  );

  return (
    <FluentProvider theme={webLightTheme}>
      {view.type === "application" ? (
        <UniversityApplicationForm
          existingStudents={students}
          onSubmit={handleApplicationSubmit}
          onCancel={cancelApplication}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : detailBuyer ? (
        <BuyerDetailView
          buyer={detailBuyer}
          onBack={closeBuyer}
          courseLinks={courseLinksByStudent}
          lecturerLinks={lecturerByStudent}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          onOpenDevelopment={openStudent}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : detailContract ? (
        <ContractDetailView
          contract={detailContract}
          onBack={closeContract}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : detailProperty ? (
        <PropertyDetailView
          property={detailProperty}
          onBack={closeProperty}
          courseLinks={courseLinksByStudent}
          lecturerLinks={lecturerByStudent}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          onOpenDevelopment={openStudent}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : detailStudent ? (
        <StudentDetailView
          student={detailStudent}
          onBack={closeStudent}
          courseLinks={courseLinksByStudent}
          lecturerLinks={lecturerByStudent}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : detailStaff ? (
        <StaffDetailView
          staff={detailStaff}
          onBack={closeStaff}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : detailSalesStaff ? (
        <SalesStaffDetailView
          salesStaff={detailSalesStaff}
          onBack={closeSalesStaff}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : detailDepartment ? (
        <DepartmentDetailView
          department={detailDepartment}
          onBack={closeDepartment}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : detailCourse ? (
        <CourseDetailView
          course={detailCourse}
          onBack={closeCourse}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : detailLecturer ? (
        <LecturerDetailView
          lecturer={detailLecturer}
          onBack={closeLecturer}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : view.type === "lecturerDetail" ? (
        <LecturersGrid
          lecturers={lecturersEnriched}
          onOpenLecturer={openLecturer}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : view.type === "courseDetail" ? (
        <CoursesGrid
          courses={institutionCourses}
          onOpenCourse={openCourse}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : view.type === "departmentDetail" ? (
        <DepartmentsGrid
          departments={departments}
          onOpenDepartment={openDepartment}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : view.type === "staffList" ? (
        <StaffGrid
          staff={staff}
          onOpenStaff={openStaff}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : view.type === "salesStaffList" ? (
        <SalesStaffGrid
          salesStaff={salesStaff}
          onOpenSalesStaff={openSalesStaff}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : view.type === "departments" ? (
        <DepartmentsGrid
          departments={departments}
          onOpenDepartment={openDepartment}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : view.type === "courses" ? (
        <CoursesGrid
          courses={institutionCourses}
          onOpenCourse={openCourse}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : view.type === "lecturers" ? (
        <LecturersGrid
          lecturers={lecturersEnriched}
          onOpenLecturer={openLecturer}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : view.type === "properties" ? (
        <PropertiesGrid
          properties={properties}
          onOpenProperty={openProperty}
          onOpenApplication={openApplication}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : view.type === "buyers" ? (
        <BuyersGrid
          buyers={buyers}
          onOpenBuyer={openBuyer}
          onOpenApplication={openApplication}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : view.type === "contracts" ? (
        <ContractsGrid
          contracts={contracts}
          onOpenContract={openContract}
          onNavigateStudents={goStudentsList}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      ) : (
        <StudentsGrid
          students={students}
          courseLinks={courseLinksByStudent}
          lecturerLinks={lecturerByStudent}
          onOpenStudent={openStudent}
          onOpenApplication={openApplication}
          onNavigateProperties={goPropertiesList}
          onNavigateBuyers={goBuyersList}
          onNavigateContracts={goContractsList}
          onNavigateStaff={goStaffList}
          onNavigateSalesStaff={goSalesStaffList}
          onNavigateApplications={openApplication}
          onNavigateDepartments={goDepartmentsList}
          onNavigateCourses={goCoursesList}
          onNavigateLecturers={goLecturersList}
          sitemapCollapsed={sitemapCollapsed}
          onToggleSitemap={toggleSitemap}
        />
      )}
    </FluentProvider>
  );
}
