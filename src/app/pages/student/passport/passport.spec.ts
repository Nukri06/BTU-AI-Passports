import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { PassportService } from '../../../core/services/passport';
import { Passport } from './passport';

describe('Passport', () => {
  let component: Passport;
  let fixture: ComponentFixture<Passport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Passport],
    }).compileComponents();

    fixture = TestBed.createComponent(Passport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate passport pages with the arrow buttons', () => {
    const nextButton = fixture.nativeElement.querySelector(
      '[aria-label="Next passport page"]',
    ) as HTMLButtonElement;
    const previousButton = fixture.nativeElement.querySelector(
      '[aria-label="Previous passport page"]',
    ) as HTMLButtonElement;

    nextButton.click();
    fixture.detectChanges();
    expect(component.currentPageIndex).toBe(1);
    expect(fixture.nativeElement.querySelector('.toolbar-title').textContent).toContain(
      'About & skill stamps',
    );

    previousButton.click();
    fixture.detectChanges();
    expect(component.currentPageIndex).toBe(0);
  });

  it('should open a page from the sidebar navigation', () => {
    const pageButtons = fixture.nativeElement.querySelectorAll('.page-navigation-item');

    pageButtons[2].click();
    fixture.detectChanges();

    expect(component.currentPageIndex).toBe(2);
    expect(fixture.nativeElement.querySelector('.toolbar-title').textContent).toContain(
      'Verified AI skillset',
    );
  });

  it('includes newly issued admin stamps in the passport achievement pages', () => {
    TestBed.inject(PassportService).issueStamp('BTU-AI-0001', {
      type: 'AI Advanced Skill',
      skillName: 'Responsible AI',
      earnedThrough: 'Ethics workshop',
      description: 'Apply responsible AI practices.',
      issuedAt: '2026-10-25',
    });

    expect(component.achievements.at(-1)).toMatchObject({
      skill: 'RESPONSIBLE AI',
      type: 'AI ADVANCED SKILL',
      earnedThrough: 'Ethics workshop',
    });
  });

  it('should expand all four full pages in order and return to page view', () => {
    const viewAllButton = fixture.nativeElement.querySelector(
      '.view-all-button',
    ) as HTMLButtonElement;

    viewAllButton.click();
    fixture.detectChanges();

    const expandedPages = fixture.nativeElement.querySelectorAll(
      '.all-pages-stack > .passport-sheet',
    );
    expect(expandedPages).toHaveLength(4);
    expect(
      Array.from(expandedPages, (page: Element) => page.getAttribute('aria-label')),
    ).toEqual([
      'Page 01: Passport cover',
      'Page 02: About & skill stamps',
      'Page 03: Verified AI skillset',
      'Page 04: Detailed information',
    ]);
    expect(fixture.nativeElement.querySelector('.details-page')).toBeTruthy();
    expect(component.currentPageIndex).toBe(0);

    viewAllButton.click();
    fixture.detectChanges();

    expect(component.showAllPages).toBe(false);
    expect(fixture.nativeElement.querySelectorAll('.passport-canvas-area > .passport-sheet')).toHaveLength(1);
  });

  it('should open all pages for printing and restore the previous view', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 0;
    });
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {
      expect(component.showAllPages).toBe(true);
    });

    component.downloadPdf();

    expect(printSpy).toHaveBeenCalledOnce();
    expect(component.showAllPages).toBe(false);
  });
});
