
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container } from '@/components/common/container';
import { peliculaService } from '@/services/pelicula.service';
import type { CrearPelicula } from '@/types/pelicula';

export function PeliculaNuevaPage() {
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState('');
    const [sinopsis, setSinopsis] = useState('');
    const [duracion, setDuracion] = useState('');
    const [fechaEstreno, setFechaEstreno] = useState('');
    const [activo, setActivo] = useState(true);
    const [imagenes, setImagenes] = useState<File[]>([]);
    const [previsualizaciones, setPrevisualizaciones] = useState<string[]>([]);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const urls = imagenes.map((imagen) =>
            URL.createObjectURL(imagen)
        );

        setPrevisualizaciones(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagenes]);

    async function manejarEnvio(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const minutos = Number(duracion);

        if (!titulo.trim() || !sinopsis.trim() || !fechaEstreno || !duracion) {
            setError('Completa todos los campos obligatorios.');
            return;
        }

        if (!Number.isInteger(minutos) || minutos <= 0) {
            setError('La duración debe ser un número entero mayor que cero.');
            return;
        }

        if (imagenes.length > 5) {
            setError('Puedes seleccionar como máximo cinco imágenes.');
            return;
        }

        const formatosPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ];

        for (const imagen of imagenes) {
            if (!formatosPermitidos.includes(imagen.type)) {
                setError('Solo se permiten imágenes JPG, PNG o WEBP.');
                return;
            }

            if (imagen.size > 5 * 1024 * 1024) {
                setError('Cada imagen debe pesar como máximo 5 MiB.');
                return;
            }
        }

        const pelicula: CrearPelicula = {
            titulo: titulo.trim(),
            sinopsis: sinopsis.trim(),
            duracion_minutos: minutos,
            fecha_estreno: fechaEstreno,
            activo,
        };

        try {
            setEnviando(true);
            await peliculaService.crear(pelicula, imagenes);
            navigate('/peliculas');
        } catch (e: unknown) {
            let mensaje = 'No se pudo registrar la película.';
            if (axios.isAxiosError(e)) {
                const respuesta = e.response?.data;
                const mensajeServidor = respuesta?.message;
                if (typeof mensajeServidor === 'string') {
                    mensaje = mensajeServidor;
                } else if (Array.isArray(mensajeServidor)) {
                    mensaje = mensajeServidor.join(', ');
                } else if (e.message) {
                    mensaje = e.message;
                }
            } else if (e instanceof Error) {
                mensaje = e.message;
            }
            setError(mensaje);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <Container>
            <div className="space-y-6 py-8">
                <h1 className="text-2xl font-bold">
                    Registrar película
                </h1>

                <form
                    onSubmit={manejarEnvio}
                    className="max-w-2xl space-y-5"
                >
                    <div className="space-y-2">
                        <label htmlFor="titulo">Título</label>
                        <input
                            id="titulo"
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                            className="w-full rounded border p-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="sinopsis">Sinopsis</label>
                        <textarea
                            id="sinopsis"
                            value={sinopsis}
                            onChange={(e) => setSinopsis(e.target.value)}
                            required
                            rows={4}
                            className="w-full rounded border p-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="duracion">
                            Duración (minutos)
                        </label>
                        <input
                            id="duracion"
                            type="number"
                            min="1"
                            step="1"
                            value={duracion}
                            onChange={(e) => setDuracion(e.target.value)}
                            required
                            className="w-full rounded border p-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="fechaEstreno">
                            Fecha de estreno
                        </label>
                        <input
                            id="fechaEstreno"
                            type="date"
                            value={fechaEstreno}
                            onChange={(e) => setFechaEstreno(e.target.value)}
                            required
                            className="w-full rounded border p-2"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="activo"
                            type="checkbox"
                            checked={activo}
                            onChange={(e) => setActivo(e.target.checked)}
                        />
                        <label htmlFor="activo">Película activa</label>
                    </div>

                    {/* Selección de imágenes */}
                    <div className="space-y-3">
                        <label
                            htmlFor="imagenes"
                            className="block font-medium"
                        >
                            Imágenes de la película
                        </label>

                        <input
                            id="imagenes"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={(e) => {
                                const nuevasImagenes = Array.from(
                                    e.target.files ?? []
                                );

                                setImagenes((anteriores) => {
                                    const combinadas = [
                                        ...anteriores,
                                        ...nuevasImagenes,
                                    ];

                                    if (combinadas.length > 5) {
                                        setError(
                                            'Puedes seleccionar como máximo cinco imágenes.'
                                        );
                                        return anteriores;
                                    }

                                    setError(null);
                                    return combinadas;
                                });

                                e.target.value = '';
                            }}
                            className="hidden"
                        />

                        <label
                            htmlFor="imagenes"
                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white shadow transition hover:bg-blue-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>

                            Seleccionar imágenes
                        </label>

                        <p className="text-sm text-gray-500">
                            Formatos permitidos: JPG, PNG y WEBP.
                            Máximo 5 imágenes de 5 MiB cada una.
                        </p>

                        {imagenes.length > 0 && (
                            <p className="text-sm font-medium text-green-700">
                                {imagenes.length} de 5 imágenes seleccionadas
                            </p>
                        )}
                    </div>

                    {/* Vista previa de las imágenes */}
                    {previsualizaciones.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {previsualizaciones.map((url, indice) => (
                                <img
                                    key={url}
                                    src={url}
                                    alt={`Vista previa ${indice + 1}`}
                                    className="aspect-[2/3] w-full rounded object-cover"
                                />
                            ))}
                        </div>
                    )}

                    {error && (
                        <p role="alert" className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={enviando}
                            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                        >
                            {enviando
                                ? 'Registrando...'
                                : 'Registrar película'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/peliculas')}
                            className="rounded border px-4 py-2"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </Container>
    );
}
