import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubjectService } from '../../../../core/services/subject.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-materia',
  templateUrl: './crear-materia.component.html',
  styleUrls: ['./crear-materia.component.css']
})
export class CrearMateriaComponent implements OnInit {
  materiaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private router: Router
  ) { }

  ngOnInit() {
    this.materiaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });
  }

  onSubmit() {
    if (this.materiaForm.valid) {
      this.subjectService.agregarMateria(this.materiaForm.value).then(() => {
        Swal.fire('¡Creado!', 'La materia ha sido creada exitosamente.', 'success');
        this.router.navigate(['/admin/mostrar-materia']);
      }).catch(error => {
        Swal.fire('Error', 'Hubo un problema al crear la materia: ' + error.message, 'error');
      });
    }
  }

  navigateBack() {
    this.router.navigate(['/admin/mostrar-materia']);
  }
}
