import { PayloadToken } from "@/types/auth";





export function leerToken(token: string): PayloadToken | null {
    try{
        const contenido = token.split('.')[1];
        if(!contenido) return null;

        const base64 = contenido.replace(/-/g, '+').replace(/_/g, '/');

        const bytes = Uint8Array.from(atob(base64), (c): number => c.charCodeAt(0));
        const json = new TextDecoder().decode(bytes);

        const payload = JSON.parse(json) as PayloadToken;
        console.log('>>> payload del token', payload);
        return payload;
    } catch {
        return null;
    }
}

export function estaVencido(payload: PayloadToken | null): boolean {
    if (!payload?.exp) return false;
    return payload.exp * 1000 <= Date.now();
}