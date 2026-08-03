# Graph Report - .  (2026-08-03)

## Corpus Check
- 195 files · ~108,551 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1690 nodes · 3231 edges · 137 communities (70 shown, 67 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 87 edges (avg confidence: 0.86)
- Token cost: 327,887 input · 45,548 output

## Community Hubs (Navigation)
- Theme Configurator
- Returning Student Flow Service
- Layout Shell Components
- Admission DTO Converters
- Admission Form Orchestrator
- Admitted Student Flow Service
- Academic History Form Logic
- Portal Data Constants
- App Bootstrap and Loader
- Location and Form DTOs
- Returning Payment Receipts
- Applicant Payment Page
- Pending Payment Flow Widget
- Traceability Analytics Data
- Admitted Student Templates
- Login and Carousel
- OTP Verification Page
- Traceability Seeder (JS)
- Menu Building and Navigation
- Academic History Form Concepts
- Student Dashboard and Fee DTOs
- Role and Feature Access Control
- Search and Payment Query State
- Application Summary and Routes
- Student Results and CGPA API
- Data Table and Payment Config
- Course Registration DTOs
- Payment Workflow Service
- Admitted Student Routes
- Returning Profile Editing
- Personal Details Form
- Application Status Constants
- Traceability Seeder (TS)
- Returning Student Pages
- Academic History Constants
- Pending Payment Copy Constants
- Application Payment Service
- Document Upload Form
- Auth Session Store
- Admitted Payment Page
- OTP and Password Reset Concepts
- Next of Kin and Address Parsing
- Pagination Component
- App Config Service
- Angular Build Options
- Returning Courses Page
- Admitted Courses Page
- JWT Token Service
- Registrant Data DTO
- Application Guideline Modal
- Hostel and Fee Normalization
- Runtime Dependencies
- Topbar Component
- Student Hostel DTOs
- Admission Stepper Concepts
- Sign Up Component
- Institutional Brand Assets
- Angular Build Configurations
- NPM Scripts
- Prettier Config
- Personal Details DTO
- Registrant Store Service
- Password Reset Component
- Error Handler
- Serve and Staging Targets
- Project Schematics Config
- Returning Hostel Page
- Payment History UI Patterns
- Image and Sprite Assets
- Angular Workspace Config
- Development Build Target
- Dev Dependencies
- Country and LGA Service
- Payments and Hostel Listing API
- Returning Dashboard Page
- Footer and Button Templates
- Data Table Row Patterns
- Program Department Selection
- Dashboard Widget Templates
- Sidebar and Topbar Templates
- Test and i18n Targets
- Pre-Registration Store
- Filter Select Component
- Designer Service
- GS1 Utility Functions
- Name Formatting Utilities
- Sakai Template License
- Package Metadata
- Student Fee Plans API
- School Fee Status API
- Portal Shell Component
- Vercel Rewrites Config
- Angular Compiler Dep
- Angular Compiler CLI Dep
- Angular Core Dep
- Angular ESLint Plugin
- Angular ESLint Template Plugin
- Angular Template Parser
- Angular Forms Dep
- Angular Platform Browser
- Platform Browser Dynamic
- Angular Router Dep
- Autoprefixer Dep
- Chart.js Dep
- date-fns Dep
- Airbnb Base ESLint Config
- Airbnb TypeScript ESLint Config
- ESLint Prettier Config
- ESLint TS Import Resolver
- ESLint Import Plugin
- ExcelJS Dep
- Jasmine Core Dep
- jwt-decode Dep
- Karma Dep
- Karma Chrome Launcher
- Karma Coverage Dep
- Karma Jasmine Dep
- Karma HTML Reporter
- PrimeIcons Dep
- PrimeNG Dep
- RxJS Dep
- Tailwind PrimeUI Dep
- tslib Dep
- Node Types Dep
- zone.js Dep
- PostCSS Dep
- Prettier Dep
- Tailwind CSS Dep
- Jasmine Types Dep
- TypeScript Dep
- TypeScript ESLint Plugin
- TypeScript ESLint Parser
- Production Environment
- Staging Environment

## God Nodes (most connected - your core abstractions)
1. `ApplicationService` - 87 edges
2. `ReturningFlowService` - 65 edges
3. `AdmissionFormComponent` - 52 edges
4. `AcademicHistoryComponent` - 47 edges
5. `AdmittedFlowService` - 45 edges
6. `PendingPaymentFlowComponent` - 42 edges
7. `ReturningPaymentComponent` - 38 edges
8. `PaymentComponent` - 36 edges
9. `ApplicationSummaryComponent` - 33 edges
10. `AuthService` - 31 edges

## Surprising Connections (you probably didn't know these)
- `Payment Row Template` --semantically_similar_to--> `StatusTone`  [INFERRED] [semantically similar]
  src/app/pages/payment/payment.component.html → src/app/shared/components/status-indicator/status-indicator.component.ts
- `Application Progress Widget` --semantically_similar_to--> `Admission Stepper Flow`  [INFERRED] [semantically similar]
  src/app/pages/xdashboard/dashboard.component.html → src/app/pages/admissionform/admissionform.component.html
- `Sakai19 Angular Project` --references--> `MIT License (Sakai template)`  [INFERRED]
  README.md → LICENSE.md
- `App Status Indicator Component` --conceptually_related_to--> `Edit Lock Policy`  [AMBIGUOUS]
  src/app/shared/components/status-indicator/status-indicator.component.html → src/app/pages/admissionform/admissionform.component.html
- `Dashboard Template` --semantically_similar_to--> `Legacy Applicant Dashboard Template`  [INFERRED] [semantically similar]
  src/app/pages/dashboard/dashboard.component.html → src/app/pages/xdashboard/dashboard.component.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admitted Student Onboarding Flow (offer to registration)** — src_app_features_admitted_student_pages_admitted_dashboard_admitted_dashboard_component_template, src_app_features_admitted_student_pages_admitted_acceptance_payment_admitted_acceptance_payment_component_template, src_app_features_admitted_student_pages_admitted_payment_admitted_payment_component_template, src_app_features_admitted_student_pages_admitted_courses_admitted_courses_component_template, src_app_features_admitted_student_pages_admitted_profile_admitted_profile_component_template [INFERRED 0.90]
- **Returning Student Portal Pages (shared flow facade signals)** — src_app_features_returning_student_pages_returning_dashboard_returning_dashboard_component_template, src_app_features_returning_student_pages_returning_courses_returning_courses_component_template, src_app_features_returning_student_pages_returning_payment_returning_payment_component_template, src_app_features_returning_student_pages_returning_results_returning_results_component_template, src_app_features_returning_student_pages_returning_cgpa_tracker_returning_cgpa_tracker_component_template, src_app_features_returning_student_pages_returning_profile_returning_profile_component_template, src_app_features_returning_student_pages_returning_hostel_returning_hostel_component_template [INFERRED 0.95]
- **Payment-Gated Feature Unlocking Pattern** — src_app_features_admitted_student_pages_admitted_courses_admitted_courses_component_payment_gated_registration, src_app_features_admitted_student_pages_admitted_profile_admitted_profile_component_payment_gated_verification, src_app_features_returning_student_pages_returning_courses_returning_courses_component_course_review_state, src_app_features_admitted_student_pages_admitted_payment_admitted_payment_component_installment_policy [INFERRED 0.85]
- **Multi-Step Admission Application Flow** — src_app_pages_admissionform_admissionform_component_apppersonaldetails, src_app_pages_admissionform_admissionform_component_appnextofkin, src_app_pages_admissionform_admissionform_component_appacademichistory, src_app_pages_admissionform_admissionform_component_appuploadform, src_app_pages_admissionform_admissionform_component_appapplicationsummary, src_app_pages_admissionform_admissionform_component_formstepstatus [EXTRACTED 1.00]
- **Credential Recovery Flow (request OTP, verify OTP, set new password, return to login)** — src_app_pages_auth_request_passwordreset_request_passwordreset_component_emailotprequestform, src_app_pages_auth_otp_page_otp_page_component_otpform, src_app_pages_auth_passwordreset_passwordreset_component_resetform, src_app_pages_auth_sigin_consmeff_login_component_loginform [INFERRED 0.95]
- **Shared Table Toolbar Composition (search + table + pagination + button)** — src_app_shared_components_search_input_search_input_component_appsearchinput, src_app_shared_components_data_table_data_table_component_appdatatable, src_app_shared_components_pagination_pagination_component_apppagination, src_app_shared_components_button_button_component_appbutton, src_app_pages_payment_payment_component_paymenthistorytemplate [EXTRACTED 1.00]
- **Admission Application Multi-Step Form Wizard** — src_app_widgets_admission_forms_personaldetails_personaldetails_component_template, src_app_widgets_admission_forms_nextofkin_nextofkin_component_template, src_app_widgets_admission_forms_academichistory_academichistory_component_template, src_app_widgets_admission_forms_uploadform_uploadform_component_template, src_app_widgets_admission_forms_applicationsummary_applicationsummary_component_template [INFERRED 0.95]
- **Application Onboarding, Program Choice and Payment Flow** — src_app_widgets_dashboard_pending_payment_flow_pending_payment_flow_component_template, src_app_widgets_dashboard_pending_payment_flow_pending_payment_flow_component_programselectiondialog, src_app_widgets_dashboard_application_guideline_modal_application_guideline_modal_component_template, src_app_widgets_admission_program_program_component_template [EXTRACTED 1.00]
- **Portal Shell Chrome (Host Page, Sidebar, Topbar)** — src_index_approotshell, src_app_widgets_sidebar_sidebar_component_template, src_app_widgets_topbar_topbar_component_template, src_app_widgets_topbar_topbar_component_sidebartoggle [INFERRED 0.85]

## Communities (137 total, 67 thin omitted)

### Community 0 - "Theme Configurator"
Cohesion: 0.06
Nodes (20): HostBinding, AppConfigurator, KeyOfType, presets, SurfacesType, Component, AppFloatingConfigurator, Component (+12 more)

### Community 2 - "Layout Shell Components"
Cohesion: 0.06
Nodes (17): HostListener, PortalEntryStubComponent, Component, AppFooter, Component, AppLayout, Component, AppSidebar (+9 more)

### Community 3 - "Admission DTO Converters"
Cohesion: 0.06
Nodes (15): AppInitResponse, AppInitResponseDTO, Convert, DepartmentsDTO, Faculty, Level, OpenApplicationDTO, Program (+7 more)

### Community 5 - "Admitted Student Flow Service"
Cohesion: 0.08
Nodes (3): flattenRegisteredCoursesResponse(), AdmittedFlowService, Injectable

### Community 6 - "Academic History Form Logic"
Cohesion: 0.11
Nodes (4): OLevelResult, TOLevelResult, AcademicHistoryComponent, Component

### Community 7 - "Portal Data Constants"
Cohesion: 0.11
Nodes (16): NgModule, ProfileFailResponse, ProfilePayload, ProfileSuccessResponse, validationCheckDTO, Logout, Component, LOGIN_CAROUSEL_IMAGES (+8 more)

### Community 8 - "App Bootstrap and Loader"
Cohesion: 0.08
Nodes (19): AppComponent, Component, appConfig, GlobalLoadingComponent, Component, buildErrorMessage(), buildErrorSummary(), collectMessages() (+11 more)

### Community 9 - "Location and Form DTOs"
Cohesion: 0.15
Nodes (17): formstepDTO, Countries, LGA, States, StatesDTO, CertificateOfBirth, LGA, TNextOfKinDTO (+9 more)

### Community 12 - "Pending Payment Flow Widget"
Cohesion: 0.13
Nodes (4): ApplicationStatusKey, RegistrantData, PendingPaymentFlowComponent, Component

### Community 13 - "Traceability Analytics Data"
Cohesion: 0.10
Nodes (19): HierarchyInfo, HierarchyLevel, HierarchySummary, HierarchyTreeNode, LevelInfo, SupplyChainHierarchy, TimelineEvent, ActivityLog (+11 more)

### Community 14 - "Admitted Student Templates"
Cohesion: 0.10
Nodes (30): Acceptance Fee Invoice Generation, Admitted Acceptance Payment Template, Admitted Course Registration Slip, Payment-Gated Course Registration, Admitted Courses Template, Acceptance-Paid Dashboard State Switch, Admitted Dashboard Template, Three-Installment School Fee Policy (+22 more)

### Community 15 - "Login and Carousel"
Cohesion: 0.09
Nodes (5): LoginResponse, ConsmeffLoginComponent, Component, AuthService, Injectable

### Community 16 - "OTP Verification Page"
Cohesion: 0.09
Nodes (5): OtpPageComponent, Component, RequestPasswordResetComponent, Component, ViewChildren

### Community 17 - "Traceability Seeder (JS)"
Cohesion: 0.14
Nodes (11): adopt(), fulfilled(), crypto, fs, main(), path, TraceabilitySeeder(), rejected() (+3 more)

### Community 18 - "Menu Building and Navigation"
Cohesion: 0.13
Nodes (7): AppMenu, Component, NavigationAccessService, RETURNING_FIRST_INSTALLMENT_FEATURES, Injectable, PermissionService, Injectable

### Community 19 - "Academic History Form Concepts"
Cohesion: 0.12
Nodes (25): Cascading State to Local Government Dropdown Pattern, PrimeNG Reactive Form Control Convention, Awaiting Result Conditional Exam Grades Branch, Exam Attempt Count FormArray (Sittings), JAMB Details Sub-Form, Optional Other Qualifications FormArray, School Completion Age Validation, Academic History Form Template (+17 more)

### Community 20 - "Student Dashboard and Fee DTOs"
Cohesion: 0.11
Nodes (21): StudentDashboardAnnouncement, StudentDashboardCoursesInfo, StudentDashboardFeeInfo, StudentFeePartPaymentMode, StudentFeePaymentPayload, StudentFeePlan, CgpaThreshold, CourseReviewState (+13 more)

### Community 21 - "Role and Feature Access Control"
Cohesion: 0.16
Nodes (12): SidebarMenuItem, ProtectedPageFeature, ALL_ROLES, RoleId, UserToken, ADMITTED_USER_TYPES, NEW_CANDIDATE_USER_TYPES, PENDING_ACCEPTANCE_FEE_KEYWORDS (+4 more)

### Community 22 - "Search and Payment Query State"
Cohesion: 0.14
Nodes (9): sidebarStateDTO, TPaymentQueryState, SearchInputComponent, Component, Injectable, WidgetsService, SidebarComponent, SidebarMenuItem (+1 more)

### Community 24 - "Student Results and CGPA API"
Cohesion: 0.19
Nodes (4): StudentCgpaTrendResponse, StudentDashboardResponse, StudentSchoolFeePaymentStatus, StudentResultsResponse

### Community 25 - "Data Table and Payment Config"
Cohesion: 0.16
Nodes (10): DATA_TABLE_CONFIG, PAYMENT_PAGE_CONFIG, PAYMENT_RECEIPT_KEYS, PAYMENT_STATUS_CLASS, PAYMENT_TABLE_COLUMNS, DataTableComponent, Component, DataTableColumn (+2 more)

### Community 26 - "Course Registration DTOs"
Cohesion: 0.11
Nodes (12): AvailableCourse, AvailableCoursesResponse, CourseInfo, RegisterCoursesPayload, RegisteredCoursesResponse, PasswordChangePayload, PaymentHistoryItem, PaymentStatus (+4 more)

### Community 27 - "Payment Workflow Service"
Cohesion: 0.16
Nodes (11): PaymentRefResponse, PaymentPageView, PaymentWorkflowHooks, PaymentWorkflowService, PaystackCallbackResponse, PaystackHandler, PaystackPopType, PaystackSetupConfig (+3 more)

### Community 28 - "Admitted Student Routes"
Cohesion: 0.10
Nodes (7): AdmittedAcceptancePaymentComponent, Component, AdmittedDashboardComponent, Component, AdmittedProfileComponent, Component, featureAccessGuard()

### Community 29 - "Returning Profile Editing"
Cohesion: 0.16
Nodes (7): EditableProfileSection, ReturningProfileComponent, Component, AddressData, NextOfKinData, PersonalContactData, ReturningProfileTab

### Community 31 - "Application Status Constants"
Cohesion: 0.13
Nodes (16): APPLICATION_STATUS_DEFINITIONS, APPLICATION_STATUS_DESCRIPTIONS, APPLICATION_STATUS_LABELS, APPLICATION_STATUS_OPTIONS, APPLICATION_STATUS_ORDER, APPLICATION_STATUS_TONES, ApplicationStatusDefinition, ApplicationStatusOption (+8 more)

### Community 32 - "Traceability Seeder (TS)"
Cohesion: 0.16
Nodes (6): TraceabilityEvent, crypto, fs, main(), path, TraceabilitySeeder

### Community 33 - "Returning Student Pages"
Cohesion: 0.15
Nodes (9): ReturningCgpaTrackerComponent, Component, ReturningResultsComponent, Component, ReturningCourse, ButtonComponent, ButtonType, ButtonVariant (+1 more)

### Community 34 - "Academic History Constants"
Cohesion: 0.18
Nodes (12): ACADEMIC_HISTORY_ATTEMPT_OPTIONS, ACADEMIC_HISTORY_AWAITING_RESULT_OPTION, ACADEMIC_HISTORY_RULES, AcademicHistory, ExamRecord, TAcademicHistory, formatDateOnly(), padDatePart() (+4 more)

### Community 35 - "Pending Payment Copy Constants"
Cohesion: 0.15
Nodes (16): ACTION_LABELS, APPROVAL_STATUS_MESSAGES, DashboardApprovalMessage, HERO_CONTENT, ROUTES, STATUS_MATCHERS, STEP_CONTENT, UI_COPY (+8 more)

### Community 36 - "Application Payment Service"
Cohesion: 0.15
Nodes (4): PaymentRefResponse, StudentSingleResponse, ApplicationService, Injectable

### Community 38 - "Auth Session Store"
Cohesion: 0.14
Nodes (14): StudentSingleData, AdmissionDocumentType, SchoolFeePaymentRecord, VerificationDocument, AuthSessionCookieState, AuthSessionState, buildPortalSessionPatch(), clearAuthSessionCookie() (+6 more)

### Community 40 - "OTP and Password Reset Concepts"
Cohesion: 0.13
Nodes (18): Personal Details Step Component, Dual-Mode OTP Flow (verify vs reset), OTP Form (six-box entry), OTP Page Template, OTP Resend Countdown, Password Strength Checklist, Password Reset Successful Dialog, Password Reset Template (+10 more)

### Community 41 - "Next of Kin and Address Parsing"
Cohesion: 0.18
Nodes (4): AddressComponents, parseAddress(), NextOfKinComponent, Component

### Community 42 - "Pagination Component"
Cohesion: 0.17
Nodes (4): PAGINATION_CONFIG, PaginationComponent, Component, PaginationItem

### Community 43 - "App Config Service"
Cohesion: 0.20
Nodes (3): AppConfigService, Injectable, AppState

### Community 44 - "Angular Build Options"
Cohesion: 0.18
Nodes (15): options, assets, browser, index, inlineStyleLanguage, outputPath, polyfills, scripts (+7 more)

### Community 45 - "Returning Courses Page"
Cohesion: 0.15
Nodes (3): ReturningCoursesComponent, Component, ResitCourse

### Community 46 - "Admitted Courses Page"
Cohesion: 0.23
Nodes (3): RegisteredCourse, AdmittedCoursesComponent, Component

### Community 48 - "Registrant Data DTO"
Cohesion: 0.17
Nodes (11): Address, AryParentOrGuardian, Country, Department, Session, State, StudentAdmissionDocuments, StudentDepartment (+3 more)

### Community 49 - "Application Guideline Modal"
Cohesion: 0.20
Nodes (7): APPLICATION_GUIDELINE_CONTENT, ApplicationGuidelineContent, GuidelineSection, ApplicationGuidelineModalComponent, Component, Input, Output

### Community 51 - "Runtime Dependencies"
Cohesion: 0.18
Nodes (11): @angular/animations, @angular/common, chartjs-adapter-date-fns, @ngrx/signals, dependencies, @angular/animations, @angular/common, chartjs-adapter-date-fns (+3 more)

### Community 53 - "Student Hostel DTOs"
Cohesion: 0.31
Nodes (3): StudentHostelAllocation, StudentHostelOption, StudentHostelRoomOption

### Community 54 - "Admission Stepper Concepts"
Cohesion: 0.22
Nodes (10): Admission Stepper Flow, Academic History Step Component, Application Summary Step Component, Next of Kin Step Component, Document Upload Step Component, Compliance Directive Notice, Form Step Status Gating, Edit Lock Policy (+2 more)

### Community 56 - "Institutional Brand Assets"
Cohesion: 0.36
Nodes (10): Crest Iconography: Lamp of Nursing, Crescent, Circular Motto Band, CONSMMEF Institutional Seal (favicon-sized crest), Browser Tab / App Icon Identity Slot, Purple Abstract Loop Favicon Mark, SVG Pattern Fill Wrapping a Base64 PNG (not true vector art), Wide Horizontal Logo Wordmark (SVG-wrapped raster, 1358x311), Brand Palette: Magenta Wordmark, Cyan Subtitle, Red-Blue Shield, Institution Identity: College of Nursing Sciences, Muslim Medical Foundation (+2 more)

### Community 57 - "Angular Build Configurations"
Cohesion: 0.22
Nodes (9): build, builder, configurations, defaultConfiguration, production, budgets, buildTarget, fileReplacements (+1 more)

### Community 58 - "NPM Scripts"
Cohesion: 0.22
Nodes (9): scripts, build, format, lint, lint:fix, ng, start, test (+1 more)

### Community 59 - "Prettier Config"
Cohesion: 0.22
Nodes (8): bracketSameLine, overrides, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 60 - "Personal Details DTO"
Cohesion: 0.22
Nodes (8): AcademicHistory, Address, AryParentOrGuardian, CertificateOfBirth, OLevelResult, PersonalDetailDTO, Subject, UtmeResult

### Community 61 - "Registrant Store Service"
Cohesion: 0.36
Nodes (3): RegistrantDataDTO, RegStoreService, Injectable

### Community 64 - "Serve and Staging Targets"
Cohesion: 0.25
Nodes (8): serve, staging, builder, configurations, defaultConfiguration, buildTarget, fileReplacements, outputHashing

### Community 65 - "Project Schematics Config"
Cohesion: 0.25
Nodes (8): prefix, projectType, root, schematics, sourceRoot, consmeff, style, @schematics/angular:component

### Community 67 - "Payment History UI Patterns"
Cohesion: 0.29
Nodes (8): Payment History Template, Search / Sort / Paginate Toolbar Pattern, Quick Actions Navigation, App Filter Select Component, App Pagination Component, Ellipsis Page Windowing, Page Size Control, App Search Input Component

### Community 69 - "Image and Sprite Assets"
Cohesion: 0.36
Nodes (8): Country Flag Sprite Sheet (flags_responsive.png), Vertical CSS Sprite Tiling Scheme (44px wide, ~30px rows), PrimeNG Demo/Showcase Asset (assets/demo), Public Landing Page Hero Carousel, Carousel Slide 1 - Nursing Students in Blue Scrubs, Student Cohort Identity and Clinical Training Theme, Carousel Slide 2 - Campus Building Exterior with Nigerian Flag, Nigerian Institution Branding and Campus Facility Identity

### Community 70 - "Angular Workspace Config"
Cohesion: 0.29
Nodes (6): analytics, cli, newProjectRoot, projects, $schema, version

### Community 71 - "Development Build Target"
Cohesion: 0.29
Nodes (7): development, aot, buildTarget, namedChunks, optimization, outputHashing, sourceMap

### Community 72 - "Dev Dependencies"
Cohesion: 0.29
Nodes (7): @angular-devkit/build-angular, eslint, devDependencies, @angular/cli, @angular-devkit/build-angular, eslint, @angular/cli

### Community 76 - "Footer and Button Templates"
Cohesion: 0.29
Nodes (7): ActivPulse Spectra Branding Link, App Footer Template, Technical Support Message, Admission Form Template, Registration Complete Dialog, App Button Component, Icon Position Variant API

### Community 77 - "Data Table Row Patterns"
Cohesion: 0.29
Nodes (7): Payment Row Template, Payment Table Columns, Receipt Download Action, App Data Table Component, Row Template Projection, Sortable Column Headers, Loading and Empty State Messaging

### Community 78 - "Program Department Selection"
Cohesion: 0.47
Nodes (3): Datum, Department, programSelectionOption

### Community 79 - "Dashboard Widget Templates"
Cohesion: 0.33
Nodes (6): Pending Payment Flow Component, Dashboard Template, Application Progress Widget, Sidebar Component, Topbar Component, Legacy Applicant Dashboard Template

### Community 80 - "Sidebar and Topbar Templates"
Cohesion: 0.40
Nodes (6): Sidebar Navigation Template, Dark Mode Theme Toggle, Topbar Sidebar Toggle Control, Topbar Template, Application HTML Shell (app-root), External Font and Branding Assets

### Community 81 - "Test and i18n Targets"
Cohesion: 0.40
Nodes (5): extract-i18n, test, architect, builder, builder

### Community 83 - "Filter Select Component"
Cohesion: 0.40
Nodes (4): FilterSelectComponent, Component, Input, Output

### Community 86 - "Name Formatting Utilities"
Cohesion: 0.60
Nodes (4): formatStructuredName(), normalizeDisplayName(), normalizeNamePart(), StructuredNameInput

### Community 87 - "Sakai Template License"
Cohesion: 0.50
Nodes (4): MIT License (Sakai template), PrimeTek (copyright holder), Angular CLI Build and Test Workflow, Sakai19 Angular Project

### Community 88 - "Package Metadata"
Cohesion: 0.50
Nodes (3): name, private, version

## Ambiguous Edges - Review These
- `Edit Lock Policy` → `App Status Indicator Component`  [AMBIGUOUS]
  src/app/shared/components/status-indicator/status-indicator.component.html · relation: conceptually_related_to
- `Sidebar Navigation Template` → `Application HTML Shell (app-root)`  [AMBIGUOUS]
  src/index.html · relation: conceptually_related_to
- `Institution Identity: College of Nursing Sciences, Muslim Medical Foundation` → `Wide Horizontal Logo Wordmark (SVG-wrapped raster, 1358x311)`  [AMBIGUOUS]
  src/assets/images/logo.svg · relation: conceptually_related_to
- `Brand Palette: Magenta Wordmark, Cyan Subtitle, Red-Blue Shield` → `Purple Abstract Loop Favicon Mark`  [AMBIGUOUS]
  src/assets/images/favicon.png · relation: conceptually_related_to
- `Nigerian Institution Branding and Campus Facility Identity` → `Country Flag Sprite Sheet (flags_responsive.png)`  [AMBIGUOUS]
  src/assets/demo/flags/flags_responsive.png · relation: conceptually_related_to
- `Public Landing Page Hero Carousel` → `PrimeNG Demo/Showcase Asset (assets/demo)`  [AMBIGUOUS]
  src/assets/demo/flags/flags_responsive.png · relation: conceptually_related_to

## Knowledge Gaps
- **236 isolated node(s):** `useTabs`, `tabWidth`, `trailingComma`, `semi`, `singleQuote` (+231 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **67 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Edit Lock Policy` and `App Status Indicator Component`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Sidebar Navigation Template` and `Application HTML Shell (app-root)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Institution Identity: College of Nursing Sciences, Muslim Medical Foundation` and `Wide Horizontal Logo Wordmark (SVG-wrapped raster, 1358x311)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Brand Palette: Magenta Wordmark, Cyan Subtitle, Red-Blue Shield` and `Purple Abstract Loop Favicon Mark`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Nigerian Institution Branding and Campus Facility Identity` and `Country Flag Sprite Sheet (flags_responsive.png)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Public Landing Page Hero Carousel` and `PrimeNG Demo/Showcase Asset (assets/demo)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `ApplicationService` connect `Application Payment Service` to `Admission DTO Converters`, `Portal Data Constants`, `Location and Form DTOs`, `Applicant Payment Page`, `Student Dashboard and Fee DTOs`, `Role and Feature Access Control`, `Search and Payment Query State`, `Student Results and CGPA API`, `Course Registration DTOs`, `Payment Workflow Service`, `Academic History Constants`, `Pending Payment Copy Constants`, `Document Upload Form`, `Auth Session Store`, `Student Hostel DTOs`, `Registrant Store Service`, `Country and LGA Service`, `Payments and Hostel Listing API`, `Pre-Registration Store`, `Student Fee Plans API`, `School Fee Status API`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._