export type PassportStatus = 'Active' | 'Pending' | 'Revoked';

export type PassportStampType = 'AI Skill' | 'AI Applied Skill' | 'AI Advanced Skill';

export interface PassportStamp {
  id: string;
  type: PassportStampType;
  skillName: string;
  earnedThrough: string;
  description: string;
  issuedAt: string;
  issuedByAdmin?: boolean;
}

export interface Passport {
  id: string;
  studentName: string;
  version: number;
  issuedAt: string;
  status: PassportStatus;
  stamps: PassportStamp[];
}
