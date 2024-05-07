import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowReservaComponent } from './show-reserva.component';

describe('ShowReservaComponent', () => {
  let component: ShowReservaComponent;
  let fixture: ComponentFixture<ShowReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowReservaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
