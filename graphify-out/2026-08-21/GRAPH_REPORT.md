# Graph Report - StudentManagementPortalv3  (2026-08-21)

## Corpus Check
- 157 files · ~111,689 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1766 nodes · 3427 edges · 136 communities (67 shown, 69 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 91 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f6e1c537`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ReturningFlowService
- LayoutService
- payment.component.ts
- program.component.ts
- AcademicHistoryComponent
- AdmittedFlowService
- admissionform.component.ts
- ReturningPaymentComponent
- PaymentComponent
- AdmissionFormComponent
- PendingPaymentFlowComponent
- RegistrantData
- dashboard.service.ts
- Returning Dashboard Template
- button.component.ts
- TraceabilitySeeder
- Academic History Form Template
- ThemeService
- ApplicationService
- name-format.ts
- ApplicationSummaryComponent
- PersonalDetailsComponent
- TraceabilitySeeder
- returning-profile.component.ts
- admitted-flow.service.ts
- SidebarComponent
- AuthService
- UploadFormComponent
- AppSidebar
- SignUpComponent
- AdmittedPaymentComponent
- Admission Portal Login Template
- NextOfKinComponent
- TraceabilityModule
- AppConfigService
- OtpPageComponent
- options
- Project Knowledge Graph (graphify-out/)
- student-dashboard.dto.ts
- pending-payment-flow.component.ts
- ReturningCoursesComponent
- .applyStudentProfileSnapshot
- exceljs
- ReturningProfileComponent
- UserPortalService
- academichistory.component.ts
- StudentFeePlan
- @angular/common
- app.layout.ts
- JwtService
- application.service.ts
- registrantdatadto.ts
- app.config.ts
- autoprefixer
- Admission Stepper Flow
- dependencies
- App Data Table Component
- AdmittedCoursesComponent
- TopbarComponent
- returning-student.routes.ts
- payment-workflow.service.ts
- NavigationAccessService
- Payment History Template
- CONSMMEF Institutional Seal (favicon-sized crest)
- production
- scripts
- .prettierrc.json
- personaldetailsdto.ts
- normalizeApplicationStatusKey
- Legacy Applicant Dashboard Template
- ErrorHandler
- staging
- consmeff
- returning-flow.service.ts
- Country Flag Sprite Sheet (flags_responsive.png)
- angular.json
- development
- devDependencies
- @angular/core
- AdmittedAcceptancePaymentComponent
- Admission Form Template
- auth-session.store.ts
- Department
- Sidebar Navigation Template
- architect
- @angular/forms
- ReturningDashboardComponent
- FilterSelectComponent
- DesignerService
- functions.ts
- MIT License (Sakai template)
- package.json
- PortalShellComponent
- vercel.json
- @angular/compiler-cli
- @angular/platform-browser
- @angular-eslint/eslint-plugin
- @angular-eslint/eslint-plugin-template
- @angular-eslint/template-parser
- .loadStudentDashboard
- AdmittedDashboardComponent
- @angular/platform-browser-dynamic
- @angular/router
- AdmittedProfileComponent
- chart.js
- date-fns
- eslint-config-airbnb-base
- eslint-config-airbnb-typescript
- eslint-config-prettier
- eslint-import-resolver-typescript
- eslint-plugin-import
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
1. `ApplicationService` - 94 edges
2. `ReturningFlowService` - 70 edges
3. `AdmissionFormComponent` - 52 edges
4. `AcademicHistoryComponent` - 47 edges
5. `AdmittedFlowService` - 46 edges
6. `PendingPaymentFlowComponent` - 43 edges
7. `ReturningPaymentComponent` - 38 edges
8. `PaymentComponent` - 36 edges
9. `ApplicationSummaryComponent` - 33 edges
10. `AuthService` - 31 edges

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

## Communities (136 total, 69 thin omitted)

### Community 1 - "LayoutService"
Cohesion: 0.06
Nodes (20): HostBinding, AppConfigurator, KeyOfType, presets, SurfacesType, Component, AppFloatingConfigurator, Component (+12 more)

### Community 2 - "payment.component.ts"
Cohesion: 0.07
Nodes (19): DATA_TABLE_CONFIG, PAGINATION_CONFIG, PAYMENT_PAGE_CONFIG, PAYMENT_RECEIPT_KEYS, PAYMENT_STATUS_CLASS, PAYMENT_TABLE_COLUMNS, Dashboard, Component (+11 more)

### Community 3 - "program.component.ts"
Cohesion: 0.06
Nodes (15): AppInitResponse, AppInitResponseDTO, Convert, DepartmentsDTO, Faculty, Level, OpenApplicationDTO, Program (+7 more)

### Community 5 - "AdmittedFlowService"
Cohesion: 0.08
Nodes (3): flattenRegisteredCoursesResponse(), AdmittedFlowService, Injectable

### Community 6 - "admissionform.component.ts"
Cohesion: 0.15
Nodes (16): formstepDTO, AcademicHistory, CertificateOfBirth, OLevelResult, TAcademicHistory, TNextOfKinDTO, TOLevelResult, TPersonalDetailDTO (+8 more)

### Community 8 - "PaymentComponent"
Cohesion: 0.09
Nodes (3): PaymentHistoryItem, PaymentComponent, Component

### Community 12 - "dashboard.service.ts"
Cohesion: 0.10
Nodes (19): HierarchyInfo, HierarchyLevel, HierarchySummary, HierarchyTreeNode, LevelInfo, SupplyChainHierarchy, TimelineEvent, ActivityLog (+11 more)

### Community 13 - "Returning Dashboard Template"
Cohesion: 0.10
Nodes (30): Acceptance Fee Invoice Generation, Admitted Acceptance Payment Template, Admitted Course Registration Slip, Payment-Gated Course Registration, Admitted Courses Template, Acceptance-Paid Dashboard State Switch, Admitted Dashboard Template, Three-Installment School Fee Policy (+22 more)

### Community 14 - "button.component.ts"
Cohesion: 0.14
Nodes (6): ReturningHostelComponent, Component, ButtonComponent, ButtonType, ButtonVariant, Component

### Community 15 - "TraceabilitySeeder"
Cohesion: 0.14
Nodes (11): adopt(), fulfilled(), crypto, fs, main(), path, TraceabilitySeeder(), rejected() (+3 more)

### Community 16 - "Academic History Form Template"
Cohesion: 0.12
Nodes (25): Cascading State to Local Government Dropdown Pattern, PrimeNG Reactive Form Control Convention, Awaiting Result Conditional Exam Grades Branch, Exam Attempt Count FormArray (Sittings), JAMB Details Sub-Form, Optional Other Qualifications FormArray, School Completion Age Validation, Academic History Form Template (+17 more)

### Community 17 - "ThemeService"
Cohesion: 0.10
Nodes (6): PasswordResetComponent, Component, RequestPasswordResetComponent, Component, ThemeService, Injectable

### Community 18 - "ApplicationService"
Cohesion: 0.06
Nodes (19): PaginatedPaymentsResponse, PaymentRefResponse, PaymentStatus, StudentSingleResponse, StudentCgpaTrendResponse, StudentDashboardResponse, StudentFeePartPaymentConfig, StudentFeePartPaymentEntry (+11 more)

### Community 19 - "name-format.ts"
Cohesion: 0.38
Nodes (9): buildStudentDisplayName(), composeDisplayName(), formatStructuredName(), normalizeDisplayName(), normalizeNamePart(), splitDisplayName(), StructuredNameInput, StructuredNameParts (+1 more)

### Community 22 - "TraceabilitySeeder"
Cohesion: 0.16
Nodes (6): TraceabilityEvent, crypto, fs, main(), path, TraceabilitySeeder

### Community 23 - "returning-profile.component.ts"
Cohesion: 0.18
Nodes (5): AddressData, NextOfKinData, PersonalContactData, ProfileSectionDraft, ReturningProfileTab

### Community 24 - "admitted-flow.service.ts"
Cohesion: 0.17
Nodes (11): AcceptanceFee, AdmissionDocumentType, SchoolFeePaymentRecord, VerificationDocument, PaymentPageView, buildStudentFeePaymentPayload(), buildStudentFeePaymentPayloadForAmount(), readStudentFeeInstallmentAmount() (+3 more)

### Community 26 - "AuthService"
Cohesion: 0.14
Nodes (3): LoginResponse, AuthService, Injectable

### Community 28 - "AppSidebar"
Cohesion: 0.17
Nodes (3): HostListener, AppSidebar, Component

### Community 31 - "Admission Portal Login Template"
Cohesion: 0.13
Nodes (18): Personal Details Step Component, Dual-Mode OTP Flow (verify vs reset), OTP Form (six-box entry), OTP Page Template, OTP Resend Countdown, Password Strength Checklist, Password Reset Successful Dialog, Password Reset Template (+10 more)

### Community 32 - "NextOfKinComponent"
Cohesion: 0.18
Nodes (4): AddressComponents, parseAddress(), NextOfKinComponent, Component

### Community 33 - "TraceabilityModule"
Cohesion: 0.12
Nodes (14): NgModule, ProfileFailResponse, ProfilePayload, ProfileSuccessResponse, validationCheckDTO, Logout, Component, LOGIN_CAROUSEL_IMAGES (+6 more)

### Community 34 - "AppConfigService"
Cohesion: 0.20
Nodes (3): AppConfigService, Injectable, AppState

### Community 35 - "OtpPageComponent"
Cohesion: 0.18
Nodes (3): OtpPageComponent, Component, ViewChildren

### Community 36 - "options"
Cohesion: 0.18
Nodes (15): options, assets, browser, index, inlineStyleLanguage, outputPath, polyfills, scripts (+7 more)

### Community 37 - "Project Knowledge Graph (graphify-out/)"
Cohesion: 0.20
Nodes (15): AST-Only Update (No API Cost), Community Structure, Cross-File Relationships, God Nodes, graphify-out/graph.json, graphify-out/GRAPH_REPORT.md, graphify, graphify explain (+7 more)

### Community 38 - "student-dashboard.dto.ts"
Cohesion: 0.33
Nodes (3): StudentDashboardAnnouncement, StudentDashboardCoursesInfo, StudentDashboardFeeInfo

### Community 39 - "pending-payment-flow.component.ts"
Cohesion: 0.05
Nodes (47): APPLICATION_STATUS_DEFINITIONS, APPLICATION_STATUS_DESCRIPTIONS, APPLICATION_STATUS_LABELS, APPLICATION_STATUS_OPTIONS, APPLICATION_STATUS_ORDER, APPLICATION_STATUS_TONES, ApplicationStatusDefinition, ApplicationStatusKey (+39 more)

### Community 40 - "ReturningCoursesComponent"
Cohesion: 0.14
Nodes (4): ReturningCoursesComponent, Component, ResitCourse, ReturningCourse

### Community 43 - "ReturningProfileComponent"
Cohesion: 0.30
Nodes (3): ReturningProfileComponent, Component, EditableProfileSection

### Community 44 - "UserPortalService"
Cohesion: 0.13
Nodes (14): PortalEntryStubComponent, Component, appRoutes, authGuard(), portalEntryGuard(), portalSegmentGuard(), resolveExpectedPortalSegment(), ADMITTED_USER_TYPES (+6 more)

### Community 45 - "academichistory.component.ts"
Cohesion: 0.23
Nodes (10): ACADEMIC_HISTORY_ATTEMPT_OPTIONS, ACADEMIC_HISTORY_AWAITING_RESULT_OPTION, ACADEMIC_HISTORY_RULES, ExamRecord, formatDateOnly(), padDatePart(), parseDateOnly(), extractLastYearFromText() (+2 more)

### Community 48 - "app.layout.ts"
Cohesion: 0.18
Nodes (6): AppFooter, Component, AppLayout, Component, AppTopbar, Component

### Community 50 - "application.service.ts"
Cohesion: 0.13
Nodes (12): Countries, CountryDTO, LGA, LGADTO, States, StatesDTO, PasswordChangePayload, PreRegistrationDataDTO (+4 more)

### Community 51 - "registrantdatadto.ts"
Cohesion: 0.14
Nodes (13): Address, AryParentOrGuardian, Country, Department, Session, State, StudentAdmissionDocuments, StudentDepartment (+5 more)

### Community 52 - "app.config.ts"
Cohesion: 0.06
Nodes (22): AppComponent, Component, appConfig, GlobalLoadingComponent, Component, ConsmeffLoginComponent, PENDING_VERIFICATION_STATUSES, Component (+14 more)

### Community 54 - "Admission Stepper Flow"
Cohesion: 0.20
Nodes (11): Admission Stepper Flow, Academic History Step Component, Application Summary Step Component, Next of Kin Step Component, Document Upload Step Component, Compliance Directive Notice, Form Step Status Gating, Edit Lock Policy (+3 more)

### Community 55 - "dependencies"
Cohesion: 0.18
Nodes (11): @angular/animations, @angular/compiler, chartjs-adapter-date-fns, @ngrx/signals, dependencies, @angular/animations, @angular/compiler, chartjs-adapter-date-fns (+3 more)

### Community 57 - "App Data Table Component"
Cohesion: 0.40
Nodes (5): Payment Table Columns, App Data Table Component, Row Template Projection, Sortable Column Headers, Loading and Empty State Messaging

### Community 58 - "AdmittedCoursesComponent"
Cohesion: 0.12
Nodes (8): AvailableCourse, AvailableCoursesResponse, CourseInfo, RegisterCoursesPayload, RegisteredCourse, RegisteredCoursesResponse, AdmittedCoursesComponent, Component

### Community 60 - "returning-student.routes.ts"
Cohesion: 0.24
Nodes (4): ReturningCgpaTrackerComponent, Component, ReturningResultsComponent, Component

### Community 61 - "payment-workflow.service.ts"
Cohesion: 0.20
Nodes (9): StudentFeePaymentPayload, PaymentRefResponse, PaymentWorkflowHooks, PaymentWorkflowService, PaystackCallbackResponse, PaystackHandler, PaystackPopType, PaystackSetupConfig (+1 more)

### Community 62 - "NavigationAccessService"
Cohesion: 0.13
Nodes (7): AppMenu, Component, NavigationAccessService, RETURNING_FIRST_INSTALLMENT_FEATURES, Injectable, PermissionService, Injectable

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
Nodes (30): RETURNING_STUDENT_DISABILITY_LABEL, RETURNING_STUDENT_PAYMENT_LABEL, RETURNING_STUDENT_PROFILE_CONFIG, RETURNING_STUDENT_PROFILE_MESSAGE, RETURNING_STUDENT_STATUS_LABEL, StudentCgpaTrendItem, StudentAddressPayload, StudentGuardianPayload (+22 more)

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

### Community 88 - "Admission Form Template"
Cohesion: 0.29
Nodes (7): ActivPulse Spectra Branding Link, App Footer Template, Technical Support Message, Admission Form Template, Registration Complete Dialog, App Button Component, Icon Position Variant API

### Community 89 - "auth-session.store.ts"
Cohesion: 0.11
Nodes (21): sidebarStateDTO, SidebarMenuItem, featureAccessGuard(), ProtectedPageFeature, ALL_ROLES, RoleId, UserToken, AuthSessionCookieState (+13 more)

### Community 90 - "Department"
Cohesion: 0.47
Nodes (3): Datum, Department, programSelectionOption

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
- **69 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

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
- **Why does `ApplicationService` connect `ApplicationService` to `TraceabilityModule`, `payment.component.ts`, `program.component.ts`, `admissionform.component.ts`, `pending-payment-flow.component.ts`, `PaymentComponent`, `returning-flow.service.ts`, `academichistory.component.ts`, `application.service.ts`, `admitted-flow.service.ts`, `auth-session.store.ts`, `AdmittedCoursesComponent`, `UploadFormComponent`, `payment-workflow.service.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._