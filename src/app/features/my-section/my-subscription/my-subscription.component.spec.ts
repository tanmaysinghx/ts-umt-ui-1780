import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySubscriptionComponent } from './my-subscription.component';

describe('MySubscriptionComponent', () => {
  let component: MySubscriptionComponent;
  let fixture: ComponentFixture<MySubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySubscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MySubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
