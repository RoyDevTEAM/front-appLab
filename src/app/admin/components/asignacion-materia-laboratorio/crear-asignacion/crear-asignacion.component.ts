import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '../../../../core/services/user.service';
import { SubjectService } from '../../../../core/services/subject.service';
import { LaboratoryService } from '../../../../core/services/laboratory.service';
import { ScheduleService } from '../../../../core/services/schedule.service';
import { Usuario } from '../../../../core/models/user.model';
import { Materia } from '../../../../core/models/subject.model';
import { Laboratorio } from '../../../../core/models/laboratory.model';
import { Horario } from '../../../../core/models/schedule.model';
import { SubjectAssignmentService } from '../../../../core/services/subject-assignment.service';
import { AsignacionMaterias } from '../../../../core/models/subject-assignment.model';

declare var $: any;

@Component({
  selector: 'app-crear-asignacion',
  templateUrl: './crear-asignacion.component.html',
  styleUrls: ['./crear-asignacion.component.css']
})
export class CrearAsignacionComponent implements OnInit, AfterViewInit {
  asignacionForm!: FormGroup;
  docentes: Usuario[] = [];
  materias: Materia[] = [];
  laboratorios: Laboratorio[] = [];
  horarios: Horario[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private subjectService: SubjectService,
    private laboratoryService: LaboratoryService,
    private scheduleService: ScheduleService,
    private router: Router,
    private subjectAssignmentService: SubjectAssignmentService,

  ) {}

  ngOnInit(): void {
    this.asignacionForm = this.fb.group({
      docente: ['', Validators.required],
      materia: ['', Validators.required],
      laboratorio: ['', Validators.required],
      horario: ['', Validators.required]
    });

    this.loadInitialData();
  }

  ngAfterViewInit(): void {
    this.setupAutocomplete();
  }

  loadInitialData(): void {
    this.userService.getDocentes().subscribe(docentes => {
      this.docentes = docentes;
      this.setupAutocomplete();
    });
    this.subjectService.getMaterias().subscribe(materias => {
      this.materias = materias;
      this.setupAutocomplete();
    });
    this.laboratoryService.getLaboratorios().subscribe(laboratorios => this.laboratorios = laboratorios);
    this.scheduleService.getHorarios().subscribe(horarios => this.horarios = horarios);
  }

  setupAutocomplete(): void {
    // Asegurarse de que jQuery UI esté cargado
    $(() => {
      $("#docente").autocomplete({
        source: this.docentes.map(docente => docente.Nombre + ' ' + docente.Apellido),
        select: (event: any, ui: { item: { label: string; value: string } }) => {
          // Encuentra el ID del docente seleccionado
          const selectedDocente = this.docentes.find(docente => docente.Nombre + ' ' + docente.Apellido === ui.item.label);
          if (selectedDocente) {
            this.asignacionForm.patchValue({ docente: selectedDocente.id });
          }
        }
      });
  
      $("#materia").autocomplete({
        source: this.materias.map(materia => materia.nombre),
        select: (event: any, ui: { item: { label: string; value: string } }) => {
          // Encuentra el ID de la materia seleccionada
          const selectedMateria = this.materias.find(materia => materia.nombre === ui.item.label);
          if (selectedMateria) {
            this.asignacionForm.patchValue({ materia: selectedMateria.id });
          }
        }
      });
    });
  }

  onSubmit(): void {
    if (this.asignacionForm.valid) {
      // Crear un objeto con los IDs para la asignación, asegurándose de usar los nombres correctos de las propiedades
      const asignacionData: AsignacionMaterias = {
        id: '', // Este campo normalmente se genera en el backend o se omite si la base de datos autogenera IDs
        idUsuario: this.asignacionForm.get('docente')?.value,
        idMateria: this.asignacionForm.get('materia')?.value,
        idLaboratorio: this.asignacionForm.get('laboratorio')?.value,
        idHorario: this.asignacionForm.get('horario')?.value
      };
  
      // Llamar al servicio para agregar la asignación
      this.subjectAssignmentService.agregarAsignacionMateria(asignacionData).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Asignación creada',
          text: 'La asignación ha sido creada exitosamente.'
        }).then(() => {
          this.router.navigate(['/admin/mostrar-asignacion']);
        });
      }).catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear asignación',
          text: error.message
        });
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Datos incompletos',
        text: 'Por favor, complete todos los campos del formulario.'
      });
    }

  }
  navigateBack() {
    this.router.navigate(['/admin/mostrar-asignacion']);
  }
  
}
