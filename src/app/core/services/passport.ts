import { Injectable, signal } from '@angular/core';
import type { Passport, PassportStamp, PassportStampType } from '../models/passport';

@Injectable({ providedIn: 'root' })
export class PassportService {
  private readonly passportRecords = signal<Passport[]>([
    {
      id: 'BTU-AI-0001',
      studentName: 'John Doe',
      version: 3,
      issuedAt: '2026-03-12',
      status: 'Active',
      stamps: [
        {
          id: 'BTU-AI-0001-stamp-1',
          type: 'AI Skill',
          skillName: 'Prompt Engineering',
          earnedThrough: 'Prompt Engineering Workshop',
          description: 'Design effective prompts and evaluate AI responses.',
          issuedAt: '2026-03-12',
          issuedByAdmin: false,
        },
      ],
    },
  ]);

  readonly passports = this.passportRecords.asReadonly();

  findById(passportId: string): Passport | undefined {
    const query = passportId.trim().toLocaleLowerCase();
    return this.passportRecords().find(
      (passport) =>
        passport.id.toLocaleLowerCase() === query ||
        passport.studentName.toLocaleLowerCase() === query,
    );
  }

  issueStamp(
    passportId: string,
    stamp: Omit<PassportStamp, 'id' | 'issuedAt' | 'type'> & {
      type: PassportStampType;
      issuedAt: string;
    },
  ): boolean {
    const passport = this.findById(passportId);
    if (
      !passport ||
      !stamp.skillName.trim() ||
      !stamp.earnedThrough.trim() ||
      !stamp.description.trim() ||
      Number.isNaN(Date.parse(stamp.issuedAt))
    ) {
      return false;
    }

    this.passportRecords.update((passports) =>
      passports.map((record) =>
        record.id === passport.id
          ? {
              ...record,
              version: record.version + 1,
              issuedAt: stamp.issuedAt,
              status: 'Active',
              stamps: [
                ...record.stamps,
                {
                  ...stamp,
                  id: this.nextStampId(record),
                  issuedByAdmin: true,
                },
              ],
            }
          : record,
      ),
    );

    return true;
  }

  removeStamp(passportId: string, stampId: string): boolean {
    const passport = this.findById(passportId);
    if (!passport || !passport.stamps.some((stamp) => stamp.id === stampId)) {
      return false;
    }

    this.passportRecords.update((passports) =>
      passports.map((record) =>
        record.id === passport.id
          ? { ...record, stamps: record.stamps.filter((stamp) => stamp.id !== stampId) }
          : record,
      ),
    );

    return true;
  }

  private nextStampId(passport: Passport): string {
    let sequence = passport.stamps.length + 1;
    let id = `${passport.id}-stamp-${sequence}`;
    while (passport.stamps.some((stamp) => stamp.id === id)) {
      sequence += 1;
      id = `${passport.id}-stamp-${sequence}`;
    }
    return id;
  }
}
