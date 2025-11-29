import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingScreenComponent } from './landing-screen.component';

describe('LandingScreenComponent', () => {
  let component: LandingScreenComponent;
  let fixture: ComponentFixture<LandingScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LandingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
