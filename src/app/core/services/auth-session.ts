
import { Injectable, signal } from '@angular/core';

export type AccountRole = 'student' | 'admin' | 'super-admin';

@Injectable({
  providedIn: 'root'
})
export class AuthSession {
  private signedIn = signal(
    sessionStorage.getItem('isSignedIn') === 'true'
  );

  private currentRole = signal<AccountRole | null>(
    sessionStorage.getItem('accountRole') as AccountRole | null
  );

  readonly isSignedIn = this.signedIn.asReadonly();
  readonly role = this.currentRole.asReadonly();

  signIn(role: AccountRole): void {
    sessionStorage.setItem('isSignedIn', 'true');
    sessionStorage.setItem('accountRole', role);

    this.currentRole.set(role);
    this.signedIn.set(true);
  }

  signOut(): void {
    sessionStorage.removeItem('isSignedIn');
    sessionStorage.removeItem('accountRole');

    this.currentRole.set(null);
    this.signedIn.set(false);
  }
}
