import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMateriaComponent } from './show-materia.component';

describe('ShowMateriaComponent', () => {
  let component: ShowMateriaComponent;
  let fixture: ComponentFixture<ShowMateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowMateriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
