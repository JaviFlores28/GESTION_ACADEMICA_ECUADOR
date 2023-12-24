import AutentificacionDatos from "../datos/AutentificacionDatos";
import { Respuesta } from "../sistema/interfaces/Respuesta";

class AutentificacionNegocio {
    static async login(data: any): Promise<Respuesta> {
        try {
            return AutentificacionDatos.login(data);
        } catch (error: any) {
            return { response: false, data: null, message: error.message }; // Devuelve una Promise rechazada con el error
        }
    }
    
    static async update2FA(USR_ID: string): Promise<Respuesta> {
        try {
            return AutentificacionDatos.update2FA(USR_ID);
        } catch (error: any) {
            return { response: false, data: null, message: error.message }; // Devuelve una Promise rechazada con el error
        }
    }
}

export default AutentificacionNegocio