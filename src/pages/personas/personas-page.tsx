
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { personaService } from '@/services/persona.service';
import type { Persona } from '@/types/persona';
import { Container } from '@/components/common/container';

export function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para la paginación
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const cargarPersonas = async (
    filtros?: { nombres?: string; apellidos?: string },
    paginaSolicitada = 1,
  ) => {
    setCargando(true);
    setError(null);

    try {
      const nombresFiltro = filtros?.nombres?.trim();
      const apellidosFiltro = filtros?.apellidos?.trim();

      const hayFiltros = Boolean(nombresFiltro || apellidosFiltro);

      const respuesta = hayFiltros
        ? await personaService.buscarPersonas({
            nombres: nombresFiltro || undefined,
            apellidos: apellidosFiltro || undefined,
            pagina: paginaSolicitada,
            porPagina: 10,
          })
        : await personaService.listarPersonas(paginaSolicitada, 10);

      setPersonas(respuesta.data);
      setPagina(respuesta.pagina);
      setTotalPaginas(respuesta.totalPaginas);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Error al cargar las personas.',
      );
      setPersonas([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargarPersonas();
  }, []);

  const buscar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void cargarPersonas({ nombres, apellidos }, 1);
  };

  const limpiar = () => {
    setNombres('');
    setApellidos('');
    void cargarPersonas(undefined, 1);
  };

  const cambiarPagina = (nuevaPagina: number) => {
    void cargarPersonas({ nombres, apellidos }, nuevaPagina);
  };

  return (
    <Container>
      <div className="space-y-6 py-8">
        <h1 className="text-2xl font-bold">Listado de personas</h1>

        <form
          onSubmit={buscar}
          className="flex flex-wrap items-end gap-4"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="nombres">Nombres</label>
            <input
              id="nombres"
              type="text"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              placeholder="Buscar por nombres"
              className="rounded-md border px-3 py-2"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="apellidos">Apellidos</label>
            <input
              id="apellidos"
              type="text"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              placeholder="Buscar por apellidos"
              className="rounded-md border px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="rounded-md bg-primary px-4 py-2 text-white disabled:opacity-50"
          >
            Buscar
          </button>

          <button
            type="button"
            onClick={limpiar}
            disabled={cargando}
            className="rounded-md border px-4 py-2 disabled:opacity-50"
          >
            Limpiar
          </button>
        </form>

        {error && (
          <p className="text-red-600" role="alert">
            {error}
          </p>
        )}

        {cargando ? (
          <p>Cargando personas...</p>
        ) : error ? null : personas.length === 0 ? (
          <p>No se encontraron personas.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">ID</th>
                    <th className="p-3">Nombres</th>
                    <th className="p-3">Apellidos</th>
                    <th className="p-3">CI</th>
                    <th className="p-3">Teléfono</th>
                    <th className="p-3">Correo</th>
                    <th className="p-3">Edad</th>
                  </tr>
                </thead>

                <tbody>
                  {personas.map((persona) => (
                    <tr
                      key={persona.id_persona}
                      className="border-b"
                    >
                      <td className="p-3">{persona.id_persona}</td>
                      <td className="p-3">{persona.nombres}</td>
                      <td className="p-3">{persona.apellido}</td>
                      <td className="p-3">{persona.ci}</td>
                      <td className="p-3">{persona.telefono}</td>
                      <td className="p-3">{persona.email}</td>
                      <td className="p-3">{persona.edad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-center gap-4 py-4">
              <button
                type="button"
                onClick={() => cambiarPagina(pagina - 1)}
                disabled={pagina <= 1 || cargando}
                className="rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Anterior
              </button>

              <span>
                Página {pagina} de {totalPaginas}
              </span>

              <button
                type="button"
                onClick={() => cambiarPagina(pagina + 1)}
                disabled={pagina >= totalPaginas || cargando}
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
