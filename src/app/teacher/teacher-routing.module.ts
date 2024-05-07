import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherGuard } from '../core/guards/teacher.guard';

// Componentes del área de Teacher
import { NotificacionComponent } from './components/notificacion/notificacion.component';
import { ReservaLaboratorioComponent } from './components/reserva-laboratorio/reserva-laboratorio.component';
import { ShowLaboratorioComponent } from './components/show-laboratorio/show-laboratorio.component';
import { SolicitudSoftwareComponent } from './components/solicitud-software/solicitud-software.component';

const routes: Routes = [
  {
    path: 'teacher',
    canActivate: [TeacherGuard],
    children: [
      { path: 'notificaciones', component: NotificacionComponent },
      { path: 'reserva-laboratorio', component: ReservaLaboratorioComponent },
      { path: 'mostrar-laboratorio', component: ShowLaboratorioComponent },
      { path: 'solicitud-software', component: SolicitudSoftwareComponent },
      { path: '', redirectTo: 'mostrar-laboratorio', pathMatch: 'full' } // Cambio de la ruta por defecto a "mostrar-laboratorio"
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
