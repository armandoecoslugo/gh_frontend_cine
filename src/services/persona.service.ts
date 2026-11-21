
import { http } from '@/lib/http';
import type {
  BuscarPersonaParams,
  PersonasResponse,
} from '@/types/persona';

export const personaService = {
  // Listar personas con paginación
  async listarPersonas(
    pagina = 1,
    porPagina = 10,
  ): Promise<PersonasResponse> {
    const { data } = await http.get<PersonasResponse>('/persona', {
      params: { pagina, porPagina },
    });
    console.log('Endpoint: listado de personas');
    console.log('Página solicitada:', pagina);
    console.log('Respuesta del backend:', data);
    console.log('Personas retornadas:', data.data);
    return data;
  },

  // Buscar personas por nombres o apellidos
  async buscarPersonas(
    params: BuscarPersonaParams,
  ): Promise<PersonasResponse> {
    const { data } = await http.get<PersonasResponse>('/persona/buscar', {
      params,
    });
    console.log('Endpoint: búsqueda de personas');
    console.log('Parámetros de búsqueda:', params);
    console.log('Respuesta del backend:', data);
    console.log('Personas encontradas:', data.data);
    return data;
  },
};
