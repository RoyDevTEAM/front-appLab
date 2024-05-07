import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SolicitudSoftware } from '../models/software-request.model';

@Injectable({
  providedIn: 'root'
})
export class SoftwareRequestService {
  private solicitudesSoftwareCollection: AngularFirestoreCollection<SolicitudSoftware>;
  solicitudesSoftware: Observable<SolicitudSoftware[]>;

  constructor(private firestore: AngularFirestore) {
    this.solicitudesSoftwareCollection = this.firestore.collection<SolicitudSoftware>('solicitudesSoftware');
    this.solicitudesSoftware = this.solicitudesSoftwareCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todas las solicitudes de software
  getSolicitudesSoftware(): Observable<SolicitudSoftware[]> {
    return this.solicitudesSoftware;
  }

  // Método para agregar una nueva solicitud de software
  async agregarSolicitudSoftware(solicitudSoftware: SolicitudSoftware): Promise<any> {
    const numSolicitudes = await this.solicitudesSoftwareCollection.ref.get().then(snapshot => snapshot.size);
    solicitudSoftware.id = (numSolicitudes + 1).toString();
    return this.solicitudesSoftwareCollection.add(solicitudSoftware);
  }

  // Método para obtener una solicitud de software por su ID
  getSolicitudSoftwareById(id: string): Observable<SolicitudSoftware | undefined> {
    return this.solicitudesSoftwareCollection.doc<SolicitudSoftware>(id).valueChanges().pipe(
      map(solicitudSoftware => solicitudSoftware ? { ...solicitudSoftware, id } as SolicitudSoftware : undefined)
    );
  }

  // Método para actualizar una solicitud de software
  actualizarSolicitudSoftware(id: string, data: any): Promise<void> {
    return this.solicitudesSoftwareCollection.doc(id).update(data);
  }

  // Método para eliminar una solicitud de software
  eliminarSolicitudSoftware(id: string): Promise<void> {
    return this.solicitudesSoftwareCollection.doc(id).delete();
  }
}
