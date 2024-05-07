import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAsignacionComponent } from './show-asignacion.component';

describe('ShowAsignacionComponent', () => {
  let component: ShowAsignacionComponent;
  let fixture: ComponentFixture<ShowAsignacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowAsignacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowAsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
