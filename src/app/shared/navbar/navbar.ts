
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthSession } from '../../core/services/auth-session';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  readonly authSession = inject(AuthSession);

  private router = inject(Router);

  get homeRoute(): string {
    if (!this.authSession.isSignedIn()) {
      return '/';
    }

    switch (this.authSession.role()) {
      case 'student':
        return '/student/student-main';
      case 'admin':
        return '/admin/admin-main';
      case 'super-admin':
        return '/super-admin/sup-admin-main';
      default:
        return '/';
    }
  }

  logOut(): void {
    this.authSession.signOut();
    this.router.navigate(['/verify']);
  }
}
