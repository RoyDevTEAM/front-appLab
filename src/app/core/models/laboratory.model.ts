export interface Laboratorio {
    id: string;
    nombre: string;
    capacidad: number;
    estado: string; //disponible, ocupado, mantenimiento
    img_url: string;
}
