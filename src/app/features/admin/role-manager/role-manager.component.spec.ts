import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleManagerComponent } from './role-manager.component';

describe('RoleManagerComponent', () => {
  let component: RoleManagerComponent;
  let fixture: ComponentFixture<RoleManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
