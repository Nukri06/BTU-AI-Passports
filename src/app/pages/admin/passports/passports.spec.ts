import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Passports } from './passports';

describe('Passports', () => {
  let component: Passports;
  let fixture: ComponentFixture<Passports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Passports],
    }).compileComponents();

    fixture = TestBed.createComponent(Passports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
