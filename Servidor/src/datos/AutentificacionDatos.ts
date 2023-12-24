import BaseDatos from "../sistema/conexion/BaseDatos";
import Funciones from "../sistema/funciones/Funciones";
import { Autentificacion } from "../sistema/interfaces/Autentificacion";
import { Respuesta } from "../sistema/interfaces/Respuesta";

class AutentificacionDatos {
  static sqllogin: string = 'SELECT * FROM vista_usuario WHERE USUARIO = ?';
  static sqlUpdate2FA: string = 'UPDATE usuario SET HAS_2FA = 1 WHERE  USR_ID = ?';

  static async login(data: any): Promise<Respuesta> {
    try {      
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqllogin;
      const [rows] = await pool.execute<any>(sql, [data.USUARIO]);

      if (rows.length <= 0) {
        throw new Error('Usuario no encontrado');
      }

      const pswdDecrypt = Funciones.decrypt(rows[0].USR_PSWD);

      if (!Funciones.pswdValid(pswdDecrypt, data.USR_PSWD)) {
        throw new Error('Contraseña incorrecta');
      }
      let newUsuario = rows[0] as Autentificacion;
      newUsuario.USR_PSWD = 'pswd';
      return { response: true, data: newUsuario, message: 'Usuario Valido' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message }; // Devuelve una Promise rechazada con el error
    }
  }

  static async update2FA(USR_ID: string) {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlUpdate2FA;
      const [rows] = await pool.execute<any>(sql, [USR_ID]);
      if (rows.length <= 0) {
        throw new Error('No fue posible activar 2FA.');
      }
      return { response: true, data: true, message: 'Activación completa.' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message }; // Devuelve una Promise rechazada con el error
    }

  }
}
export default AutentificacionDatos;