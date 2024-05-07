import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      take(1),
      switchMap((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          this.router.navigate(['/auth/auth']);
          return [false];
        }
        // Si el usuario está autenticado, verificamos si es Docente
        return this.authService.isTeacher();
      }),
      map((isTeacher: boolean) => {
        if (!isTeacher) {
          this.router.navigate(['/auth/auth']);
          return false;
        }
        return true; // Permitir acceso si es docente
      })
    );
  }
}
