
import { useEffect, useState } from 'react';
import { peliculaService } from '@/services/pelicula.service';
import { Pelicula } from '@/types/pelicula';
import { Container } from '@/components/common/container';
import { Link } from 'react-router-dom';

function formatearDuracion(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;

    return horas > 0 ? `${horas}h ${resto}m` : `${resto}m`;
}

export function PeliculasPage() {
    const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [indicesImagen, setIndicesImagen] = useState<Record<number, number>>({});

    useEffect(() => {
        peliculaService.listarPeliculas()
            .then((respuesta) => setPeliculas(respuesta.data))
            .catch((e: Error) => setError(e.message))
            .finally(() => setCargando(false));
    }, []);

    function cambiarImagen(idPelicula: number, totalImagenes: number, direccion: number) {
        setIndicesImagen((anteriores) => {
            const actual = anteriores[idPelicula] ?? 0;

            return {
                ...anteriores,
                [idPelicula]: (actual + direccion + totalImagenes) % totalImagenes,
            };
        });
    }

    if (cargando) {
        return (
            <Container>
                <p>Cargando películas...</p>
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

    if (peliculas.length === 0) {
        return (
            <Container>
                <p>No hay películas en la cartelera.</p>
            </Container>
        );
    }

    return (
        <Container>
            <div className="space-y-6 py-8">
                <h1 className="text-2xl font-bold">Películas</h1>

                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                    {peliculas.map((pelicula) => {
                        const imagenes = pelicula.imagenes ?? [];
                        const indiceActual = indicesImagen[pelicula.id_pelicula] ?? 0;
                        const imagenActual = imagenes[indiceActual];

                        return (
                            <article key={pelicula.id_pelicula} className="group">
                                <div className="relative">
                                    <Link to={`/peliculas/${pelicula.id_pelicula}`}>
                                        <div className="aspect-[2/3] overflow-hidden rounded-lg bg-muted">
                                            {imagenActual ? (
                                                <img
                                                    src={peliculaService.urlImagen(imagenActual)}
                                                    alt={`${pelicula.titulo} - imagen ${indiceActual + 1}`}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted-foreground">
                                                    Sin imagen
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    {imagenes.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                aria-label="Imagen anterior"
                                                onClick={() =>
                                                    cambiarImagen(
                                                        pelicula.id_pelicula,
                                                        imagenes.length,
                                                        -1
                                                    )
                                                }
                                                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-white hover:bg-black/80"
                                            >
                                                &#10094;
                                            </button>

                                            <button
                                                type="button"
                                                aria-label="Imagen siguiente"
                                                onClick={() =>
                                                    cambiarImagen(
                                                        pelicula.id_pelicula,
                                                        imagenes.length,
                                                        1
                                                    )
                                                }
                                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-white hover:bg-black/80"
                                            >
                                                &#10095;
                                            </button>

                                            <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                                                {indiceActual + 1} / {imagenes.length}
                                            </span>
                                        </>
                                    )}
                                </div>

                                <Link to={`/peliculas/${pelicula.id_pelicula}`}>
                                    <h2 className="mt-3 text-sm font-medium leading-tight">
                                        {pelicula.titulo}
                                    </h2>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatearDuracion(pelicula.duracion_minutos)}
                                    </p>
                                </Link>
                            </article>
                        );
                    })}
                </div>
            </div>
        </Container>
    );
}
