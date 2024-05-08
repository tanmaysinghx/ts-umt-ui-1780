import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsConditionsReviewComponent } from './terms-conditions-review.component';

describe('TermsConditionsReviewComponent', () => {
  let component: TermsConditionsReviewComponent;
  let fixture: ComponentFixture<TermsConditionsReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsConditionsReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TermsConditionsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
