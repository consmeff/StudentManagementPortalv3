# Graph Report - StudentManagementPortalv3  (2026-09-22)

## Corpus Check
- 173 files · ~117,190 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1922 nodes · 3791 edges · 143 communities (75 shown, 68 thin omitted)
- Extraction: 97% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 93 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3c8b1d8e`
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
- application-status.constants.ts
- dashboard.service.ts
- Returning Dashboard Template
- returning-student.routes.ts
- TraceabilitySeeder
- Academic History Form Template
- ThemeService
- ApplicationService
- qr-code-matrix.ts
- ApplicationSummaryComponent
- PersonalDetailsComponent
- TraceabilitySeeder
- payment-receipt.component.ts
- app.menu.ts
- RegistrantData
- AuthService
- UploadFormComponent
- AppSidebar
- AuthSessionStore
- AdmittedPaymentComponent
- Admission Portal Login Template
- nextofkin.component.ts
- courseregistration.dto.ts
- AppConfigService
- SidebarComponent
- options
- Project Knowledge Graph (graphify-out/)
- payment-receipt.service.ts
- application-guideline.data.ts
- ReturningCoursesComponent
- app.config.ts
- exceljs
- ReturningProfileComponent
- NavigationAccessService
- PaymentReceiptService
- personaldetailsdto.ts
- payment-workflow.service.ts
- student-dashboard.dto.ts
- JwtService
- application.service.ts
- registrantdatadto.ts
- academichistory.component.ts
- PaginationComponent
- Admission Stepper Flow
- dependencies
- StudentFeePlan
- App Data Table Component
- AdmittedCoursesComponent
- TopbarComponent
- @angular/core
- ReturningHostelComponent
- payment.component.ts
- pending-payment-flow.component.ts
- Payment History Template
- CONSMMEF Institutional Seal (favicon-sized crest)
- production
- scripts
- .prettierrc.json
- name-format.ts
- SignUpComponent
- app.routes.ts
- Legacy Applicant Dashboard Template
- ErrorHandler
- staging
- consmeff
- returning-flow.service.ts
- auth-session.store.ts
- AdmittedDashboardComponent
- date-fns
- Country Flag Sprite Sheet (flags_responsive.png)
- angular.json
- development
- devDependencies
- AdmittedProfileComponent
- new-candidate.routes.ts
- PaymentReceiptComponent
- Logout
- Payment Row Template
- autoprefixer
- Sidebar Navigation Template
- architect
- @angular/forms
- AppTopbar
- @angular/compiler-cli
- FilterSelectComponent
- DesignerService
- functions.ts
- MIT License (Sakai template)
- package.json
- Department
- PortalShellComponent
- @angular-eslint/eslint-plugin
- vercel.json
- jasmine-core
- @angular/platform-browser
- chart.js
- Registration Form (regForm)
- @angular-eslint/eslint-plugin-template
- @angular/platform-browser-dynamic
- @angular/router
- QrCodeComponent
- @angular/compiler
- eslint-config-airbnb-base
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
- @angular-eslint/template-parser

## God Nodes (most connected - your core abstractions)
1. `ApplicationService` - 100 edges
2. `ReturningFlowService` - 70 edges
3. `AdmissionFormComponent` - 52 edges
4. `AcademicHistoryComponent` - 47 edges
5. `AdmittedFlowService` - 45 edges
6. `PendingPaymentFlowComponent` - 44 edges
7. `ReturningPaymentComponent` - 37 edges
8. `PaymentComponent` - 34 edges
9. `ApplicationSummaryComponent` - 33 edges
10. `AuthService` - 30 edges

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

## Communities (143 total, 68 thin omitted)

### Community 0 - "ReturningFlowService"
Cohesion: 0.06
Nodes (3): HostelApplicationStatus, ReturningFlowService, Injectable

### Community 1 - "LayoutService"
Cohesion: 0.06
Nodes (20): HostBinding, AppConfigurator, KeyOfType, presets, SurfacesType, Component, AppFloatingConfigurator, Component (+12 more)

### Community 2 - "DataTableComponent"
Cohesion: 0.22
Nodes (6): DATA_TABLE_CONFIG, DataTableComponent, Component, DataTableColumn, DataTableColumnAlign, DataTableRowContext

### Community 3 - "programComponent"
Cohesion: 0.06
Nodes (15): AppInitResponse, AppInitResponseDTO, Convert, DepartmentsDTO, Faculty, Level, OpenApplicationDTO, Program (+7 more)

### Community 5 - "AdmittedFlowService"
Cohesion: 0.08
Nodes (5): flattenRegisteredCoursesResponse(), AdmittedFlowService, Injectable, readStudentFeeInstallmentAmount(), selectMatchingStudentFeePlan()

### Community 6 - "admissionform.component.ts"
Cohesion: 0.16
Nodes (15): formstepDTO, States, CertificateOfBirth, OLevelResult, TNextOfKinDTO, TOLevelResult, TPersonalDetailDTO, TUploadFile (+7 more)

### Community 8 - "PaymentComponent"
Cohesion: 0.12
Nodes (3): PaymentHistoryItem, PaymentComponent, Component

### Community 11 - "application-status.constants.ts"
Cohesion: 0.13
Nodes (17): APPLICATION_STATUS_DEFINITIONS, APPLICATION_STATUS_DESCRIPTIONS, APPLICATION_STATUS_LABELS, APPLICATION_STATUS_OPTIONS, APPLICATION_STATUS_ORDER, APPLICATION_STATUS_TONES, ApplicationStatusDefinition, ApplicationStatusOption (+9 more)

### Community 12 - "dashboard.service.ts"
Cohesion: 0.10
Nodes (19): HierarchyInfo, HierarchyLevel, HierarchySummary, HierarchyTreeNode, LevelInfo, SupplyChainHierarchy, TimelineEvent, ActivityLog (+11 more)

### Community 13 - "Returning Dashboard Template"
Cohesion: 0.10
Nodes (30): Acceptance Fee Invoice Generation, Admitted Acceptance Payment Template, Admitted Course Registration Slip, Payment-Gated Course Registration, Admitted Courses Template, Acceptance-Paid Dashboard State Switch, Admitted Dashboard Template, Three-Installment School Fee Policy (+22 more)

### Community 14 - "returning-student.routes.ts"
Cohesion: 0.10
Nodes (11): ReturningCgpaTrackerComponent, Component, ReturningDashboardComponent, Component, ReturningResultsComponent, Component, featureAccessGuard(), ButtonComponent (+3 more)

### Community 15 - "TraceabilitySeeder"
Cohesion: 0.14
Nodes (11): adopt(), fulfilled(), crypto, fs, main(), path, TraceabilitySeeder(), rejected() (+3 more)

### Community 16 - "Academic History Form Template"
Cohesion: 0.12
Nodes (25): Cascading State to Local Government Dropdown Pattern, PrimeNG Reactive Form Control Convention, Awaiting Result Conditional Exam Grades Branch, Exam Attempt Count FormArray (Sittings), JAMB Details Sub-Form, Optional Other Qualifications FormArray, School Completion Age Validation, Academic History Form Template (+17 more)

### Community 17 - "ThemeService"
Cohesion: 0.11
Nodes (6): PasswordResetComponent, Component, RequestPasswordResetComponent, Component, ThemeService, Injectable

### Community 18 - "ApplicationService"
Cohesion: 0.06
Nodes (21): AcceptanceFee, PaginatedPaymentsResponse, PaymentReceiptVerification, PaymentRefResponse, PaymentStatus, StudentSingleResponse, StudentCgpaTrendResponse, StudentDashboardResponse (+13 more)

### Community 19 - "qr-code-matrix.ts"
Cohesion: 0.05
Nodes (73): QR_ALIGNMENT_PATTERN_CENTERS, QR_CODE_CONFIG, QR_CODE_DEFAULTS, QR_ERROR_CORRECTION_INDICATORS, QR_FORMAT_INFORMATION, QR_GALOIS_FIELD, QR_MASK_PENALTY, QR_PAD_CODEWORDS (+65 more)

### Community 22 - "TraceabilitySeeder"
Cohesion: 0.16
Nodes (6): TraceabilityEvent, crypto, fs, main(), path, TraceabilitySeeder

### Community 23 - "payment-receipt.component.ts"
Cohesion: 0.12
Nodes (19): PAYMENT_RECEIPT_CONFIG, PAYMENT_RECEIPT_FIELD_LABELS, PAYMENT_RECEIPT_MESSAGES, PAYMENT_RECEIPT_NOTICES, PAYMENT_RECEIPT_RESULT, PAYMENT_TYPE_KEYWORDS, PAYMENT_RECEIPT_STATE, PaymentReceiptField (+11 more)

### Community 24 - "app.menu.ts"
Cohesion: 0.16
Nodes (11): SidebarMenuItem, ProtectedPageFeature, ALL_ROLES, RoleId, UserToken, ADMITTED_USER_TYPES, NEW_CANDIDATE_USER_TYPES, PENDING_ACCEPTANCE_FEE_KEYWORDS (+3 more)

### Community 26 - "AuthService"
Cohesion: 0.08
Nodes (6): LoginResponse, OtpPageComponent, Component, AuthService, Injectable, ViewChildren

### Community 28 - "AppSidebar"
Cohesion: 0.17
Nodes (3): HostListener, AppSidebar, Component

### Community 29 - "AuthSessionStore"
Cohesion: 0.15
Nodes (12): ProfileFailResponse, ProfilePayload, ProfileSuccessResponse, validationCheckDTO, LOGIN_CAROUSEL_IMAGES, AuthEmailPayload, AuthOtpPayload, AuthOtpTokenResponse (+4 more)

### Community 31 - "Admission Portal Login Template"
Cohesion: 0.20
Nodes (11): Dual-Mode OTP Flow (verify vs reset), OTP Form (six-box entry), OTP Page Template, OTP Resend Countdown, Password Reset Successful Dialog, Password Reset Template, Email OTP Request Form, Request Password Reset Template (+3 more)

### Community 32 - "nextofkin.component.ts"
Cohesion: 0.17
Nodes (6): Countries, LGA, AddressComponents, parseAddress(), NextOfKinComponent, Component

### Community 33 - "courseregistration.dto.ts"
Cohesion: 0.22
Nodes (5): AvailableCourse, AvailableCoursesResponse, CourseInfo, RegisterCoursesPayload, RegisteredCoursesResponse

### Community 34 - "AppConfigService"
Cohesion: 0.20
Nodes (3): AppConfigService, Injectable, AppState

### Community 36 - "options"
Cohesion: 0.18
Nodes (15): options, assets, browser, index, inlineStyleLanguage, outputPath, polyfills, scripts (+7 more)

### Community 37 - "Project Knowledge Graph (graphify-out/)"
Cohesion: 0.20
Nodes (15): AST-Only Update (No API Cost), Community Structure, Cross-File Relationships, God Nodes, graphify-out/graph.json, graphify-out/GRAPH_REPORT.md, graphify, graphify explain (+7 more)

### Community 38 - "payment-receipt.service.ts"
Cohesion: 0.13
Nodes (17): PAYMENT_PAGE_CONFIG, PAYMENT_RECEIPT_KEYS, PAYMENT_STATUS_CLASS, PAYMENT_TABLE_COLUMNS, PAYMENT_RECEIPT_DOWNLOAD, downloadBlob(), downloadBlobResponse(), resolveFileNameFromResponse() (+9 more)

### Community 39 - "application-guideline.data.ts"
Cohesion: 0.12
Nodes (17): ApplicationFeeAmounts, ApplicationGuidelineContent, buildApplicationFeeHeading(), buildApplicationGuidelineContent(), DEFAULT_APPLICATION_FEE_AMOUNTS, GuidelineSection, convertBelowThousandToWords(), convertWholeNumberToWords() (+9 more)

### Community 40 - "ReturningCoursesComponent"
Cohesion: 0.15
Nodes (3): ReturningCoursesComponent, Component, ResitCourse

### Community 41 - "app.config.ts"
Cohesion: 0.05
Nodes (24): AppComponent, Component, appConfig, SKIP_ERROR_TOAST, GlobalLoadingComponent, Component, ConsmeffLoginComponent, PENDING_VERIFICATION_STATUSES (+16 more)

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
Cohesion: 0.21
Nodes (8): PaymentRefResponse, PaymentWorkflowHooks, PaymentWorkflowService, PaystackCallbackResponse, PaystackHandler, PaystackPopType, PaystackSetupConfig, Injectable

### Community 48 - "student-dashboard.dto.ts"
Cohesion: 0.33
Nodes (3): StudentDashboardAnnouncement, StudentDashboardCoursesInfo, StudentDashboardFeeInfo

### Community 50 - "application.service.ts"
Cohesion: 0.14
Nodes (9): CountryDTO, LGA, LGADTO, StatesDTO, PasswordChangePayload, PreRegistrationDataDTO, RegistrantDataDTO, RegStoreService (+1 more)

### Community 51 - "registrantdatadto.ts"
Cohesion: 0.17
Nodes (11): Country, Department, Session, State, StudentAdmissionDocuments, StudentDepartment, StudentLevel, StudentProgram (+3 more)

### Community 52 - "academichistory.component.ts"
Cohesion: 0.16
Nodes (13): ACADEMIC_HISTORY_ATTEMPT_OPTIONS, ACADEMIC_HISTORY_AWAITING_RESULT_OPTION, ACADEMIC_HISTORY_RULES, AcademicHistory, StudentProfileUpdatePayload, ExamRecord, TAcademicHistory, formatDateOnly() (+5 more)

### Community 53 - "PaginationComponent"
Cohesion: 0.17
Nodes (4): PAGINATION_CONFIG, PaginationComponent, Component, PaginationItem

### Community 54 - "Admission Stepper Flow"
Cohesion: 0.20
Nodes (11): Admission Stepper Flow, Academic History Step Component, Application Summary Step Component, Next of Kin Step Component, Document Upload Step Component, Compliance Directive Notice, Form Step Status Gating, Edit Lock Policy (+3 more)

### Community 55 - "dependencies"
Cohesion: 0.18
Nodes (11): @angular/animations, @angular/common, chartjs-adapter-date-fns, @ngrx/signals, dependencies, @angular/animations, @angular/common, chartjs-adapter-date-fns (+3 more)

### Community 57 - "App Data Table Component"
Cohesion: 0.40
Nodes (5): Payment Table Columns, App Data Table Component, Row Template Projection, Sortable Column Headers, Loading and Empty State Messaging

### Community 58 - "AdmittedCoursesComponent"
Cohesion: 0.23
Nodes (3): RegisteredCourse, AdmittedCoursesComponent, Component

### Community 62 - "payment.component.ts"
Cohesion: 0.11
Nodes (15): NgModule, StudentSingleData, sidebarStateDTO, AdmissionDocumentType, SchoolFeePaymentRecord, VerificationDocument, AdmittedAcceptancePaymentComponent, Component (+7 more)

### Community 63 - "pending-payment-flow.component.ts"
Cohesion: 0.20
Nodes (13): ACTION_LABELS, APPROVAL_STATUS_MESSAGES, DashboardApprovalMessage, HERO_CONTENT, POST_PAYMENT_APPROVAL_STATUSES, ROUTES, STATUS_MATCHERS, STEP_CONTENT (+5 more)

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

### Community 71 - "app.routes.ts"
Cohesion: 0.15
Nodes (12): PortalEntryStubComponent, Component, AppFooter, Component, AppLayout, Component, authGuard(), portalEntryGuard() (+4 more)

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
Cohesion: 0.07
Nodes (32): RETURNING_STUDENT_DISABILITY_LABEL, RETURNING_STUDENT_PAYMENT_LABEL, RETURNING_STUDENT_PROFILE_CONFIG, RETURNING_STUDENT_PROFILE_MESSAGE, RETURNING_STUDENT_STATUS_LABEL, Address, AryParentOrGuardian, StudentCgpaTrendItem (+24 more)

### Community 77 - "auth-session.store.ts"
Cohesion: 0.21
Nodes (10): AuthSessionCookieState, AuthSessionState, buildPortalSessionPatch(), clearAuthSessionCookie(), hasPaidStatus(), initialAuthSessionCookieState, initialAuthSessionState, normalizeSessionValue() (+2 more)

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

### Community 88 - "Payment Row Template"
Cohesion: 0.22
Nodes (9): ActivPulse Spectra Branding Link, App Footer Template, Technical Support Message, Admission Form Template, Registration Complete Dialog, Payment Row Template, Receipt Download Action, App Button Component (+1 more)

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

### Community 101 - "Department"
Cohesion: 0.47
Nodes (3): Datum, Department, programSelectionOption

### Community 108 - "Registration Form (regForm)"
Cohesion: 0.29
Nodes (7): Personal Details Step Component, Password Strength Checklist, New Password Reset Form, Applicant Identity Fields, Registration Form (regForm), Signup Password Strength Checklist, New Account Registration Template

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
- **258 isolated node(s):** `useTabs`, `tabWidth`, `trailingComma`, `semi`, `singleQuote` (+253 more)
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
- **Why does `ApplicationService` connect `ApplicationService` to `nextofkin.component.ts`, `courseregistration.dto.ts`, `programComponent`, `admissionform.component.ts`, `payment-receipt.service.ts`, `returning-flow.service.ts`, `PaymentReceiptService`, `payment-workflow.service.ts`, `application.service.ts`, `academichistory.component.ts`, `PaymentReceiptComponent`, `payment-receipt.component.ts`, `app.menu.ts`, `UploadFormComponent`, `payment.component.ts`, `pending-payment-flow.component.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._