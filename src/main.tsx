import './css/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

//import { carteleraService } from '@/services/cartelera.service';
//import { peliculaService } from './services/pelicula.service';

//carteleraService.listarFunciones().then(console.log)
//peliculaService.listarPeliculas().then(console.log);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
