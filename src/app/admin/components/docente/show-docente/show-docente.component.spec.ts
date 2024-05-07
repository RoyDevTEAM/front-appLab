import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDocenteComponent } from './show-docente.component';

describe('ShowDocenteComponent', () => {
  let component: ShowDocenteComponent;
  let fixture: ComponentFixture<ShowDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowDocenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
