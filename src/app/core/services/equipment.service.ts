import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Equipo } from '../models/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private equiposCollection: AngularFirestoreCollection<Equipo>;
  equipos: Observable<Equipo[]>;

  constructor(private firestore: AngularFirestore) {
    this.equiposCollection = this.firestore.collection<Equipo>('equipos');
    this.equipos = this.equiposCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todos los equipos
  getEquipos(): Observable<Equipo[]> {
    return this.equipos;
  }

  // Método para agregar un nuevo equipo
  async agregarEquipo(equipo: Equipo): Promise<any> {
    const numEquipos = await this.equiposCollection.ref.get().then(snapshot => snapshot.size);
    equipo.id = (numEquipos + 1).toString();
    return this.equiposCollection.add(equipo);
  }

  // Método para obtener un equipo por su ID
  getEquipoById(id: string): Observable<Equipo | undefined> {
    return this.equiposCollection.doc<Equipo>(id).valueChanges().pipe(
      map(equipo => equipo ? { ...equipo, id } as Equipo : undefined)
    );
  }

  // Método para actualizar un equipo
  actualizarEquipo(id: string, data: any): Promise<void> {
    return this.equiposCollection.doc(id).update(data);
  }

  // Método para eliminar un equipo
  eliminarEquipo(id: string): Promise<void> {
    return this.equiposCollection.doc(id).delete();
  }
}
