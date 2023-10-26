
import baseDatos from '../Datos/BaseDatos';
import Usuario from '../Entidades/UsuarioEntidad';
import { v4 as uuidv4 } from 'uuid';
import Funciones from '../Modelos/Funciones';

class UsuarioNegocio {
  
  static async getUsuario(): Promise<{ data: Usuario[], message: string }> {
    try {
      let data = 'SELECT * FROM usuario';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as Usuario[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabledUsuario(): Promise<{ data: Usuario[], message: string }> {
    try {
      let data = 'SELECT * FROM usuario where Estado=1';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as Usuario[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async searchById(id: String): Promise<{ data: Usuario | null; message: string }> {
    try {
      const [rows] = await baseDatos.execute<any>('SELECT * FROM usuario WHERE USR_ID = ?', [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Usuario no encontrado');
      }
      let newUsuario = rows[0] as Usuario;
      newUsuario.USR_PSWD = 'pswd';
      return { data: newUsuario, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  } 
  
  static async addUsuario(usuario: Usuario): Promise<{ data: string | null, message: string }> {
    try {
      if (!usuario.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Usuario no tiene la estructura esperada.');
      }
      usuario.USR_ID = uuidv4(); //asigna un identificador unico
      usuario.USR_PSWD = Funciones.encrypt(usuario.USR_PSWD); // cifra la contraseña en caso de ser usuario
      let data = usuario.sqlInsert();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Usuario');
      }
      return { data:usuario.USR_ID, message: 'Se creo correctamente' }; // Retorna el ID del Usuario
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async deleteUsuario(id: String): Promise<{ data: boolean, message: string }> {
    try {
      const [result] = await baseDatos.execute<any>('delete FROM usuario WHERE USR_ID = ?', [id]);
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
      if (!usuario.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Usuario no tiene la estructura esperada.');
      }
      let data = usuario.sqlUpdate();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
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
      let data = 'UPDATE usuario SET USR_PSWD=? WHERE USR_ID = ?';
      pswdNew = Funciones.encrypt(pswdNew);

      const [result] = await baseDatos.execute<any>(data, [pswdNew, id]);

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
      const [rows] = await baseDatos.execute<any>('SELECT * FROM usuario WHERE USUARIO = ?', [usuario]);

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