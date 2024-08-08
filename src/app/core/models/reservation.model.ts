import { Laboratorio } from "./laboratory.model";
import { Usuario } from "./user.model";

export interface Reserva {
    id: string;
    idLaboratorio: string;
    idUsuario: string;
    fecha: Date;
    horaInicio: Date;
    horaFin: Date;
    estado: string;
    usuario?: Usuario;
    laboratorio?: Laboratorio;
}
