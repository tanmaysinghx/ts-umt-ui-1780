import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPasswordChangeComponent } from './user-password-change.component';

describe('UserPasswordChangeComponent', () => {
  let component: UserPasswordChangeComponent;
  let fixture: ComponentFixture<UserPasswordChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPasswordChangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
