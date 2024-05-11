import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../../../core/models/user.model';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import 'pdfmake/build/vfs_fonts';
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
  exportDropdown: boolean = false;

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
toggleExportDropdown() {
  this.exportDropdown = !this.exportDropdown;
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
          { text: 'Lista de Docentes', style: 'header' },
          { text: '\n' },
          universityInfo,
          { text: '\n' },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [{ text: 'Nombre', style: 'tableHeader' }, { text: 'Apellido', style: 'tableHeader' }, { text: 'Estado', style: 'tableHeader' }],
                ...this.filteredDocentes.map((docente: { Nombre: any; Apellido: any; Estado: any; }) => [docente.Nombre, docente.Apellido, docente.Estado ? 'ACTIVO' : 'INACTIVO'])
              ]
            }
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 10]
          },
          universityName: {
            fontSize: 16,
            bold: true,
            color: '#1E88E5', // Azul
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
            fillColor: '#1E88E5', // Azul
            alignment: 'center'
          }
        }
      };
  
      (pdfMake as any).createPdf(docDefinition).open();
    });
  }
  
  exportToExcel() {
    // Filtrar los datos para eliminar campos no deseados y valores inesperados
    const dataWithoutId = this.filteredDocentes.map(docente => ({
      Nombre: docente.Nombre || '', // Asegúrate de que siempre haya un valor, incluso si es una cadena vacía
      Apellido: docente.Apellido || '', // Asegúrate de que siempre haya un valor, incluso si es una cadena vacía
      Estado: docente.Estado ? 'ACTIVO' : 'INACTIVO' // Convertir el valor booleano en una cadena 'ACTIVO' o 'INACTIVO'
    }));

    // Crear la hoja de cálculo de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataWithoutId);

    // Definir estilos para el encabezado de la tabla
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } }, // Texto en negrita y color blanco
      fill: { fgColor: { rgb: '1E88E5' } } // Fondo azul
    };

    // Establecer los encabezados manualmente
    worksheet['A1'] = { v: 'Nombre', s: headerStyle };
    worksheet['B1'] = { v: 'Apellido', s: headerStyle };
    worksheet['C1'] = { v: 'Estado', s: headerStyle };

    // Configurar anchos de columna
    const columnWidths = [
      { wch: 30 }, // Anchura de la columna para Nombre
      { wch: 30 }, // Anchura de la columna para Apellido
      { wch: 20 } // Anchura de la columna para Estado
    ];
    worksheet['!cols'] = columnWidths;

    // Convertir la hoja de cálculo de Excel a un libro de Excel
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    // Convertir el libro de Excel a un buffer
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Descargar el archivo Excel
    this.saveAsExcelFile(excelBuffer, 'docentes');
  }

  
  saveAsExcelFile(buffer: any, fileName: string): void {
    // Crear un objeto Blob a partir del buffer
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
  
    // Crear una URL para el objeto Blob
    const url: string = window.URL.createObjectURL(data);
  
    // Crear un elemento <a> para descargar el archivo
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = fileName + '.xlsx';
  
    link.click();
  
    // Liberar la URL creada para evitar pérdidas de memoria
    window.URL.revokeObjectURL(url);
  }

  print() {
    window.print();
  }
}
