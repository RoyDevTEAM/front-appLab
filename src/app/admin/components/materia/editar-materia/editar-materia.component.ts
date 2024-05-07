import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from '../../../../core/services/subject.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-materia',
  templateUrl: './editar-materia.component.html',
  styleUrls: ['./editar-materia.component.css']
})
export class EditarMateriaComponent implements OnInit {
  materiaForm: FormGroup;
  id!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private subjectService: SubjectService,
    private router: Router
  ) {
    this.materiaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadMateria(this.id);
    });
  }

  loadMateria(id: string) {
    this.subjectService.getMateriaById(id).subscribe(data => {
      if (data) {
        this.materiaForm.patchValue(data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Materia no encontrada',
        });
        this.router.navigate(['/admin/mostrar-materia']);
      }
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar',
        text: 'No se pudo cargar la información de la materia',
      });
    });
  }

  onSubmit() {
    if (this.materiaForm.valid) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Estás a punto de actualizar la información de la materia.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, actualizar!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.subjectService.actualizarMateria(this.id, this.materiaForm.value).then(() => {
            Swal.fire(
              'Actualizado',
              'La materia ha sido actualizada correctamente.',
              'success'
            );
            this.router.navigate(['/admin/mostrar-materia']);
          }).catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar',
              text: error.message,
            });
          });
        }
      });
    }
  }

  navigateBack() {
    this.router.navigate(['/admin/mostrar-materia']);
  }
}
