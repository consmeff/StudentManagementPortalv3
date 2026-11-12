import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  EMAIL_ADDRESS_PATTERN,
  NON_ALPHANUMERIC_PATTERN,
  PROFILE_FIELD_INPUT_TYPE,
  PROFILE_SECTION_CARD_LABEL,
  STUDENT_PROFILE_VALIDATION_MESSAGE
} from '../../../constants/student-profile.constants';
import {
  ProfileField,
  ProfileFieldErrors,
  ProfileFieldOptions,
  ProfileSectionValues
} from '../../../constants/student-profile.types';
import { formatDateOfBirth, isYoungerThan, readLatestBirthDateForAge } from '../../../utility/student-profile';

@Component({
  selector: 'app-profile-section-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile-section-card.component.html',
  styleUrl: './profile-section-card.component.scss'
})
export class ProfileSectionCardComponent<TValues extends ProfileSectionValues> {
  readonly heading = input.required<string>();

  readonly fields = input.required<readonly ProfileField<TValues>[]>();

  readonly values = input.required<TValues>();

  readonly isSaving = input(false);

  readonly saveSection = input.required<(draft: TValues) => Promise<boolean>>();

  readonly loadedOptions = input<ProfileFieldOptions>({});

  readonly draftChanged = output<TValues | null>();

  readonly labels = PROFILE_SECTION_CARD_LABEL;

  readonly inputTypes = PROFILE_FIELD_INPUT_TYPE;

  readonly draft = signal<TValues | null>(null);

  readonly errors = signal<ProfileFieldErrors>({});

  readonly isEditing = computed(() => this.draft() !== null);

  readonly editButtonLabel = computed(() => `${this.labels.editPrefix}${this.heading()}`);

  readonly formId = computed(() => `${this.heading().toLowerCase().replace(NON_ALPHANUMERIC_PATTERN, '-')}-form`);

  startEdit(): void {
    this.setDraft({ ...this.values() });
  }

  cancelEdit(): void {
    this.errors.set({});
    this.setDraft(null);
  }

  updateDraftField(field: ProfileField<TValues>, value: string): void {
    const currentDraft = this.draft();
    if (!currentDraft) {
      return;
    }
    const clearedFields = Object.fromEntries((field.resetsFields ?? []).map((key) => [key, '']));
    this.setDraft({ ...currentDraft, ...clearedFields, [field.key]: value });
    this.errors.update((errors) => ({ ...errors, [field.key]: undefined }));
  }

  displayValue(field: ProfileField<TValues>): string {
    const rawValue = this.values()[field.key] ?? '';
    const formattedValue = field.inputType === PROFILE_FIELD_INPUT_TYPE.date ? formatDateOfBirth(rawValue) : rawValue;
    return formattedValue || this.labels.emptyValue;
  }

  fieldInputId(field: ProfileField<TValues>): string {
    return `${this.formId()}-${field.key}`;
  }

  fieldErrorId(field: ProfileField<TValues>): string {
    return `${this.fieldInputId(field)}-error`;
  }

  optionsFor(field: ProfileField<TValues>, currentDraft: TValues): readonly string[] {
    const options = field.options ?? this.loadedOptions()[field.key] ?? [];
    const selectedValue = currentDraft[field.key] ?? '';
    const isSelectedValueListed = selectedValue === '' || options.includes(selectedValue);
    return isSelectedValueListed ? options : [selectedValue, ...options];
  }

  isFieldDisabled(field: ProfileField<TValues>, currentDraft: TValues): boolean {
    if (field.readOnly) {
      return true;
    }
    return field.enabledWhen ? currentDraft[field.enabledWhen.key] !== field.enabledWhen.value : false;
  }

  latestAllowedDate(field: ProfileField<TValues>): string | null {
    return field.minimumAgeYears ? readLatestBirthDateForAge(field.minimumAgeYears) : null;
  }

  async save(): Promise<void> {
    const currentDraft = this.draft();
    if (!currentDraft || this.isSaving()) {
      return;
    }
    const errors = this.validateDraft(currentDraft);
    this.errors.set(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    const isSaved = await this.saveSection()(currentDraft);
    if (isSaved) {
      this.cancelEdit();
    }
  }

  private validateDraft(currentDraft: TValues): ProfileFieldErrors {
    const errors: ProfileFieldErrors = {};
    for (const field of this.fields()) {
      const errorMessage = this.readFieldError(field, (currentDraft[field.key] ?? '').trim());
      if (errorMessage) {
        errors[field.key] = errorMessage;
      }
    }
    return errors;
  }

  private readFieldError(field: ProfileField<TValues>, value: string): string | null {
    if (field.readOnly) {
      return null;
    }
    if (field.required && value === '') {
      return STUDENT_PROFILE_VALIDATION_MESSAGE.required(field.label);
    }
    if (field.minimumAgeYears && isYoungerThan(value, field.minimumAgeYears)) {
      return STUDENT_PROFILE_VALIDATION_MESSAGE.minimumAge(field.minimumAgeYears);
    }
    const isInvalidEmail =
      field.inputType === PROFILE_FIELD_INPUT_TYPE.email && value !== '' && !EMAIL_ADDRESS_PATTERN.test(value);
    return isInvalidEmail ? STUDENT_PROFILE_VALIDATION_MESSAGE.invalidEmail : null;
  }

  private setDraft(draft: TValues | null): void {
    this.draft.set(draft);
    this.draftChanged.emit(draft);
  }
}
