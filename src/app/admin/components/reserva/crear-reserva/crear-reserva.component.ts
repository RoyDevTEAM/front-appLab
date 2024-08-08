import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UserService } from '../../../../core/services/user.service';
import { LaboratoryService } from '../../../../core/services/laboratory.service';
import { ScheduleService } from '../../../../core/services/schedule.service';
import { Reserva } from '../../../../core/models/reservation.model';
import { Usuario } from '../../../../core/models/user.model';
import { Laboratorio } from '../../../../core/models/laboratory.model';
import { Horario } from '../../../../core/models/schedule.model';
import { ReservationService } from '../../../../core/services/reservation.service';

declare var $: any;

@Component({
  selector: 'app-crear-reserva',
  templateUrl: './crear-reserva.component.html',
  styleUrls: ['./crear-reserva.component.css']
})
export class CrearReservaComponent implements OnInit, AfterViewInit {
  reservaForm!: FormGroup;
  usuarios: Usuario[] = [];
  laboratorios: Laboratorio[] = [];
  horarios: Horario[] = [];
  fechaValida: boolean = false;
  horaValida: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private laboratoryService: LaboratoryService,
    private scheduleService: ScheduleService,
    private reservationService: ReservationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
  }

  ngAfterViewInit(): void {
    this.setupAutocomplete();
  }

  initForm(): void {
    this.reservaForm = this.fb.group({
      docente: ['', Validators.required],
      laboratorio: ['', Validators.required],
      fecha: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
    });
  }

  loadInitialData(): void {
    this.userService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
      this.setupAutocomplete();
    });
    this.laboratoryService.getLaboratorios().subscribe(laboratorios => this.laboratorios = laboratorios);
    this.scheduleService.getHorarios().subscribe(horarios => this.horarios = horarios);
  }

  setupAutocomplete(): void {
    $(() => {
      $("#docente").autocomplete({
        source: this.usuarios.map(usuario => usuario.Nombre + ' ' + usuario.Apellido),
        select: (event: any, ui: { item: { label: string; value: string } }) => {
          const selectedUsuario = this.usuarios.find(usuario => usuario.Nombre + ' ' + usuario.Apellido === ui.item.label);
          if (selectedUsuario) {
            this.reservaForm.patchValue({ docente: selectedUsuario.id });
          }
        }
      });
    });
  }

  onSubmit(): void {
    if (this.reservaForm.valid && this.fechaValida && this.horaValida) {
      const reservaData: Reserva = {
        id: '', 
        idUsuario: this.reservaForm.get('docente')?.value,
        idLaboratorio: this.reservaForm.get('laboratorio')?.value,
        fecha: this.reservaForm.get('fecha')?.value,
        horaInicio: this.reservaForm.get('horaInicio')?.value,
        horaFin: this.reservaForm.get('horaFin')?.value, 
        estado: 'pendiente' // Estado inicial de la reserva
      };

      this.reservationService.agregarReserva(reservaData).then(() => {
        this.showSuccessAlert();
      }).catch(error => {
        this.showErrorAlert(error.message);
      });
    } else {
      this.showValidationErrorAlert();
    }
  }

  showSuccessAlert(): void {
    Swal.fire({
      icon: 'success',
      title: 'Reserva creada',
      text: 'La reserva ha sido creada exitosamente.'
    }).then(() => {
      this.router.navigate(['/admin/mostrar-reserva']);
    });
  }

  showErrorAlert(errorMessage: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error al crear reserva',
      text: errorMessage
    });
  }

  showValidationErrorAlert(): void {
    Swal.fire({
      icon: 'error',
      title: 'Datos incompletos o inválidos',
      text: 'Por favor, complete todos los campos del formulario y seleccione una fecha, hora de inicio y hora de fin válidas.'
    });
  }

  verificarLaboratorios(): void {
    const fecha = this.reservaForm.get('fecha')?.value;
    const horaInicio = this.reservaForm.get('horaInicio')?.value;
    const horaFin = this.reservaForm.get('horaFin')?.value;
  
    if (fecha && horaInicio && horaFin) {
      this.reservationService.verificarLaboratoriosDisponibles(fecha, horaInicio, horaFin).subscribe(laboratoriosDisponibles => {
        if (laboratoriosDisponibles && laboratoriosDisponibles.length > 0) {
          this.laboratorios = laboratoriosDisponibles;
          this.reservaForm.get('laboratorio')?.enable();
        } else {
          this.laboratorios = [];
          this.reservaForm.get('laboratorio')?.disable();
        }
      });
    } else {
      this.reservaForm.get('laboratorio')?.disable();
    }
  }
  
  cancelar(): void {
    this.router.navigate(['/admin/mostrar-reserva']);
  }
}
