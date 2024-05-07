import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Materia } from '../models/subject.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private materiasCollection: AngularFirestoreCollection<Materia>;
  materias: Observable<Materia[]>;

  constructor(private firestore: AngularFirestore) {
    this.materiasCollection = this.firestore.collection<Materia>('materias');
    this.materias = this.materiasCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todas las materias
  getMaterias(): Observable<Materia[]> {
    return this.materias;
  }

  // Método para agregar una nueva materia
  async agregarMateria(materia: Materia): Promise<any> {
    const numMaterias = await this.materiasCollection.ref.get().then(snapshot => snapshot.size);
    materia.id = (numMaterias + 1).toString();
    return this.materiasCollection.add(materia);
  }

  // Método para obtener una materia por su ID
  getMateriaById(id: string): Observable<Materia | undefined> {
    return this.materiasCollection.doc<Materia>(id).valueChanges().pipe(
      map(materia => materia ? { ...materia, id } as Materia : undefined)
    );
  }

  // Método para actualizar una materia
  actualizarMateria(id: string, data: any): Promise<void> {
    return this.materiasCollection.doc(id).update(data);
  }

  // Método para eliminar una materia
  eliminarMateria(id: string): Promise<void> {
    return this.materiasCollection.doc(id).delete();
  }

  // Método para obtener una materia por su nombre
  getMateriaByNombre(nombre: string): Observable<Materia | undefined> {
    return this.firestore.collection<Materia>('materias', ref => ref.where('nombre', '==', nombre))
      .valueChanges({ idField: 'id' })
      .pipe(
        map(materias => {
          if (materias && materias.length > 0) {
            return { ...materias[0], id: materias[0].id } as Materia;
          } else {
            return undefined;
          }
        })
      );
  }
}
