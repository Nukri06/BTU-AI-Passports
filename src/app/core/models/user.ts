//მომხმარებლის ID, ელფოსტა, როლი და ვერიფიკაციის სტატუსი

export type UserRole =
  | 'student'
  | 'admin'
  | 'super-admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
}