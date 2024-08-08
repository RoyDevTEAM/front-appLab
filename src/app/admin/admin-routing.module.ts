import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../core/guards/admin.guard';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CrearAsignacionComponent } from './components/asignacion-materia-laboratorio/crear-asignacion/crear-asignacion.component';
import { EditarAsignacionComponent } from './components/asignacion-materia-laboratorio/editar-asignacion/editar-asignacion.component';
import { ShowAsignacionComponent } from './components/asignacion-materia-laboratorio/show-asignacion/show-asignacion.component';
import { CrearDocenteComponent } from './components/docente/crear-docente/crear-docente.component';
import { EditarDocenteComponent } from './components/docente/editar-docente/editar-docente.component';
import { ShowDocenteComponent } from './components/docente/show-docente/show-docente.component';
import { CrearLaboratorioComponent } from './components/laboratorio/crear-laboratorio/crear-laboratorio.component';
import { EditarLaboratorioComponent } from './components/laboratorio/editar-laboratorio/editar-laboratorio.component';
import { ShowLaboratorioComponent } from './components/laboratorio/show-laboratorio/show-laboratorio.component';
import { CrearMateriaComponent } from './components/materia/crear-materia/crear-materia.component';
import { EditarMateriaComponent } from './components/materia/editar-materia/editar-materia.component';
import { ShowMateriaComponent } from './components/materia/show-materia/show-materia.component';
import { CrearReservaComponent } from './components/reserva/crear-reserva/crear-reserva.component'; // Nueva importación
import { EditarReservaComponent } from './components/reserva/editar-reserva/editar-reserva.component'; // Nueva importación
import { ShowReservaComponent } from './components/reserva/show-reserva/show-reserva.component'; // Nueva importación

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'dashboard', redirectTo: '', pathMatch: 'full' },
      { path: 'crear-asignacion', component: CrearAsignacionComponent },
      { path: 'editar-asignacion/:id', component: EditarAsignacionComponent },
      { path: 'mostrar-asignacion', component: ShowAsignacionComponent },
      { path: 'crear-docente', component: CrearDocenteComponent },
      { path: 'editar-docente/:id', component: EditarDocenteComponent },
      { path: 'mostrar-docente', component: ShowDocenteComponent },
      { path: 'crear-laboratorio', component: CrearLaboratorioComponent },
      { path: 'editar-laboratorio/:id', component: EditarLaboratorioComponent },
      { path: 'mostrar-laboratorio', component: ShowLaboratorioComponent },
      { path: 'crear-materia', component: CrearMateriaComponent },
      { path: 'editar-materia/:id', component: EditarMateriaComponent },
      { path: 'mostrar-materia', component: ShowMateriaComponent },
      // Rutas para la gestión de reservas
      { path: 'crear-reserva', component: CrearReservaComponent },
      { path: 'editar-reserva/:id', component: EditarReservaComponent },
      { path: 'mostrar-reserva', component: ShowReservaComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
