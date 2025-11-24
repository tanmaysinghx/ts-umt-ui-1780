import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFavoritesComponent } from './dashboard-favorites.component';

describe('DashboardFavoritesComponent', () => {
  let component: DashboardFavoritesComponent;
  let fixture: ComponentFixture<DashboardFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardFavoritesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
