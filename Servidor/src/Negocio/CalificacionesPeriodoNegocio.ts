
import baseDatos from '../Datos/BaseDatos';
import Funciones from '../Modelos/Funciones';
import CalificacionesPeriodo from '../Entidades/CalificacionesPeriodoEntidad';
import { v4 as uuidv4 } from 'uuid';

class CalificacionesPeriodoNegocio {
  
  static async getCalificacionesPeriodo(): Promise<{ data: CalificacionesPeriodo[], message: string }> {
    try {
      let data = 'SELECT * FROM calificaciones_periodo';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as CalificacionesPeriodo[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async searchById(id: String): Promise<{ data: CalificacionesPeriodo | null; message: string }> {
    try {
      const [rows] = await baseDatos.execute<any>('SELECT * FROM calificaciones_periodo WHERE CAL_ID = ?', [id]);
      if (rows.length <= 0) {
        throw new Error('CalificacionesPeriodo no encontrado');
      }
      let newCalificacionesPeriodo = rows[0] as CalificacionesPeriodo;
      
      return { data: newCalificacionesPeriodo, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  } 
  
  static async addCalificacionesPeriodo(calificaciones_periodo: CalificacionesPeriodo): Promise<{ data: string | null, message: string }> {
    try {
      if (!calificaciones_periodo.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo CalificacionesPeriodo no tiene la estructura esperada.');
      }
      calificaciones_periodo.CAL_ID = uuidv4(); //asigna un identificador unico
      
      let data = calificaciones_periodo.sqlInsert();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar CalificacionesPeriodo');
      }
      return { data:calificaciones_periodo.CAL_ID, message: 'Se creo correctamente' }; // Retorna el ID del CalificacionesPeriodo
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async deleteCalificacionesPeriodo(id: String): Promise<{ data: boolean, message: string }> {
    try {
      const [result] = await baseDatos.execute<any>('delete FROM calificaciones_periodo WHERE CAL_ID = ?', [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo CalificacionesPeriodo');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateCalificacionesPeriodo(calificaciones_periodo: CalificacionesPeriodo): Promise<{ data: boolean, message: string }> {
    try {
      if (!calificaciones_periodo.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo CalificacionesPeriodo no tiene la estructura esperada.');
      }
      let data = calificaciones_periodo.sqlUpdate();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar CalificacionesPeriodo');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}
export default CalificacionesPeriodoNegocio;