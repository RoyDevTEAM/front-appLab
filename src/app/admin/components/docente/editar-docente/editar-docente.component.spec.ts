import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDocenteComponent } from './editar-docente.component';

describe('EditarDocenteComponent', () => {
  let component: EditarDocenteComponent;
  let fixture: ComponentFixture<EditarDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarDocenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
