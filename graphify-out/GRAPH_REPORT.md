# Graph Report - StudentManagementPortalv3  (2026-08-13)

## Corpus Check
- 155 files · ~109,711 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1733 nodes · 3324 edges · 146 communities (79 shown, 67 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 91 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1bb87ba0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ReturningFlowService
- LayoutService
- payment.component.ts
- programComponent
- AcademicHistoryComponent
- AdmittedFlowService
- admissionform.component.ts
- ReturningPaymentComponent
- PaymentComponent
- AdmissionFormComponent
- PendingPaymentFlowComponent
- consmeff-login.component.ts
- dashboard.service.ts
- Returning Dashboard Template
- admitted-flow.service.ts
- TraceabilitySeeder
- Academic History Form Template
- ThemeService
- ApplicationService
- auth-session.store.ts
- ApplicationSummaryComponent
- PersonalDetailsComponent
- TraceabilitySeeder
- .toRecord
- SidebarComponent
- application.service.ts
- AuthService
- UploadFormComponent
- AppSidebar
- auth.service.ts
- AdmittedPaymentComponent
- Admission Portal Login Template
- NextOfKinComponent
- payment-workflow.service.ts
- AppConfigService
- OtpPageComponent
- options
- Project Knowledge Graph (graphify-out/)
- application-status.constants.ts
- pending-payment-flow.component.ts
- ReturningCoursesComponent
- application-guideline.data.ts
- .normalizeStudentHostelOption
- ReturningProfileComponent
- UserPortalService
- academichistory.component.ts
- app.routes.ts
- app.config.ts
- app.layout.ts
- JwtService
- regstore.service.ts
- registrantdatadto.ts
- name-format.ts
- ApplicationGuidelineModalComponent
- Admission Stepper Flow
- dependencies
- app.menu.ts
- App Data Table Component
- NavigationAccessService
- TopbarComponent
- returning-student.routes.ts
- button.component.ts
- AppMenu
- SignUpComponent
- Payment History Template
- CONSMMEF Institutional Seal (favicon-sized crest)
- production
- scripts
- .prettierrc.json
- RegistrantData
- personaldetailsdto.ts
- normalizeApplicationStatusKey
- Legacy Applicant Dashboard Template
- ErrorHandler
- staging
- consmeff
- returning-flow.service.ts
- ReturningHostelComponent
- PasswordResetComponent
- InactivityService
- Country Flag Sprite Sheet (flags_responsive.png)
- angular.json
- development
- devDependencies
- @angular/core
- admitted-profile.component.ts
- app.sidebar.ts
- returning-profile.component.ts
- Admission Form Template
- AuthSessionStore
- Department
- Sidebar Navigation Template
- architect
- ReturningDashboardComponent
- Password Reset Template
- .normalizeStudentCgpaTrendResponse
- FilterSelectComponent
- DesignerService
- functions.ts
- MIT License (Sakai template)
- package.json
- @angular/compiler
- PortalShellComponent
- @angular/compiler-cli
- vercel.json
- autoprefixer
- @angular-eslint/eslint-plugin
- @angular-eslint/eslint-plugin-template
- @angular-eslint/template-parser
- @angular/forms
- @angular/platform-browser
- @angular/platform-browser-dynamic
- @angular/router
- chart.js
- date-fns
- eslint-config-airbnb-base
- eslint-config-airbnb-typescript
- eslint-config-prettier
- eslint-import-resolver-typescript
- eslint-plugin-import
- exceljs
- jasmine-core
- jwt-decode
- karma
- karma-chrome-launcher
- karma-coverage
- karma-jasmine
- karma-jasmine-html-reporter
- primeicons
- primeng
- rxjs
- tailwindcss-primeui
- tslib
- @types/node
- zone.js
- postcss
- prettier
- tailwindcss
- @types/jasmine
- typescript
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- environment.prod.ts
- environment.staging.ts

## God Nodes (most connected - your core abstractions)
1. `ApplicationService` - 93 edges
2. `ReturningFlowService` - 65 edges
3. `AdmissionFormComponent` - 52 edges
4. `AcademicHistoryComponent` - 47 edges
5. `AdmittedFlowService` - 46 edges
6. `PendingPaymentFlowComponent` - 43 edges
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

## Communities (146 total, 67 thin omitted)

### Community 0 - "ReturningFlowService"
Cohesion: 0.05
Nodes (4): StudentDashboardAnnouncement, HostelApplicationStatus, ReturningFlowService, Injectable

### Community 1 - "LayoutService"
Cohesion: 0.06
Nodes (20): HostBinding, AppConfigurator, KeyOfType, presets, SurfacesType, Component, AppFloatingConfigurator, Component (+12 more)

### Community 2 - "payment.component.ts"
Cohesion: 0.08
Nodes (17): DATA_TABLE_CONFIG, PAGINATION_CONFIG, PAYMENT_PAGE_CONFIG, PAYMENT_RECEIPT_KEYS, PAYMENT_STATUS_CLASS, PAYMENT_TABLE_COLUMNS, TPaymentQueryState, DataTableComponent (+9 more)

### Community 3 - "programComponent"
Cohesion: 0.06
Nodes (15): AppInitResponse, AppInitResponseDTO, Convert, DepartmentsDTO, Faculty, Level, OpenApplicationDTO, Program (+7 more)

### Community 4 - "AcademicHistoryComponent"
Cohesion: 0.11
Nodes (4): AcademicHistory, OLevelResult, AcademicHistoryComponent, Component

### Community 6 - "admissionform.component.ts"
Cohesion: 0.15
Nodes (15): formstepDTO, CertificateOfBirth, TAcademicHistory, TNextOfKinDTO, TOLevelResult, TPersonalDetailDTO, TUploadFile, TUtmeResultPayload (+7 more)

### Community 11 - "consmeff-login.component.ts"
Cohesion: 0.13
Nodes (11): ConsmeffLoginComponent, LOGIN_CAROUSEL_IMAGES, PENDING_VERIFICATION_STATUSES, Component, buildErrorSummary(), collectMessages(), collectMessagesRecursively(), errorInterceptor() (+3 more)

### Community 12 - "dashboard.service.ts"
Cohesion: 0.10
Nodes (19): HierarchyInfo, HierarchyLevel, HierarchySummary, HierarchyTreeNode, LevelInfo, SupplyChainHierarchy, TimelineEvent, ActivityLog (+11 more)

### Community 13 - "Returning Dashboard Template"
Cohesion: 0.10
Nodes (30): Acceptance Fee Invoice Generation, Admitted Acceptance Payment Template, Admitted Course Registration Slip, Payment-Gated Course Registration, Admitted Courses Template, Acceptance-Paid Dashboard State Switch, Admitted Dashboard Template, Three-Installment School Fee Policy (+22 more)

### Community 14 - "admitted-flow.service.ts"
Cohesion: 0.13
Nodes (12): AcceptanceFee, StudentSingleData, AdmissionDocumentType, SchoolFeePaymentRecord, VerificationDocument, PaymentPageView, buildStudentFeePaymentPayload(), buildStudentFeePaymentPayloadForAmount() (+4 more)

### Community 15 - "TraceabilitySeeder"
Cohesion: 0.14
Nodes (11): adopt(), fulfilled(), crypto, fs, main(), path, TraceabilitySeeder(), rejected() (+3 more)

### Community 16 - "Academic History Form Template"
Cohesion: 0.12
Nodes (25): Cascading State to Local Government Dropdown Pattern, PrimeNG Reactive Form Control Convention, Awaiting Result Conditional Exam Grades Branch, Exam Attempt Count FormArray (Sittings), JAMB Details Sub-Form, Optional Other Qualifications FormArray, School Completion Age Validation, Academic History Form Template (+17 more)

### Community 17 - "ThemeService"
Cohesion: 0.17
Nodes (4): RequestPasswordResetComponent, Component, ThemeService, Injectable

### Community 18 - "ApplicationService"
Cohesion: 0.12
Nodes (4): LGADTO, StudentSingleResponse, ApplicationService, Injectable

### Community 19 - "auth-session.store.ts"
Cohesion: 0.21
Nodes (10): AuthSessionCookieState, AuthSessionState, buildPortalSessionPatch(), clearAuthSessionCookie(), hasPaidStatus(), initialAuthSessionCookieState, initialAuthSessionState, normalizeSessionValue() (+2 more)

### Community 22 - "TraceabilitySeeder"
Cohesion: 0.16
Nodes (6): TraceabilityEvent, crypto, fs, main(), path, TraceabilitySeeder

### Community 23 - ".toRecord"
Cohesion: 0.17
Nodes (4): PaginatedPaymentsResponse, StudentDashboardResponse, StudentHostelListResponse, StudentResultsResponse

### Community 25 - "application.service.ts"
Cohesion: 0.13
Nodes (12): PasswordChangePayload, PaymentHistoryItem, PaymentRefResponse, PaymentStatus, StudentFeePartPaymentConfig, StudentFeePartPaymentEntry, StudentFeePartPaymentMode, StudentFeePaymentPayload (+4 more)

### Community 26 - "AuthService"
Cohesion: 0.15
Nodes (3): LoginResponse, AuthService, Injectable

### Community 28 - "AppSidebar"
Cohesion: 0.17
Nodes (3): HostListener, AppSidebar, Component

### Community 29 - "auth.service.ts"
Cohesion: 0.18
Nodes (9): ProfileFailResponse, ProfilePayload, ProfileSuccessResponse, validationCheckDTO, AuthEmailPayload, AuthOtpPayload, AuthOtpTokenResponse, RefreshTokenResponse (+1 more)

### Community 30 - "AdmittedPaymentComponent"
Cohesion: 0.05
Nodes (11): RegisteredCourse, AdmittedAcceptancePaymentComponent, Component, AdmittedCoursesComponent, Component, AdmittedDashboardComponent, Component, AdmittedPaymentComponent (+3 more)

### Community 31 - "Admission Portal Login Template"
Cohesion: 0.20
Nodes (11): Personal Details Step Component, OTP Form (six-box entry), OTP Resend Countdown, Email OTP Request Form, Request Password Reset Template, Auth Split-Panel Carousel, Login Form (email + password), Admission Portal Login Template (+3 more)

### Community 32 - "NextOfKinComponent"
Cohesion: 0.18
Nodes (4): AddressComponents, parseAddress(), NextOfKinComponent, Component

### Community 33 - "payment-workflow.service.ts"
Cohesion: 0.21
Nodes (8): PaymentRefResponse, PaymentWorkflowHooks, PaymentWorkflowService, PaystackCallbackResponse, PaystackHandler, PaystackPopType, PaystackSetupConfig, Injectable

### Community 34 - "AppConfigService"
Cohesion: 0.20
Nodes (3): AppConfigService, Injectable, AppState

### Community 35 - "OtpPageComponent"
Cohesion: 0.15
Nodes (3): OtpPageComponent, Component, ViewChildren

### Community 36 - "options"
Cohesion: 0.18
Nodes (15): options, assets, browser, index, inlineStyleLanguage, outputPath, polyfills, scripts (+7 more)

### Community 37 - "Project Knowledge Graph (graphify-out/)"
Cohesion: 0.20
Nodes (15): AST-Only Update (No API Cost), Community Structure, Cross-File Relationships, God Nodes, graphify-out/graph.json, graphify-out/GRAPH_REPORT.md, graphify, graphify explain (+7 more)

### Community 38 - "application-status.constants.ts"
Cohesion: 0.22
Nodes (11): APPLICATION_STATUS_DEFINITIONS, APPLICATION_STATUS_DESCRIPTIONS, APPLICATION_STATUS_LABELS, APPLICATION_STATUS_OPTIONS, APPLICATION_STATUS_ORDER, APPLICATION_STATUS_TONES, ApplicationStatusDefinition, ApplicationStatusKey (+3 more)

### Community 39 - "pending-payment-flow.component.ts"
Cohesion: 0.22
Nodes (12): ACTION_LABELS, APPROVAL_STATUS_MESSAGES, DashboardApprovalMessage, HERO_CONTENT, ROUTES, STATUS_MATCHERS, STEP_CONTENT, UI_COPY (+4 more)

### Community 40 - "ReturningCoursesComponent"
Cohesion: 0.15
Nodes (3): ReturningCoursesComponent, Component, ResitCourse

### Community 41 - "application-guideline.data.ts"
Cohesion: 0.22
Nodes (12): ApplicationFeeAmounts, buildApplicationFeeHeading(), buildApplicationGuidelineContent(), DEFAULT_APPLICATION_FEE_AMOUNTS, GuidelineSection, convertBelowThousandToWords(), convertWholeNumberToWords(), formatNairaAmount() (+4 more)

### Community 42 - ".normalizeStudentHostelOption"
Cohesion: 0.31
Nodes (3): StudentHostelAllocation, StudentHostelOption, StudentHostelRoomOption

### Community 43 - "ReturningProfileComponent"
Cohesion: 0.27
Nodes (3): ReturningProfileComponent, Component, AddressData

### Community 44 - "UserPortalService"
Cohesion: 0.24
Nodes (6): ADMITTED_USER_TYPES, NEW_CANDIDATE_USER_TYPES, PENDING_ACCEPTANCE_FEE_KEYWORDS, RETURNING_USER_TYPES, Injectable, UserPortalService

### Community 45 - "academichistory.component.ts"
Cohesion: 0.26
Nodes (9): ACADEMIC_HISTORY_ATTEMPT_OPTIONS, ACADEMIC_HISTORY_AWAITING_RESULT_OPTION, ACADEMIC_HISTORY_RULES, ExamRecord, formatDateOnly(), padDatePart(), parseDateOnly(), extractLastYearFromText() (+1 more)

### Community 46 - "app.routes.ts"
Cohesion: 0.22
Nodes (8): PortalEntryStubComponent, Component, appRoutes, authGuard(), portalEntryGuard(), portalSegmentGuard(), resolveExpectedPortalSegment(), PortalSegment

### Community 47 - "app.config.ts"
Cohesion: 0.13
Nodes (9): AppComponent, Component, appConfig, GlobalLoadingComponent, Component, jwtInterceptor(), LoadingInterceptor(), LoadingService (+1 more)

### Community 48 - "app.layout.ts"
Cohesion: 0.18
Nodes (6): AppFooter, Component, AppLayout, Component, AppTopbar, Component

### Community 50 - "regstore.service.ts"
Cohesion: 0.17
Nodes (10): Countries, CountryDTO, LGA, States, StatesDTO, PreRegistrationDataDTO, LGA, RegistrantDataDTO (+2 more)

### Community 51 - "registrantdatadto.ts"
Cohesion: 0.17
Nodes (11): Address, AryParentOrGuardian, Country, Department, Session, State, StudentAdmissionDocuments, StudentDepartment (+3 more)

### Community 52 - "name-format.ts"
Cohesion: 0.39
Nodes (7): buildStudentDisplayName(), composeDisplayName(), formatStructuredName(), normalizeDisplayName(), normalizeNamePart(), StructuredNameInput, toTitleCase()

### Community 53 - "ApplicationGuidelineModalComponent"
Cohesion: 0.25
Nodes (5): ApplicationGuidelineContent, ApplicationGuidelineModalComponent, Component, Input, Output

### Community 54 - "Admission Stepper Flow"
Cohesion: 0.22
Nodes (10): Admission Stepper Flow, Academic History Step Component, Application Summary Step Component, Next of Kin Step Component, Document Upload Step Component, Compliance Directive Notice, Form Step Status Gating, Edit Lock Policy (+2 more)

### Community 55 - "dependencies"
Cohesion: 0.18
Nodes (11): @angular/animations, @angular/common, chartjs-adapter-date-fns, @ngrx/signals, dependencies, @angular/animations, @angular/common, chartjs-adapter-date-fns (+3 more)

### Community 56 - "app.menu.ts"
Cohesion: 0.24
Nodes (5): ALL_ROLES, PermissionService, RoleId, Injectable, UserToken

### Community 57 - "App Data Table Component"
Cohesion: 0.29
Nodes (7): Payment Row Template, Payment Table Columns, Receipt Download Action, App Data Table Component, Row Template Projection, Sortable Column Headers, Loading and Empty State Messaging

### Community 60 - "returning-student.routes.ts"
Cohesion: 0.24
Nodes (4): ReturningCgpaTrackerComponent, Component, ReturningResultsComponent, Component

### Community 61 - "button.component.ts"
Cohesion: 0.27
Nodes (5): ReturningCourse, ButtonComponent, ButtonType, ButtonVariant, Component

### Community 64 - "Payment History Template"
Cohesion: 0.29
Nodes (8): Payment History Template, Search / Sort / Paginate Toolbar Pattern, Quick Actions Navigation, App Filter Select Component, App Pagination Component, Ellipsis Page Windowing, Page Size Control, App Search Input Component

### Community 65 - "CONSMMEF Institutional Seal (favicon-sized crest)"
Cohesion: 0.36
Nodes (10): Crest Iconography: Lamp of Nursing, Crescent, Circular Motto Band, CONSMMEF Institutional Seal (favicon-sized crest), Browser Tab / App Icon Identity Slot, Purple Abstract Loop Favicon Mark, SVG Pattern Fill Wrapping a Base64 PNG (not true vector art), Wide Horizontal Logo Wordmark (SVG-wrapped raster, 1358x311), Brand Palette: Magenta Wordmark, Cyan Subtitle, Red-Blue Shield, Institution Identity: College of Nursing Sciences, Muslim Medical Foundation (+2 more)

### Community 66 - "production"
Cohesion: 0.22
Nodes (9): build, builder, configurations, defaultConfiguration, production, budgets, buildTarget, fileReplacements (+1 more)

### Community 67 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, format, lint, lint:fix, ng, start, test (+1 more)

### Community 68 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): bracketSameLine, overrides, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 70 - "personaldetailsdto.ts"
Cohesion: 0.22
Nodes (8): AcademicHistory, Address, AryParentOrGuardian, CertificateOfBirth, OLevelResult, PersonalDetailDTO, Subject, UtmeResult

### Community 72 - "Legacy Applicant Dashboard Template"
Cohesion: 0.33
Nodes (6): Pending Payment Flow Component, Dashboard Template, Application Progress Widget, Sidebar Component, Topbar Component, Legacy Applicant Dashboard Template

### Community 74 - "staging"
Cohesion: 0.25
Nodes (8): serve, staging, builder, configurations, defaultConfiguration, buildTarget, fileReplacements, outputHashing

### Community 75 - "consmeff"
Cohesion: 0.25
Nodes (8): prefix, projectType, root, schematics, sourceRoot, consmeff, style, @schematics/angular:component

### Community 76 - "returning-flow.service.ts"
Cohesion: 0.08
Nodes (20): AvailableCourse, AvailableCoursesResponse, CourseInfo, flattenRegisteredCoursesResponse(), RegisterCoursesPayload, RegisteredCoursesResponse, StudentDashboardCoursesInfo, StudentDashboardFeeInfo (+12 more)

### Community 79 - "InactivityService"
Cohesion: 0.31
Nodes (3): INACTIVITY_PROVIDERS, InactivityService, Injectable

### Community 80 - "Country Flag Sprite Sheet (flags_responsive.png)"
Cohesion: 0.36
Nodes (8): Country Flag Sprite Sheet (flags_responsive.png), Vertical CSS Sprite Tiling Scheme (44px wide, ~30px rows), PrimeNG Demo/Showcase Asset (assets/demo), Public Landing Page Hero Carousel, Carousel Slide 1 - Nursing Students in Blue Scrubs, Student Cohort Identity and Clinical Training Theme, Carousel Slide 2 - Campus Building Exterior with Nigerian Flag, Nigerian Institution Branding and Campus Facility Identity

### Community 81 - "angular.json"
Cohesion: 0.29
Nodes (6): analytics, cli, newProjectRoot, projects, $schema, version

### Community 82 - "development"
Cohesion: 0.29
Nodes (7): development, aot, buildTarget, namedChunks, optimization, outputHashing, sourceMap

### Community 83 - "devDependencies"
Cohesion: 0.29
Nodes (7): @angular-devkit/build-angular, eslint, devDependencies, @angular/cli, @angular-devkit/build-angular, eslint, @angular/cli

### Community 85 - "admitted-profile.component.ts"
Cohesion: 0.29
Nodes (6): ApplicationStatusTone, App Status Indicator Component, StatusIndicatorComponent, StatusTone, Component, Input

### Community 86 - "app.sidebar.ts"
Cohesion: 0.23
Nodes (6): SidebarMenuItem, Dashboard, Component, featureAccessGuard(), ProtectedPageFeature, RETURNING_FIRST_INSTALLMENT_FEATURES

### Community 87 - "returning-profile.component.ts"
Cohesion: 0.25
Nodes (4): EditableProfileSection, NextOfKinData, PersonalContactData, ReturningProfileTab

### Community 88 - "Admission Form Template"
Cohesion: 0.29
Nodes (7): ActivPulse Spectra Branding Link, App Footer Template, Technical Support Message, Admission Form Template, Registration Complete Dialog, App Button Component, Icon Position Variant API

### Community 89 - "AuthSessionStore"
Cohesion: 0.18
Nodes (9): NgModule, sidebarStateDTO, Logout, Component, TraceabilityModule, AuthSessionStore, Injectable, WidgetsService (+1 more)

### Community 90 - "Department"
Cohesion: 0.47
Nodes (3): Datum, Department, programSelectionOption

### Community 91 - "Sidebar Navigation Template"
Cohesion: 0.40
Nodes (6): Sidebar Navigation Template, Dark Mode Theme Toggle, Topbar Sidebar Toggle Control, Topbar Template, Application HTML Shell (app-root), External Font and Branding Assets

### Community 92 - "architect"
Cohesion: 0.40
Nodes (5): extract-i18n, test, architect, builder, builder

### Community 94 - "Password Reset Template"
Cohesion: 0.29
Nodes (7): Dual-Mode OTP Flow (verify vs reset), OTP Page Template, Password Strength Checklist, Password Reset Successful Dialog, Password Reset Template, New Password Reset Form, Signup Password Strength Checklist

### Community 96 - "FilterSelectComponent"
Cohesion: 0.40
Nodes (4): FilterSelectComponent, Component, Input, Output

### Community 99 - "MIT License (Sakai template)"
Cohesion: 0.50
Nodes (4): MIT License (Sakai template), PrimeTek (copyright holder), Angular CLI Build and Test Workflow, Sakai19 Angular Project

### Community 100 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, version

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
- **240 isolated node(s):** `useTabs`, `tabWidth`, `trailingComma`, `semi`, `singleQuote` (+235 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **67 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

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
- **Why does `ApplicationService` connect `ApplicationService` to `payment.component.ts`, `programComponent`, `admissionform.component.ts`, `PaymentComponent`, `admitted-flow.service.ts`, `ApplicationSummaryComponent`, `.toRecord`, `application.service.ts`, `UploadFormComponent`, `auth.service.ts`, `payment-workflow.service.ts`, `pending-payment-flow.component.ts`, `.normalizeStudentHostelOption`, `academichistory.component.ts`, `regstore.service.ts`, `returning-flow.service.ts`, `app.sidebar.ts`, `AuthSessionStore`, `.normalizeStudentCgpaTrendResponse`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._