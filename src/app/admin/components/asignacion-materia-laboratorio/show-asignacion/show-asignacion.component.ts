import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectAssignmentService } from '../../../../core/services/subject-assignment.service';
import { AsignacionMaterias } from '../../../../core/models/subject-assignment.model';
import Swal from 'sweetalert2';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import 'pdfmake/build/vfs_fonts';
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
  selectedMonth: string = ''; // Nuevo campo para el filtro por mes
  page: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  months: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']; // Definir el array de meses
  exportDropdown: boolean = false;

  constructor(
    public subjectAssignmentService: SubjectAssignmentService,
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
      const mesCreacion: boolean = this.selectedMonth === '' || this.subjectAssignmentService.getMonthName(asig.fechaCreacion) === this.selectedMonth;

      // Filtro por searchTerm, verifica si alguno de los campos coincide
      const searchTermMatch: boolean = this.searchTerm ?
        (usuarioNombre || usuarioApellido || materiaNombre || laboratorioNombre) : true;
      
      // Filtro por turno, solo activo si selectedTurno no es vacío
      const turnoMatch: boolean = this.selectedTurno ? horarioTurno : true;
      
      return searchTermMatch && turnoMatch && mesCreacion;
    });
  
    this.totalItems = this.filteredAsignaciones.length;
  }
  
  editarAsignacion(id: string): void {
    this.router.navigate(['/admin/editar-asignacion', id]);
  }
  
  navegarACrearAsignacion(): void {
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
          { text: '\n' },
          { text: 'Lista de Asignaciones', style: 'subheader' }, // Nuevo estilo para el subencabezado
          { text: '\n' },
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto'], // Anchuras automáticas para un diseño más flexible
              body: [
                [
                  { text: 'Docente', style: 'tableHeader' }, // Encabezado con estilo
                  { text: 'Materia', style: 'tableHeader' },
                  { text: 'Horario', style: 'tableHeader' },
                  { text: 'Laboratorio', style: 'tableHeader' },
                  { text: 'Mes', style: 'tableHeader' }
                ],
                ...this.filteredAsignaciones.map(asignacion => [
                  asignacion.usuario?.Nombre + ' ' + asignacion.usuario?.Apellido,
                  asignacion.materia?.nombre,
                  asignacion.horario?.turno + ' (' + asignacion.horario?.horaInicio + ' - ' + asignacion.horario?.horaFin + ')',
                  asignacion.laboratorio?.nombre,
                  this.subjectAssignmentService.getMonthName(asignacion.fechaCreacion)
                ])
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
    const data = this.filteredAsignaciones.map(asignacion => ({
      'Docente': asignacion.usuario?.Nombre + ' ' + asignacion.usuario?.Apellido,
      'Materia': asignacion.materia?.nombre,
      'Horario': asignacion.horario?.turno + ' (' + asignacion.horario?.horaInicio + ' - ' + asignacion.horario?.horaFin + ')',
      'Laboratorio': asignacion.laboratorio?.nombre,
      'Mes': this.subjectAssignmentService.getMonthName(asignacion.fechaCreacion)
    }));
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    this.saveAsExcelFile(excelBuffer, 'asignaciones');
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
}
