
import baseDatos from '../Datos/BaseDatos';
import Asignatura from '../Entidades/AsignaturaEntidad';
import { v4 as uuidv4 } from 'uuid';


class AsignaturaNegocio {
  
  static async getAsignatura(): Promise<{ data: Asignatura[], message: string }> {
    try {
      let data = 'SELECT * FROM asignatura';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as Asignatura[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabledAsignatura(): Promise<{ data: Asignatura[], message: string }> {
    try {
      let data = 'SELECT * FROM asignatura where Estado=1';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as Asignatura[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async searchById(id: String): Promise<{ data: Asignatura | null; message: string }> {
    try {
      const [rows] = await baseDatos.execute<any>('SELECT * FROM asignatura WHERE ASG_ID = ?', [id]);
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
      
      let data = asignatura.sqlInsert();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
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
      const [result] = await baseDatos.execute<any>('delete FROM asignatura WHERE ASG_ID = ?', [id]);
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
      let data = asignatura.sqlUpdate();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
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