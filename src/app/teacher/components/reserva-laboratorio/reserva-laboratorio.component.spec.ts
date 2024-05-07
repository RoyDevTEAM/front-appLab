import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaLaboratorioComponent } from './reserva-laboratorio.component';

describe('ReservaLaboratorioComponent', () => {
  let component: ReservaLaboratorioComponent;
  let fixture: ComponentFixture<ReservaLaboratorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservaLaboratorioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservaLaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
