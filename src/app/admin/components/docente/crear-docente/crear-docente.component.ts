import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-crear-docente',
  templateUrl: './crear-docente.component.html',
  styleUrls: ['./crear-docente.component.css']
})
export class CrearDocenteComponent implements OnInit {
  docenteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.docenteForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]], // Aseguramos que el teléfono sea requerido.
      password: ['', [Validators.required, Validators.minLength(6)]]  // Aseguramos que la contraseña tenga al menos 6 caracteres.
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.docenteForm.valid) {
      const { nombre, apellido, email, password, telefono } = this.docenteForm.value;
      this.authService.registerWithEmail(email, password, nombre, apellido, telefono)
        .then(() => {
          Swal.fire('Registro exitoso', 'El docente ha sido agregado correctamente', 'success');
          this.router.navigate(['/admin/mostrar-docente']);
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            Swal.fire('Error', 'El correo electrónico ya está en uso', 'error');
          } else {
            Swal.fire('Error', 'Ha ocurrido un error al registrar el docente: ' + error.message, 'error');
          }
        });
    }
  }

  cancel() {
    this.router.navigate(['/admin/mostrar-docente']);
  }
}
