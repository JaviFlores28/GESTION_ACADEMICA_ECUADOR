
import baseDatos from '../Datos/BaseDatos';
import Profesor from '../Entidades/ProfesorEntidad';
import { v4 as uuidv4 } from 'uuid';


class ProfesorNegocio {
  
  static async getProfesor(): Promise<{ data: Profesor[], message: string }> {
    try {
      let data = 'SELECT * FROM profesor';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as Profesor[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabledProfesor(): Promise<{ data: Profesor[], message: string }> {
    try {
      let data = 'SELECT * FROM profesor where Estado=1';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as Profesor[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async searchById(id: String): Promise<{ data: Profesor | null; message: string }> {
    try {
      const [rows] = await baseDatos.execute<any>('SELECT * FROM profesor WHERE PRF_ID = ?', [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Profesor no encontrado');
      }
      let newProfesor = rows[0] as Profesor;
      
      return { data: newProfesor, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  } 
  
  static async addProfesor(profesor: Profesor): Promise<{ data: string | null, message: string }> {
    try {
      if (!profesor.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Profesor no tiene la estructura esperada.');
      }
      profesor.PRF_ID = uuidv4(); //asigna un identificador unico
      
      let data = profesor.sqlInsert();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Profesor');
      }
      return { data:profesor.PRF_ID, message: 'Se creo correctamente' }; // Retorna el ID del Profesor
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async deleteProfesor(id: String): Promise<{ data: boolean, message: string }> {
    try {
      const [result] = await baseDatos.execute<any>('delete FROM profesor WHERE PRF_ID = ?', [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Profesor');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateProfesor(profesor: Profesor): Promise<{ data: boolean, message: string }> {
    try {
      if (!profesor.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Profesor no tiene la estructura esperada.');
      }
      let data = profesor.sqlUpdate();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Profesor');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}
export default ProfesorNegocio;