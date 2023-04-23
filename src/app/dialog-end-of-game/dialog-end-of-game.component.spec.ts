import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEndOfGameComponent } from './dialog-end-of-game.component';

describe('DialogEndOfGameComponent', () => {
  let component: DialogEndOfGameComponent;
  let fixture: ComponentFixture<DialogEndOfGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEndOfGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEndOfGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
