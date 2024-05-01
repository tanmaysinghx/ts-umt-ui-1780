import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRootUserComponent } from './dashboard-root-user.component';

describe('DashboardRootUserComponent', () => {
  let component: DashboardRootUserComponent;
  let fixture: ComponentFixture<DashboardRootUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRootUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardRootUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
