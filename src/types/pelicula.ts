
 // GET: catálogo de películas
export interface Pelicula {
  id_pelicula: number;
  titulo: string;
  sinopsis: string;
  duracion_minutos: number;
  fecha_estreno: string;
  activo: boolean;
  // Solo los nombres de los archivos, no las imágenes
  // URL: {apiUrl}/files/pelicula/{nombre}
  imagenes: string[];
}

// Respuesta genérica para listados paginados
export interface RespuestaPaginada<T> {
  status: string;
  message?: string;
  data: T[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

// POST: datos para registrar una película
export interface CrearPelicula {
  titulo: string;
  sinopsis: string;
  duracion_minutos: number;
  fecha_estreno: string;
  activo: boolean;
}