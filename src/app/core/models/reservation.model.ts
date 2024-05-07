import { Laboratorio } from "./laboratory.model";
import { Usuario } from "./user.model";
export interface Reserva {
    id: string;
    idLaboratorio: string;
    idUsuario: string;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    estado: string;
    usuario?: Usuario;
    laboratorio?: Laboratorio;
}
