// Datos de una persona según base de datos
export interface Persona {
  id_persona: number;
  nombres: string;
  apellido: string;
  ci: string;
  telefono: string;
  email: string;
  edad: number;
}
// Parámetros para buscar y paginar personas
export interface BuscarPersonaParams {
  nombres?: string;
  apellidos?: string;
  pagina?: number;
  porPagina?: number;
}
// Estructura de respuesta del backend
export interface PersonasResponse {
  status: string;
  message: string;
  data: Persona[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
  timestamp: string;
}