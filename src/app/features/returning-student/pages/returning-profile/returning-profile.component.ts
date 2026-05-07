import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AddressData, NextOfKinData, PersonalContactData, ReturningFlowService, ReturningProfileTab } from '../../returning-flow.service';

@Component({
  selector: 'app-returning-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  providers: [MessageService],
  templateUrl: './returning-profile.component.html',
  styleUrl: './returning-profile.component.scss'
})
export class ReturningProfileComponent {
  readonly flow = inject(ReturningFlowService);
  private readonly messageService = inject(MessageService);

  readonly activeTab = computed(() => this.flow.activeProfileTab());
  readonly overview = computed(() => this.flow.profileOverview());
  readonly personal = computed(() => this.flow.personalContact());
  readonly residential = computed(() => this.flow.residentialAddress());
  readonly nextOfKin = computed(() => this.flow.nextOfKin());
  readonly nextOfKinResidence = computed(() => this.flow.nextOfKinResidence());

  readonly currentPassword = signal('');
  readonly newPassword = signal('');
  readonly confirmPassword = signal('');
  readonly showCurrent = signal(false);
  readonly showNew = signal(false);
  readonly showConfirm = signal(false);

  readonly savingSection = signal<string | null>(null);
  readonly isEditingPersonal = signal(false);
  readonly isEditingResidential = signal(false);
  readonly isEditingNextOfKin = signal(false);
  readonly isEditingNextOfKinResidence = signal(false);

  readonly personalDraft = signal<PersonalContactData>(this.flow.personalContact());
  readonly residentialDraft = signal<AddressData>(this.flow.residentialAddress());
  readonly nextOfKinDraft = signal<NextOfKinData>(this.flow.nextOfKin());
  readonly nextOfKinResidenceDraft = signal<AddressData>(this.flow.nextOfKinResidence());

  setTab(tab: ReturningProfileTab): void {
    this.flow.setProfileTab(tab);
  }

  private resetPersonalDraft(): void {
    this.personalDraft.set(this.flow.personalContact());
  }

  private resetResidentialDraft(): void {
    this.residentialDraft.set(this.flow.residentialAddress());
  }

  private resetNextOfKinDraft(): void {
    this.nextOfKinDraft.set(this.flow.nextOfKin());
  }

  private resetNextOfKinResidenceDraft(): void {
    this.nextOfKinResidenceDraft.set(this.flow.nextOfKinResidence());
  }

  private setEditing(section: EditableProfileSection, value: boolean): void {
    if (section === 'personal') {
      this.isEditingPersonal.set(value);
      return;
    }
    if (section === 'residential') {
      this.isEditingResidential.set(value);
      return;
    }
    if (section === 'nok') {
      this.isEditingNextOfKin.set(value);
      return;
    }
    this.isEditingNextOfKinResidence.set(value);
  }

  startEdit(section: EditableProfileSection): void {
    if (section === 'personal') {
      this.resetPersonalDraft();
    } else if (section === 'residential') {
      this.resetResidentialDraft();
    } else if (section === 'nok') {
      this.resetNextOfKinDraft();
    } else {
      this.resetNextOfKinResidenceDraft();
    }
    this.setEditing(section, true);
  }

  cancelEdit(section: EditableProfileSection): void {
    if (section === 'personal') {
      this.resetPersonalDraft();
    } else if (section === 'residential') {
      this.resetResidentialDraft();
    } else if (section === 'nok') {
      this.resetNextOfKinDraft();
    } else {
      this.resetNextOfKinResidenceDraft();
    }
    this.setEditing(section, false);
  }

  updatePersonalDraft<K extends keyof PersonalContactData>(key: K, value: PersonalContactData[K]): void {
    this.personalDraft.set({ ...this.personalDraft(), [key]: value });
  }

  updateResidentialDraft<K extends keyof AddressData>(key: K, value: AddressData[K]): void {
    this.residentialDraft.set({ ...this.residentialDraft(), [key]: value });
  }

  updateNextOfKinDraft<K extends keyof NextOfKinData>(key: K, value: NextOfKinData[K]): void {
    this.nextOfKinDraft.set({ ...this.nextOfKinDraft(), [key]: value });
  }

  updateNextOfKinResidenceDraft<K extends keyof AddressData>(key: K, value: AddressData[K]): void {
    this.nextOfKinResidenceDraft.set({ ...this.nextOfKinResidenceDraft(), [key]: value });
  }

  save(section: EditableProfileSection): void {
    if (section === 'personal') {
      this.flow.updatePersonalContact(this.personalDraft());
    } else if (section === 'residential') {
      this.flow.updateResidentialAddress(this.residentialDraft());
    } else if (section === 'nok') {
      this.flow.updateNextOfKin(this.nextOfKinDraft());
    } else {
      this.flow.updateNextOfKinResidence(this.nextOfKinResidenceDraft());
    }

    this.savingSection.set(section);
    const result = this.flow.saveProfileChanges();
    this.savingSection.set(null);
    this.messageService.add({
      severity: result.ok ? 'success' : 'warn',
      summary: 'Profile',
      detail: result.message
    });
    if (result.ok) {
      this.setEditing(section, false);
    }
  }

  savePassword(): void {
    const result = this.flow.updateAccountPassword(this.currentPassword(), this.newPassword(), this.confirmPassword());
    this.messageService.add({
      severity: result.ok ? 'success' : 'warn',
      summary: 'Account Settings',
      detail: result.message
    });
    if (!result.ok) {
      return;
    }
    this.currentPassword.set('');
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.showCurrent.set(false);
    this.showNew.set(false);
    this.showConfirm.set(false);
  }
}

type EditableProfileSection = 'personal' | 'residential' | 'nok' | 'nok-residence';
