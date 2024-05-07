import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LaboratoryService } from '../../../../core/services/laboratory.service';

@Component({
  selector: 'app-crear-laboratorio',
  templateUrl: './crear-laboratorio.component.html',
  styleUrls: ['./crear-laboratorio.component.css']
})
export class CrearLaboratorioComponent implements OnInit {
  laboratorioForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private laboratoryService: LaboratoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.laboratorioForm = this.fb.group({
      nombre: ['', Validators.required],
      capacidad: [0, [Validators.required, Validators.min(1)]],
      estado: ['disponible', Validators.required],
      img_url: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.laboratorioForm.valid) {
      this.laboratoryService.agregarLaboratorio(this.laboratorioForm.value).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Laboratorio creado',
          text: 'El laboratorio ha sido añadido exitosamente.'
        }).then(() => {
          this.router.navigate(['/admin/mostrar-laboratorio']);
        });
      }).catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el laboratorio',
          text: error.message
        });
      });
    }
  } navigateBack() {
    this.router.navigate(['/admin/mostrar-laboratorio']);
  }
}
