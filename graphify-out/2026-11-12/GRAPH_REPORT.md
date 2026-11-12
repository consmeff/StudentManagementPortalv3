# Graph Report - StudentManagementPortalv3  (2026-11-12)

## Corpus Check
- 190 files · ~118,762 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2016 nodes · 4037 edges · 167 communities (94 shown, 73 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 93 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1f9a3cae`
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
- consmeff-login.component.ts
- TraceabilitySeeder
- Academic History Form Template
- ThemeService
- app.config.ts
- qr-code-matrix.ts
- ApplicationSummaryComponent
- PersonalDetailsComponent
- TraceabilitySeeder
- payment-receipt.component.ts
- UserPortalService
- AdmittedPaymentComponent
- AuthService
- UploadFormComponent
- AppSidebar
- application-status.constants.ts
- .toRecord
- Admission Portal Login Template
- NextOfKinComponent
- admitted-payment.component.ts
- AppConfigService
- sign-up.component.ts
- options
- Project Knowledge Graph (graphify-out/)
- payment-format.ts
- application-guideline.data.ts
- ReturningCoursesComponent
- student-profile.ts
- exceljs
- http-error-message.ts
- applicationsummary.component.ts
- PaymentReceiptService
- personaldetailsdto.ts
- payment-workflow.service.ts
- karma-jasmine-html-reporter
- JwtService
- admitted-student.routes.ts
- registrantdatadto.ts
- academichistory.component.ts
- PaginationComponent
- Admission Stepper Flow
- dependencies
- InactivityService
- App Data Table Component
- returning-flow.service.ts
- TopbarComponent
- ProfileSectionCardComponent
- returning-student.routes.ts
- AuthSessionStore
- OtpPageComponent
- Payment History Template
- CONSMMEF Institutional Seal (favicon-sized crest)
- production
- scripts
- .prettierrc.json
- student-profile-details.component.ts
- SidebarComponent
- app.layout.ts
- Legacy Applicant Dashboard Template
- ErrorHandler
- staging
- consmeff
- returning-profile.component.ts
- student-dashboard.dto.ts
- AppMenu
- date-fns
- Country Flag Sprite Sheet (flags_responsive.png)
- angular.json
- development
- devDependencies
- app.routes.ts
- application.service.ts
- PaymentReceiptComponent
- RegistrantDataDTO
- Admission Form Template
- .normalizeStudentHostelOption
- auth.routes.ts
- Sidebar Navigation Template
- architect
- @angular/forms
- ReturningHostelComponent
- @angular/common
- FilterSelectComponent
- DesignerService
- functions.ts
- MIT License (Sakai template)
- package.json
- Department
- PortalShellComponent
- @angular-eslint/eslint-plugin
- vercel.json
- autoprefixer
- @angular/platform-browser
- chart.js
- .loadStudentDashboard
- @angular-eslint/eslint-plugin-template
- auth-session.store.ts
- ApplicationService
- RegistrantData
- @angular/platform-browser-dynamic
- @angular/router
- QrCodeComponent
- jasmine-core
- StudentProfileDetailsComponent
- @angular/compiler-cli
- eslint-config-airbnb-typescript
- eslint-config-prettier
- eslint-import-resolver-typescript
- eslint-plugin-import
- app.menu.ts
- StudentSingleData
- jwt-decode
- karma
- karma-chrome-launcher
- karma-coverage
- karma-jasmine
- SignUpComponent
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
- name-format.ts
- ApplicationGuidelineModalComponent
- @angular-eslint/template-parser
- NavigationAccessService
- AdmittedCoursesComponent
- new-candidate.routes.ts
- ReturningDashboardComponent
- eslint-config-airbnb-base
- StudentProfileOptionsService
- ProfileSectionCardComponent
- PreRegistrationDataDTO
- TAcademicHistory
- .normalizeStudentCgpaTrendResponse
- file-download.ts
- StudentDashboardAnnouncement
- .normalizeStudentFeePlansResponse
- StudentSchoolFeeStatus
- @angular/compiler

## God Nodes (most connected - your core abstractions)
1. `ApplicationService` - 104 edges
2. `ReturningFlowService` - 60 edges
3. `AdmittedFlowService` - 54 edges
4. `AdmissionFormComponent` - 53 edges
5. `AcademicHistoryComponent` - 48 edges
6. `PendingPaymentFlowComponent` - 44 edges
7. `ReturningPaymentComponent` - 37 edges
8. `ApplicationSummaryComponent` - 33 edges
9. `AuthSessionStore` - 32 edges
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

## Communities (167 total, 73 thin omitted)

### Community 1 - "LayoutService"
Cohesion: 0.08
Nodes (14): HostBinding, AppConfigurator, KeyOfType, presets, SurfacesType, Component, AppMenuitem, Component (+6 more)

### Community 2 - "DataTableComponent"
Cohesion: 0.22
Nodes (6): DATA_TABLE_CONFIG, DataTableComponent, Component, DataTableColumn, DataTableColumnAlign, DataTableRowContext

### Community 3 - "program.component.ts"
Cohesion: 0.06
Nodes (15): AppInitResponse, AppInitResponseDTO, Convert, DepartmentsDTO, Faculty, Level, OpenApplicationDTO, Program (+7 more)

### Community 5 - "AdmittedFlowService"
Cohesion: 0.05
Nodes (13): ADMITTED_PROFILE_PAGE_COPY, ADMITTED_PROFILE_TAB, ADMITTED_PROFILE_TABS, FLAGGED_ADMISSION_DOCUMENTS_COPY, SUBMIT_VERIFICATION_LABELS, AdmittedProfileTab, AdmittedFlowService, Injectable (+5 more)

### Community 6 - "admissionform.component.ts"
Cohesion: 0.20
Nodes (11): formstepDTO, CertificateOfBirth, LGA, OLevelResult, TNextOfKinDTO, TOLevelResult, TPersonalDetailDTO, TUploadFile (+3 more)

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

### Community 14 - "consmeff-login.component.ts"
Cohesion: 0.11
Nodes (13): SKIP_ERROR_TOAST, ConsmeffLoginComponent, LOGIN_CAROUSEL_IMAGES, PENDING_VERIFICATION_STATUSES, Component, buildErrorSummary(), collectMessages(), collectMessagesRecursively() (+5 more)

### Community 15 - "TraceabilitySeeder"
Cohesion: 0.14
Nodes (11): adopt(), fulfilled(), crypto, fs, main(), path, TraceabilitySeeder(), rejected() (+3 more)

### Community 16 - "Academic History Form Template"
Cohesion: 0.12
Nodes (25): Cascading State to Local Government Dropdown Pattern, PrimeNG Reactive Form Control Convention, Awaiting Result Conditional Exam Grades Branch, Exam Attempt Count FormArray (Sittings), JAMB Details Sub-Form, Optional Other Qualifications FormArray, School Completion Age Validation, Academic History Form Template (+17 more)

### Community 17 - "ThemeService"
Cohesion: 0.11
Nodes (6): PasswordResetComponent, Component, RequestPasswordResetComponent, Component, ThemeService, Injectable

### Community 18 - "app.config.ts"
Cohesion: 0.13
Nodes (9): AppComponent, Component, appConfig, GlobalLoadingComponent, Component, jwtInterceptor(), LoadingInterceptor(), LoadingService (+1 more)

### Community 19 - "qr-code-matrix.ts"
Cohesion: 0.05
Nodes (73): QR_ALIGNMENT_PATTERN_CENTERS, QR_CODE_CONFIG, QR_CODE_DEFAULTS, QR_ERROR_CORRECTION_INDICATORS, QR_FORMAT_INFORMATION, QR_GALOIS_FIELD, QR_MASK_PENALTY, QR_PAD_CODEWORDS (+65 more)

### Community 21 - "PersonalDetailsComponent"
Cohesion: 0.17
Nodes (4): Countries, parseDateOnly(), PersonalDetailsComponent, Component

### Community 22 - "TraceabilitySeeder"
Cohesion: 0.16
Nodes (6): TraceabilityEvent, crypto, fs, main(), path, TraceabilitySeeder

### Community 23 - "payment-receipt.component.ts"
Cohesion: 0.19
Nodes (12): PAYMENT_RECEIPT_FIELD_LABELS, PAYMENT_RECEIPT_MESSAGES, PAYMENT_RECEIPT_NOTICES, PAYMENT_RECEIPT_RESULT, PAYMENT_RECEIPT_STATE, PaymentReceiptField, PaymentReceiptNotice, PaymentReceiptResult (+4 more)

### Community 24 - "UserPortalService"
Cohesion: 0.23
Nodes (6): ADMITTED_USER_TYPES, NEW_CANDIDATE_USER_TYPES, PENDING_ACCEPTANCE_FEE_KEYWORDS, RETURNING_USER_TYPES, Injectable, UserPortalService

### Community 26 - "AuthService"
Cohesion: 0.15
Nodes (3): LoginResponse, AuthService, Injectable

### Community 28 - "AppSidebar"
Cohesion: 0.17
Nodes (3): HostListener, AppSidebar, Component

### Community 29 - "application-status.constants.ts"
Cohesion: 0.15
Nodes (14): APPLICATION_STATUS_DEFINITIONS, APPLICATION_STATUS_DESCRIPTIONS, APPLICATION_STATUS_LABELS, APPLICATION_STATUS_OPTIONS, APPLICATION_STATUS_ORDER, APPLICATION_STATUS_TONES, ApplicationStatusDefinition, ApplicationStatusOption (+6 more)

### Community 31 - "Admission Portal Login Template"
Cohesion: 0.13
Nodes (18): Personal Details Step Component, Dual-Mode OTP Flow (verify vs reset), OTP Form (six-box entry), OTP Page Template, OTP Resend Countdown, Password Strength Checklist, Password Reset Successful Dialog, Password Reset Template (+10 more)

### Community 32 - "NextOfKinComponent"
Cohesion: 0.18
Nodes (4): AddressComponents, parseAddress(), NextOfKinComponent, Component

### Community 33 - "admitted-payment.component.ts"
Cohesion: 0.25
Nodes (8): PAYMENT_PLURAL_MAPPING, PAYMENT_RECEIPT_CONFIG, PAYMENT_RECEIPT_DOWNLOAD, PAYMENT_TYPE_KEYWORDS, PaymentPageView, buildPaymentReceiptVerificationPath(), buildStudentFeePaymentPayload(), buildStudentFeePaymentPayloadForAmount()

### Community 34 - "AppConfigService"
Cohesion: 0.20
Nodes (3): AppConfigService, Injectable, AppState

### Community 35 - "sign-up.component.ts"
Cohesion: 0.17
Nodes (9): ProfileFailResponse, ProfilePayload, ProfileSuccessResponse, validationCheckDTO, AuthEmailPayload, AuthOtpPayload, AuthOtpTokenResponse, RefreshTokenResponse (+1 more)

### Community 36 - "options"
Cohesion: 0.18
Nodes (15): options, assets, browser, index, inlineStyleLanguage, outputPath, polyfills, scripts (+7 more)

### Community 37 - "Project Knowledge Graph (graphify-out/)"
Cohesion: 0.20
Nodes (15): AST-Only Update (No API Cost), Community Structure, Cross-File Relationships, God Nodes, graphify-out/graph.json, graphify-out/GRAPH_REPORT.md, graphify, graphify explain (+7 more)

### Community 38 - "payment-format.ts"
Cohesion: 0.15
Nodes (13): INSTALLMENT_PLURAL_MAPPING, PAYMENT_PAGE_CONFIG, PAYMENT_RECEIPT_KEYS, PAYMENT_STATUS_CLASS, PAYMENT_TABLE_COLUMNS, FAILED_STATUS_KEYWORDS, formatPaymentDate(), isSuccessfulPaymentStatus() (+5 more)

### Community 39 - "application-guideline.data.ts"
Cohesion: 0.22
Nodes (12): ApplicationFeeAmounts, buildApplicationFeeHeading(), buildApplicationGuidelineContent(), DEFAULT_APPLICATION_FEE_AMOUNTS, GuidelineSection, convertBelowThousandToWords(), convertWholeNumberToWords(), formatNairaAmount() (+4 more)

### Community 40 - "ReturningCoursesComponent"
Cohesion: 0.12
Nodes (5): ReturningCoursesComponent, Component, ResitCourse, downloadCourseSlipFile(), formatRegisteredCourseLine()

### Community 41 - "student-profile.ts"
Cohesion: 0.21
Nodes (17): STUDENT_PROFILE_MESSAGE, StudentAddressPayload, StudentGuardianPayload, StudentProfileUpdatePayload, buildAddressPayload(), buildEmptyAddress(), buildGuardianPayload(), buildPersonalContactPayload() (+9 more)

### Community 43 - "http-error-message.ts"
Cohesion: 0.48
Nodes (5): HTTP_ERROR_MESSAGE_KEYS, readErrorMessage(), readFirstText(), resolveHttpErrorMessage(), toRecord()

### Community 44 - "applicationsummary.component.ts"
Cohesion: 0.13
Nodes (9): CountryDTO, LGA, LGADTO, States, StatesDTO, ACTIVE_SUMMARY_ACCORDION_VALUES, DocumentRow, LabelValueRow (+1 more)

### Community 45 - "PaymentReceiptService"
Cohesion: 0.16
Nodes (3): PaymentHistoryItem, PaymentReceiptService, Injectable

### Community 46 - "personaldetailsdto.ts"
Cohesion: 0.22
Nodes (8): AcademicHistory, Address, AryParentOrGuardian, CertificateOfBirth, OLevelResult, PersonalDetailDTO, Subject, UtmeResult

### Community 47 - "payment-workflow.service.ts"
Cohesion: 0.21
Nodes (8): PaymentRefResponse, PaymentWorkflowHooks, PaymentWorkflowService, PaystackCallbackResponse, PaystackHandler, PaystackPopType, PaystackSetupConfig, Injectable

### Community 50 - "admitted-student.routes.ts"
Cohesion: 0.13
Nodes (7): ACCEPTANCE_PAYMENT_SYNC_CONFIG, PAYMENT_REFERENCE_QUERY_PARAMS, AdmittedAcceptancePaymentComponent, Component, AdmittedDashboardComponent, Component, readPaymentReferenceFromQuery()

### Community 51 - "registrantdatadto.ts"
Cohesion: 0.14
Nodes (13): Address, AryParentOrGuardian, Country, Department, Session, State, StudentAdmissionDocuments, StudentDepartment (+5 more)

### Community 52 - "academichistory.component.ts"
Cohesion: 0.20
Nodes (12): ACADEMIC_HISTORY_ATTEMPT_OPTIONS, ACADEMIC_HISTORY_AWAITING_RESULT_OPTION, ACADEMIC_HISTORY_NO_GRADE_OPTION, ACADEMIC_HISTORY_RULES, ExamRecord, formatDateOnly(), padDatePart(), isYoungerThan() (+4 more)

### Community 53 - "PaginationComponent"
Cohesion: 0.17
Nodes (4): PAGINATION_CONFIG, PaginationComponent, Component, PaginationItem

### Community 54 - "Admission Stepper Flow"
Cohesion: 0.20
Nodes (11): Admission Stepper Flow, Academic History Step Component, Application Summary Step Component, Next of Kin Step Component, Document Upload Step Component, Compliance Directive Notice, Form Step Status Gating, Edit Lock Policy (+3 more)

### Community 55 - "dependencies"
Cohesion: 0.18
Nodes (11): @angular/animations, @angular/core, chartjs-adapter-date-fns, @ngrx/signals, dependencies, @angular/animations, @angular/core, chartjs-adapter-date-fns (+3 more)

### Community 56 - "InactivityService"
Cohesion: 0.31
Nodes (3): INACTIVITY_PROVIDERS, InactivityService, Injectable

### Community 57 - "App Data Table Component"
Cohesion: 0.40
Nodes (5): Payment Table Columns, App Data Table Component, Row Template Projection, Sortable Column Headers, Loading and Empty State Messaging

### Community 58 - "returning-flow.service.ts"
Cohesion: 0.09
Nodes (24): AvailableCourse, AvailableCoursesResponse, CourseInfo, flattenRegisteredCoursesResponse(), RegisterCoursesPayload, RegisteredCourse, RegisteredCoursesResponse, CgpaThreshold (+16 more)

### Community 60 - "ProfileSectionCardComponent"
Cohesion: 0.21
Nodes (5): STUDENT_PROFILE_VALIDATION_MESSAGE, ProfileField, ProfileSectionCardComponent, Component, formatDateOfBirth()

### Community 61 - "returning-student.routes.ts"
Cohesion: 0.16
Nodes (8): ReturningCgpaTrackerComponent, Component, ReturningResultsComponent, Component, ButtonComponent, ButtonType, ButtonVariant, Component

### Community 62 - "AuthSessionStore"
Cohesion: 0.21
Nodes (10): NgModule, sidebarStateDTO, TPaymentQueryState, SearchInputComponent, Component, TraceabilityModule, AuthSessionStore, Injectable (+2 more)

### Community 63 - "OtpPageComponent"
Cohesion: 0.15
Nodes (3): OtpPageComponent, Component, ViewChildren

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

### Community 69 - "student-profile-details.component.ts"
Cohesion: 0.17
Nodes (19): ADDRESS_LINE_FIELDS, NEXT_OF_KIN_FIELDS, NEXT_OF_KIN_RESIDENCE_FIELDS, PERSONAL_CONTACT_FIELDS, PROFILE_FIELD_INPUT_TYPE, PROFILE_SECTION_CARD_LABEL, RESIDENTIAL_ADDRESS_FIELDS, STUDENT_PROFILE_DATE_OF_BIRTH_FORMAT (+11 more)

### Community 71 - "app.layout.ts"
Cohesion: 0.18
Nodes (6): AppFooter, Component, AppLayout, Component, AppTopbar, Component

### Community 72 - "Legacy Applicant Dashboard Template"
Cohesion: 0.33
Nodes (6): Pending Payment Flow Component, Dashboard Template, Application Progress Widget, Sidebar Component, Topbar Component, Legacy Applicant Dashboard Template

### Community 74 - "staging"
Cohesion: 0.25
Nodes (8): serve, staging, builder, configurations, defaultConfiguration, buildTarget, fileReplacements, outputHashing

### Community 75 - "consmeff"
Cohesion: 0.25
Nodes (8): prefix, projectType, root, schematics, sourceRoot, consmeff, style, @schematics/angular:component

### Community 76 - "returning-profile.component.ts"
Cohesion: 0.16
Nodes (7): RETURNING_PROFILE_TOAST_SUMMARY, RETURNING_STUDENT_PAYMENT_LABEL, RETURNING_STUDENT_PROFILE_MESSAGE, RETURNING_STUDENT_STATUS_LABEL, ReturningProfileComponent, Component, ReturningProfileTab

### Community 78 - "AppMenu"
Cohesion: 0.20
Nodes (4): AppMenu, Component, PermissionService, Injectable

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

### Community 84 - "app.routes.ts"
Cohesion: 0.20
Nodes (9): PortalEntryStubComponent, Component, appRoutes, authGuard(), portalEntryGuard(), portalSegmentGuard(), resolveExpectedPortalSegment(), PortalSegment (+1 more)

### Community 85 - "application.service.ts"
Cohesion: 0.13
Nodes (17): AcceptanceFee, PasswordChangePayload, StudentFeePartPaymentConfig, StudentFeePartPaymentEntry, StudentFeePartPaymentMode, StudentFeePaymentPayload, StudentFeePlan, StudentSchoolFeePaymentStatus (+9 more)

### Community 86 - "PaymentReceiptComponent"
Cohesion: 0.15
Nodes (5): PaymentReceiptVerification, PaymentStatus, PaymentReceiptComponent, Component, Inject

### Community 87 - "RegistrantDataDTO"
Cohesion: 0.43
Nodes (3): RegistrantDataDTO, RegStoreService, Injectable

### Community 88 - "Admission Form Template"
Cohesion: 0.29
Nodes (7): ActivPulse Spectra Branding Link, App Footer Template, Technical Support Message, Admission Form Template, Registration Complete Dialog, App Button Component, Icon Position Variant API

### Community 89 - ".normalizeStudentHostelOption"
Cohesion: 0.24
Nodes (4): StudentHostelAllocation, StudentHostelListResponse, StudentHostelOption, StudentHostelRoomOption

### Community 90 - "auth.routes.ts"
Cohesion: 0.20
Nodes (8): AppFloatingConfigurator, Component, Access, Component, Error, Component, Logout, Component

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

### Community 110 - "auth-session.store.ts"
Cohesion: 0.21
Nodes (10): AuthSessionCookieState, AuthSessionState, buildPortalSessionPatch(), clearAuthSessionCookie(), hasPaidStatus(), initialAuthSessionCookieState, initialAuthSessionState, normalizeSessionValue() (+2 more)

### Community 111 - "ApplicationService"
Cohesion: 0.12
Nodes (4): PaymentRefResponse, StudentSingleResponse, ApplicationService, Injectable

### Community 112 - "RegistrantData"
Cohesion: 0.33
Nodes (4): ApplicationStatusKey, getApplicationStatusDefinition(), normalizeApplicationStatusKey(), RegistrantData

### Community 115 - "QrCodeComponent"
Cohesion: 0.25
Nodes (7): Behaviour when the value cannot be encoded, Capacity, Encoder internals, First consumer, Inputs, QrCodeComponent, Usage

### Community 117 - "StudentProfileDetailsComponent"
Cohesion: 0.27
Nodes (4): ProfileSaveResult, ProfileSectionDraft, StudentProfileDetailsComponent, Component

### Community 123 - "app.menu.ts"
Cohesion: 0.24
Nodes (6): SidebarMenuItem, ProtectedPageFeature, RETURNING_FIRST_INSTALLMENT_FEATURES, ALL_ROLES, RoleId, UserToken

### Community 124 - "StudentSingleData"
Cohesion: 0.20
Nodes (5): EditableProfileSection, StudentSingleData, StudentProfileService, Inject, Injectable

### Community 149 - "name-format.ts"
Cohesion: 0.38
Nodes (9): buildStudentDisplayName(), composeDisplayName(), formatStructuredName(), normalizeDisplayName(), normalizeNamePart(), splitDisplayName(), StructuredNameInput, StructuredNameParts (+1 more)

### Community 150 - "ApplicationGuidelineModalComponent"
Cohesion: 0.25
Nodes (5): ApplicationGuidelineContent, ApplicationGuidelineModalComponent, Component, Input, Output

### Community 154 - "new-candidate.routes.ts"
Cohesion: 0.38
Nodes (3): Dashboard, Component, featureAccessGuard()

### Community 158 - "ProfileSectionCardComponent"
Cohesion: 0.33
Nodes (5): Behaviour, Inputs, ProfileSectionCardComponent, StudentProfileDetailsComponent, Usage

### Community 162 - "file-download.ts"
Cohesion: 0.83
Nodes (3): downloadBlob(), downloadBlobResponse(), resolveFileNameFromResponse()

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
- **269 isolated node(s):** `useTabs`, `tabWidth`, `trailingComma`, `semi`, `singleQuote` (+264 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **73 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

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
- **Why does `ApplicationService` connect `ApplicationService` to `program.component.ts`, `admissionform.component.ts`, `pending-payment-flow.component.ts`, `payment-receipt.component.ts`, `UploadFormComponent`, `StudentProfileOptionsService`, `.toRecord`, `PreRegistrationDataDTO`, `.normalizeStudentCgpaTrendResponse`, `admitted-payment.component.ts`, `.normalizeStudentFeePlansResponse`, `StudentSchoolFeeStatus`, `student-profile.ts`, `applicationsummary.component.ts`, `PaymentReceiptService`, `payment-workflow.service.ts`, `academichistory.component.ts`, `returning-flow.service.ts`, `AuthSessionStore`, `application.service.ts`, `PaymentReceiptComponent`, `RegistrantDataDTO`, `.normalizeStudentHostelOption`, `app.menu.ts`, `StudentSingleData`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._