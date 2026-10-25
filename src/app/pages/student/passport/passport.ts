import { Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { PassportService } from '../../../core/services/passport';
import {
  ACHIEVEMENTS,
  passportStampToAchievement,
  type Achievement,
} from '../achievements';

interface PassportPage {
  id: string;
  title: string;
}

@Component({
  imports: [NgTemplateOutlet],
  selector: 'app-passport',
  templateUrl: './passport.html',
})
export class Passport {
  private readonly passportService = inject(PassportService);

  currentPageIndex = 0;
  showAllPages = false;

  readonly pages: PassportPage[] = [
    { id: 'cover', title: 'Passport cover' },
    { id: 'about', title: 'About & skill stamps' },
    { id: 'skills', title: 'Verified AI skillset' },
    { id: 'details', title: 'Detailed information' },
  ];

  get achievements(): Achievement[] {
    const adminIssuedStamps = this.passportService
      .passports()[0]
      ?.stamps.filter((stamp) => stamp.issuedByAdmin);

    return [
      ...ACHIEVEMENTS,
      ...(adminIssuedStamps ?? []).map(passportStampToAchievement),
    ];
  }

  get pageCounter(): string {
    return `0${this.currentPageIndex + 1} / 0${this.pages.length}`;
  }

  get emptyAchievementSlots(): number[] {
    return Array.from({ length: 5 }, (_, index) => index);
  }

  selectPage(index: number): void {
    this.currentPageIndex = index;
    this.showAllPages = false;
  }

  previousPage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex -= 1;
    }
  }

  nextPage(): void {
    if (this.currentPageIndex < this.pages.length - 1) {
      this.currentPageIndex += 1;
    }
  }

  toggleAllPages(): void {
    this.showAllPages = !this.showAllPages;
  }

  downloadPdf(): void {
    const wasExpanded = this.showAllPages;
    this.showAllPages = true;

    requestAnimationFrame(() => {
      window.print();
      this.showAllPages = wasExpanded;
    });
  }
}
