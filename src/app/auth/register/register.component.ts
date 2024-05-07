import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    if (this.registerForm.valid) {
      const { nombre, apellido, email, telefono, password } = this.registerForm.value;
      this.authService.registerWithEmail(email, password, nombre, apellido, telefono)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Registro Exitoso',
            text: 'Tu cuenta ha sido creada con éxito.'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/auth/auth']);
            }
          });
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            Swal.fire({
              icon: 'error',
              title: 'Error de Registro',
              text: 'El correo electrónico ya está en uso.'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error de Registro',
              text: error.message
            });
          }
        });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Datos Incompletos',
        text: 'Por favor, completa todos los campos con la información requerida.'
      });
    }
  }
}
