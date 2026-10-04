# Graph Report - StudentManagementPortalv3  (2026-10-04)

## Corpus Check
- 176 files · ~117,520 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1933 nodes · 3811 edges · 150 communities (86 shown, 64 thin omitted)
- Extraction: 97% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 93 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c642f4ea`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ReturningFlowService
- LayoutService
- DataTableComponent
- program.component.ts
- AcademicHistoryComponent
- AdmittedFlowService
- admissionform.component.ts
- ReturningPaymentComponent
- PaymentComponent
- AdmissionFormComponent
- PendingPaymentFlowComponent
- pending-payment-flow.component.ts
- dashboard.service.ts
- Returning Dashboard Template
- returning-student.routes.ts
- TraceabilitySeeder
- Academic History Form Template
- ThemeService
- new-candidate.routes.ts
- qr-code-matrix.ts
- ApplicationSummaryComponent
- PersonalDetailsComponent
- TraceabilitySeeder
- payment-receipt.component.ts
- admitted-profile.component.ts
- app.config.ts
- AuthService
- UploadFormComponent
- UserPortalService
- payment.component.ts
- AdmittedPaymentComponent
- Admission Portal Login Template
- NextOfKinComponent
- admitted-flow.service.ts
- AppConfigService
- TraceabilityModule
- options
- Project Knowledge Graph (graphify-out/)
- payment-format.ts
- application-guideline.data.ts
- ReturningCoursesComponent
- AppSidebar
- exceljs
- ReturningProfileComponent
- NavigationAccessService
- PaymentReceiptService
- personaldetailsdto.ts
- payment-workflow.service.ts
- auth-session.store.ts
- JwtService
- application.service.ts
- registrantdatadto.ts
- academichistory.component.ts
- PaginationComponent
- Admission Stepper Flow
- dependencies
- student-fees.dto.ts
- App Data Table Component
- AdmittedCoursesComponent
- TopbarComponent
- consmeff-login.component.ts
- app.routes.ts
- payment-receipt.service.ts
- @angular/core
- Payment History Template
- CONSMMEF Institutional Seal (favicon-sized crest)
- production
- scripts
- .prettierrc.json
- name-format.ts
- QrCodeComponent
- RegistrantData
- Legacy Applicant Dashboard Template
- ErrorHandler
- staging
- consmeff
- returning-flow.service.ts
- application-status.constants.ts
- .normalizeStudentHostelOption
- date-fns
- Country Flag Sprite Sheet (flags_responsive.png)
- angular.json
- development
- devDependencies
- AdmittedDashboardComponent
- PaymentReceiptComponent
- SignUpComponent
- Admission Form Template
- jasmine-core
- ApplicationGuidelineModalComponent
- Sidebar Navigation Template
- architect
- @angular/forms
- InactivityService
- .normalizeAcceptanceFeeResponse
- FilterSelectComponent
- DesignerService
- functions.ts
- MIT License (Sakai template)
- package.json
- Department
- PortalShellComponent
- AppTopbar
- vercel.json
- student-dashboard.dto.ts
- @angular/platform-browser
- chart.js
- ApplicationService
- @angular-eslint/eslint-plugin-template
- .toRecord
- AdmittedAcceptancePaymentComponent
- @angular/common
- @angular/platform-browser-dynamic
- @angular/router
- QrCodeComponent
- @angular/compiler
- @angular/compiler-cli
- autoprefixer
- eslint-config-airbnb-typescript
- eslint-config-prettier
- eslint-import-resolver-typescript
- eslint-plugin-import
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
- .normalizeStudentFeePlan
- @angular-eslint/template-parser
- @angular-eslint/eslint-plugin
- eslint-config-airbnb-base

## God Nodes (most connected - your core abstractions)
1. `ApplicationService` - 100 edges
2. `ReturningFlowService` - 71 edges
3. `AdmissionFormComponent` - 53 edges
4. `AdmittedFlowService` - 49 edges
5. `AcademicHistoryComponent` - 48 edges
6. `PendingPaymentFlowComponent` - 44 edges
7. `ReturningPaymentComponent` - 37 edges
8. `ApplicationSummaryComponent` - 33 edges
9. `AuthService` - 30 edges
10. `AuthSessionStore` - 30 edges

## Surprising Connections (you probably didn't know these)
- `StatusTone` --semantically_similar_to--> `Payment Row Template`  [INFERRED] [semantically similar]
  src/app/shared/components/status-indicator/status-indicator.component.ts → src/app/pages/payment/payment.component.html
- `Admission Stepper Flow` --semantically_similar_to--> `Application Progress Widget`  [INFERRED] [semantically similar]
  src/app/pages/admissionform/admissionform.component.html → src/app/pages/xdashboard/dashboard.component.html
- `MIT License (Sakai template)` --references--> `Sakai19 Angular Project`  [INFERRED]
  LICENSE.md → README.md
- `Edit Lock Policy` --conceptually_related_to--> `App Status Indicator Component`  [AMBIGUOUS]
  src/app/pages/admissionform/admissionform.component.html → src/app/shared/components/status-indicator/status-indicator.component.html
- `Dashboard Template` --semantically_similar_to--> `Legacy Applicant Dashboard Template`  [INFERRED] [semantically similar]
  src/app/pages/dashboard/dashboard.component.html → src/app/pages/xdashboard/dashboard.component.html

## Import Cycles
- None detected.

## Communities (150 total, 64 thin omitted)

### Community 0 - "ReturningFlowService"
Cohesion: 0.06
Nodes (5): StudentFeePlan, HostelApplicationStatus, ReturningFlowService, Injectable, selectStudentFeePlan()

### Community 1 - "LayoutService"
Cohesion: 0.06
Nodes (20): HostBinding, AppConfigurator, KeyOfType, presets, SurfacesType, Component, AppFloatingConfigurator, Component (+12 more)

### Community 2 - "DataTableComponent"
Cohesion: 0.22
Nodes (6): DATA_TABLE_CONFIG, DataTableComponent, Component, DataTableColumn, DataTableColumnAlign, DataTableRowContext

### Community 3 - "program.component.ts"
Cohesion: 0.06
Nodes (15): AppInitResponse, AppInitResponseDTO, Convert, DepartmentsDTO, Faculty, Level, OpenApplicationDTO, Program (+7 more)

### Community 4 - "AcademicHistoryComponent"
Cohesion: 0.11
Nodes (4): AcademicHistory, TAcademicHistory, AcademicHistoryComponent, Component

### Community 5 - "AdmittedFlowService"
Cohesion: 0.11
Nodes (3): AdmittedFlowService, Injectable, selectMatchingStudentFeePlan()

### Community 6 - "admissionform.component.ts"
Cohesion: 0.17
Nodes (15): formstepDTO, Countries, States, CertificateOfBirth, LGA, TNextOfKinDTO, TPersonalDetailDTO, TUploadFile (+7 more)

### Community 9 - "AdmissionFormComponent"
Cohesion: 0.08
Nodes (3): AdmissionFormComponent, Component, scrollToPageTop()

### Community 11 - "pending-payment-flow.component.ts"
Cohesion: 0.17
Nodes (15): ACTION_LABELS, APPROVAL_STATUS_MESSAGES, DashboardApprovalMessage, HERO_CONTENT, POST_PAYMENT_APPROVAL_STATUSES, ROUTES, SHORTLISTED_EXAM_INFO, STATUS_MATCHERS (+7 more)

### Community 12 - "dashboard.service.ts"
Cohesion: 0.10
Nodes (19): HierarchyInfo, HierarchyLevel, HierarchySummary, HierarchyTreeNode, LevelInfo, SupplyChainHierarchy, TimelineEvent, ActivityLog (+11 more)

### Community 13 - "Returning Dashboard Template"
Cohesion: 0.10
Nodes (30): Acceptance Fee Invoice Generation, Admitted Acceptance Payment Template, Admitted Course Registration Slip, Payment-Gated Course Registration, Admitted Courses Template, Acceptance-Paid Dashboard State Switch, Admitted Dashboard Template, Three-Installment School Fee Policy (+22 more)

### Community 14 - "returning-student.routes.ts"
Cohesion: 0.08
Nodes (12): ReturningCgpaTrackerComponent, Component, ReturningDashboardComponent, Component, ReturningHostelComponent, Component, ReturningResultsComponent, Component (+4 more)

### Community 15 - "TraceabilitySeeder"
Cohesion: 0.14
Nodes (11): adopt(), fulfilled(), crypto, fs, main(), path, TraceabilitySeeder(), rejected() (+3 more)

### Community 16 - "Academic History Form Template"
Cohesion: 0.12
Nodes (25): Cascading State to Local Government Dropdown Pattern, PrimeNG Reactive Form Control Convention, Awaiting Result Conditional Exam Grades Branch, Exam Attempt Count FormArray (Sittings), JAMB Details Sub-Form, Optional Other Qualifications FormArray, School Completion Age Validation, Academic History Form Template (+17 more)

### Community 17 - "ThemeService"
Cohesion: 0.11
Nodes (6): PasswordResetComponent, Component, RequestPasswordResetComponent, Component, ThemeService, Injectable

### Community 18 - "new-candidate.routes.ts"
Cohesion: 0.40
Nodes (3): Dashboard, Component, featureAccessGuard()

### Community 19 - "qr-code-matrix.ts"
Cohesion: 0.05
Nodes (71): QR_ALIGNMENT_PATTERN_CENTERS, QR_CODE_CONFIG, QR_CODE_DEFAULTS, QR_ERROR_CORRECTION_INDICATORS, QR_FORMAT_INFORMATION, QR_GALOIS_FIELD, QR_MASK_PENALTY, QR_PAD_CODEWORDS (+63 more)

### Community 22 - "TraceabilitySeeder"
Cohesion: 0.16
Nodes (6): TraceabilityEvent, crypto, fs, main(), path, TraceabilitySeeder

### Community 23 - "payment-receipt.component.ts"
Cohesion: 0.15
Nodes (14): PAYMENT_RECEIPT_CONFIG, PAYMENT_RECEIPT_FIELD_LABELS, PAYMENT_RECEIPT_MESSAGES, PAYMENT_RECEIPT_NOTICES, PAYMENT_RECEIPT_RESULT, PAYMENT_TYPE_KEYWORDS, PAYMENT_RECEIPT_STATE, PaymentReceiptNotice (+6 more)

### Community 24 - "admitted-profile.component.ts"
Cohesion: 0.17
Nodes (6): SUBMIT_VERIFICATION_LABELS, AdmittedProfileComponent, Component, StatusIndicatorComponent, Component, Input

### Community 25 - "app.config.ts"
Cohesion: 0.12
Nodes (10): AppComponent, Component, appConfig, GlobalLoadingComponent, Component, appRoutes, jwtInterceptor(), LoadingInterceptor() (+2 more)

### Community 26 - "AuthService"
Cohesion: 0.08
Nodes (6): LoginResponse, OtpPageComponent, Component, AuthService, Injectable, ViewChildren

### Community 28 - "UserPortalService"
Cohesion: 0.13
Nodes (13): ProtectedPageFeature, ALL_ROLES, RoleId, UserToken, portalSegmentGuard(), resolveExpectedPortalSegment(), ADMITTED_USER_TYPES, NEW_CANDIDATE_USER_TYPES (+5 more)

### Community 29 - "payment.component.ts"
Cohesion: 0.14
Nodes (11): sidebarStateDTO, SidebarMenuItem, TPaymentQueryState, SearchInputComponent, Component, AuthSessionStore, Injectable, WidgetsService (+3 more)

### Community 31 - "Admission Portal Login Template"
Cohesion: 0.13
Nodes (18): Personal Details Step Component, Dual-Mode OTP Flow (verify vs reset), OTP Form (six-box entry), OTP Page Template, OTP Resend Countdown, Password Strength Checklist, Password Reset Successful Dialog, Password Reset Template (+10 more)

### Community 32 - "NextOfKinComponent"
Cohesion: 0.18
Nodes (4): AddressComponents, parseAddress(), NextOfKinComponent, Component

### Community 33 - "admitted-flow.service.ts"
Cohesion: 0.12
Nodes (11): AvailableCourse, AvailableCoursesResponse, CourseInfo, flattenRegisteredCoursesResponse(), RegisterCoursesPayload, RegisteredCoursesResponse, AdmissionDocumentType, SchoolFeePaymentRecord (+3 more)

### Community 34 - "AppConfigService"
Cohesion: 0.20
Nodes (3): AppConfigService, Injectable, AppState

### Community 35 - "TraceabilityModule"
Cohesion: 0.13
Nodes (13): NgModule, ProfileFailResponse, ProfilePayload, ProfileSuccessResponse, validationCheckDTO, Logout, Component, AuthEmailPayload (+5 more)

### Community 36 - "options"
Cohesion: 0.18
Nodes (15): options, assets, browser, index, inlineStyleLanguage, outputPath, polyfills, scripts (+7 more)

### Community 37 - "Project Knowledge Graph (graphify-out/)"
Cohesion: 0.20
Nodes (15): AST-Only Update (No API Cost), Community Structure, Cross-File Relationships, God Nodes, graphify-out/graph.json, graphify-out/GRAPH_REPORT.md, graphify, graphify explain (+7 more)

### Community 38 - "payment-format.ts"
Cohesion: 0.13
Nodes (16): PAYMENT_PAGE_CONFIG, PAYMENT_RECEIPT_KEYS, PAYMENT_STATUS_CLASS, PAYMENT_TABLE_COLUMNS, PaymentReceiptField, displayPaymentValue(), FAILED_STATUS_KEYWORDS, formatPaymentCurrency() (+8 more)

### Community 39 - "application-guideline.data.ts"
Cohesion: 0.22
Nodes (12): ApplicationFeeAmounts, buildApplicationFeeHeading(), buildApplicationGuidelineContent(), DEFAULT_APPLICATION_FEE_AMOUNTS, GuidelineSection, convertBelowThousandToWords(), convertWholeNumberToWords(), formatNairaAmount() (+4 more)

### Community 40 - "ReturningCoursesComponent"
Cohesion: 0.14
Nodes (4): ReturningCoursesComponent, Component, ResitCourse, ReturningCourse

### Community 41 - "AppSidebar"
Cohesion: 0.17
Nodes (3): HostListener, AppSidebar, Component

### Community 43 - "ReturningProfileComponent"
Cohesion: 0.15
Nodes (8): ReturningProfileComponent, Component, AddressData, EditableProfileSection, NextOfKinData, PersonalContactData, ProfileSectionDraft, ReturningProfileTab

### Community 44 - "NavigationAccessService"
Cohesion: 0.13
Nodes (7): AppMenu, Component, NavigationAccessService, RETURNING_FIRST_INSTALLMENT_FEATURES, Injectable, PermissionService, Injectable

### Community 46 - "personaldetailsdto.ts"
Cohesion: 0.22
Nodes (8): AcademicHistory, Address, AryParentOrGuardian, CertificateOfBirth, OLevelResult, PersonalDetailDTO, Subject, UtmeResult

### Community 47 - "payment-workflow.service.ts"
Cohesion: 0.20
Nodes (9): StudentFeePaymentPayload, PaymentRefResponse, PaymentWorkflowHooks, PaymentWorkflowService, PaystackCallbackResponse, PaystackHandler, PaystackPopType, PaystackSetupConfig (+1 more)

### Community 48 - "auth-session.store.ts"
Cohesion: 0.21
Nodes (10): AuthSessionCookieState, AuthSessionState, buildPortalSessionPatch(), clearAuthSessionCookie(), hasPaidStatus(), initialAuthSessionCookieState, initialAuthSessionState, normalizeSessionValue() (+2 more)

### Community 50 - "application.service.ts"
Cohesion: 0.16
Nodes (9): CountryDTO, LGA, LGADTO, StatesDTO, PasswordChangePayload, PreRegistrationDataDTO, RegistrantDataDTO, RegStoreService (+1 more)

### Community 51 - "registrantdatadto.ts"
Cohesion: 0.14
Nodes (13): Address, AryParentOrGuardian, Country, Department, Session, State, StudentAdmissionDocuments, StudentDepartment (+5 more)

### Community 52 - "academichistory.component.ts"
Cohesion: 0.17
Nodes (13): ACADEMIC_HISTORY_ATTEMPT_OPTIONS, ACADEMIC_HISTORY_AWAITING_RESULT_OPTION, ACADEMIC_HISTORY_NO_GRADE_OPTION, ACADEMIC_HISTORY_RULES, OLevelResult, ExamRecord, TOLevelResult, formatDateOnly() (+5 more)

### Community 53 - "PaginationComponent"
Cohesion: 0.17
Nodes (4): PAGINATION_CONFIG, PaginationComponent, Component, PaginationItem

### Community 54 - "Admission Stepper Flow"
Cohesion: 0.22
Nodes (10): Admission Stepper Flow, Academic History Step Component, Application Summary Step Component, Next of Kin Step Component, Document Upload Step Component, Compliance Directive Notice, Form Step Status Gating, Edit Lock Policy (+2 more)

### Community 55 - "dependencies"
Cohesion: 0.18
Nodes (11): @angular/animations, chartjs-adapter-date-fns, @ngrx/signals, dependencies, @angular/animations, chartjs-adapter-date-fns, @ngrx/signals, @primeng/themes (+3 more)

### Community 56 - "student-fees.dto.ts"
Cohesion: 0.22
Nodes (6): StudentFeePartPaymentConfig, StudentFeePartPaymentEntry, StudentFeePartPaymentMode, StudentFeePlanResponse, StudentSchoolFeePaymentStatus, StudentSchoolFeeStatus

### Community 57 - "App Data Table Component"
Cohesion: 0.29
Nodes (7): Payment Row Template, Payment Table Columns, Receipt Download Action, App Data Table Component, Row Template Projection, Sortable Column Headers, Loading and Empty State Messaging

### Community 58 - "AdmittedCoursesComponent"
Cohesion: 0.21
Nodes (3): RegisteredCourse, AdmittedCoursesComponent, Component

### Community 60 - "consmeff-login.component.ts"
Cohesion: 0.11
Nodes (13): SKIP_ERROR_TOAST, ConsmeffLoginComponent, LOGIN_CAROUSEL_IMAGES, PENDING_VERIFICATION_STATUSES, Component, buildErrorSummary(), collectMessages(), collectMessagesRecursively() (+5 more)

### Community 61 - "app.routes.ts"
Cohesion: 0.18
Nodes (9): PortalEntryStubComponent, Component, AppFooter, Component, AppLayout, Component, authGuard(), portalEntryGuard() (+1 more)

### Community 62 - "payment-receipt.service.ts"
Cohesion: 0.25
Nodes (6): PAYMENT_RECEIPT_DOWNLOAD, PaymentHistoryItem, PaymentStatus, downloadBlob(), downloadBlobResponse(), resolveFileNameFromResponse()

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

### Community 69 - "name-format.ts"
Cohesion: 0.38
Nodes (9): buildStudentDisplayName(), composeDisplayName(), formatStructuredName(), normalizeDisplayName(), normalizeNamePart(), splitDisplayName(), StructuredNameInput, StructuredNameParts (+1 more)

### Community 71 - "RegistrantData"
Cohesion: 0.22
Nodes (3): getApplicationStatusDefinition(), normalizeApplicationStatusKey(), RegistrantData

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
Nodes (31): RETURNING_STUDENT_DISABILITY_LABEL, RETURNING_STUDENT_PAYMENT_LABEL, RETURNING_STUDENT_PROFILE_CONFIG, RETURNING_STUDENT_PROFILE_MESSAGE, RETURNING_STUDENT_STATUS_LABEL, StudentSingleData, StudentCgpaTrendItem, StudentAddressPayload (+23 more)

### Community 77 - "application-status.constants.ts"
Cohesion: 0.16
Nodes (14): APPLICATION_STATUS_DEFINITIONS, APPLICATION_STATUS_DESCRIPTIONS, APPLICATION_STATUS_LABELS, APPLICATION_STATUS_OPTIONS, APPLICATION_STATUS_ORDER, APPLICATION_STATUS_TONES, ApplicationStatusDefinition, ApplicationStatusKey (+6 more)

### Community 78 - ".normalizeStudentHostelOption"
Cohesion: 0.24
Nodes (4): StudentHostelAllocation, StudentHostelListResponse, StudentHostelOption, StudentHostelRoomOption

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

### Community 86 - "PaymentReceiptComponent"
Cohesion: 0.25
Nodes (3): Inject, PaymentReceiptComponent, Component

### Community 88 - "Admission Form Template"
Cohesion: 0.29
Nodes (7): ActivPulse Spectra Branding Link, App Footer Template, Technical Support Message, Admission Form Template, Registration Complete Dialog, App Button Component, Icon Position Variant API

### Community 90 - "ApplicationGuidelineModalComponent"
Cohesion: 0.25
Nodes (5): ApplicationGuidelineContent, ApplicationGuidelineModalComponent, Component, Input, Output

### Community 91 - "Sidebar Navigation Template"
Cohesion: 0.40
Nodes (6): Sidebar Navigation Template, Dark Mode Theme Toggle, Topbar Sidebar Toggle Control, Topbar Template, Application HTML Shell (app-root), External Font and Branding Assets

### Community 92 - "architect"
Cohesion: 0.40
Nodes (5): extract-i18n, test, architect, builder, builder

### Community 94 - "InactivityService"
Cohesion: 0.31
Nodes (3): INACTIVITY_PROVIDERS, InactivityService, Injectable

### Community 96 - "FilterSelectComponent"
Cohesion: 0.40
Nodes (4): FilterSelectComponent, Component, Input, Output

### Community 99 - "MIT License (Sakai template)"
Cohesion: 0.50
Nodes (4): MIT License (Sakai template), PrimeTek (copyright holder), Angular CLI Build and Test Workflow, Sakai19 Angular Project

### Community 100 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 101 - "Department"
Cohesion: 0.47
Nodes (3): Datum, Department, programSelectionOption

### Community 105 - "student-dashboard.dto.ts"
Cohesion: 0.33
Nodes (3): StudentDashboardAnnouncement, StudentDashboardCoursesInfo, StudentDashboardFeeInfo

### Community 108 - "ApplicationService"
Cohesion: 0.12
Nodes (4): PaymentRefResponse, StudentSingleResponse, ApplicationService, Injectable

### Community 110 - ".toRecord"
Cohesion: 0.21
Nodes (3): PaymentReceiptVerification, StudentCgpaTrendResponse, StudentDashboardResponse

### Community 115 - "QrCodeComponent"
Cohesion: 0.25
Nodes (7): Behaviour when the value cannot be encoded, Capacity, Encoder internals, First consumer, Inputs, QrCodeComponent, Usage

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
- **260 isolated node(s):** `useTabs`, `tabWidth`, `trailingComma`, `semi`, `singleQuote` (+255 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **64 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

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
- **Why does `ApplicationService` connect `ApplicationService` to `program.component.ts`, `admissionform.component.ts`, `pending-payment-flow.component.ts`, `ApplicationSummaryComponent`, `.normalizeStudentFeePlan`, `payment-receipt.component.ts`, `UploadFormComponent`, `UserPortalService`, `payment.component.ts`, `admitted-flow.service.ts`, `PaymentReceiptService`, `payment-workflow.service.ts`, `application.service.ts`, `academichistory.component.ts`, `student-fees.dto.ts`, `payment-receipt.service.ts`, `returning-flow.service.ts`, `.normalizeStudentHostelOption`, `PaymentReceiptComponent`, `.normalizeAcceptanceFeeResponse`, `.toRecord`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._