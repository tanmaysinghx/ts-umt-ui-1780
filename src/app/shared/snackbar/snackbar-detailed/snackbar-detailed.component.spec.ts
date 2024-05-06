import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarDetailedComponent } from './snackbar-detailed.component';

describe('SnackbarDetailedComponent', () => {
  let component: SnackbarDetailedComponent;
  let fixture: ComponentFixture<SnackbarDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarDetailedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SnackbarDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
