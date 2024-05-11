import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';
import { AsignacionMaterias } from '../models/subject-assignment.model';
import { Usuario } from '../models/user.model';
import { Materia } from '../models/subject.model';
import { Laboratorio } from '../models/laboratory.model';
import { Horario } from '../models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectAssignmentService {
  private asignacionesMateriasCollection: AngularFirestoreCollection<AsignacionMaterias>;

  constructor(private firestore: AngularFirestore) {
    this.asignacionesMateriasCollection = this.firestore.collection<AsignacionMaterias>('asignacionesMaterias');
  }

  getAsignacionesMaterias(): Observable<AsignacionMaterias[]> {
    return this.asignacionesMateriasCollection.valueChanges({ idField: 'id' });
  }

  agregarAsignacionMateria(asignacionMateria: AsignacionMaterias): Promise<any> {
    return this.asignacionesMateriasCollection.add(asignacionMateria);
  }

  getAsignacionMateriaById(id: string): Observable<AsignacionMaterias | undefined> {
    return this.asignacionesMateriasCollection.doc<AsignacionMaterias>(id).valueChanges().pipe(
      map(asignacionMateria => asignacionMateria ? { ...asignacionMateria, id } : undefined)
    );
  }

  actualizarAsignacionMateria(id: string, data: any): Promise<void> {
    return this.asignacionesMateriasCollection.doc(id).update(data);
  }

  getAsignacionesDetalladas(): Observable<any[]> {
    return this.asignacionesMateriasCollection.valueChanges({ idField: 'id' }).pipe(
      switchMap(asignaciones => {
        if (asignaciones.length === 0) {
          return of([]);
        }

        const fetchDetails = (asig: AsignacionMaterias) => {
          const user$ = asig.idUsuario ? this.firestore.doc<Usuario>(`Usuarios/${asig.idUsuario}`).valueChanges() : of(null);
          const materia$ = asig.idMateria ? this.firestore.doc<Materia>(`materias/${asig.idMateria}`).valueChanges() : of(null);
          const lab$ = asig.idLaboratorio ? this.firestore.doc<Laboratorio>(`Laboratorio/${asig.idLaboratorio}`).valueChanges() : of(null);
          const horario$ = asig.idHorario ? this.firestore.doc<Horario>(`horarios/${asig.idHorario}`).valueChanges() : of(null);

          return combineLatest([user$, materia$, lab$, horario$]).pipe(
            map(([usuario, materia, laboratorio, horario]) => ({
              ...asig,
              usuario: usuario || undefined,
              materia: materia || undefined,
              laboratorio: laboratorio || undefined,
              horario: horario || undefined
            }))
          );
        };

        return combineLatest(asignaciones.map(fetchDetails));
      }),
      map(asignaciones => asignaciones.filter(asig =>
        asig.usuario && asig.materia && asig.laboratorio && asig.horario // Make sure all details are loaded
      ))
    );
  }
// Método para obtener el nombre del mes a partir de una fecha
getMonthName(date: any): string {
  if (!date) return ''; // Devuelve vacío si no hay fecha

  // Convierte el objeto Timestamp a Date si es necesario
  const fecha = date.toDate ? date.toDate() : date;

  // Verifica si la fecha es una instancia de Date
  if (!(fecha instanceof Date)) {
    return ''; // Devuelve vacío si la fecha no es válida
  }

  // Obtén el índice del mes a partir de la fecha
  const monthIndex = fecha.getMonth();
  
  // Array con los nombres de los meses
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // Devuelve el nombre del mes correspondiente al índice
  return months[monthIndex];
}

  eliminarAsignacionMateria(id: string): Promise<void> {
    return this.asignacionesMateriasCollection.doc(id).delete();
  }
}
