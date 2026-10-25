import { Component, inject } from '@angular/core';
import type { Passport as StudentPassport } from '../../../core/models/passport';
import { AuthSession } from '../../../core/services/auth-session';
import { PassportService } from '../../../core/services/passport';
import { ACHIEVEMENTS } from '../achievements';
import { Navbar } from '../../../shared/navbar/navbar';
import { Passport } from '../passport/passport';
import { SkillBadges } from '../skill-badges/skill-badges';
import { Footer } from '../../../shared/footer/footer';

@Component({
  imports: [Navbar, Passport, SkillBadges, Footer],
  selector: 'app-student-main',
  styleUrl: './student-main.css',
  templateUrl: './student-main.html',
})
export class StudentMain {
  private readonly passportService = inject(PassportService);

  get passport(): StudentPassport {
    const passport = this.passportService.passports()[0];
    if (!passport) {
      throw new Error('No passport is available for the signed-in student.');
    }
    return passport;
  }

  constructor(private readonly authSession: AuthSession) {}

  get isStudentLoggedIn(): boolean {
    return this.authSession.role() === 'student';
  }

  get studentInitials(): string {
    return this.passport.studentName
      .split(' ')
      .map((part) => part[0])
      .join('');
  }

  get verifiedSkillCount(): string {
    const adminIssuedCount = this.passport.stamps.filter((stamp) => stamp.issuedByAdmin).length;
    return String(ACHIEVEMENTS.length + adminIssuedCount).padStart(2, '0');
  }
}
