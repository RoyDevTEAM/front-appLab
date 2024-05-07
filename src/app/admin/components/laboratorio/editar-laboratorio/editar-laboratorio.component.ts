import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LaboratoryService } from '../../../../core/services/laboratory.service';
import { Laboratorio } from '../../../../core/models/laboratory.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-laboratorio',
  templateUrl: './editar-laboratorio.component.html',
  styleUrls: ['./editar-laboratorio.component.css']
})
export class EditarLaboratorioComponent implements OnInit {
  laboratorioForm!: FormGroup;
  laboratorioId!: string;

  constructor(
    private fb: FormBuilder,
    private laboratoryService: LaboratoryService,
    public router: Router,  // Cambiado de private a public para permitir el acceso desde el template
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.laboratorioId = this.route.snapshot.params['id'];
    this.loadLaboratorioData();
    this.laboratorioForm = this.fb.group({
      nombre: ['', Validators.required],
      capacidad: [0, [Validators.required, Validators.min(1)]],
      estado: ['', Validators.required],
      img_url: ['', Validators.required]
    });
  }

  loadLaboratorioData() {
    this.laboratoryService.getLaboratorioById(this.laboratorioId).subscribe(data => {
      if (data) {
        this.laboratorioForm.patchValue(data);
      } else {
        Swal.fire('Error', 'Laboratorio no encontrado', 'error');
        this.router.navigate(['/admin/mostrar-laboratorio']);
      }
    });
  }

  onSubmit(): void {
    if (this.laboratorioForm.valid) {
      this.laboratoryService.actualizarLaboratorio(this.laboratorioId, this.laboratorioForm.value).then(() => {
        Swal.fire('Actualizado', 'El laboratorio ha sido actualizado correctamente', 'success');
        this.navigateBack();
      }).catch(error => {
        Swal.fire('Error al actualizar', error.message, 'error');
      });
    }
  }

  navigateBack() {
    this.router.navigate(['/admin/mostrar-laboratorio']);
  }
}
