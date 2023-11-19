import Funciones from '../Default/Funciones/Funciones';
import UsuarioProfesorDatos from './UsuarioProfesorDatos';
import UsuarioProfesorEntidad from '../Entidades/UsuarioProfesorEntidad';
import pool from '../Default/Conexion/BaseDatos';
import { Respuesta } from '../Default/Interfaces/Respuesta';
import UsuarioEntidad from '../Entidades/UsuarioEntidad';
import { v4 as uuidv4 } from 'uuid';

class UsuarioDatos {
  static sqlInsert: string = `INSERT INTO usuario (USR_ID, USR_DNI, USR_NOM, USR_NOM2, USR_APE, USR_APE2, USR_DIR, USR_TEL, USR_CEL, USR_EMAIL, USR_FECH_NAC, USR_GEN, USUARIO, USR_PSWD, ROL_PRF, ROL_REPR, ROL_ADMIN, ESTADO)VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE usuario SET USR_DNI=?,USR_NOM=?,USR_NOM2=?,USR_APE=?,USR_APE2=?,USR_DIR=?,USR_TEL=?,USR_CEL=?,USR_EMAIL=?,USR_FECH_NAC=?,USR_GEN=?,ROL_PRF=?,ROL_REPR=?,ROL_ADMIN=?,ESTADO=? WHERE USR_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE usuario SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  USR_ID IN';
  static sqlDelete: string = `DELETE FROM usuario WHERE USR_ID = ?`;
  static sqlSelect: string = `SELECT * FROM vista_usuario `;
  static sqlGetById: string = 'SELECT * FROM usuario WHERE USR_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM vista_usuario WHERE ESTADO = 1';
  static sqlGetByUser: string = 'SELECT * FROM usuario WHERE USUARIO = ?'
  
  static async insert(usuario: UsuarioEntidad , detalle?: UsuarioProfesorEntidad): Promise<Respuesta> {
    try {
      usuario.USR_ID = uuidv4(); //asigna un identificador unico
      usuario.USUARIO = Funciones.crearUsuario(usuario.USR_DNI, usuario.USR_NOM, usuario.USR_NOM2, usuario.USR_APE);
  usuario.USR_PSWD = Funciones.encrypt(usuario.USR_DNI);
  
      const newUsuario = new UsuarioEntidad(usuario.USR_ID, usuario.USR_DNI, usuario.USR_NOM, usuario.USR_NOM2, usuario.USR_APE, usuario.USR_APE2, usuario.USR_DIR, usuario.USR_TEL, usuario.USR_CEL, usuario.USR_EMAIL, usuario.USR_FECH_NAC, usuario.USR_GEN, usuario.USUARIO, usuario.USR_PSWD, usuario.ROL_PRF, usuario.ROL_REPR, usuario.ROL_ADMIN, usuario.ESTADO);

      let sql =this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newUsuario.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Usuario');
      }else {
    if (detalle) {
      detalle.USR_ID = usuario.USR_ID;
      const response = await UsuarioProfesorDatos.insert(detalle);
      if (response.data === null) {
        await this.delete(usuario.USR_ID)
        throw new Error(response.message);
      }
    }
  }
      return {response: true, data:newUsuario.USR_ID, message: 'Se creo correctamente' }; // Retorna el ID del Usuario
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async update(usuario: UsuarioEntidad): Promise<Respuesta> {
    try {
      const newUsuario = new UsuarioEntidad(usuario.USR_ID, usuario.USR_DNI, usuario.USR_NOM, usuario.USR_NOM2, usuario.USR_APE, usuario.USR_APE2, usuario.USR_DIR, usuario.USR_TEL, usuario.USR_CEL, usuario.USR_EMAIL, usuario.USR_FECH_NAC, usuario.USR_GEN, usuario.USUARIO, usuario.USR_PSWD, usuario.ROL_PRF, usuario.ROL_REPR, usuario.ROL_ADMIN, usuario.ESTADO);
      let sql =this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newUsuario.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Usuario');
      }
      return {response: true, data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
    
  static async updateEstado(ids: string[]): Promise<Respuesta> {
    try {
      // Crear una cadena de marcadores de posición para la cantidad de IDs en el array
      const placeholders = ids.map(() => '?').join(',');

      // Consulta SQL con cláusula IN y actualización del estado
      let sql = `${this.sqlUpdateEstado}(${placeholders});`;

      // Ejecutar la consulta con el array de valores
      const [result] = await pool.execute<any>(sql, ids);

      // Verificar si se afectaron filas
      if (result.affectedRows < 1) {
        throw new Error('No se pudo actualizar el estado');
      }

      return {response: true, data: true, message: 'Estado actualizado' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message };
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlDelete;
      const [result] = await pool.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Usuario');
      }
      return { response: true, data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getAll(tipo: string): Promise<Respuesta> {
    try {
      let sql = this.sqlSelect;
      
    const userMapping = {
      'R': ' WHERE ROL_REPR=1',
      'P': ' WHERE ROL_PRF=1',
      'A': ' WHERE ROL_ADMIN=1'
    }as { [key: string]: string };
    const userClause = userMapping[tipo] || '';
    sql += userClause;
    
      const [rows] = await pool.execute<any>(sql);
      return { response: true, data: rows as UsuarioEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetById;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Usuario no encontrado');
      }
      let newUsuario = rows[0] as UsuarioEntidad;
      return {response: true, data: newUsuario, message: 'Encontrado' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabled(tipo: string): Promise<Respuesta> {
    try {
      let sql = this.sqlGetEnabled;
      
  const userMapping = {
    'R': ' AND ROL_REPR=1',
    'P': ' AND ROL_PRF=1',
    'A': ' AND ROL_ADMIN=1'
  }as { [key: string]: string };
  const userClause = userMapping[tipo] || '';
  sql += userClause;
  
      const [rows] = await pool.execute<any>(sql);
      return {response: true, data: rows as UsuarioEntidad[], message: '' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getByUser(usuario: string, pswd: string): Promise<Respuesta> {
    try {
      let sql = this.sqlGetByUser;
      const [rows] = await pool.execute<any>(sql, [usuario]);

      if (rows.length <= 0) {
        throw new Error('Usuario no encontrado');
      }

      const pswdDecrypt = Funciones.decrypt(rows[0].USR_PSWD);

      if (!Funciones.pswdValid(pswdDecrypt, pswd)) {
        throw new Error('Contraseña incorrecta');
      }
      let newUsuario = rows[0] as UsuarioEntidad;
      newUsuario.USR_PSWD = 'pswd';
      return {response: true, data: newUsuario, message: 'Usuario Valido' }
    } catch (error: any) {
      return { response: false, data: null, message: error.message } // Devuelve una Promise rechazada con el error
    }
  }


}
export default UsuarioDatos;
