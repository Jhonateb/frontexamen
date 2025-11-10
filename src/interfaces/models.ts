// src/interfaces/models.ts

export interface Mesa {
  id: number;
  numero_mesa: number;
  capacidad: number;
  ubicacion: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  puntos: number;
}

// --- AÑADE ESTO ---
// Nota que las relaciones se definen "anidadas"
// gracias al 'eager: true' que pusimos en el backend
export interface Reserva {
  id: number;
  fecha: string;
  hora: string;
  numero_personas: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  cliente: Cliente; // El objeto Cliente completo
  mesa: Mesa;     // El objeto Mesa completo
}