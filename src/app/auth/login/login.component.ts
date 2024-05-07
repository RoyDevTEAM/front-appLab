import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.loginWithEmail(email, password).then(() => {
        // Check the role and navigate accordingly
        this.navigateToRoleBasedRoute();
      }).catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: 'Correo o contraseña incorrecta.'
        });
      });
    } else {
      // If the form is invalid, display an alert
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, completa todos los campos correctamente.'
      });
    }
  }

  private navigateToRoleBasedRoute() {
    this.authService.isAdmin().subscribe(isAdmin => {
      if (isAdmin) {
        Swal.fire('¡Bienvenido!', 'Inicio de sesión exitoso.', 'success');
        this.router.navigate(['/admin']);
      } else {
        this.authService.isTeacher().subscribe(isTeacher => {
          if (isTeacher) {
            Swal.fire('¡Bienvenido!', 'Inicio de sesión exitoso.', 'success');
            this.router.navigate(['/teacher']);
          } else {
            this.router.navigate(['/home']);
          }
        });
      }
    });
  }
}
