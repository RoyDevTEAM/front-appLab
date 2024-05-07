import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reserva } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservasCollection: AngularFirestoreCollection<Reserva>;
  reservas: Observable<Reserva[]>;

  constructor(private firestore: AngularFirestore) {
    this.reservasCollection = this.firestore.collection<Reserva>('reservas');
    this.reservas = this.reservasCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todas las reservas
  getReservas(): Observable<Reserva[]> {
    return this.reservas;
  }

  // Método para agregar una nueva reserva
  async agregarReserva(reserva: Reserva): Promise<any> {
    const numReservas = await this.reservasCollection.ref.get().then(snapshot => snapshot.size);
    reserva.id = (numReservas + 1).toString();
    return this.reservasCollection.add(reserva);
  }

  // Método para obtener una reserva por su ID
  getReservaById(id: string): Observable<Reserva | undefined> {
    return this.reservasCollection.doc<Reserva>(id).valueChanges().pipe(
      map(reserva => reserva ? { ...reserva, id } as Reserva : undefined)
    );
  }

  // Método para actualizar una reserva
  actualizarReserva(id: string, data: any): Promise<void> {
    return this.reservasCollection.doc(id).update(data);
  }

  // Método para eliminar una reserva
  eliminarReserva(id: string): Promise<void> {
    return this.reservasCollection.doc(id).delete();
  }
}
