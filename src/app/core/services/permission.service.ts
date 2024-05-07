import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Permiso } from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permisosCollection: AngularFirestoreCollection<Permiso>;
  permisos: Observable<Permiso[]>;

  constructor(private firestore: AngularFirestore) {
    this.permisosCollection = this.firestore.collection<Permiso>('permisos');
    this.permisos = this.permisosCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todos los permisos
  getPermisos(): Observable<Permiso[]> {
    return this.permisos;
  }

  // Método para agregar un nuevo permiso
  async agregarPermiso(permiso: Permiso): Promise<any> {
    const numPermisos = await this.permisosCollection.ref.get().then(snapshot => snapshot.size);
    permiso.id = (numPermisos + 1).toString();
    return this.permisosCollection.add(permiso);
  }

  // Método para obtener un permiso por su ID
  getPermisoById(id: string): Observable<Permiso | undefined> {
    return this.permisosCollection.doc<Permiso>(id).valueChanges().pipe(
      map(permiso => permiso ? { ...permiso, id } as Permiso : undefined)
    );
  }

  // Método para actualizar un permiso
  actualizarPermiso(id: string, data: any): Promise<void> {
    return this.permisosCollection.doc(id).update(data);
  }

  // Método para eliminar un permiso
  eliminarPermiso(id: string): Promise<void> {
    return this.permisosCollection.doc(id).delete();
  }
}
