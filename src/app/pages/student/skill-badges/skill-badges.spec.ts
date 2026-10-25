import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { SkillBadges } from './skill-badges';

describe('SkillBadges', () => {
  let component: SkillBadges;
  let fixture: ComponentFixture<SkillBadges>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillBadges],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillBadges);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the three most recent skill stamps in date order', () => {
    const cards = fixture.nativeElement.querySelectorAll('.skill-stamp-card');

    expect(cards).toHaveLength(3);
    expect(
      Array.from(cards, (card: Element) =>
        card.querySelector('h3')?.textContent?.trim(),
      ),
    ).toEqual([
      'DATA ANALYSIS WITH AI',
      'AI ETHICS & RESPONSIBLE USE',
      'AI AGENTS',
    ]);
  });

  it('should emit when the full skillset link is selected', () => {
    const emitSpy = vi.spyOn(component.viewSkillset, 'emit');
    const link = fixture.nativeElement.querySelector('.view-skillset') as HTMLAnchorElement;

    link.click();

    expect(emitSpy).toHaveBeenCalledOnce();
  });
});
