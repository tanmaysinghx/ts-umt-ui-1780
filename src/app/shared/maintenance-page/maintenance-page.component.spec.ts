import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancePageComponent } from './maintenance-page.component';

describe('MaintenancePageComponent', () => {
  let component: MaintenancePageComponent;
  let fixture: ComponentFixture<MaintenancePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenancePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaintenancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
