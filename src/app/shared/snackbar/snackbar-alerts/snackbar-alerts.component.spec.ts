import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarAlertsComponent } from './snackbar-alerts.component';

describe('SnackbarAlertsComponent', () => {
  let component: SnackbarAlertsComponent;
  let fixture: ComponentFixture<SnackbarAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarAlertsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SnackbarAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
