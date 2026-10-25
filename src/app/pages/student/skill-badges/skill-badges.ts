import { Component, EventEmitter, Output, inject } from '@angular/core';
import { PassportService } from '../../../core/services/passport';
import { ACHIEVEMENTS, passportStampToAchievement, type Achievement } from '../achievements';

@Component({
  imports: [],
  selector: 'app-skill-badges',
  styleUrl: './skill-badges.css',
  templateUrl: './skill-badges.html',
})
export class SkillBadges {
  private readonly passportService = inject(PassportService);

  @Output() readonly viewSkillset = new EventEmitter<void>();

  get latestAchievements(): Achievement[] {
    const issuedStamps = this.passportService
      .passports()[0]
      ?.stamps.filter((stamp) => stamp.issuedByAdmin)
      .map(passportStampToAchievement) ?? [];

    return [...ACHIEVEMENTS, ...issuedStamps].slice(-3);
  }
}
