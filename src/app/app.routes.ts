
import { Routes } from '@angular/router';

import { Login } from './pages/auth/login/login';
import { AdminMain } from './pages/admin/admin-main/admin-main';
import { SupAdminMain } from './pages/super-admin/sup-admin-main/sup-admin-main';
import { StudentMain } from './pages/student/student-main/student-main';
import { Verify } from './pages/verify/verify';

export const routes: Routes = [
  { path: '', component: Verify, title: 'User Page' },
  { path: 'verify', component: Verify, title: 'Verify Passport' },
  { path: 'login', component: Login, title: 'Log In' },

  { path: 'admin/admin-main', component: AdminMain, title: 'Admin Dashboard' },
  { path: 'super-admin/sup-admin-main', component: SupAdminMain, title: 'Super Admin Dashboard' },
  { path: 'student/student-main', component: StudentMain, title: 'Student Dashboard' },

  { path: '**', redirectTo: '' }
];
