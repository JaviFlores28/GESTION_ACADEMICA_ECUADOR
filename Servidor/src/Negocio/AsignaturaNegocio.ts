
import baseDatos from '../Datos/BaseDatos';
import Asignatura from '../Entidades/AsignaturaEntidad';
import { v4 as uuidv4 } from 'uuid';


class AsignaturaNegocio {
  
  static async getAsignatura(): Promise<{ data: Asignatura[], message: string }> {
    try {
      let sql = 'SELECT a.`ASG_ID` as id, a.`ASG_NOM`, a.`ASG_TIPO`, c.AREA_NOM as AREA, concat(b.CRS_NOM,\'-\' ,b.CRS_TIPO) CURSO, a.`ESTADO`  FROM asignatura as a JOIN curso as b ON a.CRS_ID = b.CRS_ID JOIN area as c ON a.AREA_ID = c.AREA_ID ORDER BY a.CRS_ID ASC;';
      const [rows] = await baseDatos.execute<any>(sql);
      return { data: rows as Asignatura[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabledAsignatura(): Promise<{ data: Asignatura[], message: string }> {
    try {
      let sql = 'SELECT * FROM asignatura where Estado=1';
      const [rows] = await baseDatos.execute<any>(sql);
      return { data: rows as Asignatura[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async searchById(id: String): Promise<{ data: Asignatura | null; message: string }> {
    try {
      let sql = 'SELECT * FROM asignatura WHERE ASG_ID = ?';
      const [rows] = await baseDatos.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Asignatura no encontrado');
      }
      let newAsignatura = rows[0] as Asignatura;
      
      return { data: newAsignatura, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  } 
  
  static async addAsignatura(asignatura: Asignatura): Promise<{ data: string | null, message: string }> {
    try {
      if (!asignatura.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Asignatura no tiene la estructura esperada.');
      }
      asignatura.ASG_ID = uuidv4(); //asigna un identificador unico
      let sql = asignatura.sqlInsert();
      const [result] = await baseDatos.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Asignatura');
      }
      return { data:asignatura.ASG_ID, message: 'Se creo correctamente' }; // Retorna el ID del Asignatura
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async deleteAsignatura(id: String): Promise<{ data: boolean, message: string }> {
    try {
      let sql = 'delete FROM asignatura WHERE ASG_ID = ?';
      const [result] = await baseDatos.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Asignatura');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateAsignatura(asignatura: Asignatura): Promise<{ data: boolean, message: string }> {
    try {
      if (!asignatura.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Asignatura no tiene la estructura esperada.');
      }
      let sql = asignatura.sqlUpdate();
      const [result] = await baseDatos.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Asignatura');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}
export default AsignaturaNegocio;