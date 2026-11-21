
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { peliculaService } from '@/services/pelicula.service';
import { Pelicula } from '@/types/pelicula';
import { Container } from '@/components/common/container';

function formatearDuracion(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;

    return horas > 0 ? `${horas}h ${resto}m` : `${resto}m`;
}

export function PeliculasAdminPage() {
    const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [aviso, setAviso] = useState<string | null>(null);

    useEffect(() => {
        peliculaService.listarPeliculas()
            .then((respuesta) => setPeliculas(respuesta.data))
            .catch((e: Error) => setError(e.message))
            .finally(() => setCargando(false));
    }, []);

    return (
        <Container>
            <div className="space-y-6 py-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Gestión de películas
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Administra las películas registradas en el cine.
                        </p>
                    </div>

                    <Link
                        to="/panel/peliculas/nueva"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                        <span>+</span>
                        Registrar película
                    </Link>
                </div>

                <div className="rounded-xl border border-border p-4">
                    <p className="text-sm text-muted-foreground">
                        Total de películas registradas
                    </p>
                    <p className="mt-1 text-3xl font-bold">
                        {cargando ? '...' : peliculas.length}
                    </p>
                </div>

                {aviso && (
                    <div
                        role="status"
                        className="flex items-center justify-between gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800"
                    >
                        <span>{aviso}</span>
                        <button
                            type="button"
                            onClick={() => setAviso(null)}
                            className="font-semibold underline"
                        >
                            Cerrar
                        </button>
                    </div>
                )}

                {cargando && (
                    <p className="py-8 text-center">
                        Cargando películas...
                    </p>
                )}

                {error && (
                    <div className="rounded-lg border border-red-300 p-4 text-sm text-red-600">
                        No se pudieron cargar las películas: {error}
                    </div>
                )}

                {!cargando && !error && peliculas.length === 0 && (
                    <div className="rounded-lg border border-border p-8 text-center">
                        <p>No hay películas registradas.</p>
                        <Link
                            to="/panel/peliculas/nueva"
                            className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
                        >
                            Registrar la primera película
                        </Link>
                    </div>
                )}

                {!cargando && !error && peliculas.length > 0 && (
                    <div className="overflow-x-auto rounded-xl border border-border">
                        <table className="w-full min-w-[750px] text-left text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-3">Película</th>
                                    <th className="px-4 py-3">Duración</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {peliculas.map((pelicula) => (
                                    <tr
                                        key={pelicula.id_pelicula}
                                        className="border-t border-border"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {pelicula.imagenes?.[0] ? (
                                                    <img
                                                        src={peliculaService.urlImagen(
                                                            pelicula.imagenes[0]
                                                        )}
                                                        alt={pelicula.titulo}
                                                        className="h-16 w-12 rounded object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="flex h-16 w-12 items-center justify-center rounded bg-muted text-xs">
                                                        Sin imagen
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="font-semibold">
                                                        {pelicula.titulo}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        ID: {pelicula.id_pelicula}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            {formatearDuracion(
                                                pelicula.duracion_minutos
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                    pelicula.activo
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {pelicula.activo
                                                    ? 'Activa'
                                                    : 'Inactiva'}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {/* Ver detalle */}
                                                <Link
                                                    to={`/peliculas/${pelicula.id_pelicula}`}
                                                    title="Ver detalle"
                                                    aria-label={`Ver detalle de ${pelicula.titulo}`}
                                                    className="rounded-md border border-border p-2 transition-colors hover:bg-muted"
                                                >
                                                    <Eye size={18} />
                                                </Link>

                                                {/* Editar */}
                                                <button
                                                    type="button"
                                                    title="Editar película"
                                                    aria-label={`Editar ${pelicula.titulo}`}
                                                    onClick={() =>
                                                        setAviso(
                                                            `La edición de "${pelicula.titulo}" todavía no está implementada.`
                                                        )
                                                    }
                                                    className="rounded-md border border-blue-300 p-2 text-blue-700 transition-colors hover:bg-blue-50"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                {/* Eliminar */}
                                                <button
                                                    type="button"
                                                    title="Eliminar película"
                                                    aria-label={`Eliminar ${pelicula.titulo}`}
                                                    onClick={() =>
                                                        setAviso(
                                                            `La eliminación de "${pelicula.titulo}" todavía no está implementada. No se ha borrado ningún registro.`
                                                        )
                                                    }
                                                    className="rounded-md border border-red-300 p-2 text-red-700 transition-colors hover:bg-red-50"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Container>
    );
}
