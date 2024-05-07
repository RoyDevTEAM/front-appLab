import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      take(1),
      switchMap((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          this.router.navigate(['/auth/auth']);
          return [false];
        }
        // Si el usuario está autenticado, verificamos si es administrador
        return this.authService.isAdmin();
      }),
      map((isAdmin: boolean) => {
        if (!isAdmin) {
          this.router.navigate(['/auth/auth']);
          return false;
        }
        return true; // Permitir acceso si es administrador
      })
    );
  }
}
