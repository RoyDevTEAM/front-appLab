import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLaboratorioComponent } from './show-laboratorio.component';

describe('ShowLaboratorioComponent', () => {
  let component: ShowLaboratorioComponent;
  let fixture: ComponentFixture<ShowLaboratorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowLaboratorioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowLaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
