import { Laboratorio } from "./laboratory.model";
import { Horario } from "./schedule.model";
import { Materia } from "./subject.model";
import { Usuario } from "./user.model";


export interface AsignacionMaterias {
    id: string;
    idLaboratorio: string;
    idMateria: string;
    idUsuario: string;
    idHorario: string;
    usuario?: Usuario;
    materia?: Materia;
    laboratorio?: Laboratorio;
    horario?: Horario;
}
