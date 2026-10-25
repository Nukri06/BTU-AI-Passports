import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { AuthSession } from '../../core/services/auth-session';
import { Navbar } from './navbar';

describe('Navbar', () => {
  let fixture: ComponentFixture<Navbar>;
  let authSession: AuthSession;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])],
    }).compileComponents();

    authSession = TestBed.inject(AuthSession);
    authSession.signOut();
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
  });

  it('shows Log In while no account is signed in', () => {
    expect(fixture.nativeElement.querySelector('.login-link').textContent.trim()).toBe('Log In');
    expect(fixture.nativeElement.querySelector('.brand').getAttribute('href')).toBe('/');
  });

  it('routes a signed-in student to the student dashboard when the logo is clicked', () => {
    authSession.signIn('student');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.brand').getAttribute('href')).toBe(
      '/student/student-main',
    );
  });

  it('routes signed-in administrators to their dashboards when the logo is clicked', () => {
    authSession.signIn('admin');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.brand').getAttribute('href')).toBe(
      '/admin/admin-main',
    );

    authSession.signIn('super-admin');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.brand').getAttribute('href')).toBe(
      '/super-admin/sup-admin-main',
    );
  });

  it('signs out and returns to verification when Log Out is clicked', async () => {
    authSession.signIn('student');
    fixture.detectChanges();
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const logOutButton = fixture.nativeElement.querySelector(
      '.login-link',
    ) as HTMLButtonElement;
    expect(logOutButton.textContent.trim()).toBe('Log Out');

    logOutButton.click();
    await fixture.whenStable();

    expect(authSession.isSignedIn()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/verify']);
  });
});
