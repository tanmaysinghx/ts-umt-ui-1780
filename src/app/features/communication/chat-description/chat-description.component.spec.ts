import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDescriptionComponent } from './chat-description.component';

describe('ChatDescriptionComponent', () => {
  let component: ChatDescriptionComponent;
  let fixture: ComponentFixture<ChatDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatDescriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
