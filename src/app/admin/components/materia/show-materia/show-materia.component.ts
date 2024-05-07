import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectService } from '../../../../core/services/subject.service';
import { Materia } from '../../../../core/models/subject.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-materia',
  templateUrl: './show-materia.component.html',
  styleUrls: ['./show-materia.component.css']
})
export class ShowMateriaComponent implements OnInit {
  materias: Materia[] = [];
  filteredMaterias: Materia[] = [];
  totalItems: number = 0;
  filter: string = '';
  page: number = 1;
  pageSize: number = 5;

  constructor(private subjectService: SubjectService, private router: Router) {}

  ngOnInit() {
    this.loadMaterias();
  }

  loadMaterias() {
    this.subjectService.getMaterias().subscribe(materias => {
      this.materias = materias;
      this.applyFilter();  // Aplicar filtro inicial o reiniciar cuando los datos cambian
    });
  }

  applyFilter() {
    this.filteredMaterias = this.materias.filter(materia => 
      materia.nombre.toLowerCase().includes(this.filter.toLowerCase())
    );
    this.totalItems = this.filteredMaterias.length;  // Actualizar el total de ítems para la paginación
    this.page = 1;  // Resetear a la primera página tras cada filtro
  }

  editarMateria(id: string) {
    this.router.navigate(['/admin/editar-materia', id]);
  }

  navegarACrearMateria() {
    this.router.navigate(['/admin/crear-materia']);
  }

  confirmarEliminacion(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, bórralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subjectService.eliminarMateria(id).then(() => {
          Swal.fire(
            'Eliminado!',
            'La materia ha sido eliminada.',
            'success'
          );
          this.loadMaterias(); // Recargar materias después de eliminar
        }).catch(error => {
          Swal.fire(
            'Error!',
            'Hubo un problema al eliminar la materia: ' + error.message,
            'error'
          );
        });
      }
    });
  }
}
