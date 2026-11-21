

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container } from '@/components/common/container';
import { Armchair } from 'lucide-react';

type Butaca = {
    id: number;
    fila: string;
    columna: number;
    numero: number;
};

export function SeleccionButacasPage() {
    const { idFuncion } = useParams<{ idFuncion: string }>();
    const [seleccionados, setSeleccionados] = useState<Butaca[]>([]);

    // Sala con cinco filas y ocho butacas por fila.
    const filas = 'ABCDE'.split('');
    const columnas = 8;

    const butacas: Butaca[] = filas.flatMap((fila, indiceFila) =>
        Array.from({ length: columnas }, (_, indiceColumna) => ({
            id: indiceFila * columnas + indiceColumna + 1,
            fila,
            columna: indiceColumna + 1,
            numero: indiceColumna + 1,
        }))
    );

    function cambiarSeleccion(butaca: Butaca) {
        setSeleccionados((actuales) =>
            actuales.some((item) => item.id === butaca.id)
                ? actuales.filter((item) => item.id !== butaca.id)
                : [...actuales, butaca]
        );
    }

    return (
        <Container>
            <div className="mx-auto max-w-4xl py-8">
                <Link
                    to="/peliculas"
                    className="text-sm text-blue-600 hover:underline"
                >
                    ← Volver a películas
                </Link>

                <h1 className="mt-5 text-2xl font-bold">
                    Selección de butacas
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Función seleccionada: {idFuncion}
                </p>

                {/* Pantalla del cine */}
                <div className="mx-auto mt-8 mb-10 max-w-2xl">
                    <div className="h-2 rounded-full bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-md" />
                    <p className="mt-3 text-center text-sm font-semibold tracking-[0.3em] text-muted-foreground">
                        PANTALLA
                    </p>
                </div>

                {/* Mapa de butacas */}
                <div className="mx-auto max-w-xl overflow-x-auto rounded-2xl border border-border bg-muted/30 p-4 sm:p-6">
                    <div className="mx-auto min-w-[340px] max-w-md">
                        {/* Numeración de columnas */}
                        <div className="mb-3 grid grid-cols-[28px_repeat(8,minmax(0,1fr))] gap-1">
                            <span />
                            {Array.from({ length: columnas }, (_, i) => (
                                <span
                                    key={i}
                                    className="text-center text-xs font-medium text-muted-foreground"
                                >
                                    {i + 1}
                                </span>
                            ))}
                        </div>

                        {filas.map((fila) => (
                            <div
                                key={fila}
                                className="mb-3 grid grid-cols-[28px_repeat(8,minmax(0,1fr))] items-center gap-1"
                            >
                                <span className="text-center text-sm font-bold">
                                    {fila}
                                </span>

                                {butacas
                                    .filter((butaca) => butaca.fila === fila)
                                    .map((butaca) => {
                                        const seleccionado =
                                            seleccionados.some(
                                                (item) => item.id === butaca.id
                                            );

                                        return (
                                            <button
                                                key={butaca.id}
                                                type="button"
                                                onClick={() =>
                                                    cambiarSeleccion(butaca)
                                                }
                                                aria-pressed={seleccionado}
                                                aria-label={`Fila ${butaca.fila}, columna ${butaca.columna}, butaca ${butaca.numero}`}
                                                title={`Fila ${butaca.fila}, columna ${butaca.columna}, butaca ${butaca.numero}`}
                                                className={`flex flex-col items-center justify-center rounded-lg border p-1 transition-all hover:-translate-y-0.5 ${
                                                    seleccionado
                                                        ? 'border-blue-700 bg-blue-600 text-white shadow-md'
                                                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-100'
                                                }`}
                                            >
                                                <Armchair
                                                    size={25}
                                                    strokeWidth={2.2}
                                                />
                                                <span className="text-[10px] font-bold">
                                                    {butaca.numero}
                                                </span>
                                            </button>
                                        );
                                    })}
                            </div>
                        ))}
                    </div>

                    {/* Leyenda */}
                    <div className="mt-6 flex flex-wrap justify-center gap-5 border-t border-border pt-4 text-xs">
                        <div className="flex items-center gap-2">
                            <Armchair
                                size={20}
                                className="text-emerald-600"
                            />
                            <span>Disponible</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Armchair
                                size={20}
                                className="text-blue-600"
                            />
                            <span>Seleccionada</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Armchair size={20} className="text-red-600" />
                            <span>Ocupada</span>
                        </div>
                    </div>
                </div>

                {/* Detalle de selección */}
                <section className="mt-8 rounded-xl border border-border p-5">
                    <h2 className="text-lg font-bold">
                        Resumen de selección
                    </h2>

                    {seleccionados.length === 0 ? (
                        <p className="mt-3 text-sm text-muted-foreground">
                            Selecciona una o más butacas de la sala.
                        </p>
                    ) : (
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {seleccionados
                                .slice()
                                .sort(
                                    (a, b) =>
                                        a.fila.localeCompare(b.fila) ||
                                        a.columna - b.columna
                                )
                                .map((butaca) => (
                                    <div
                                        key={butaca.id}
                                        className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3"
                                    >
                                        <Armchair
                                            size={30}
                                            className="text-blue-600"
                                        />

                                        <div className="text-sm">
                                            <p className="font-bold">
                                                Butaca {butaca.fila}
                                                {butaca.numero}
                                            </p>
                                            <p>
                                                Fila: {butaca.fila}
                                            </p>
                                            <p>
                                                Columna: {butaca.columna}
                                            </p>
                                            <p>
                                                Número: {butaca.numero}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                cambiarSeleccion(butaca)
                                            }
                                            className="ml-auto text-xs font-semibold text-red-600 hover:underline"
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                ))}
                        </div>
                    )}

                    <div className="mt-5 border-t border-border pt-4">
                        <p className="font-semibold">
                            Butacas seleccionadas: {seleccionados.length}
                        </p>
                    </div>
                </section>
            </div>
        </Container>
    );
}