import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringUsersComponent } from './monitoring-users.component';

describe('MonitoringUsersComponent', () => {
  let component: MonitoringUsersComponent;
  let fixture: ComponentFixture<MonitoringUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoringUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonitoringUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
