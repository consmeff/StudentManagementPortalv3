import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RETURNING_PROFILE_TOAST_SUMMARY } from '../../../../constants/returning-student.constants';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { StudentProfileDetailsComponent } from '../../../../shared/components/student-profile-details/student-profile-details.component';
import { ReturningFlowService, ReturningProfileTab } from '../../returning-flow.service';

@Component({
  selector: 'app-returning-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, ButtonComponent, StudentProfileDetailsComponent],
  providers: [MessageService],
  templateUrl: './returning-profile.component.html',
  styleUrl: './returning-profile.component.scss'
})
export class ReturningProfileComponent implements OnInit {
  readonly activeTab = computed(() => this.flow.activeProfileTab());

  readonly overview = computed(() => this.flow.profileOverview());

  readonly currentPassword = signal('');

  readonly newPassword = signal('');

  readonly confirmPassword = signal('');

  readonly showCurrent = signal(false);

  readonly showNew = signal(false);

  readonly showConfirm = signal(false);

  readonly isUpdatingPassword = signal(false);

  constructor(
    readonly flow: ReturningFlowService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.flow.loadStudentProfile(true);
  }

  setTab(tab: ReturningProfileTab): void {
    this.flow.setProfileTab(tab);
  }

  async savePassword(): Promise<void> {
    this.isUpdatingPassword.set(true);
    const result = await this.flow.updateAccountPassword(this.currentPassword(), this.newPassword(), this.confirmPassword());
    this.isUpdatingPassword.set(false);
    this.messageService.add({
      severity: result.ok ? 'success' : 'warn',
      summary: RETURNING_PROFILE_TOAST_SUMMARY.accountSettings,
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
