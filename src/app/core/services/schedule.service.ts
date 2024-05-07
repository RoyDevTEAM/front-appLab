import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Horario } from '../models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private horariosCollection: AngularFirestoreCollection<Horario>;
  horarios: Observable<Horario[]>;

  constructor(private firestore: AngularFirestore) {
    this.horariosCollection = this.firestore.collection<Horario>('horarios');
    this.horarios = this.horariosCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todos los horarios
  getHorarios(): Observable<Horario[]> {
    return this.horarios;
  }

  // Método para agregar un nuevo horario
  async agregarHorario(horario: Horario): Promise<any> {
    const numHorarios = await this.horariosCollection.ref.get().then(snapshot => snapshot.size);
    horario.id = (numHorarios + 1).toString();
    return this.horariosCollection.add(horario);
  }

  // Método para obtener un horario por su ID
  getHorarioById(id: string): Observable<Horario | undefined> {
    return this.horariosCollection.doc<Horario>(id).valueChanges().pipe(
      map(horario => horario ? { ...horario, id } as Horario : undefined)
    );
  }

  // Método para actualizar un horario
  actualizarHorario(id: string, data: any): Promise<void> {
    return this.horariosCollection.doc(id).update(data);
  }

  // Método para eliminar un horario
  eliminarHorario(id: string): Promise<void> {
    return this.horariosCollection.doc(id).delete();
  }
}
