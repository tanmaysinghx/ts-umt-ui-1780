import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardApplicationsComponent } from './dashboard-applications.component';

describe('DashboardApplicationsComponent', () => {
  let component: DashboardApplicationsComponent;
  let fixture: ComponentFixture<DashboardApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardApplicationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
