import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectAssignmentService } from '../../../../core/services/subject-assignment.service';
import { AsignacionMaterias } from '../../../../core/models/subject-assignment.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-asignacion',
  templateUrl: './show-asignacion.component.html',
  styleUrls: ['./show-asignacion.component.css']
})
export class ShowAsignacionComponent implements OnInit {
  asignaciones: AsignacionMaterias[] = [];
  filteredAsignaciones: AsignacionMaterias[] = [];
  searchTerm: string = '';
  selectedTurno: string = '';
  page: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  constructor(
    private subjectAssignmentService: SubjectAssignmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAsignaciones();
  }

  loadAsignaciones(): void {
    this.subjectAssignmentService.getAsignacionesDetalladas().subscribe(asignaciones => {
      this.asignaciones = asignaciones;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    this.filteredAsignaciones = this.asignaciones.filter(asig => {
      // Verificar si los objetos están definidos antes de acceder a sus propiedades
      const usuarioNombre: boolean = asig.usuario?.Nombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false;
      const usuarioApellido: boolean = asig.usuario?.Apellido?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false;
      const materiaNombre: boolean = asig.materia?.nombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false;
      const laboratorioNombre: boolean = asig.laboratorio?.nombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false;
      const horarioTurno: boolean = asig.horario?.turno === this.selectedTurno;
  
      // Filtro por searchTerm, verifica si alguno de los campos coincide
      const searchTermMatch: boolean = this.searchTerm ?
        (usuarioNombre || usuarioApellido || materiaNombre || laboratorioNombre) : true;
      
      // Filtro por turno, solo activo si selectedTurno no es vacío
      const turnoMatch: boolean = this.selectedTurno ? horarioTurno : true;
  
      return searchTermMatch && turnoMatch;
    });
  
    this.totalItems = this.filteredAsignaciones.length;
  }
  

  editarAsignacion(id: string): void {
    this.router.navigate(['/admin/editar-asignacion', id]);
  }
  navegarACrearAsignacion(): void{
    this.router.navigate(['/admin/crear-asignacion']);

  }

  eliminarAsignacion(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, elimínalo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subjectAssignmentService.eliminarAsignacionMateria(id).then(() => {
          Swal.fire(
            'Eliminado!',
            'La asignación ha sido eliminada.',
            'success'
          );
          this.loadAsignaciones(); // Recarga la lista después de eliminar
        }).catch(error => {
          Swal.fire('Error', error.message, 'error');
        });
      }
    });
  }
}
