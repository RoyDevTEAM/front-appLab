import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from '../../../../core/services/reservation.service';
import Swal from 'sweetalert2';
import { Reserva } from '../../../../core/models/reservation.model';
import * as XLSX from 'xlsx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-show-reserva',
  templateUrl: './show-reserva.component.html',
  styleUrls: ['./show-reserva.component.css']
})
export class ShowReservaComponent implements OnInit {
  reservas: Reserva[] = [];
  filteredReservas: Reserva[] = [];
  totalItems: number = 0;
  filter: string = '';
  page: number = 1;
  pageSize: number = 5;
  exportDropdown: boolean = false;

  constructor(private reservationService: ReservationService, private router: Router) {}

  ngOnInit() {
    this.loadReservas();
  }

  loadReservas() {
    this.reservationService.getReservasDetalladas().subscribe(reservas => {
      this.reservas = reservas;
      this.applyFilter();
      this.cambiarEstadoReserva(); // Llamada a la función para cambiar estado de reservas
    });
  }

  applyFilter() {
    this.filteredReservas = this.reservas.filter(reserva =>
      (reserva.usuario && reserva.usuario.Nombre.toLowerCase().includes(this.filter.toLowerCase())) ||
      (reserva.laboratorio && reserva.laboratorio.nombre.toLowerCase().includes(this.filter.toLowerCase()))
    );
    this.totalItems = this.filteredReservas.length;
  }

  editarReserva(id: string) {
    // Lógica para editar una reserva
  }

  confirmarReserva(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres confirmar esta reserva?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar reserva!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService.actualizarReserva(id, { estado: 'confirmada' }).then(() => {
          Swal.fire(
            'Reserva Confirmada',
            'La reserva ha sido confirmada correctamente.',
            'success'
          );
          this.loadReservas();
        }).catch(error => {
          Swal.fire(
            'Error al confirmar',
            `Error al confirmar la reserva: ${error.message}`,
            'error'
          );
        });
      }
    });
  }

  cambiarEstadoReserva() {
    // Lógica para cambiar el estado de la reserva (pendiente a completada si es fecha anterior)
    this.reservationService.completarReservaAntigua();
  }

  toggleExportDropdown() {
    this.exportDropdown = !this.exportDropdown;
  }

  confirmarEliminacion(id: string) {
    // Lógica para confirmar y eliminar una reserva
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, bórralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService.eliminarReserva(id).then(() => {
          Swal.fire(
            'Eliminado!',
            'La reserva ha sido eliminada.',
            'success'
          );
          this.loadReservas();
        }).catch(error => {
          Swal.fire(
            'Error!',
            'Hubo un problema al eliminar la reserva: ' + error.message,
            'error'
          );
        });
      }
    });
  }

  exportToPDF() {
    // Función para convertir una imagen a base64
    function toBase64(url: string | URL, callback: { (base64Logo: any): void; (arg0: string | ArrayBuffer | null): void; }) {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend = function() {
          callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    }
  
    // Convertir el logo a base64
    toBase64('assets/img/logo.png', (base64Logo: any) => {
      const universityInfo = [
        { text: 'Universidad Privada Domingo Savio', style: 'universityName' },
        { text: 'Ubicación: Av. Beni Santa Cruz de la Sierra', style: 'universityLocation' }
      ];
  
      const docDefinition = {
        content: [
          { image: base64Logo, width: 100, alignment: 'left', margin: [0, 0, 0, 10] },
          universityInfo,
          { text: '\n' },
          { text: 'Lista de Reservas', style: 'subheader' }, // Nuevo estilo para el subencabezado
          { text: '\n' },
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto'], // Anchuras automáticas para un diseño más flexible
              body: [
                [
                  { text: 'Usuario', style: 'tableHeader' }, // Encabezado con estilo
                  { text: 'Laboratorio', style: 'tableHeader' },
                  { text: 'Fecha', style: 'tableHeader' },
                  { text: 'Estado', style: 'tableHeader' },
                  { text: 'Descripción', style: 'tableHeader' }
                ],
                ...this.filteredReservas.map(reserva => [
                  reserva.usuario?.Nombre + ' ' + reserva.usuario?.Apellido,
                  reserva.laboratorio?.nombre,
                  reserva.fecha,
                  reserva.estado,
                ])
              ]
            }
          }
        ],
        styles: {
          subheader: { // Nuevo estilo para el subencabezado
            fontSize: 16,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 10]
          },
          universityName: {
            fontSize: 20, // Tamaño aumentado para resaltar
            bold: true,
            color: '#033E8C', // Azul
            alignment: 'center'
          },
          universityLocation: {
            fontSize: 12,
            italic: true,
            alignment: 'center'
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: '#FFFFFF', // Blanco
            fillColor: '#033E8C', // Azul
            alignment: 'center'
          }
        }
      };
  
      (pdfMake as any).createPdf(docDefinition).open();
    });
  }
  
  exportToExcel() {
    const data = this.filteredReservas.map(reserva => ({
      'Usuario': reserva.usuario?.Nombre + ' ' + reserva.usuario?.Apellido,
      'Laboratorio': reserva.laboratorio?.nombre,
      'Fecha': reserva.fecha,
      'Estado': reserva.estado,
    }));
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    this.saveAsExcelFile(excelBuffer, 'reservas');
  }
  
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url: string = window.URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = fileName + '.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
  }
  

  print() {
    window.print();
  }
  navegarACrearReserva(){
    this.router.navigate(['/admin/crear-reserva']);

  }
}
