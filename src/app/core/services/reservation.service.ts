import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, of, flatMap } from 'rxjs';
import { map, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { Reserva } from '../models/reservation.model';
import { Laboratorio } from '../models/laboratory.model';
import { Usuario } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservasCollection: AngularFirestoreCollection<Reserva>;
  laboratorios!: Observable<Laboratorio[]>;

  constructor(private firestore: AngularFirestore) {
    this.reservasCollection = this.firestore.collection<Reserva>('reservas');

  }

  getReservas(): Observable<Reserva[]> {
    return this.reservasCollection.valueChanges({ idField: 'id' });
  }

  agregarReserva(reserva: Reserva): Promise<any> {
    return this.reservasCollection.add(reserva);
  }

  getReservaById(id: string): Observable<Reserva | undefined> {
    return this.reservasCollection.doc<Reserva>(id).valueChanges().pipe(
      map(reserva => reserva ? { ...reserva, id } : undefined)
    );
  }

  actualizarReserva(id: string, data: any): Promise<void> {
    return this.reservasCollection.doc(id).update(data);
  }

  eliminarReserva(id: string): Promise<void> {
    return this.reservasCollection.doc(id).delete();
  }

  getReservasDetalladas(): Observable<any[]> {
    return this.reservasCollection.valueChanges({ idField: 'id' }).pipe(
      switchMap(reservas => {
        if (reservas.length === 0) {
          return of([]);
        }

        const fetchDetails = (reserva: Reserva) => {
          const user$ = reserva.idUsuario ? this.firestore.doc<Usuario>(`Usuarios/${reserva.idUsuario}`).valueChanges() : of(null);
          const lab$ = reserva.idLaboratorio ? this.firestore.doc<Laboratorio>(`Laboratorio/${reserva.idLaboratorio}`).valueChanges() : of(null);

          return combineLatest([user$, lab$]).pipe(
            map(([usuario, laboratorio]) => ({
              ...reserva,
              usuario: usuario || undefined,
              laboratorio: laboratorio || undefined
            }))
          );
        };

        return combineLatest(reservas.map(fetchDetails));
      })
    );
  }
   // Método para actualizar el estado de una reserva de "pendiente" a "confirmada"
   confirmarReserva(id: string): Promise<void> {
    return this.actualizarReserva(id, { estado: 'confirmada' });
  }

  // Método para cambiar el estado de una reserva a "completada" si la fecha es anterior a la actual
  completarReservaAntigua(): void {
    const today = new Date();
    this.getReservas().subscribe(reservas => {
      reservas.forEach(reserva => {
        const fechaReserva = new Date(reserva.fecha);
        if (fechaReserva < today && reserva.estado !== 'completada') {
          this.actualizarReserva(reserva.id, { estado: 'completada' });
        }
      });
    });
  }
 
  verificarLaboratoriosDisponibles(fecha: Date, horaInicio: Date, horaFin: Date): Observable<Laboratorio[]> {
    // Obtener todas las reservas para la fecha seleccionada
    return this.firestore.collection<Reserva>('reservas', ref =>
        ref.where('fecha', '==', fecha)
    ).valueChanges().pipe(
        switchMap(reservas => {
            if (reservas.length === 0) {
                // Si no hay reservas para esta fecha, todos los laboratorios están disponibles
                return this.firestore.collection<Laboratorio>('Laboratorio').valueChanges();
            } else {
                // Filtrar los laboratorios ocupados en el rango horario seleccionado
                const laboratoriosOcupadosIds = reservas.filter(reserva => {
                    // Convertir la fecha de inicio y fin de la reserva a objetos Date
                    const reservaHoraInicio = (reserva.horaInicio as any).toDate(); // Convertir a Date
                    const reservaHoraFin = (reserva.horaFin as any).toDate(); // Convertir a Date

                    // Verificar si hay solapamiento de horarios
                    return (
                        (horaInicio >= reservaHoraInicio && horaInicio < reservaHoraFin) ||
                        (horaFin > reservaHoraInicio && horaFin <= reservaHoraFin) ||
                        (horaInicio <= reservaHoraInicio && horaFin >= reservaHoraFin)
                    );
                }).map(reserva => reserva.idLaboratorio);
  
                // Obtener los laboratorios disponibles
                return this.firestore.collection<Laboratorio>('Laboratorio', ref =>
                    ref.where('id', 'not-in', laboratoriosOcupadosIds)
                ).valueChanges();
            }
        })
    );
  }
 
}
