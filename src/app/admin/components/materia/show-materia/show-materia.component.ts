import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectService } from '../../../../core/services/subject.service';
import { Materia } from '../../../../core/models/subject.model';
import Swal from 'sweetalert2';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import 'pdfmake/build/vfs_fonts';
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
  exportDropdown: boolean = false;

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

  toggleExportDropdown() {
    this.exportDropdown = !this.exportDropdown;
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
          { text: 'Lista de Materias', style: 'subheader' },
          { text: '\n' },
          universityInfo,
          { text: '\n' },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*'],
              body: [
                [{ text: 'Nombre', style: 'tableHeader' }, { text: 'Descripción', style: 'tableHeader' }],
                ...this.filteredMaterias.map((materia: { nombre: any; descripcion: any; }) => [materia.nombre, materia.descripcion])
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
    // Crear una copia de los datos filtrados para eliminar el campo "id"
    const dataWithoutId = this.filteredMaterias.map(({ id, ...rest }) => rest);
  
    // Crear la hoja de cálculo de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataWithoutId);
  
    // Definir estilos para el encabezado de la tabla
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } }, // Texto en negrita y color blanco
      fill: { fgColor: { rgb: '1E88E5' } } // Fondo azul
    };
  
    // Establecer los encabezados manualmente
    worksheet['A1'] = { v: 'Nombre', s: headerStyle };
    worksheet['B1'] = { v: 'Descripción', s: headerStyle };
  
    // Configurar anchos de columna
    const columnWidths = [
      { wch: 30 }, // Anchura de la columna para Nombre
      { wch: 50 } // Anchura de la columna para Descripción
    ];
    worksheet['!cols'] = columnWidths;
  
    // Convertir la hoja de cálculo de Excel a un libro de Excel
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  
    // Convertir el libro de Excel a un buffer
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Descargar el archivo Excel
    this.saveAsExcelFile(excelBuffer, 'materias');
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
