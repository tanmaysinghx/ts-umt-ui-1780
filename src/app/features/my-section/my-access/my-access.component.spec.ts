import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAccessComponent } from './my-access.component';

describe('MyAccessComponent', () => {
  let component: MyAccessComponent;
  let fixture: ComponentFixture<MyAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
