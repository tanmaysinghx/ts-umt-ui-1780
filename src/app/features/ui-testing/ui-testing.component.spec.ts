import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTestingComponent } from './ui-testing.component';

describe('UiTestingComponent', () => {
  let component: UiTestingComponent;
  let fixture: ComponentFixture<UiTestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTestingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UiTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
