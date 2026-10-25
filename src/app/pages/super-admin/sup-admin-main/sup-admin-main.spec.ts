import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupAdminMain } from './sup-admin-main';

describe('SupAdminMain', () => {
  let component: SupAdminMain;
  let fixture: ComponentFixture<SupAdminMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupAdminMain],
    }).compileComponents();

    fixture = TestBed.createComponent(SupAdminMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
