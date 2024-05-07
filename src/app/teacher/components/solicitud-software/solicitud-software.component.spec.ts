import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudSoftwareComponent } from './solicitud-software.component';

describe('SolicitudSoftwareComponent', () => {
  let component: SolicitudSoftwareComponent;
  let fixture: ComponentFixture<SolicitudSoftwareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudSoftwareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitudSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
