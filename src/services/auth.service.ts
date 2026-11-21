import { http } from "@/lib/http";
import { Credenciales, RespuestaLogin } from "@/types/auth";



const CLAVE_TOKEN = 'cine_token';

export const authService = {
    async login(credenciales: Credenciales): Promise<string>{ 
        const {data} = await http.post<RespuestaLogin>('/auth/login', credenciales);
        console.log('>>> Respuesta data', data);
        
        const token = data?.data?.token;
        console.log('tokeeeeeen extraiddddooooo', data);
        if(!token) { throw new Error ('El servidor no devolvio un Token')};
        return token;
    },
    //guardar el token en el navegador 
    guardarToken(token: string){
        try{
            localStorage.setItem(CLAVE_TOKEN, token)
        } catch {
            console.log('No pudo guaradr el token en modo privado');
        }
    },
    obtenerToken(): string | null {
        try {
            return localStorage.getItem(CLAVE_TOKEN);
        } catch {
            return null;
        }
    },
    borrarToken(){
        try{
            localStorage.removeItem(CLAVE_TOKEN);
        } catch {
            
        }
    }



}