import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-routing.module.js').then(m => m.AdminRoutingModule)  // Carga el módulo de admin
  },
  {
    path: 'teacher',
    loadChildren: () => import('./teacher/teacher-routing.module.js').then(m => m.TeacherRoutingModule)  // Carga el módulo de teacher
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-routing.module.js').then(m => m.AuthRoutingModule)  // Carga diferida para el módulo de autenticación
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./public/public-routing.module.js').then(m => m.PublicRoutingModule)  // Carga diferida para el módulo público
  },
  { 
    path: '**', 
    redirectTo: 'home'  // Redirige cualquier ruta no reconocida al Home
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
