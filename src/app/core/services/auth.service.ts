import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioActual$!: Observable<any>;

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.usuarioActual$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection('Usuarios').doc<any>(user.uid).valueChanges();
        } else {
          return of(null);
        }
      }),
      catchError(error => {
        console.error('Error en AuthService:', error);
        return of(null);
      })
    );

    this.afAuth.authState.subscribe(user => {
      this.isLoggedInSubject.next(!!user);
    });
  }

  // Método para comprobar si el usuario está autenticado
isLoggedIn(): Observable<boolean> {
  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
  return of(isLoggedIn);
}

  // Método para obtener el nombre del usuario
  getUserName(): Observable<string> {
    return this.usuarioActual$.pipe(map(usuario => usuario ? usuario.Nombre : ''));
  }

  // Método para registrar un usuario con correo electrónico y contraseña
  async registerWithEmail(
    email: string,
    password: string,
    nombre: string,
    apellido: string,
    telefono: string
  ): Promise<void> {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = credential.user;

      if (user) {
        await this.createUserProfile(user.uid, email, nombre, apellido, telefono);
        await this.assignUserRole(user.uid); // Asignar rol al usuario
      } else {
        throw new Error('El usuario no se ha creado correctamente.');
      }
    } catch (error) {
      throw error;
    }
  }

  private async createUserProfile(
    uid: string,
    email: string,
    nombre: string,
    apellido: string,
    telefono: string
  ): Promise<void> {
    try {
      await this.firestore.collection('Usuarios').doc(uid).set({
        id: uid,
        Nombre: nombre,
        Apellido: apellido,
        Email: email,
        Telefono: telefono,
        Estado: true // Por defecto, el estado es verdadero para un nuevo usuario
      });
    } catch (error) {
      throw error;
    }
  }

  // Método para asignar el rol al usuario (por defecto se asigna 'TTgVKpaKB2KRrIaTM2HQ')
  private async assignUserRole(uid: string): Promise<void> {
    try {
      await this.firestore.collection('UsuariosRoles').doc(uid).set({
        ID_Usuario: uid,
        ID_Rol: '1vTg2Cn43BKLueUHE0h4' // ID_Rol por defecto para docente
      });
    } catch (error) {
      throw error;
    }
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      localStorage.setItem('userLoggedIn', 'true');
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      localStorage.removeItem('userLoggedIn');
    } catch (error) {
      throw error;
    }
  }
  // Método para comprobar si el usuario es administrador
isAdmin(): Observable<boolean> {
  return this.afAuth.authState.pipe(
    switchMap(user => {
      if (!user) {
        return of(false); // Si no hay usuario, devuelve false
      } else {
        return this.firestore.collection('UsuariosRoles', ref => ref.where('ID_Usuario', '==', user.uid)).valueChanges().pipe(
          map((roles: any[]) => {
            // Comprueba si el usuario tiene el rol de administrador
            return roles.some(role => role.ID_Rol === 'TTgVKpaKB2KRrIaTM2HQ'); // Reemplaza 'TTgVKpaKB2KRrIaTM2HQ' con el ID de rol de administrador
          })
        );
      }
    })
  );
}// Método para comprobar si el usuario es profesor
isTeacher(): Observable<boolean> {
  return this.afAuth.authState.pipe(
    switchMap(user => {
      if (!user) {
        return of(false); // Si no hay usuario, devuelve false
      } else {
        return this.firestore.collection('UsuariosRoles', ref => ref.where('ID_Usuario', '==', user.uid)).valueChanges().pipe(
          map((roles: any[]) => {
            // Comprueba si el usuario tiene el rol de profesor
            return roles.some(role => role.ID_Rol === '1vTg2Cn43BKLueUHE0h4'); // Reemplaza 'ID_DEL_ROL_DE_PROFESOR' con el ID de rol de profesor
          })
        );
      }
    })
  );
}


}
