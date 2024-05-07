import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Laboratorio } from '../models/laboratory.model';

@Injectable({
  providedIn: 'root'
})
export class LaboratoryService {
  private laboratoriosCollection: AngularFirestoreCollection<Laboratorio>;
  Laboratorio: Observable<Laboratorio[]>;

  constructor(private firestore: AngularFirestore) {
    this.laboratoriosCollection = this.firestore.collection<Laboratorio>('Laboratorio');
    this.Laboratorio = this.laboratoriosCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todos los laboratorios
  getLaboratorios(): Observable<Laboratorio[]> {
    return this.Laboratorio;
  }

  // Método para agregar un nuevo laboratorio
  async agregarLaboratorio(laboratorio: Laboratorio): Promise<any> {
    const numLaboratorios = await this.laboratoriosCollection.ref.get().then(snapshot => snapshot.size);
    laboratorio.id = (numLaboratorios + 1).toString();
    return this.laboratoriosCollection.add(laboratorio);
  }

  // Método para obtener un laboratorio por su ID
  getLaboratorioById(id: string): Observable<Laboratorio | undefined> {
    return this.laboratoriosCollection.doc<Laboratorio>(id).valueChanges().pipe(
      map(laboratorio => laboratorio ? { ...laboratorio, id } as Laboratorio : undefined)
    );
  }

  // Método para actualizar un laboratorio
  actualizarLaboratorio(id: string, data: any): Promise<void> {
    return this.laboratoriosCollection.doc(id).update(data);
  }

  // Método para eliminar un laboratorio
  eliminarLaboratorio(id: string): Promise<void> {
    return this.laboratoriosCollection.doc(id).delete();
  }

  // Método para obtener un laboratorio por su nombre
  getLaboratorioByNombre(nombre: string): Observable<Laboratorio | undefined> {
    return this.firestore.collection<Laboratorio>('Laboratorios', ref => ref.where('nombre', '==', nombre))
      .valueChanges({ idField: 'id' })
      .pipe(
        map(laboratorios => {
          if (laboratorios && laboratorios.length > 0) {
            return { ...laboratorios[0], id: laboratorios[0].id } as Laboratorio;
          } else {
            return undefined;
          }
        })
      );
  }
}
