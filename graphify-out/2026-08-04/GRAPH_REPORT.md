# Graph Report - .  (2026-08-03)

## Corpus Check
- 197 files · ~108,699 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1705 nodes · 3252 edges · 149 communities (78 shown, 71 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 91 edges (avg confidence: 0.86)
- Token cost: 34,000 input · 3,451 output

## Community Hubs (Navigation)
- Returning Student Flow Service
- Layout Theme Configurator
- Table & Payment Page Constants
- Admission Response DTOs
- Academic History Form
- Admitted Student Flow Service
- Location & Transformer DTOs
- Returning Student Payment Page
- Payment Page Component
- Admission Form Orchestrator
- Pending Payment Flow Widget
- Admitted Student Routing
- Analytics Hierarchy Data
- Admitted Student Templates
- Course Registration DTOs
- Traceability Seeder (JS)
- Cascading Dropdown Patterns
- App Root Bootstrap & Config
- Application Service API Client
- Auth Session Store
- Application Summary Widget
- Personal Details Form
- Traceability Seeder (TS)
- Student Dashboard Data Fetch
- Academic History Constants
- Student Fees & Password DTOs
- Auth Service & Login
- Document Upload Form
- Sidebar Navigation
- Auth Profile Data & Pages
- Admitted Payment Page
- OTP Page State
- Address Parser & Next of Kin
- Payment Workflow Service
- App Config Service
- OTP Page Component
- Angular Build Config
- Graphify Project Conventions
- Application Status Constants
- Dashboard Flow Constants
- Returning Features Student
- Auth Sigin Consmeff
- Application Services Service
- Returning Features Student
- Services User Portal
- Admitted Features Student
- Portal Guard Services
- Services Loading Global
- Layout Topbar Apptopbar
- Services Jwt Service
- Services Service Regstore
- Data Application Registrantdatadto
- Admissionform Admissionformcomponent Data
- Dashboard Application Guideline
- Admissionform Xdashboard Dashboard
- Package Dependencies Angular
- Services Permission Service
- Data Payment Shared
- Services Navigation Access
- Topbar Widgets Topbarcomponent
- Returning Features Student
- Button Returning Shared
- Layout Menu Appmenu
- Sign Auth Up
- Pagination Dashboard Shared
- Assets Logo Images
- Angular Production Build
- Package Scripts Lint
- Prettierrc Bracketsameline Overrides
- Widgets Dashboard Pending
- Data Application Personaldetailsdto
- Passwordreset Auth Passwordresetcomponent
- Inactivity Services Service
- Errorhandler Utility Apperror
- Angular Serve Staging
- Angular Consmeff Schematics
- Data Application Payment
- Returning Features Student
- Returning Features Student
- Interceptor Services Error
- Assets Flags Images
- Angular Cli Analytics
- Angular Development Configurations
- Angular Package Devdependencies
- Admitted Features Student
- Admitted Features Student
- Dashboard New Services
- Returning Features Student
- Admissionform Button Layout
- Sidebar Widgets Sidebarcomponent
- Widgets Dashboard Pending
- Topbar Widgets Sidebar
- Angular Architect Extract
- Application Preregistrationdatadto Services
- Application Data Student
- Admitted Features Student
- Filter Shared Select
- Designerservice Utility Setactokens
- Utility Functions Getemail
- License Readme Mit
- Package Name Private
- Application Services Service
- Features Shared Portal
- Status Shared Indicator
- Vercel Rewrites Trailingslash
- Angular Common Package
- Angular Compiler Package
- Angular Compiler Cli
- Eslint Angular Plugin
- Eslint Angular Plugin
- Angular Eslint Template
- Angular Forms Package
- Angular Platform Browser
- Angular Platform Browser
- Angular Router Package
- Autoprefixer Package Devdependencies
- Chart Package Dependencies
- Date Fns Package
- Eslint Config Airbnb
- Eslint Config Airbnb
- Eslint Config Prettier
- Eslint Import Resolver
- Eslint Plugin Import
- Exceljs Package Dependencies
- Jasmine Core Package
- Jwt Decode Package
- Karma Package Devdependencies
- Karma Chrome Launcher
- Karma Coverage Package
- Karma Jasmine Package
- Karma Jasmine Html
- Primeicons Package Dependencies
- Primeng Package Dependencies
- Rxjs Package Dependencies
- Tailwindcss Primeui Package
- Tslib Package Dependencies
- Types Node Package
- Zone Package Dependencies
- Postcss Package Devdependencies
- Prettier Package Devdependencies
- Tailwindcss Package Devdependencies
- Types Jasmine Package
- Typescript Package Devdependencies
- Eslint Typescript Package
- Typescript Eslint Package
- Environment Environments Prod
- Environment Environments Staging

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
- `Dashboard Template` --semantically_similar_to--> `Legacy Applicant Dashboard Template`  [INFERRED] [semantically similar]
  src/app/pages/dashboard/dashboard.component.html → src/app/pages/xdashboard/dashboard.component.html
- `Sakai19 Angular Project` --references--> `MIT License (Sakai template)`  [INFERRED]
  README.md → LICENSE.md
- `Application Progress Widget` --semantically_similar_to--> `Admission Stepper Flow`  [INFERRED] [semantically similar]
  src/app/pages/xdashboard/dashboard.component.html → src/app/pages/admissionform/admissionform.component.html
- `App Status Indicator Component` --implements--> `StatusTone`  [EXTRACTED]
  src/app/shared/components/status-indicator/status-indicator.component.html → src/app/shared/components/status-indicator/status-indicator.component.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Payment-Gated Feature Unlocking Pattern** — src_app_features_admitted_student_pages_admitted_courses_admitted_courses_component_payment_gated_registration, src_app_features_admitted_student_pages_admitted_profile_admitted_profile_component_payment_gated_verification, src_app_features_returning_student_pages_returning_courses_returning_courses_component_course_review_state, src_app_features_admitted_student_pages_admitted_payment_admitted_payment_component_installment_policy [INFERRED 0.85]
- **Admitted Student Onboarding Flow (offer to registration)** — src_app_features_admitted_student_pages_admitted_dashboard_admitted_dashboard_component_template, src_app_features_admitted_student_pages_admitted_acceptance_payment_admitted_acceptance_payment_component_template, src_app_features_admitted_student_pages_admitted_payment_admitted_payment_component_template, src_app_features_admitted_student_pages_admitted_courses_admitted_courses_component_template, src_app_features_admitted_student_pages_admitted_profile_admitted_profile_component_template [INFERRED 0.90]
- **Returning Student Portal Pages (shared flow facade signals)** — src_app_features_returning_student_pages_returning_dashboard_returning_dashboard_component_template, src_app_features_returning_student_pages_returning_courses_returning_courses_component_template, src_app_features_returning_student_pages_returning_payment_returning_payment_component_template, src_app_features_returning_student_pages_returning_results_returning_results_component_template, src_app_features_returning_student_pages_returning_cgpa_tracker_returning_cgpa_tracker_component_template, src_app_features_returning_student_pages_returning_profile_returning_profile_component_template, src_app_features_returning_student_pages_returning_hostel_returning_hostel_component_template [INFERRED 0.95]
- **Multi-Step Admission Application Flow** — src_app_pages_admissionform_admissionform_component_apppersonaldetails, src_app_pages_admissionform_admissionform_component_appnextofkin, src_app_pages_admissionform_admissionform_component_appacademichistory, src_app_pages_admissionform_admissionform_component_appuploadform, src_app_pages_admissionform_admissionform_component_appapplicationsummary, src_app_pages_admissionform_admissionform_component_formstepstatus [EXTRACTED 1.00]
- **Credential Recovery Flow (request OTP, verify OTP, set new password, return to login)** — src_app_pages_auth_request_passwordreset_request_passwordreset_component_emailotprequestform, src_app_pages_auth_otp_page_otp_page_component_otpform, src_app_pages_auth_passwordreset_passwordreset_component_resetform, src_app_pages_auth_sigin_consmeff_login_component_loginform [INFERRED 0.95]
- **Shared Table Toolbar Composition (search + table + pagination + button)** — src_app_shared_components_search_input_search_input_component_appsearchinput, src_app_shared_components_data_table_data_table_component_appdatatable, src_app_shared_components_pagination_pagination_component_apppagination, src_app_shared_components_button_button_component_appbutton, src_app_pages_payment_payment_component_paymenthistorytemplate [EXTRACTED 1.00]
- **Admission Application Multi-Step Form Wizard** — src_app_widgets_admission_forms_personaldetails_personaldetails_component_template, src_app_widgets_admission_forms_nextofkin_nextofkin_component_template, src_app_widgets_admission_forms_academichistory_academichistory_component_template, src_app_widgets_admission_forms_uploadform_uploadform_component_template, src_app_widgets_admission_forms_applicationsummary_applicationsummary_component_template [INFERRED 0.95]
- **Application Onboarding, Program Choice and Payment Flow** — src_app_widgets_dashboard_pending_payment_flow_pending_payment_flow_component_template, src_app_widgets_dashboard_pending_payment_flow_pending_payment_flow_component_programselectiondialog, src_app_widgets_dashboard_application_guideline_modal_application_guideline_modal_component_template, src_app_widgets_admission_program_program_component_template [EXTRACTED 1.00]
- **Portal Shell Chrome (Host Page, Sidebar, Topbar)** — src_index_approotshell, src_app_widgets_sidebar_sidebar_component_template, src_app_widgets_topbar_topbar_component_template, src_app_widgets_topbar_topbar_component_sidebartoggle [INFERRED 0.85]
- **graphify context-retrieval command surface (query / path / explain)** — claude_graphify_query, claude_graphify_path, claude_graphify_explain, claude_scoped_subgraph [EXTRACTED 1.00]
- **graphify-out generated artifact set** — claude_graph_json, claude_graph_report, claude_wiki_index, claude_knowledge_graph [EXTRACTED 1.00]
- **Context escalation ladder: scoped query first, wiki for navigation, full report last** — claude_scoped_subgraph, claude_wiki_index, claude_graph_report, claude_raw_source_browsing [INFERRED 0.85]

## Communities (149 total, 71 thin omitted)

### Community 0 - "Returning Student Flow Service"
Cohesion: 0.05
Nodes (4): StudentDashboardAnnouncement, HostelApplicationStatus, ReturningFlowService, Injectable

### Community 1 - "Layout Theme Configurator"
Cohesion: 0.06
Nodes (20): HostBinding, AppConfigurator, KeyOfType, presets, SurfacesType, Component, AppFloatingConfigurator, Component (+12 more)

### Community 2 - "Table & Payment Page Constants"
Cohesion: 0.08
Nodes (17): DATA_TABLE_CONFIG, PAGINATION_CONFIG, PAYMENT_PAGE_CONFIG, PAYMENT_RECEIPT_KEYS, PAYMENT_STATUS_CLASS, PAYMENT_TABLE_COLUMNS, TPaymentQueryState, DataTableComponent (+9 more)

### Community 3 - "Admission Response DTOs"
Cohesion: 0.06
Nodes (15): AppInitResponse, AppInitResponseDTO, Convert, DepartmentsDTO, Faculty, Level, OpenApplicationDTO, Program (+7 more)

### Community 4 - "Academic History Form"
Cohesion: 0.11
Nodes (4): OLevelResult, TOLevelResult, AcademicHistoryComponent, Component

### Community 5 - "Admitted Student Flow Service"
Cohesion: 0.08
Nodes (3): AdmittedFlowService, Injectable, readStudentFeeInstallmentAmount()

### Community 6 - "Location & Transformer DTOs"
Cohesion: 0.15
Nodes (17): formstepDTO, Countries, CountryDTO, LGA, States, CertificateOfBirth, LGA, TNextOfKinDTO (+9 more)

### Community 11 - "Admitted Student Routing"
Cohesion: 0.17
Nodes (9): NgModule, sidebarStateDTO, SidebarMenuItem, LOGIN_CAROUSEL_IMAGES, TraceabilityModule, AuthSessionStore, Injectable, WidgetsService (+1 more)

### Community 12 - "Analytics Hierarchy Data"
Cohesion: 0.10
Nodes (19): HierarchyInfo, HierarchyLevel, HierarchySummary, HierarchyTreeNode, LevelInfo, SupplyChainHierarchy, TimelineEvent, ActivityLog (+11 more)

### Community 13 - "Admitted Student Templates"
Cohesion: 0.10
Nodes (30): Acceptance Fee Invoice Generation, Admitted Acceptance Payment Template, Admitted Course Registration Slip, Payment-Gated Course Registration, Admitted Courses Template, Acceptance-Paid Dashboard State Switch, Admitted Dashboard Template, Three-Installment School Fee Policy (+22 more)

### Community 14 - "Course Registration DTOs"
Cohesion: 0.08
Nodes (20): AvailableCourse, AvailableCoursesResponse, CourseInfo, flattenRegisteredCoursesResponse(), RegisterCoursesPayload, RegisteredCoursesResponse, StudentCgpaTrendItem, StudentDashboardCoursesInfo (+12 more)

### Community 15 - "Traceability Seeder (JS)"
Cohesion: 0.14
Nodes (11): adopt(), fulfilled(), crypto, fs, main(), path, TraceabilitySeeder(), rejected() (+3 more)

### Community 16 - "Cascading Dropdown Patterns"
Cohesion: 0.12
Nodes (25): Cascading State to Local Government Dropdown Pattern, PrimeNG Reactive Form Control Convention, Awaiting Result Conditional Exam Grades Branch, Exam Attempt Count FormArray (Sittings), JAMB Details Sub-Form, Optional Other Qualifications FormArray, School Completion Age Validation, Academic History Form Template (+17 more)

### Community 17 - "App Root Bootstrap & Config"
Cohesion: 0.12
Nodes (8): AppComponent, Component, appConfig, RequestPasswordResetComponent, Component, jwtInterceptor(), ThemeService, Injectable

### Community 18 - "Application Service API Client"
Cohesion: 0.12
Nodes (5): LGADTO, PaymentRefResponse, StudentSingleResponse, ApplicationService, Injectable

### Community 19 - "Auth Session Store"
Cohesion: 0.12
Nodes (18): StudentSingleData, AdmissionDocumentType, SchoolFeePaymentRecord, VerificationDocument, AuthSessionCookieState, AuthSessionState, buildPortalSessionPatch(), clearAuthSessionCookie() (+10 more)

### Community 22 - "Traceability Seeder (TS)"
Cohesion: 0.16
Nodes (6): TraceabilityEvent, crypto, fs, main(), path, TraceabilitySeeder

### Community 23 - "Student Dashboard Data Fetch"
Cohesion: 0.21
Nodes (3): StudentCgpaTrendResponse, StudentDashboardResponse, StudentSchoolFeeStatus

### Community 24 - "Academic History Constants"
Cohesion: 0.18
Nodes (12): ACADEMIC_HISTORY_ATTEMPT_OPTIONS, ACADEMIC_HISTORY_AWAITING_RESULT_OPTION, ACADEMIC_HISTORY_RULES, AcademicHistory, ExamRecord, TAcademicHistory, formatDateOnly(), padDatePart() (+4 more)

### Community 25 - "Student Fees & Password DTOs"
Cohesion: 0.18
Nodes (13): PasswordChangePayload, StudentFeePartPaymentConfig, StudentFeePartPaymentEntry, StudentFeePartPaymentMode, StudentFeePaymentPayload, StudentFeePlan, StudentSchoolFeePaymentStatus, PaymentPageView (+5 more)

### Community 26 - "Auth Service & Login"
Cohesion: 0.15
Nodes (3): LoginResponse, AuthService, Injectable

### Community 28 - "Sidebar Navigation"
Cohesion: 0.16
Nodes (4): HostListener, AppSidebar, Component, ProtectedPageFeature

### Community 29 - "Auth Profile Data & Pages"
Cohesion: 0.19
Nodes (9): ProfileFailResponse, ProfilePayload, ProfileSuccessResponse, validationCheckDTO, AuthEmailPayload, AuthOtpPayload, AuthOtpTokenResponse, RefreshTokenResponse (+1 more)

### Community 31 - "OTP Page State"
Cohesion: 0.13
Nodes (18): Personal Details Step Component, Dual-Mode OTP Flow (verify vs reset), OTP Form (six-box entry), OTP Page Template, OTP Resend Countdown, Password Strength Checklist, Password Reset Successful Dialog, Password Reset Template (+10 more)

### Community 32 - "Address Parser & Next of Kin"
Cohesion: 0.18
Nodes (4): AddressComponents, parseAddress(), NextOfKinComponent, Component

### Community 33 - "Payment Workflow Service"
Cohesion: 0.21
Nodes (8): PaymentRefResponse, PaymentWorkflowHooks, PaymentWorkflowService, PaystackCallbackResponse, PaystackHandler, PaystackPopType, PaystackSetupConfig, Injectable

### Community 34 - "App Config Service"
Cohesion: 0.20
Nodes (3): AppConfigService, Injectable, AppState

### Community 35 - "OTP Page Component"
Cohesion: 0.16
Nodes (3): OtpPageComponent, Component, ViewChildren

### Community 36 - "Angular Build Config"
Cohesion: 0.18
Nodes (15): options, assets, browser, index, inlineStyleLanguage, outputPath, polyfills, scripts (+7 more)

### Community 37 - "Graphify Project Conventions"
Cohesion: 0.20
Nodes (15): AST-Only Update (No API Cost), Community Structure, Cross-File Relationships, God Nodes, graphify-out/graph.json, graphify-out/GRAPH_REPORT.md, graphify, graphify explain (+7 more)

### Community 38 - "Application Status Constants"
Cohesion: 0.19
Nodes (11): APPLICATION_STATUS_DEFINITIONS, APPLICATION_STATUS_DESCRIPTIONS, APPLICATION_STATUS_LABELS, APPLICATION_STATUS_OPTIONS, APPLICATION_STATUS_ORDER, APPLICATION_STATUS_TONES, ApplicationStatusDefinition, ApplicationStatusOption (+3 more)

### Community 39 - "Dashboard Flow Constants"
Cohesion: 0.21
Nodes (13): ApplicationStatusKey, ACTION_LABELS, APPROVAL_STATUS_MESSAGES, DashboardApprovalMessage, HERO_CONTENT, ROUTES, STATUS_MATCHERS, STEP_CONTENT (+5 more)

### Community 40 - "Returning Features Student"
Cohesion: 0.15
Nodes (3): ReturningCoursesComponent, Component, ResitCourse

### Community 41 - "Auth Sigin Consmeff"
Cohesion: 0.15
Nodes (4): Logout, Component, ConsmeffLoginComponent, Component

### Community 42 - "Application Services Service"
Cohesion: 0.22
Nodes (4): StudentHostelAllocation, StudentHostelListResponse, StudentHostelOption, StudentHostelRoomOption

### Community 43 - "Returning Features Student"
Cohesion: 0.27
Nodes (3): ReturningProfileComponent, Component, AddressData

### Community 44 - "Services User Portal"
Cohesion: 0.24
Nodes (6): ADMITTED_USER_TYPES, NEW_CANDIDATE_USER_TYPES, PENDING_ACCEPTANCE_FEE_KEYWORDS, RETURNING_USER_TYPES, Injectable, UserPortalService

### Community 45 - "Admitted Features Student"
Cohesion: 0.23
Nodes (3): RegisteredCourse, AdmittedCoursesComponent, Component

### Community 46 - "Portal Guard Services"
Cohesion: 0.22
Nodes (8): PortalEntryStubComponent, Component, appRoutes, authGuard(), portalEntryGuard(), portalSegmentGuard(), resolveExpectedPortalSegment(), PortalSegment

### Community 47 - "Services Loading Global"
Cohesion: 0.19
Nodes (5): GlobalLoadingComponent, Component, LoadingInterceptor(), LoadingService, Injectable

### Community 48 - "Layout Topbar Apptopbar"
Cohesion: 0.18
Nodes (6): AppFooter, Component, AppLayout, Component, AppTopbar, Component

### Community 50 - "Services Service Regstore"
Cohesion: 0.24
Nodes (4): StatesDTO, RegistrantDataDTO, RegStoreService, Injectable

### Community 51 - "Data Application Registrantdatadto"
Cohesion: 0.17
Nodes (11): Address, AryParentOrGuardian, Country, Department, Session, State, StudentAdmissionDocuments, StudentDepartment (+3 more)

### Community 53 - "Dashboard Application Guideline"
Cohesion: 0.20
Nodes (7): APPLICATION_GUIDELINE_CONTENT, ApplicationGuidelineContent, GuidelineSection, ApplicationGuidelineModalComponent, Component, Input, Output

### Community 54 - "Admissionform Xdashboard Dashboard"
Cohesion: 0.20
Nodes (12): Admission Stepper Flow, Academic History Step Component, Application Summary Step Component, Next of Kin Step Component, Document Upload Step Component, Form Step Status Gating, Application Guidelines Dialog, Admission Requirements (SSCE, documents, fee, JAMB) (+4 more)

### Community 55 - "Package Dependencies Angular"
Cohesion: 0.18
Nodes (11): @angular/animations, @angular/core, chartjs-adapter-date-fns, @ngrx/signals, dependencies, @angular/animations, @angular/core, chartjs-adapter-date-fns (+3 more)

### Community 56 - "Services Permission Service"
Cohesion: 0.24
Nodes (5): ALL_ROLES, PermissionService, RoleId, Injectable, UserToken

### Community 57 - "Data Payment Shared"
Cohesion: 0.18
Nodes (11): Compliance Directive Notice, Edit Lock Policy, Payment Row Template, Payment Table Columns, Receipt Download Action, App Data Table Component, Row Template Projection, Sortable Column Headers (+3 more)

### Community 58 - "Services Navigation Access"
Cohesion: 0.35
Nodes (3): NavigationAccessService, RETURNING_FIRST_INSTALLMENT_FEATURES, Injectable

### Community 60 - "Returning Features Student"
Cohesion: 0.24
Nodes (4): ReturningCgpaTrackerComponent, Component, ReturningResultsComponent, Component

### Community 61 - "Button Returning Shared"
Cohesion: 0.27
Nodes (5): ReturningCourse, ButtonComponent, ButtonType, ButtonVariant, Component

### Community 64 - "Pagination Dashboard Shared"
Cohesion: 0.22
Nodes (10): Pending Payment Flow Component, Dashboard Template, Payment History Template, Search / Sort / Paginate Toolbar Pattern, Quick Actions Navigation, App Filter Select Component, App Pagination Component, Ellipsis Page Windowing (+2 more)

### Community 65 - "Assets Logo Images"
Cohesion: 0.36
Nodes (10): Crest Iconography: Lamp of Nursing, Crescent, Circular Motto Band, CONSMMEF Institutional Seal (favicon-sized crest), Browser Tab / App Icon Identity Slot, Purple Abstract Loop Favicon Mark, SVG Pattern Fill Wrapping a Base64 PNG (not true vector art), Wide Horizontal Logo Wordmark (SVG-wrapped raster, 1358x311), Brand Palette: Magenta Wordmark, Cyan Subtitle, Red-Blue Shield, Institution Identity: College of Nursing Sciences, Muslim Medical Foundation (+2 more)

### Community 66 - "Angular Production Build"
Cohesion: 0.22
Nodes (9): build, builder, configurations, defaultConfiguration, production, budgets, buildTarget, fileReplacements (+1 more)

### Community 67 - "Package Scripts Lint"
Cohesion: 0.22
Nodes (9): scripts, build, format, lint, lint:fix, ng, start, test (+1 more)

### Community 68 - "Prettierrc Bracketsameline Overrides"
Cohesion: 0.22
Nodes (8): bracketSameLine, overrides, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 70 - "Data Application Personaldetailsdto"
Cohesion: 0.22
Nodes (8): AcademicHistory, Address, AryParentOrGuardian, CertificateOfBirth, OLevelResult, PersonalDetailDTO, Subject, UtmeResult

### Community 72 - "Inactivity Services Service"
Cohesion: 0.31
Nodes (3): INACTIVITY_PROVIDERS, InactivityService, Injectable

### Community 74 - "Angular Serve Staging"
Cohesion: 0.25
Nodes (8): serve, staging, builder, configurations, defaultConfiguration, buildTarget, fileReplacements, outputHashing

### Community 75 - "Angular Consmeff Schematics"
Cohesion: 0.25
Nodes (8): prefix, projectType, root, schematics, sourceRoot, consmeff, style, @schematics/angular:component

### Community 76 - "Data Application Payment"
Cohesion: 0.32
Nodes (3): PaginatedPaymentsResponse, PaymentHistoryItem, PaymentStatus

### Community 78 - "Returning Features Student"
Cohesion: 0.25
Nodes (4): EditableProfileSection, NextOfKinData, PersonalContactData, ReturningProfileTab

### Community 79 - "Interceptor Services Error"
Cohesion: 0.43
Nodes (7): buildErrorMessage(), buildErrorSummary(), collectMessages(), collectMessagesRecursively(), errorInterceptor(), extractObjectMessage(), INTERCEPTOR_SUMMARIES

### Community 80 - "Assets Flags Images"
Cohesion: 0.36
Nodes (8): Country Flag Sprite Sheet (flags_responsive.png), Vertical CSS Sprite Tiling Scheme (44px wide, ~30px rows), PrimeNG Demo/Showcase Asset (assets/demo), Public Landing Page Hero Carousel, Carousel Slide 1 - Nursing Students in Blue Scrubs, Student Cohort Identity and Clinical Training Theme, Carousel Slide 2 - Campus Building Exterior with Nigerian Flag, Nigerian Institution Branding and Campus Facility Identity

### Community 81 - "Angular Cli Analytics"
Cohesion: 0.29
Nodes (6): analytics, cli, newProjectRoot, projects, $schema, version

### Community 82 - "Angular Development Configurations"
Cohesion: 0.29
Nodes (7): development, aot, buildTarget, namedChunks, optimization, outputHashing, sourceMap

### Community 83 - "Angular Package Devdependencies"
Cohesion: 0.29
Nodes (7): @angular-devkit/build-angular, eslint, devDependencies, @angular/cli, @angular-devkit/build-angular, eslint, @angular/cli

### Community 86 - "Dashboard New Services"
Cohesion: 0.38
Nodes (3): Dashboard, Component, featureAccessGuard()

### Community 88 - "Admissionform Button Layout"
Cohesion: 0.29
Nodes (7): ActivPulse Spectra Branding Link, App Footer Template, Technical Support Message, Admission Form Template, Registration Complete Dialog, App Button Component, Icon Position Variant API

### Community 90 - "Widgets Dashboard Pending"
Cohesion: 0.47
Nodes (3): Datum, Department, programSelectionOption

### Community 91 - "Topbar Widgets Sidebar"
Cohesion: 0.40
Nodes (6): Sidebar Navigation Template, Dark Mode Theme Toggle, Topbar Sidebar Toggle Control, Topbar Template, Application HTML Shell (app-root), External Font and Branding Assets

### Community 92 - "Angular Architect Extract"
Cohesion: 0.40
Nodes (5): extract-i18n, test, architect, builder, builder

### Community 96 - "Filter Shared Select"
Cohesion: 0.40
Nodes (4): FilterSelectComponent, Component, Input, Output

### Community 99 - "License Readme Mit"
Cohesion: 0.50
Nodes (4): MIT License (Sakai template), PrimeTek (copyright holder), Angular CLI Build and Test Workflow, Sakai19 Angular Project

### Community 100 - "Package Name Private"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 103 - "Status Shared Indicator"
Cohesion: 0.67
Nodes (3): StatusIndicatorComponent, Component, Input

## Ambiguous Edges - Review These
- `Edit Lock Policy` → `App Status Indicator Component`  [AMBIGUOUS]
  src/app/shared/components/status-indicator/status-indicator.component.html · relation: conceptually_related_to
- `Sidebar Navigation Template` → `Application HTML Shell (app-root)`  [AMBIGUOUS]
  src/index.html · relation: conceptually_related_to
- `Country Flag Sprite Sheet (flags_responsive.png)` → `Nigerian Institution Branding and Campus Facility Identity`  [AMBIGUOUS]
  src/assets/demo/flags/flags_responsive.png · relation: conceptually_related_to
- `PrimeNG Demo/Showcase Asset (assets/demo)` → `Public Landing Page Hero Carousel`  [AMBIGUOUS]
  src/assets/demo/flags/flags_responsive.png · relation: conceptually_related_to
- `Purple Abstract Loop Favicon Mark` → `Brand Palette: Magenta Wordmark, Cyan Subtitle, Red-Blue Shield`  [AMBIGUOUS]
  src/assets/images/favicon.png · relation: conceptually_related_to
- `Wide Horizontal Logo Wordmark (SVG-wrapped raster, 1358x311)` → `Institution Identity: College of Nursing Sciences, Muslim Medical Foundation`  [AMBIGUOUS]
  src/assets/images/logo.svg · relation: conceptually_related_to

## Knowledge Gaps
- **237 isolated node(s):** `useTabs`, `tabWidth`, `trailingComma`, `semi`, `singleQuote` (+232 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **71 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Edit Lock Policy` and `App Status Indicator Component`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Sidebar Navigation Template` and `Application HTML Shell (app-root)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Country Flag Sprite Sheet (flags_responsive.png)` and `Nigerian Institution Branding and Campus Facility Identity`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `PrimeNG Demo/Showcase Asset (assets/demo)` and `Public Landing Page Hero Carousel`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Purple Abstract Loop Favicon Mark` and `Brand Palette: Magenta Wordmark, Cyan Subtitle, Red-Blue Shield`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Wide Horizontal Logo Wordmark (SVG-wrapped raster, 1358x311)` and `Institution Identity: College of Nursing Sciences, Muslim Medical Foundation`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `ApplicationService` connect `Application Service API Client` to `Table & Payment Page Constants`, `Admission Response DTOs`, `Location & Transformer DTOs`, `Payment Page Component`, `Admitted Student Routing`, `Course Registration DTOs`, `Auth Session Store`, `Student Dashboard Data Fetch`, `Academic History Constants`, `Student Fees & Password DTOs`, `Document Upload Form`, `Auth Profile Data & Pages`, `Payment Workflow Service`, `Dashboard Flow Constants`, `Application Services Service`, `Services Service Regstore`, `Services Navigation Access`, `Data Application Payment`, `Application Preregistrationdatadto Services`, `Application Data Student`, `Application Services Service`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._