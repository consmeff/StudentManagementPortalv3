# ProfileSectionCardComponent

`src/app/shared/components/profile-section-card/`

A card that shows one section of a student's profile in read mode and switches to an inline edit form when the pencil button is clicked. The `fields` config decides both modes, so one component covers every profile section.

## Inputs

| Input | Type | Notes |
| --- | --- | --- |
| `heading` | `string` (required) | Card title. Also used to build the form id and the edit button's aria label. |
| `fields` | `readonly ProfileField<TValues>[]` (required) | Field order, labels, input type, autocomplete hint and an optional `readOnly` flag. |
| `values` | `TValues` (required) | Current saved values. The edit draft is copied from here when editing starts. |
| `isSaving` | `boolean` | Disables Save/Cancel and shows the saving label. |
| `loadedOptions` | `Record<fieldKey, string[]>` | Dropdown options that come from the API (countries, states, LGAs). Static options go in the field config's `options` instead. |
| `saveSection` | `(draft: TValues) => Promise<boolean>` (required) | Called on Save. Resolve `true` to close the form, `false` to keep it open (for example after a validation or API error). |

## Behaviour

- `inputType: 'select'` renders a dropdown. A saved value that isn't in the option list is kept as an extra option so it is never silently lost.
- `resetsFields` clears dependent fields when a field changes (changing the state clears the LGA).
- `enabledWhen` disables a field unless another field has a given value (Specific Disability is enabled only when Living with Disability is Yes).
- `required` blocks Save with an inline error when the field is blank; `maxLength` caps the input length; email fields are checked for a valid address when filled in.
- `minimumAgeYears` on a date field caps the date picker and blocks Save with an inline error when the person would be younger than that age.
- Emits `draftChanged` with the current draft (or `null` when editing ends) so the host can load dependent options.
- Date fields (`inputType: 'date'`) are edited as `YYYY-MM-DD` and displayed as a long date (`12 March 2001`).
- Empty values are displayed as `—`.
- `readOnly` fields still appear in the form but can't be changed. Use this for values the API can't update.
- Pressing Enter in any field submits the form.

## Usage

```html
<app-profile-section-card
  [heading]="headings.personal"
  [fields]="personalFields"
  [values]="studentProfile.personalContact()"
  [isSaving]="isSaving('personal')"
  [saveSection]="savePersonal"
></app-profile-section-card>
```

Field configs live in `src/app/constants/student-profile.constants.ts`.

# StudentProfileDetailsComponent

`src/app/shared/components/student-profile-details/`

Renders the four editable profile sections (personal, residential, next of kin, next of kin residence) for any student portal. Data comes from `StudentProfileService`, which derives it from `AuthSessionStore.studentProfile()` and saves through `PATCH /api/v1/students/profile`, then re-reads the profile from `GET /api/v1/students/single`. Residential addresses are sent with `lga_id`, resolved from the selected state and LGA.

- The host page must provide `MessageService` and render a `<p-toast>`.
- Emits `profileSaved` with the updated `StudentSingleData` so a portal can refresh its own derived state (the returning portal uses it to refresh the header name).
- Shows an explanatory note instead of the forms when the user has no student record yet (admitted students before their school fees payment).
