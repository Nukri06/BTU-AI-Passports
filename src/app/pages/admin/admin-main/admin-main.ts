import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthSession } from '../../../core/services/auth-session';
import type { Passport, PassportStampType } from '../../../core/models/passport';
import { PassportService } from '../../../core/services/passport';
import { AdminNavbar } from '../../../shared/admin-navbar/admin-navbar';

@Component({
  imports: [DatePipe, FormsModule, RouterLink, AdminNavbar],
  selector: 'app-admin-main',
  styleUrl: './admin-main.css',
  templateUrl: './admin-main.html',
})
export class AdminMain {
  private readonly authSession = inject(AuthSession);
  private readonly router = inject(Router);
  private readonly passportService = inject(PassportService);

  readonly activeSection = signal<'dashboard' | 'issue-stamps'>('dashboard');
  readonly searchQuery = signal('');
  readonly selectedPassportId = signal<string | null>(null);
  readonly searchMessage = signal('');
  readonly submitMessage = signal('');

  readonly stampTypes = computed(() => {
    const allStamps = this.passportService.passports().flatMap((passport) => passport.stamps);
    const types: { name: PassportStampType; color: string; image: string }[] = [
      { name: 'AI Skill', color: 'stamp-pink', image: '/assets/Artboard%203%20(2).png' },
      {
        name: 'AI Applied Skill',
        color: 'stamp-purple',
        image: '/assets/Artboard%204%20(1).png',
      },
      {
        name: 'AI Advanced Skill',
        color: 'stamp-cyan',
        image: '/assets/Artboard%205%20(1).png',
      },
    ];

    return types.map((type) => ({
      ...type,
      percentage: allStamps.length
        ? Math.round(
            (allStamps.filter((stamp) => stamp.type === type.name).length / allStamps.length) *
              100,
          )
        : 0,
    }));
  });

  readonly selectedStampType = signal<PassportStampType>('AI Advanced Skill');
  readonly stampForm = {
    skillName: '',
    earnedThrough: '',
    description: '',
    issuedAt: this.today(),
  };
  readonly recentPassports = computed(() =>
    [...this.passportService.passports()].sort(
      (first, second) => Date.parse(second.issuedAt) - Date.parse(first.issuedAt),
    ),
  );
  readonly statistics = computed(() => [
    { title: 'Students', value: this.passportService.passports().length, icon: '♙', color: 'cyan' },
    {
      title: 'Stamps issued',
      value: this.passportService.passports().reduce((total, passport) => total + passport.stamps.length, 0),
      icon: '♟',
      color: 'purple',
    },
    { title: 'Linked accounts', value: this.passportService.passports().length, icon: '✓', color: 'green' },
    { title: 'Awaiting stamps', value: 0, icon: '+', color: 'pink' },
  ]);
  readonly foundPassport = computed<Passport | undefined>(() => {
    const passportId = this.selectedPassportId();
    return passportId ? this.passportService.findById(passportId) : undefined;
  });

  showSection(section: 'dashboard' | 'issue-stamps'): void {
    this.activeSection.set(section);
    this.searchMessage.set('');
    this.submitMessage.set('');
  }

  updateSearchQuery(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  findPassport(): void {
    this.submitMessage.set('');
    const passport = this.passportService.findById(this.searchQuery());
    this.selectedPassportId.set(passport?.id ?? null);
    this.searchMessage.set(
      passport ? '' : 'No passport found. Check the student or passport ID and try again.',
    );
  }

  selectStampType(type: PassportStampType): void {
    this.selectedStampType.set(type);
  }

  updateStampField(
    field: 'skillName' | 'earnedThrough' | 'description' | 'issuedAt',
    event: Event,
  ): void {
    this.stampForm[field] = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.submitMessage.set('');
  }

  get isStampFormValid(): boolean {
    return (
      Boolean(this.stampForm.skillName.trim()) &&
      Boolean(this.stampForm.earnedThrough.trim()) &&
      Boolean(this.stampForm.description.trim()) &&
      !Number.isNaN(Date.parse(this.stampForm.issuedAt))
    );
  }

  stampImage(type: PassportStampType): string {
    return this.stampTypes().find((stamp) => stamp.name === type)?.image ?? '';
  }

  addStamp(): void {
    const passport = this.foundPassport();
    if (!passport) {
      this.submitMessage.set('Find a student passport before issuing a stamp.');
      return;
    }

    const issued = this.passportService.issueStamp(passport.id, {
      type: this.selectedStampType(),
      skillName: this.stampForm.skillName.trim(),
      earnedThrough: this.stampForm.earnedThrough.trim(),
      description: this.stampForm.description.trim(),
      issuedAt: this.stampForm.issuedAt,
    });
    if (!issued) {
      this.submitMessage.set('The passport could not be updated. Find it again and retry.');
      return;
    }

    this.stampForm.skillName = '';
    this.stampForm.earnedThrough = '';
    this.stampForm.description = '';
    this.submitMessage.set('Stamp issued successfully.');
  }

  removeStamp(passportId: string, stampId: string): void {
    this.passportService.removeStamp(passportId, stampId);
  }

  private today(): string {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  logOut(): void {
    this.authSession.signOut();
    void this.router.navigate(['/verify']);
  }
}
