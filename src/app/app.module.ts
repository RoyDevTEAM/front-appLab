import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ShowMateriaComponent } from './admin/components/materia/show-materia/show-materia.component';
import { CrearMateriaComponent } from './admin/components/materia/crear-materia/crear-materia.component';
import { EditarMateriaComponent } from './admin/components/materia/editar-materia/editar-materia.component';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { ShowLaboratorioComponent } from './admin/components/laboratorio/show-laboratorio/show-laboratorio.component';
import { CrearLaboratorioComponent } from './admin/components/laboratorio/crear-laboratorio/crear-laboratorio.component';
import { EditarLaboratorioComponent } from './admin/components/laboratorio/editar-laboratorio/editar-laboratorio.component';
import { ShowAsignacionComponent } from './admin/components/asignacion-materia-laboratorio/show-asignacion/show-asignacion.component';
import { CrearAsignacionComponent } from './admin/components/asignacion-materia-laboratorio/crear-asignacion/crear-asignacion.component';
import { EditarAsignacionComponent } from './admin/components/asignacion-materia-laboratorio/editar-asignacion/editar-asignacion.component';
import { ShowDocenteComponent } from './admin/components/docente/show-docente/show-docente.component';
import { CrearDocenteComponent } from './admin/components/docente/crear-docente/crear-docente.component';
import { EditarDocenteComponent } from './admin/components/docente/editar-docente/editar-docente.component';
import { NotificacionComponent } from './teacher/components/notificacion/notificacion.component';
import { ReservaLaboratorioComponent } from './teacher/components/reserva-laboratorio/reserva-laboratorio.component';
import { SolicitudSoftwareComponent } from './teacher/components/solicitud-software/solicitud-software.component';
import { HomeComponent } from './public/home/home.component';
import { HeaderComponent } from './public/layout/header/header.component';
import { FooterComponent } from './public/layout/footer/footer.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShowReservaComponent } from './admin/components/reserva/show-reserva/show-reserva.component';
import { DetalleReservaComponent } from './admin/components/reserva/detalle-reserva/detalle-reserva.component';
import { EditarReservaComponent } from './admin/components/reserva/editar-reserva/editar-reserva.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ShowMateriaComponent,
    CrearMateriaComponent,
    EditarMateriaComponent,
    DashboardComponent,
    ShowLaboratorioComponent,
    CrearLaboratorioComponent,
    EditarLaboratorioComponent,
    ShowAsignacionComponent,
    CrearAsignacionComponent,
    EditarAsignacionComponent,
    ShowDocenteComponent,
    CrearDocenteComponent,
    EditarDocenteComponent,
    NotificacionComponent,
    ReservaLaboratorioComponent,
    SolicitudSoftwareComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ShowReservaComponent,
    DetalleReservaComponent,
    EditarReservaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,    
    FormsModule,NgxPaginationModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
