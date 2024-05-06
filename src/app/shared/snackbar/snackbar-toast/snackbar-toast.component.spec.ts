import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarToastComponent } from './snackbar-toast.component';

describe('SnackbarToastComponent', () => {
  let component: SnackbarToastComponent;
  let fixture: ComponentFixture<SnackbarToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarToastComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SnackbarToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
