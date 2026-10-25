import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PassportService } from '../../../core/services/passport';
import { AdminMain } from './admin-main';

describe('AdminMain', () => {
  let component: AdminMain;
  let fixture: ComponentFixture<AdminMain>;
  let passportService: PassportService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMain],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMain);
    component = fixture.componentInstance;
    passportService = TestBed.inject(PassportService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the admin dashboard layout and its overview sections', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.role-label').textContent.trim()).toBe(
      'Admin Panel',
    );
    expect(fixture.nativeElement.querySelectorAll('.nav-item').length).toBe(4);
    expect(fixture.nativeElement.querySelectorAll('.stat-item').length).toBe(4);
    expect(fixture.nativeElement.querySelectorAll('.stamp-row').length).toBe(3);
    expect(fixture.nativeElement.querySelector('.recent-section')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.recent-student').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.recent-student-name').textContent.trim()).toBe(
      'John Doe',
    );
    expect(fixture.nativeElement.querySelector('.recent-version').textContent.trim()).toBe(
      'Version 3',
    );
    expect(fixture.nativeElement.querySelector('.recent-date').textContent.trim()).toBe(
      '12 Mar 2026',
    );
    expect(fixture.nativeElement.querySelector('.passport-status').textContent.trim()).toBe(
      'Active',
    );
  });

  it('finds a passport by ID or student name and reports unknown students', () => {
    component.showSection('issue-stamps');
    component.searchQuery.set('john doe');
    component.findPassport();
    expect(component.foundPassport()?.id).toBe('BTU-AI-0001');

    component.searchQuery.set('unknown student');
    component.findPassport();
    expect(component.foundPassport()).toBeUndefined();
    expect(component.searchMessage()).toContain('No passport found');
  });

  it('issues a stamp and updates the passport version and dashboard totals', () => {
    component.showSection('issue-stamps');
    component.searchQuery.set('BTU-AI-0001');
    component.findPassport();
    component.stampForm.skillName = 'AI Research';
    component.stampForm.earnedThrough = 'Research workshop';
    component.stampForm.description = 'Applied research methods with AI.';
    component.stampForm.issuedAt = '2026-10-25';
    component.selectStampType('AI Applied Skill');

    component.addStamp();

    const updatedPassport = passportService.findById('BTU-AI-0001');
    expect(updatedPassport?.version).toBe(4);
    expect(updatedPassport?.issuedAt).toBe('2026-10-25');
    expect(updatedPassport?.stamps.at(-1)).toMatchObject({
      type: 'AI Applied Skill',
      skillName: 'AI Research',
      earnedThrough: 'Research workshop',
    });
    expect(component.statistics()[1].value).toBe(2);
    expect(component.submitMessage()).toBe('Stamp issued successfully.');
  });

  it('does not issue an incomplete stamp', () => {
    component.showSection('issue-stamps');
    component.searchQuery.set('BTU-AI-0001');
    component.findPassport();
    component.stampForm.skillName = '   ';

    component.addStamp();

    expect(passportService.findById('BTU-AI-0001')?.version).toBe(3);
    expect(component.submitMessage()).toContain('could not be updated');
  });

  it('issues a stamp from the admin form after finding the passport', async () => {
    fixture.detectChanges();
    (fixture.nativeElement.querySelectorAll('.nav-item')[1] as HTMLButtonElement).click();
    fixture.detectChanges();

    const searchInput = fixture.nativeElement.querySelector(
      '#passport-lookup',
    ) as HTMLInputElement;
    searchInput.value = 'BTU-AI-0001';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.passport-search button') as HTMLButtonElement).click();
    fixture.detectChanges();

    const setField = (selector: string, value: string): void => {
      const field = fixture.nativeElement.querySelector(selector) as HTMLInputElement;
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
    };
    setField('#skill-name', 'Responsible AI');
    setField('#earned-through', 'Ethics workshop');
    setField('#stamp-date', '2026-10-25');

    const description = fixture.nativeElement.querySelector(
      '#stamp-description',
    ) as HTMLTextAreaElement;
    description.value = 'Apply responsible AI practices.';
    description.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    const addButton = fixture.nativeElement.querySelector(
      '.add-stamp-button',
    ) as HTMLButtonElement;
    expect(component.stampForm).toEqual({
      skillName: 'Responsible AI',
      earnedThrough: 'Ethics workshop',
      description: 'Apply responsible AI practices.',
      issuedAt: '2026-10-25',
    });
    expect(addButton.disabled).toBe(false);
    addButton.click();
    fixture.detectChanges();

    expect(component.submitMessage()).toBe('Stamp issued successfully.');
    expect(passportService.findById('BTU-AI-0001')?.stamps).toHaveLength(2);
    expect(fixture.nativeElement.querySelectorAll('.issued-stamp')).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('.success-message').textContent.trim()).toBe(
      'Stamp issued successfully.',
    );
  });
});
