import { AuthRouting } from '@/auth/auth-routing';
import { RequireAuth } from '@/auth/require-auth';
import { ErrorRouting } from '@/errors/error-routing';
import { Demo1Layout } from '@/layouts/demo1/layout';
import { PublicoLayout } from '@/layouts/publico/layout';
import { CarteleraPage } from '@/pages/cartelera/cartelera-page';
import { CineHomePage } from '@/pages/cine';
import { PeliculaNuevaPage } from '@/pages/peliculas/pelicula-nueva-page';
import { PeliculasAdminPage } from '@/pages/peliculas/peliculas-admin-page';
import { PeliculasDellatePage } from '@/pages/peliculas/peliculas-detalle-page';

import { PeliculasPage } from '@/pages/peliculas/peliculas-page';
import { PersonasPage } from '@/pages/personas/personas-page';
import { SeleccionButacasPage } from '@/pages/reservas/seleccion-butacas-page';
import { Navigate, Route, Routes } from 'react-router';


export function AppRoutingSetup() {
  return (
    <Routes>
     {/* PUBLICO */}
     
        <Route element={<PublicoLayout />}>
          <Route path="/peliculas" element={<PeliculasPage />} />
          <Route path="/peliculas/:id" element={<PeliculasDellatePage />} />
          <Route path="/cartelera" element={<CarteleraPage />} />
          <Route path="/reservas/asientos/:idFuncion" element={<SeleccionButacasPage />} />
        </Route>
     
      {/* PRIVADO */}
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          <Route path="/" element={<CineHomePage />} />
          <Route path="/cartelera" element={<CarteleraPage />} />
          <Route path="/panel/personas" element={<PersonasPage />} />
          <Route path="/panel/peliculas/nueva" element={<PeliculaNuevaPage />} />
          <Route path="/panel/peliculas" element={<PeliculasAdminPage />} />
        </Route>
      </Route>

      <Route path="error/*" element={<ErrorRouting />} />
      <Route path="auth/*" element={<AuthRouting />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
}
