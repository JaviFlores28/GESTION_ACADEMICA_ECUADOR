
import baseDatos from '../Datos/BaseDatos';
import Usuario from '../Entidades/UsuarioEntidad';
import { v4 as uuidv4 } from 'uuid';
import Funciones from '../Modelos/Funciones';
import DetalleUsuarioProfesor from '../Entidades/DetalleUsuarioProfesorEntidad';
import DetalleUsuarioProfesorNegocio from './DetalleUsuarioProfesorNegocio';

class UsuarioNegocio {

  static async getUsuario(tipo: string): Promise<{ data: Usuario[], message: string }> {
    try {
      let sql = 'SELECT  `USR_ID` as id, `USR_DNI`, concat(`USR_NOM`,\' \' , `USR_NOM2`,\' \', `USR_APE`,\' \' , `USR_APE2`) as USR_NOM, `USR_CEL`, `USR_EMAIL`,`ESTADO` FROM usuario';
      if (tipo === 'R') {
        sql += ' where ROL_REPR=1'; // Added a space before AND
      } else if (tipo === 'P') {
        sql += ' where ROL_PRF=1';
      } else if (tipo === 'A') {
        sql += 'where ROL_ADMIN=1';
      } 
      const [rows] = await baseDatos.execute<any>(sql);
      return { data: rows as Usuario[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }

  static async getEnabledUsuario(tipo: string): Promise<{ data: Usuario[], message: string }> {
    try {
      let sql = 'SELECT * FROM usuario where Estado=1';
      if (tipo === 'R') {
        sql += ' AND ROL_REPR=1'; // Added a space before AND
      } else if (tipo === 'P') {
        sql += ' AND ROL_PRF=1';
      } else if (tipo === 'A') {
        sql += ' AND ROL_ADMIN=1';
      }
      const [rows] = await baseDatos.execute<any>(sql);
      return { data: rows as Usuario[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }

  static async searchById(id: String): Promise<{ data: Usuario | null; message: string }> {
    try {
      let sql = 'SELECT * FROM usuario WHERE USR_ID = ?';
      const [rows] = await baseDatos.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Usuario no encontrado');
      }
      let newUsuario = rows[0] as Usuario;
      //newUsuario.USR_PSWD = 'pswd';
      return { data: newUsuario, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }

  static async addUsuario(usuario: Usuario, detalle?: DetalleUsuarioProfesor): Promise<{ data: string | null, message: string }> {
    try {
      if (!usuario.isValid()) { //validar estructura del objeto
        throw new Error('Objeto de tipo Usuario no tiene la estructura esperada.');
      }
      usuario.USR_ID = uuidv4(); //asigna un identificador unico
      let sql = usuario.sqlInsert();
      const [result] = await baseDatos.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Usuario');
      } else {
        if (detalle) {
          detalle.USR_ID = usuario.USR_ID;
          const response = await DetalleUsuarioProfesorNegocio.addDetalleUsuarioProfesor(detalle);
          if (response.data === null) {
            await this.deleteUsuario(usuario.USR_ID)
            throw new Error(response.message);
          }
        }
      }
      return { data: usuario.USR_ID, message: 'Se creo correctamente' }; // Retorna el ID del Usuario
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }

  static async deleteUsuario(id: String): Promise<{ data: boolean, message: string }> {
    try {
      let sql = 'delete FROM usuario WHERE USR_ID = ?';
      const [result] = await baseDatos.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Usuario');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }

  static async updateUsuario(usuario: Usuario): Promise<{ data: boolean, message: string }> {
    try {
      if (!usuario.isValid()) { //validar estructura del objeto
        throw new Error('Objeto de tipo Usuario no tiene la estructura esperada.');
      }
      let sql = usuario.sqlUpdate();
      const [result] = await baseDatos.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Usuario');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }

  static async updatePswdUsuario(id: string, pswdOld: string, pswdNew: string): Promise<{ data: boolean, message: string }> {
    try {
      const { data: objeto, message } = await this.searchById(id);
      if (!objeto) {
        throw new Error(message);
      }

      let pswdUser = Funciones.decrypt(objeto.USR_PSWD);

      if (!this.pswdValid(pswdOld, pswdUser)) {
        throw new Error('Contraseña actual incorrecta.');
      }
      let sql = 'UPDATE usuario SET USR_PSWD=? WHERE USR_ID = ?';
      pswdNew = Funciones.encrypt(pswdNew);

      const [result] = await baseDatos.execute<any>(sql, [pswdNew, id]);

      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar el objeto de tipo Usuario.');
      }
      return { data: true, message: 'Campos actualizados para el objeto de tipo Usuario.' }; // Retorna true si se pudo actualizar

    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }

  static async validarUsuario(usuario: string, pswd: string): Promise<{ data: Usuario | null; message: string }> {
    try {
      let sql = 'SELECT * FROM usuario WHERE USUARIO = ?';
      const [rows] = await baseDatos.execute<any>(sql, [usuario]);

      if (rows.length <= 0) {
        throw new Error('Usuario no encontrado');
      }

      const pswdDecrypt = Funciones.decrypt(rows[0].USR_PSWD);

      if (!this.pswdValid(pswdDecrypt, pswd)) {
        throw new Error('Contraseña incorrecta');
      }
      let newUsuario = rows[0] as Usuario;
      newUsuario.USR_PSWD = 'pswd';
      return { data: newUsuario, message: 'Usuario Valido' }
    } catch (error: any) {
      return { data: null, message: error.message } // Devuelve una Promise rechazada con el error
    }
  }

  static pswdValid(pswdInit: string, pswdSent: string): boolean {
    if (pswdInit === pswdSent) {
      return true;
    }
    return false;
  }
}
export default UsuarioNegocio;