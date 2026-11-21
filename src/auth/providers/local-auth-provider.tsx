import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { AuthContext } from '@/auth/context/auth-context';
import { UsuarioSesion } from '@/types/auth';
import { authService } from '@/services/auth.service';
import { estaVencido, leerToken } from '@/lib/jwt';

/**
 * Proveedor de sesion LOCAL, de practica.
 *
 * No habla con ningun servidor: compara contra un usuario escrito aqui abajo.
 * Sirve para ver funcionando el formulario, las rutas protegidas y el cerrar
 * sesion sin depender todavia de una API.
 *
 * Es temporal a proposito. Cuando toque conectar el backend, lo unico que
 * cambia es el contenido de `login`: en vez de comparar con USUARIO_DEMO,
 * hara una peticion y guardara lo que responda. El resto de la aplicacion
 * (RequireAuth, la cabecera, el menu) no se entera del cambio.
 */

/*const USUARIO_DEMO = {
  usuario: 'demo',
  contrasena: 'demo123',
};*/

export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UsuarioSesion | undefined>();

  const login = useCallback(async (usuario: string, contrasenia: string) => {

    const token = await authService.login({usuario, contrasenia});
    const payload = leerToken(token);

    if(!payload) {
      throw new Error('El token recibido no se pudo leer');
    }

    authService.guardarToken(token);
    const sesion = {
      id: payload.id,
      usuario: payload.usuario,
      roles: payload.roles,
    }
    setUser(sesion);
  }, []);

  const tieneRol = useCallback(
    (...roles: string[]): boolean => roles.some((rol): boolean | undefined => user?.roles.includes(rol)),
    [user]
  )

  const logout = useCallback(() =>{
    authService.borrarToken();
    setUser(undefined);
  }, []);



  //para no perder el token al recargar el navegador con F5
  useEffect(() => {
    const token = authService.obtenerToken();
    const payload = token? leerToken(token): null;
    if(payload && !estaVencido(payload)){
      setUser({
        id: payload.id,
        usuario: payload.usuario,
        roles: payload.roles,
      });
      console.log('>>> sesion restaurada tras F5: ', payload.usuario);
    }
    else if (token){
      authService.borrarToken();
    }
    setLoading(false);
  }, [])



  return (
    <AuthContext.Provider
      value={{
        loading,
        isAuthenticated: user !== undefined,
        user,
        login,
        logout,
        tieneRol,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
