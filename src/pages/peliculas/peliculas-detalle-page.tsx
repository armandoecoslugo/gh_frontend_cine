
import { useEffect, useState } from 'react';
import { peliculaService } from '@/services/pelicula.service';
import { Pelicula } from '@/types/pelicula';
import { Container } from '@/components/common/container';
import { Link, useParams } from 'react-router-dom';
import { Funcion } from '@/types/cartelera';
import { carteleraService } from '@/services/cartelera.service';

export function PeliculasDellatePage() {
    const { id } = useParams<{ id: string }>();
    const idPelicula = Number(id);

    const [pelicula, setPelicula] = useState<Pelicula | undefined>();
    const [funciones, setFunciones] = useState<Funcion[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [indiceImagen, setIndiceImagen] = useState(0);

    useEffect(() => {
        setCargando(true);
        setError(null);
        setIndiceImagen(0);

        Promise.all([
            peliculaService.obtenerPelicula(idPelicula),
            carteleraService.listarFunciones(idPelicula),
        ])
            .then(([peliculaHallada, funcionesHalladas]) => {
                setPelicula(peliculaHallada);
                setFunciones(funcionesHalladas);
            })
            .catch((e: Error) => setError(e.message))
            .finally(() => setCargando(false));
    }, [idPelicula]);

    if (cargando) {
        return (
            <Container>
                <p>Cargando película...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <p>{error}</p>
            </Container>
        );
    }

    if (!pelicula) {
        return (
            <Container>
                <p>No se encontró esa película.</p>
                <Link to="/peliculas">Volver al listado</Link>
            </Container>
        );
    }

    const imagenes = pelicula.imagenes ?? [];
    const imagenActual = imagenes[indiceImagen];

    function cambiarImagen(direccion: number) {
        setIndiceImagen((actual) =>
            (actual + direccion + imagenes.length) % imagenes.length
        );
    }

    return (
        <Container>
            <div className="py-8">
                <div className="mt-6 grid gap-8 md:grid-cols-[280px_1fr]">
                    <div className="space-y-3">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
                            {imagenActual ? (
                                <img
                                    src={peliculaService.urlImagen(imagenActual)}
                                    alt={`${pelicula.titulo} - imagen ${indiceImagen + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                    Sin imagen
                                </div>
                            )}

                            {imagenes.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        aria-label="Imagen anterior"
                                        onClick={() => cambiarImagen(-1)}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-white hover:bg-black/80"
                                    >
                                        &#10094;
                                    </button>

                                    <button
                                        type="button"
                                        aria-label="Imagen siguiente"
                                        onClick={() => cambiarImagen(1)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-white hover:bg-black/80"
                                    >
                                        &#10095;
                                    </button>

                                    <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                                        {indiceImagen + 1} / {imagenes.length}
                                    </span>
                                </>
                            )}
                        </div>

                        <Link
                            to="/peliculas"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-700"
                        >
                            <span aria-hidden="true">←</span>
                            Volver a películas
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-mono">
                                {pelicula.titulo}
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Fecha de estreno: {pelicula.fecha_estreno}
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Duración: {pelicula.duracion_minutos} minutos
                            </p>
                        </div>

                        <p className="text-sm leading-relaxed text-secondary-foreground">
                            {pelicula.sinopsis}
                        </p>

                        <div>
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-mono">
                                Horarios
                            </h2>

                            {funciones.length === 0 ? (
                                <p>No hay funciones programadas</p>
                            ) : (
                                <div className="mt-3 flex flex-wrap gap-3">
                                    {funciones.map((funcion) => (
                                        <Link
                                            key={funcion.idFuncion}
                                            to={`/reservas/asientos/${funcion.idFuncion}`}
                                            className="block rounded-lg border border-border px-4 py-3 transition-colors hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <p className="text-base font-medium text-mono">
                                                Hora de inicio:{' '}
                                                {funcion.horaInicio.slice(0, 5)}
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Precio: {funcion.precio}
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Sala: {funcion.sala} - {funcion.tipoSala}
                                            </p>

                                            <p className="mt-2 text-sm font-semibold text-blue-600">
                                                Seleccionar butacas →
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}