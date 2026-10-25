import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthSession } from '../../../core/services/auth-session';
import { Passport } from '../passport/passport';
import { StudentMain } from './student-main';

describe('StudentMain', () => {
  let component: StudentMain;
  let fixture: ComponentFixture<StudentMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentMain],
      providers: [provideRouter([])],
    }).compileComponents();

    TestBed.inject(AuthSession).signIn('admin');
    fixture = TestBed.createComponent(StudentMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable PDF download for a signed-in student and invoke the passport download', () => {
    TestBed.inject(AuthSession).signIn('student');
    fixture.detectChanges();

    const downloadButton = fixture.nativeElement.querySelector(
      '.download-action',
    ) as HTMLButtonElement;
    const passport = fixture.debugElement.query(By.directive(Passport))
      .componentInstance as Passport;
    const downloadSpy = vi.spyOn(passport, 'downloadPdf').mockImplementation(() => {});

    expect(downloadButton.disabled).toBe(false);
    downloadButton.click();

    expect(downloadSpy).toHaveBeenCalledOnce();
  });

  it('should keep PDF download disabled for a non-student account', () => {
    fixture.detectChanges();

    const downloadButton = fixture.nativeElement.querySelector(
      '.download-action',
    ) as HTMLButtonElement;

    expect(component.isStudentLoggedIn).toBe(false);
    expect(downloadButton.disabled).toBe(true);
  });
});
