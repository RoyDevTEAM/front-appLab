import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarLaboratorioComponent } from './editar-laboratorio.component';

describe('EditarLaboratorioComponent', () => {
  let component: EditarLaboratorioComponent;
  let fixture: ComponentFixture<EditarLaboratorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarLaboratorioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarLaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
