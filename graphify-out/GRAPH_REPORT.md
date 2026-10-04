# Graph Report - StudentManagementPortalv3  (2026-10-04)

## Corpus Check
- 176 files · ~117,428 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1930 nodes · 3745 edges · 150 communities (82 shown, 68 thin omitted)
- Extraction: 97% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 93 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9a56461b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ReturningFlowService
- LayoutService
- DataTableComponent
- programComponent
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
- admitted-student.routes.ts
- qr-code-matrix.ts
- ApplicationSummaryComponent
- PersonalDetailsComponent
- TraceabilitySeeder
- returning-payment.component.ts
- ButtonComponent
- OtpPageComponent
- AuthService
- UploadFormComponent
- UserPortalService
- payment.component.ts
- AdmittedPaymentComponent
- Admission Portal Login Template
- NextOfKinComponent
- admitted-flow.service.ts
- AppConfigService
- sign-up.component.ts
- options
- Project Knowledge Graph (graphify-out/)
- payment-receipt.service.ts
- application-guideline.data.ts
- ReturningCoursesComponent
- consmeff-login.component.ts
- exceljs
- ReturningProfileComponent
- app.menu.ts
- PaymentReceiptService
- personaldetailsdto.ts
- payment-workflow.service.ts
- auth-session.store.ts
- JwtService
- regstore.service.ts
- registrantdatadto.ts
- academichistory.component.ts
- PaginationComponent
- Admission Stepper Flow
- dependencies
- application.service.ts
- App Data Table Component
- AdmittedCoursesComponent
- TopbarComponent
- app.config.ts
- status-indicator.component.ts
- SidebarComponent
- @angular/core
- Payment History Template
- CONSMMEF Institutional Seal (favicon-sized crest)
- production
- scripts
- .prettierrc.json
- name-format.ts
- payment-receipt.component.ts
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
- eslint
- PaymentReceiptComponent
- xDashboardComponent
- Payment Row Template
- jasmine-core
- returning-profile.component.ts
- Sidebar Navigation Template
- architect
- @angular/forms
- ReturningHostelComponent
- FilterSelectComponent
- DesignerService
- functions.ts
- MIT License (Sakai template)
- package.json
- program.component.ts
- PortalShellComponent
- ReturningDashboardComponent
- vercel.json
- PreRegistrationDataDTO
- @angular/platform-browser
- chart.js
- StudentSingleResponse
- @angular-eslint/eslint-plugin-template
- StudentCgpaTrendResponse
- StudentResultsResponse
- Registration Form (regForm)
- @angular/platform-browser-dynamic
- @angular/router
- QrCodeComponent
- @angular/compiler
- @angular/compiler-cli
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
- ApplicationService
- @angular-eslint/template-parser
- @angular-eslint/eslint-plugin
- eslint-config-airbnb-base

## God Nodes (most connected - your core abstractions)
1. `ApplicationService` - 100 edges
2. `ReturningFlowService` - 70 edges
3. `AdmittedFlowService` - 47 edges
4. `AdmissionFormComponent` - 45 edges
5. `PendingPaymentFlowComponent` - 44 edges
6. `AcademicHistoryComponent` - 43 edges
7. `ReturningPaymentComponent` - 37 edges
8. `ApplicationSummaryComponent` - 33 edges
9. `AuthService` - 30 edges
10. `AuthSessionStore` - 30 edges

## Surprising Connections (you probably didn't know these)
- `StatusTone` --semantically_similar_to--> `Payment Row Template`  [INFERRED] [semantically similar]
  src/app/shared/components/status-indicator/status-indicator.component.ts → src/app/pages/payment/payment.component.html
- `Admission Stepper Flow` --semantically_similar_to--> `Application Progress Widget`  [INFERRED] [semantically similar]
  src/app/pages/admissionform/admissionform.component.html → src/app/pages/xdashboard/dashboard.component.html
- `StatusTone` --implements--> `App Status Indicator Component`  [EXTRACTED]
  src/app/shared/components/status-indicator/status-indicator.component.ts → src/app/shared/components/status-indicator/status-indicator.component.html
- `MIT License (Sakai template)` --references--> `Sakai19 Angular Project`  [INFERRED]
  LICENSE.md → README.md
- `Dashboard Template` --semantically_similar_to--> `Legacy Applicant Dashboard Template`  [INFERRED] [semantically similar]
  src/app/pages/dashboard/dashboard.component.html → src/app/pages/xdashboard/dashboard.component.html

## Import Cycles
- None detected.

## Communities (150 total, 68 thin omitted)

### Community 0 - "ReturningFlowService"
Cohesion: 0.05
Nodes (9): StudentSingleData, buildAddressPayload(), buildGuardianPayload(), composeAddressLine(), HostelApplicationStatus, prunePayload(), readDisabilityPayload(), ReturningFlowService (+1 more)

### Community 1 - "LayoutService"
Cohesion: 0.06
Nodes (20): HostBinding, AppConfigurator, KeyOfType, presets, SurfacesType, Component, AppFloatingConfigurator, Component (+12 more)

### Community 2 - "DataTableComponent"
Cohesion: 0.22
Nodes (6): DATA_TABLE_CONFIG, DataTableComponent, Component, DataTableColumn, DataTableColumnAlign, DataTableRowContext

### Community 3 - "programComponent"
Cohesion: 0.14
Nodes (4): programComponent, Component, Input, Output

### Community 6 - "admissionform.component.ts"
Cohesion: 0.14
Nodes (19): formstepDTO, States, AcademicHistory, CertificateOfBirth, LGA, OLevelResult, TAcademicHistory, TNextOfKinDTO (+11 more)

### Community 9 - "AdmissionFormComponent"
Cohesion: 0.10
Nodes (3): AdmissionFormComponent, Component, scrollToPageTop()

### Community 11 - "pending-payment-flow.component.ts"
Cohesion: 0.15
Nodes (17): ApplicationStatusKey, ACTION_LABELS, APPROVAL_STATUS_MESSAGES, DashboardApprovalMessage, HERO_CONTENT, POST_PAYMENT_APPROVAL_STATUSES, ROUTES, SHORTLISTED_EXAM_INFO (+9 more)

### Community 12 - "dashboard.service.ts"
Cohesion: 0.10
Nodes (19): HierarchyInfo, HierarchyLevel, HierarchySummary, HierarchyTreeNode, LevelInfo, SupplyChainHierarchy, TimelineEvent, ActivityLog (+11 more)

### Community 13 - "Returning Dashboard Template"
Cohesion: 0.10
Nodes (30): Acceptance Fee Invoice Generation, Admitted Acceptance Payment Template, Admitted Course Registration Slip, Payment-Gated Course Registration, Admitted Courses Template, Acceptance-Paid Dashboard State Switch, Admitted Dashboard Template, Three-Installment School Fee Policy (+22 more)

### Community 14 - "returning-student.routes.ts"
Cohesion: 0.17
Nodes (6): ReturningCgpaTrackerComponent, Component, ReturningResultsComponent, Component, ButtonType, ButtonVariant

### Community 15 - "TraceabilitySeeder"
Cohesion: 0.14
Nodes (11): adopt(), fulfilled(), crypto, fs, main(), path, TraceabilitySeeder(), rejected() (+3 more)

### Community 16 - "Academic History Form Template"
Cohesion: 0.12
Nodes (25): Cascading State to Local Government Dropdown Pattern, PrimeNG Reactive Form Control Convention, Awaiting Result Conditional Exam Grades Branch, Exam Attempt Count FormArray (Sittings), JAMB Details Sub-Form, Optional Other Qualifications FormArray, School Completion Age Validation, Academic History Form Template (+17 more)

### Community 17 - "ThemeService"
Cohesion: 0.10
Nodes (6): PasswordResetComponent, Component, RequestPasswordResetComponent, Component, ThemeService, Injectable

### Community 18 - "admitted-student.routes.ts"
Cohesion: 0.15
Nodes (7): AdmittedAcceptancePaymentComponent, Component, SidebarMenuItem, Dashboard, Component, featureAccessGuard(), ProtectedPageFeature

### Community 19 - "qr-code-matrix.ts"
Cohesion: 0.05
Nodes (71): QR_ALIGNMENT_PATTERN_CENTERS, QR_CODE_CONFIG, QR_CODE_DEFAULTS, QR_ERROR_CORRECTION_INDICATORS, QR_FORMAT_INFORMATION, QR_GALOIS_FIELD, QR_MASK_PENALTY, QR_PAD_CODEWORDS (+63 more)

### Community 21 - "PersonalDetailsComponent"
Cohesion: 0.17
Nodes (4): Countries, parseDateOnly(), PersonalDetailsComponent, Component

### Community 22 - "TraceabilitySeeder"
Cohesion: 0.16
Nodes (6): TraceabilityEvent, crypto, fs, main(), path, TraceabilitySeeder

### Community 23 - "returning-payment.component.ts"
Cohesion: 0.19
Nodes (10): PAYMENT_RECEIPT_CONFIG, PAYMENT_RECEIPT_FIELD_LABELS, PAYMENT_RECEIPT_RESULT, PAYMENT_TYPE_KEYWORDS, PaymentPageView, buildPaymentReceiptVerificationPath(), buildStudentFeePaymentPayload(), buildStudentFeePaymentPayloadForAmount() (+2 more)

### Community 24 - "ButtonComponent"
Cohesion: 0.17
Nodes (5): SUBMIT_VERIFICATION_LABELS, AdmittedProfileComponent, Component, ButtonComponent, Component

### Community 25 - "OtpPageComponent"
Cohesion: 0.17
Nodes (3): OtpPageComponent, Component, ViewChildren

### Community 26 - "AuthService"
Cohesion: 0.15
Nodes (3): LoginResponse, AuthService, Injectable

### Community 28 - "UserPortalService"
Cohesion: 0.05
Nodes (23): HostListener, PortalEntryStubComponent, Component, AppFooter, Component, AppLayout, Component, AppSidebar (+15 more)

### Community 29 - "payment.component.ts"
Cohesion: 0.19
Nodes (10): NgModule, sidebarStateDTO, TPaymentQueryState, SearchInputComponent, Component, TraceabilityModule, AuthSessionStore, Injectable (+2 more)

### Community 31 - "Admission Portal Login Template"
Cohesion: 0.20
Nodes (11): Dual-Mode OTP Flow (verify vs reset), OTP Form (six-box entry), OTP Page Template, OTP Resend Countdown, Password Reset Successful Dialog, Password Reset Template, Email OTP Request Form, Request Password Reset Template (+3 more)

### Community 32 - "NextOfKinComponent"
Cohesion: 0.18
Nodes (4): AddressComponents, parseAddress(), NextOfKinComponent, Component

### Community 33 - "admitted-flow.service.ts"
Cohesion: 0.12
Nodes (12): AcceptanceFee, AvailableCourse, AvailableCoursesResponse, CourseInfo, flattenRegisteredCoursesResponse(), RegisterCoursesPayload, RegisteredCoursesResponse, AdmissionDocumentType (+4 more)

### Community 34 - "AppConfigService"
Cohesion: 0.20
Nodes (3): AppConfigService, Injectable, AppState

### Community 35 - "sign-up.component.ts"
Cohesion: 0.11
Nodes (11): ProfileFailResponse, ProfilePayload, ProfileSuccessResponse, validationCheckDTO, SignUpComponent, Component, AuthEmailPayload, AuthOtpPayload (+3 more)

### Community 36 - "options"
Cohesion: 0.18
Nodes (15): options, assets, browser, index, inlineStyleLanguage, outputPath, polyfills, scripts (+7 more)

### Community 37 - "Project Knowledge Graph (graphify-out/)"
Cohesion: 0.20
Nodes (15): AST-Only Update (No API Cost), Community Structure, Cross-File Relationships, God Nodes, graphify-out/graph.json, graphify-out/GRAPH_REPORT.md, graphify, graphify explain (+7 more)

### Community 38 - "payment-receipt.service.ts"
Cohesion: 0.16
Nodes (14): PAYMENT_PAGE_CONFIG, PAYMENT_RECEIPT_KEYS, PAYMENT_STATUS_CLASS, PAYMENT_TABLE_COLUMNS, PAYMENT_RECEIPT_DOWNLOAD, downloadBlob(), downloadBlobResponse(), resolveFileNameFromResponse() (+6 more)

### Community 39 - "application-guideline.data.ts"
Cohesion: 0.12
Nodes (17): ApplicationFeeAmounts, ApplicationGuidelineContent, buildApplicationFeeHeading(), buildApplicationGuidelineContent(), DEFAULT_APPLICATION_FEE_AMOUNTS, GuidelineSection, convertBelowThousandToWords(), convertWholeNumberToWords() (+9 more)

### Community 40 - "ReturningCoursesComponent"
Cohesion: 0.14
Nodes (4): ReturningCoursesComponent, Component, ResitCourse, ReturningCourse

### Community 41 - "consmeff-login.component.ts"
Cohesion: 0.24
Nodes (4): Logout, Component, LOGIN_CAROUSEL_IMAGES, resolveSafeReturnUrl()

### Community 43 - "ReturningProfileComponent"
Cohesion: 0.30
Nodes (3): ReturningProfileComponent, Component, EditableProfileSection

### Community 44 - "app.menu.ts"
Cohesion: 0.11
Nodes (10): AppMenu, Component, NavigationAccessService, RETURNING_FIRST_INSTALLMENT_FEATURES, Injectable, ALL_ROLES, PermissionService, RoleId (+2 more)

### Community 46 - "personaldetailsdto.ts"
Cohesion: 0.22
Nodes (8): AcademicHistory, Address, AryParentOrGuardian, CertificateOfBirth, OLevelResult, PersonalDetailDTO, Subject, UtmeResult

### Community 47 - "payment-workflow.service.ts"
Cohesion: 0.21
Nodes (8): PaymentRefResponse, PaymentWorkflowHooks, PaymentWorkflowService, PaystackCallbackResponse, PaystackHandler, PaystackPopType, PaystackSetupConfig, Injectable

### Community 48 - "auth-session.store.ts"
Cohesion: 0.21
Nodes (10): AuthSessionCookieState, AuthSessionState, buildPortalSessionPatch(), clearAuthSessionCookie(), hasPaidStatus(), initialAuthSessionCookieState, initialAuthSessionState, normalizeSessionValue() (+2 more)

### Community 50 - "regstore.service.ts"
Cohesion: 0.16
Nodes (7): CountryDTO, LGA, LGADTO, StatesDTO, RegistrantDataDTO, RegStoreService, Injectable

### Community 51 - "registrantdatadto.ts"
Cohesion: 0.14
Nodes (13): Address, AryParentOrGuardian, Country, Department, Session, State, StudentAdmissionDocuments, StudentDepartment (+5 more)

### Community 52 - "academichistory.component.ts"
Cohesion: 0.26
Nodes (9): ACADEMIC_HISTORY_ATTEMPT_OPTIONS, ACADEMIC_HISTORY_AWAITING_RESULT_OPTION, ACADEMIC_HISTORY_NO_GRADE_OPTION, ACADEMIC_HISTORY_RULES, ExamRecord, formatDateOnly(), padDatePart(), extractLastYearFromText() (+1 more)

### Community 53 - "PaginationComponent"
Cohesion: 0.17
Nodes (4): PAGINATION_CONFIG, PaginationComponent, Component, PaginationItem

### Community 54 - "Admission Stepper Flow"
Cohesion: 0.20
Nodes (11): Admission Stepper Flow, Academic History Step Component, Application Summary Step Component, Next of Kin Step Component, Document Upload Step Component, Compliance Directive Notice, Form Step Status Gating, Edit Lock Policy (+3 more)

### Community 55 - "dependencies"
Cohesion: 0.18
Nodes (11): @angular/animations, @angular/common, chartjs-adapter-date-fns, @ngrx/signals, dependencies, @angular/animations, @angular/common, chartjs-adapter-date-fns (+3 more)

### Community 56 - "application.service.ts"
Cohesion: 0.12
Nodes (13): PasswordChangePayload, PaginatedPaymentsResponse, PaymentHistoryItem, PaymentReceiptVerification, PaymentRefResponse, PaymentStatus, StudentFeePartPaymentConfig, StudentFeePartPaymentEntry (+5 more)

### Community 57 - "App Data Table Component"
Cohesion: 0.40
Nodes (5): Payment Table Columns, App Data Table Component, Row Template Projection, Sortable Column Headers, Loading and Empty State Messaging

### Community 58 - "AdmittedCoursesComponent"
Cohesion: 0.23
Nodes (3): RegisteredCourse, AdmittedCoursesComponent, Component

### Community 60 - "app.config.ts"
Cohesion: 0.05
Nodes (24): AppComponent, Component, appConfig, SKIP_ERROR_TOAST, GlobalLoadingComponent, Component, ConsmeffLoginComponent, PENDING_VERIFICATION_STATUSES (+16 more)

### Community 61 - "status-indicator.component.ts"
Cohesion: 0.33
Nodes (5): ApplicationStatusTone, StatusIndicatorComponent, StatusTone, Component, Input

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

### Community 70 - "payment-receipt.component.ts"
Cohesion: 0.14
Nodes (14): PAYMENT_RECEIPT_MESSAGES, PAYMENT_RECEIPT_NOTICES, PAYMENT_RECEIPT_STATE, PaymentReceiptField, PaymentReceiptNotice, PaymentReceiptResult, PaymentReceiptState, QrCodeComponent (+6 more)

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
Cohesion: 0.09
Nodes (27): RETURNING_STUDENT_DISABILITY_LABEL, RETURNING_STUDENT_PAYMENT_LABEL, RETURNING_STUDENT_PROFILE_CONFIG, RETURNING_STUDENT_PROFILE_MESSAGE, RETURNING_STUDENT_STATUS_LABEL, StudentDashboardAnnouncement, StudentDashboardCoursesInfo, StudentDashboardFeeInfo (+19 more)

### Community 77 - "application-status.constants.ts"
Cohesion: 0.19
Nodes (12): APPLICATION_STATUS_DEFINITIONS, APPLICATION_STATUS_DESCRIPTIONS, APPLICATION_STATUS_LABELS, APPLICATION_STATUS_OPTIONS, APPLICATION_STATUS_ORDER, APPLICATION_STATUS_TONES, ApplicationStatusDefinition, ApplicationStatusOption (+4 more)

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
Nodes (7): @angular-devkit/build-angular, autoprefixer, devDependencies, @angular/cli, @angular-devkit/build-angular, autoprefixer, @angular/cli

### Community 86 - "PaymentReceiptComponent"
Cohesion: 0.19
Nodes (3): Inject, PaymentReceiptComponent, Component

### Community 88 - "Payment Row Template"
Cohesion: 0.22
Nodes (9): ActivPulse Spectra Branding Link, App Footer Template, Technical Support Message, Admission Form Template, Registration Complete Dialog, Payment Row Template, Receipt Download Action, App Button Component (+1 more)

### Community 90 - "returning-profile.component.ts"
Cohesion: 0.18
Nodes (5): AddressData, NextOfKinData, PersonalContactData, ProfileSectionDraft, ReturningProfileTab

### Community 91 - "Sidebar Navigation Template"
Cohesion: 0.40
Nodes (6): Sidebar Navigation Template, Dark Mode Theme Toggle, Topbar Sidebar Toggle Control, Topbar Template, Application HTML Shell (app-root), External Font and Branding Assets

### Community 92 - "architect"
Cohesion: 0.40
Nodes (5): extract-i18n, test, architect, builder, builder

### Community 96 - "FilterSelectComponent"
Cohesion: 0.40
Nodes (4): FilterSelectComponent, Component, Input, Output

### Community 99 - "MIT License (Sakai template)"
Cohesion: 0.50
Nodes (4): MIT License (Sakai template), PrimeTek (copyright holder), Angular CLI Build and Test Workflow, Sakai19 Angular Project

### Community 100 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 101 - "program.component.ts"
Cohesion: 0.17
Nodes (11): AppInitResponse, AppInitResponseDTO, Convert, Datum, Department, DepartmentsDTO, Faculty, Level (+3 more)

### Community 112 - "Registration Form (regForm)"
Cohesion: 0.29
Nodes (7): Personal Details Step Component, Password Strength Checklist, New Password Reset Form, Applicant Identity Fields, Registration Form (regForm), Signup Password Strength Checklist, New Account Registration Template

### Community 115 - "QrCodeComponent"
Cohesion: 0.25
Nodes (7): Behaviour when the value cannot be encoded, Capacity, Encoder internals, First consumer, Inputs, QrCodeComponent, Usage

### Community 150 - "ApplicationService"
Cohesion: 0.15
Nodes (3): StudentSchoolFeeStatus, ApplicationService, Injectable

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
- **261 isolated node(s):** `POST_PAYMENT_APPROVAL_STATUSES`, `DashboardApprovalMessage`, `Country`, `State`, `Department` (+256 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **68 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

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
- **Why does `ApplicationService` connect `ApplicationService` to `programComponent`, `admissionform.component.ts`, `PaymentComponent`, `pending-payment-flow.component.ts`, `admitted-student.routes.ts`, `ApplicationSummaryComponent`, `UploadFormComponent`, `payment.component.ts`, `admitted-flow.service.ts`, `payment-receipt.service.ts`, `PaymentReceiptService`, `payment-workflow.service.ts`, `regstore.service.ts`, `academichistory.component.ts`, `application.service.ts`, `payment-receipt.component.ts`, `returning-flow.service.ts`, `.normalizeStudentHostelOption`, `PaymentReceiptComponent`, `program.component.ts`, `PreRegistrationDataDTO`, `StudentSingleResponse`, `StudentCgpaTrendResponse`, `StudentResultsResponse`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._