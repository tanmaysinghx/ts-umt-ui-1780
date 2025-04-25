import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsDashboardComponent } from './applications-dashboard.component';

describe('ApplicationsDashboardComponent', () => {
  let component: ApplicationsDashboardComponent;
  let fixture: ComponentFixture<ApplicationsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationsDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
