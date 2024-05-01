import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardIamUserComponent } from './dashboard-iam-user.component';

describe('DashboardIamUserComponent', () => {
  let component: DashboardIamUserComponent;
  let fixture: ComponentFixture<DashboardIamUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardIamUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardIamUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
