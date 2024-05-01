import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedUpDialComponent } from './speed-up-dial.component';

describe('SpeedUpDialComponent', () => {
  let component: SpeedUpDialComponent;
  let fixture: ComponentFixture<SpeedUpDialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeedUpDialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpeedUpDialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
