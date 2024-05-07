import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LaboratoryService } from '../../../../core/services/laboratory.service';
import { Laboratorio } from '../../../../core/models/laboratory.model';

@Component({
  selector: 'app-show-laboratorio',
  templateUrl: './show-laboratorio.component.html',
  styleUrls: ['./show-laboratorio.component.css']
})
export class ShowLaboratorioComponent implements OnInit {
  laboratorios: Laboratorio[] = [];
  filteredLaboratorios: Laboratorio[] = [];
  totalItems: number = 0;
  filter: string = '';
  estadoFilter: string = '';
  page: number = 1;
  pageSize: number = 5;

  constructor(
    private laboratoryService: LaboratoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLaboratorios();
  }

  loadLaboratorios() {
    this.laboratoryService.getLaboratorios().subscribe(laboratorios => {
      this.laboratorios = laboratorios;
      this.applyFilter(); // Aplicar filtro inicial o reiniciar cuando los datos cambian
    });
  }

  applyFilter() {
    this.filteredLaboratorios = this.laboratorios.filter(lab =>
      lab.nombre.toLowerCase().includes(this.filter.toLowerCase()) &&
      (!this.estadoFilter || lab.estado === this.estadoFilter)
    );
    this.totalItems = this.filteredLaboratorios.length; // Actualizar el total de ítems para la paginación
  }

  navegarACrearLaboratorio() {
    this.router.navigate(['/admin/crear-laboratorio']);
  }

  editarLaboratorio(id: string) {
    this.router.navigate(['/admin/editar-laboratorio', id]);
  }

  cambiarEstado(laboratorio: Laboratorio) {
    const nuevoEstado = laboratorio.estado === 'disponible' ? 'ocupado' : 'disponible'; // Simplificado para ejemplo
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Cambiar el estado a ${nuevoEstado}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.laboratoryService.actualizarLaboratorio(laboratorio.id, { estado: nuevoEstado }).then(() => {
          Swal.fire('Estado actualizado', `El estado ha sido cambiado a ${nuevoEstado}.`, 'success');
          this.loadLaboratorios();
        });
      }
    });
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
        this.laboratoryService.eliminarLaboratorio(id).then(() => {
          Swal.fire('Eliminado!', 'El laboratorio ha sido eliminado.', 'success');
          this.loadLaboratorios();
        });
      }
    });
  }
}
