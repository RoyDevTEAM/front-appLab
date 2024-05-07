// src/app/core/models/usuario.model.ts

export interface Usuario {
    id: string;
    Nombre: string;
    Apellido: string;
    Email: string;
    Estado: boolean;  // Cambiado de string a boolean según la descripción
    Telefono: string; // Añadido el campo teléfono que estaba en la descripción pero no en el modelo
}
