import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SubjectAssignmentService } from '../../../core/services/subject-assignment.service';
import { AsignacionMaterias } from '../../../core/models/subject-assignment.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isOpen = false;
  usuarioActual$ = this.authService.usuarioActual$;
  asignaciones: AsignacionMaterias[] = [];
  filteredAsignaciones: AsignacionMaterias[] = [];
  selectedTurno: string = '';
  showDashboardContent: boolean = true;  // Control visibility of the dashboard content

  constructor(
    private authService: AuthService,
    private router: Router,
    private subjectAssignmentService: SubjectAssignmentService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      // Check if the current route is the dashboard
      this.showDashboardContent = this.router.url === '/admin';
    });
    this.loadAsignaciones();
  }

  loadAsignaciones(): void {
    this.subjectAssignmentService.getAsignacionesDetalladas().subscribe(asignaciones => {
      this.asignaciones = asignaciones;
      this.applyFilter();
    }, error => {
      console.error('Error loading assignments:', error);
      Swal.fire('Error', 'Error loading data from server', 'error');
    });
  }

  applyFilter(): void {
    this.filteredAsignaciones = this.asignaciones.filter(asig => {
      const turnoMatch = this.selectedTurno ? asig.horario?.turno === this.selectedTurno : true;
      return turnoMatch;
    });
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;  // Toggle the sidebar state
  }

  confirmLogout() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Estás a punto de cerrar sesión",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/auth/auth']);
    });
  }
}
