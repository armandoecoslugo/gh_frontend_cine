
import { env } from "@/config/env";
import { http } from "@/lib/http";
import {
    Pelicula,
    RespuestaPaginada,
    CrearPelicula
} from "@/types/pelicula";

export const peliculaService = {
    // Listar películas
    async listarPeliculas(
        pagina = 1,
        porPagina = 20,
    ): Promise<RespuestaPaginada<Pelicula>> {
        const { data } = await http.get<RespuestaPaginada<Pelicula>>(
            '/peliculas',
            {
                params: { pagina, porPagina }
            }
        );
        console.log("Respuesta del listado de películas:", data);
        return data;
    },

    // Obtener detalle de una película
    async obtenerPelicula(id: number): Promise<Pelicula | undefined> {
        const respuesta = await this.listarPeliculas(1, 100);
        const pelicula = respuesta.data.find(
            (p) => p.id_pelicula === id
        );
        console.log("Detalle de la película consultada:", pelicula);
        return pelicula;
    },

    // Construir URL de la imagen
    urlImagen(nombreArchivo: string): string {
        return `${env.apiUrl}/files/pelicula/${nombreArchivo}`;
    },
    // Registrar película con imágenes
    async crear(
        pelicula: CrearPelicula,
        imagenes: File[]
    ) {
        const datos = new FormData();
        datos.append('titulo', pelicula.titulo);
        datos.append('sinopsis', pelicula.sinopsis);
        datos.append(
            'duracion_minutos',
            String(pelicula.duracion_minutos)
        );
        datos.append('fecha_estreno', pelicula.fecha_estreno);
        datos.append('activo', String(pelicula.activo));
        // Enviar cada imagen con el campo "imagenes"
        for (const imagen of imagenes) {
            datos.append('imagenes', imagen);
        }
        const { data } = await http.post('/peliculas', datos);
        console.log("Respuesta del registro de película:", data);
        return data;
    }
};
