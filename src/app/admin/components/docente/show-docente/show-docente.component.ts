import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../../../core/models/user.model';

@Component({
  selector: 'app-show-docente',
  templateUrl: './show-docente.component.html',
  styleUrls: ['./show-docente.component.css']
})
export class ShowDocenteComponent implements OnInit {
  docentes: Usuario[] = [];
  filteredDocentes: Usuario[] = [];
  totalItems: number = 0;
  filter: string = '';
  page: number = 1;
  pageSize: number = 5;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loadDocentes();
  }

  loadDocentes() {
    this.userService.getDocentes().subscribe(docentes => {
      this.docentes = docentes;
      this.applyFilter();
    });
  }

  applyFilter() {
    this.filteredDocentes = this.docentes.filter(docente =>
      (docente.Nombre && docente.Nombre.toLowerCase().includes(this.filter.toLowerCase())) ||
      (docente.Apellido && docente.Apellido.toLowerCase().includes(this.filter.toLowerCase()))
    );
    this.totalItems = this.filteredDocentes.length;
  }
  

  editarDocente(id: string) {
    this.router.navigate(['/admin/editar-docente', id]);
  }

  navegarACrearDocente() {
    this.router.navigate(['/admin/crear-docente']);
  }

  cambiarEstado(docente: Usuario) {
    const estadoActual = docente.Estado ? 'activo' : 'inactivo';
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres cambiar el estado del docente ${docente.Nombre} ${docente.Apellido} de ${estadoActual} a ${docente.Estado ? 'inactivo' : 'activo'}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cambiar estado!'
    }).then((result) => {
        if (result.isConfirmed) {
            const nuevoEstado = !docente.Estado;  // simplemente invertir el estado actual
            this.userService.actualizarUsuario(docente.id, { estado: nuevoEstado }).then(() => {
                Swal.fire(
                    'Estado Actualizado',
                    `El estado del docente ha sido cambiado a ${nuevoEstado ? 'activo' : 'inactivo'}.`,
                    'success'
                );
                this.loadDocentes();  // Recargar los datos
            }).catch(error => {
                Swal.fire(
                    'Error al actualizar',
                    `Error al cambiar el estado: ${error.message}`,
                    'error'
                );
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
        this.userService.eliminarUsuario(id).then(() => {
          Swal.fire(
            'Eliminado!',
            'El docente ha sido eliminado.',
            'success'
          );
          this.loadDocentes();
        }).catch(error => {
          Swal.fire(
            'Error!',
            'Hubo un problema al eliminar el docente: ' + error.message,
            'error'
          );
        });
      }
    });
  }
}
