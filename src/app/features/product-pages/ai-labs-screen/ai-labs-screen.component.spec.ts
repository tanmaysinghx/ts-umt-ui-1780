import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiLabsScreenComponent } from './ai-labs-screen.component';

describe('AiLabsScreenComponent', () => {
  let component: AiLabsScreenComponent;
  let fixture: ComponentFixture<AiLabsScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiLabsScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AiLabsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
