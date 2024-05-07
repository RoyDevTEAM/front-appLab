import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, from, combineLatest, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Usuario } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usuariosCollection: AngularFirestoreCollection<Usuario>;
  Usuarios: Observable<Usuario[]>;
  private UsuariosRolesCollection: AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore) {
    this.usuariosCollection = this.firestore.collection<Usuario>('Usuarios');
    this.Usuarios = this.usuariosCollection.valueChanges({ idField: 'id' });
    this.UsuariosRolesCollection = this.firestore.collection('UsuariosRoles');
  }

  // Método para obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.Usuarios;
  }

  // Método para obtener un usuario por su ID
  getUsuarioById(id: string): Observable<Usuario | undefined> {
    return this.usuariosCollection.doc<Usuario>(id).valueChanges().pipe(
      map(usuario => usuario ? { ...usuario, id } as Usuario : undefined)
    );
  }

  // Método para obtener todos los usuarios con el rol de docente
  getDocentes(): Observable<Usuario[]> {
    const docenteRolId = '1vTg2Cn43BKLueUHE0h4';
    return from(this.UsuariosRolesCollection.ref.where('ID_Rol', '==', docenteRolId).get()).pipe(
      switchMap(querySnapshot => {
        const userIds = querySnapshot.docs.map(doc => doc.data().ID_Usuario);
        if (userIds.length > 0) {
          const userRefs = userIds.map(userId => this.usuariosCollection.doc<Usuario>(userId).valueChanges());
          return combineLatest(userRefs).pipe(
            map(users => users.filter(user => user !== undefined) as Usuario[]),
            catchError(err => of([])) // En caso de error, devolver un array vacío
          );
        } else {
          return of([]);
        }
      })
    );
  }

  // Método para actualizar un usuario
  actualizarUsuario(id: string, data: any): Promise<void> {
    return this.usuariosCollection.doc(id).update(data);
  }

  // Método para actualizar el estado de un docente
  actualizarEstadoDocente(id: string, nuevoEstado: boolean): Promise<void> {
    return this.usuariosCollection.doc(id).update({ Estado: nuevoEstado });
  }

  // Método para eliminar un usuario
  eliminarUsuario(id: string): Promise<void> {
    return this.usuariosCollection.doc(id).delete();
  }
}
