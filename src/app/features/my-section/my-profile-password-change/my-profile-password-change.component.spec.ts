import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfilePasswordChangeComponent } from './my-profile-password-change.component';

describe('MyProfilePasswordChangeComponent', () => {
  let component: MyProfilePasswordChangeComponent;
  let fixture: ComponentFixture<MyProfilePasswordChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfilePasswordChangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyProfilePasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
