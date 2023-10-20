
import baseDatos from '../Datos/BaseDatos';
import Funciones from '../Modelos/Funciones';
import CalificacionesParciales from '../Entidades/CalificacionesParcialesEntidad';
import { v4 as uuidv4 } from 'uuid';

class CalificacionesParcialesNegocio {
  
  static async getCalificacionesParciales(): Promise<{ data: CalificacionesParciales[], message: string }> {
    try {
      let data = 'SELECT * FROM calificaciones_parciales';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as CalificacionesParciales[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async searchById(id: String): Promise<{ data: CalificacionesParciales | null; message: string }> {
    try {
      const [rows] = await baseDatos.execute<any>('SELECT * FROM calificaciones_parciales WHERE CAL_ID = ?', [id]);
      if (rows.length <= 0) {
        throw new Error('CalificacionesParciales no encontrado');
      }
      let newCalificacionesParciales = rows[0] as CalificacionesParciales;
      
      return { data: newCalificacionesParciales, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  } 
  
  static async addCalificacionesParciales(calificaciones_parciales: CalificacionesParciales): Promise<{ data: string | null, message: string }> {
    try {
      if (!calificaciones_parciales.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo CalificacionesParciales no tiene la estructura esperada.');
      }
      calificaciones_parciales.CAL_ID = uuidv4(); //asigna un identificador unico
      
      let data = calificaciones_parciales.sqlInsert();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar CalificacionesParciales');
      }
      return { data:calificaciones_parciales.CAL_ID, message: 'Se creo correctamente' }; // Retorna el ID del CalificacionesParciales
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async deleteCalificacionesParciales(id: String): Promise<{ data: boolean, message: string }> {
    try {
      const [result] = await baseDatos.execute<any>('delete FROM calificaciones_parciales WHERE CAL_ID = ?', [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo CalificacionesParciales');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateCalificacionesParciales(calificaciones_parciales: CalificacionesParciales): Promise<{ data: boolean, message: string }> {
    try {
      if (!calificaciones_parciales.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo CalificacionesParciales no tiene la estructura esperada.');
      }
      let data = calificaciones_parciales.sqlUpdate();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar CalificacionesParciales');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}
export default CalificacionesParcialesNegocio;