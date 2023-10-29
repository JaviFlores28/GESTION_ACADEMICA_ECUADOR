
import baseDatos from '../Datos/BaseDatos';
import DetalleUsuarioProfesor from '../Entidades/DetalleUsuarioProfesorEntidad';
import { v4 as uuidv4 } from 'uuid';


class DetalleUsuarioProfesorNegocio {
  
  static async getDetalleUsuarioProfesor(): Promise<{ data: DetalleUsuarioProfesor[], message: string }> {
    try {
      let sql = 'SELECT * FROM detalle_usuario_profesor';
      const [rows] = await baseDatos.execute<any>(sql);
      return { data: rows as DetalleUsuarioProfesor[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabledDetalleUsuarioProfesor(): Promise<{ data: DetalleUsuarioProfesor[], message: string }> {
    try {
      let sql = 'SELECT * FROM detalle_usuario_profesor where Estado=1';
      const [rows] = await baseDatos.execute<any>(sql);
      return { data: rows as DetalleUsuarioProfesor[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async searchById(id: String): Promise<{ data: DetalleUsuarioProfesor | null; message: string }> {
    try {
      let sql = 'SELECT * FROM detalle_usuario_profesor WHERE USR_ID = ?';
      const [rows] = await baseDatos.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo DetalleUsuarioProfesor no encontrado');
      }
      let newDetalleUsuarioProfesor = rows[0] as DetalleUsuarioProfesor;
      
      return { data: newDetalleUsuarioProfesor, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  } 
  
  static async addDetalleUsuarioProfesor(detalle_usuario_profesor: DetalleUsuarioProfesor): Promise<{ data: string | null, message: string }> {
    try {
      if (!detalle_usuario_profesor.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo DetalleUsuarioProfesor no tiene la estructura esperada.');
      }
      detalle_usuario_profesor.DTLL_PRF_ID = uuidv4(); //asigna un identificador unico
      let sql = detalle_usuario_profesor.sqlInsert();
      const [result] = await baseDatos.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar DetalleUsuarioProfesor');
      }
      return { data:detalle_usuario_profesor.DTLL_PRF_ID, message: 'Se creo correctamente' }; // Retorna el ID del DetalleUsuarioProfesor
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async deleteDetalleUsuarioProfesor(id: String): Promise<{ data: boolean, message: string }> {
    try {
      let sql = 'delete FROM detalle_usuario_profesor WHERE USR_ID = ?';
      const [result] = await baseDatos.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo DetalleUsuarioProfesor');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateDetalleUsuarioProfesor(detalle_usuario_profesor: DetalleUsuarioProfesor): Promise<{ data: boolean, message: string }> {
    try {
      if (!detalle_usuario_profesor.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo DetalleUsuarioProfesor no tiene la estructura esperada.');
      }
      let sql = detalle_usuario_profesor.sqlUpdate();
      const [result] = await baseDatos.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar DetalleUsuarioProfesor');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}
export default DetalleUsuarioProfesorNegocio;