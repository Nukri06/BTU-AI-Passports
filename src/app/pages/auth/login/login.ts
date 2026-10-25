import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Navbar } from '../../../shared/navbar/navbar';
import { SemiNavbar } from '../../../shared/semi-navbar/semi-navbar';
import { AuthSession, type AccountRole } from '../../../core/services/auth-session';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, SemiNavbar],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  code = '';

  showCodeField = false;
  errorMessage = '';

  //სატესტო ანგარიშები
  private testUsers: Record<string, AccountRole> = {
    'student@btu.edu.ge': 'student',
    'admin@btu.edu.ge': 'admin',
    'superadmin@btu.edu.ge': 'super-admin'
  };

  constructor(
    private router: Router,
    private authSession: AuthSession,
  ) {}

  requestCode(): void {
    this.errorMessage = '';

    const normalizedEmail = this.email.trim().toLowerCase();

    if (!/^[^\s@]+@btu\.edu\.ge$/i.test(normalizedEmail)) {
      this.errorMessage = 'შეიყვანე სწორი BTU ელფოსტა.';
      return;
    }
    if (!this.testUsers[normalizedEmail]) {
      this.errorMessage='ეს სატესტო ანგარიში არ არსებობს.';
      return;
    }
    //სატსტოდ კოდის ველი
    this.email = normalizedEmail;
    this.showCodeField = true;
  }

  verifyCode(): void {
    this.errorMessage = '';

    // მხოლოდ სატესტო კოდი
    if (this.code !== '123456') {
      this.errorMessage = 'კოდი არასწორია. სცადე თავიდან.';
      return;
    }

    const role = this.testUsers[this.email];

    switch (role) {
      case 'student':
        this.authSession.signIn(role);
        this.router.navigate(['/student/student-main']);
        break;

      case 'admin':
        this.authSession.signIn(role);
        this.router.navigate(['/admin/admin-main']);
        break;

      case 'super-admin':
        this.authSession.signIn(role);
        this.router.navigate(['/super-admin/sup-admin-main']);
        break;

      default:
        this.errorMessage = 'მომხმარებლის როლი ვერ განისაზღვრა.';
    }
  }

  
}