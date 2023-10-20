
import baseDatos from '../Datos/BaseDatos';
import Funciones from '../Modelos/Funciones';
import AnioLectivo from '../Entidades/AnioLectivoEntidad';
import { v4 as uuidv4 } from 'uuid';

class AnioLectivoNegocio {
  
  static async getAnioLectivo(): Promise<{ data: AnioLectivo[], message: string }> {
    try {
      let data = 'SELECT * FROM anio_lectivo';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as AnioLectivo[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async searchById(id: String): Promise<{ data: AnioLectivo | null; message: string }> {
    try {
      const [rows] = await baseDatos.execute<any>('SELECT * FROM anio_lectivo WHERE AL_ID = ?', [id]);
      if (rows.length <= 0) {
        throw new Error('AnioLectivo no encontrado');
      }
      let newAnioLectivo = rows[0] as AnioLectivo;
      
      return { data: newAnioLectivo, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  } 
  
  static async addAnioLectivo(anio_lectivo: AnioLectivo): Promise<{ data: string | null, message: string }> {
    try {
      if (!anio_lectivo.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo AnioLectivo no tiene la estructura esperada.');
      }
      anio_lectivo.AL_ID = uuidv4(); //asigna un identificador unico
      
      let data = anio_lectivo.sqlInsert();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar AnioLectivo');
      }
      return { data:anio_lectivo.AL_ID, message: 'Se creo correctamente' }; // Retorna el ID del AnioLectivo
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async deleteAnioLectivo(id: String): Promise<{ data: boolean, message: string }> {
    try {
      const [result] = await baseDatos.execute<any>('delete FROM anio_lectivo WHERE AL_ID = ?', [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo AnioLectivo');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateAnioLectivo(anio_lectivo: AnioLectivo): Promise<{ data: boolean, message: string }> {
    try {
      if (!anio_lectivo.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo AnioLectivo no tiene la estructura esperada.');
      }
      let data = anio_lectivo.sqlUpdate();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar AnioLectivo');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}
export default AnioLectivoNegocio;