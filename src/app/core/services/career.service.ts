import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Carrera } from '../models/career.model';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  private carrerasCollection: AngularFirestoreCollection<Carrera>;
  carreras: Observable<Carrera[]>;

  constructor(private firestore: AngularFirestore) {
    this.carrerasCollection = this.firestore.collection<Carrera>('carreras');
    this.carreras = this.carrerasCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todas las carreras
  getCarreras(): Observable<Carrera[]> {
    return this.carreras;
  }

  // Método para agregar una nueva carrera
  async agregarCarrera(carrera: Carrera): Promise<any> {
    const numCarreras = await this.carrerasCollection.ref.get().then(snapshot => snapshot.size);
    carrera.id = (numCarreras + 1).toString();
    return this.carrerasCollection.add(carrera);
  }

  // Método para obtener una carrera por su ID
  getCarreraById(id: string): Observable<Carrera | undefined> {
    return this.carrerasCollection.doc<Carrera>(id).valueChanges().pipe(
      map(carrera => carrera ? { ...carrera, id } as Carrera : undefined)
    );
  }

  // Método para actualizar una carrera
  actualizarCarrera(id: string, data: any): Promise<void> {
    return this.carrerasCollection.doc(id).update(data);
  }

  // Método para eliminar una carrera
  eliminarCarrera(id: string): Promise<void> {
    return this.carrerasCollection.doc(id).delete();
  }

  // Método para obtener una carrera por su nombre
  getCarreraByNombre(nombre: string): Observable<Carrera | undefined> {
    return this.firestore.collection<Carrera>('carreras', ref => ref.where('nombre', '==', nombre))
      .valueChanges({ idField: 'id' })
      .pipe(
        map(carreras => {
          if (carreras && carreras.length > 0) {
            return { ...carreras[0], id: carreras[0].id } as Carrera;
          } else {
            return undefined;
          }
        })
      );
  }
}
