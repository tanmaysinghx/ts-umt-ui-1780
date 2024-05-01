import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOwnerComponent } from './dashboard-owner.component';

describe('DashboardOwnerComponent', () => {
  let component: DashboardOwnerComponent;
  let fixture: ComponentFixture<DashboardOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOwnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
