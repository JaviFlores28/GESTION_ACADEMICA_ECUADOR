
import baseDatos from '../Datos/BaseDatos';
import Funciones from '../Modelos/Funciones';
import Matricula from '../Entidades/MatriculaEntidad';
import { v4 as uuidv4 } from 'uuid';

class MatriculaNegocio {
  
  static async getMatricula(): Promise<{ data: Matricula[], message: string }> {
    try {
      let data = 'SELECT * FROM matricula';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as Matricula[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async searchById(id: String): Promise<{ data: Matricula | null; message: string }> {
    try {
      const [rows] = await baseDatos.execute<any>('SELECT * FROM matricula WHERE MTR_ID = ?', [id]);
      if (rows.length <= 0) {
        throw new Error('Matricula no encontrado');
      }
      let newMatricula = rows[0] as Matricula;
      
      return { data: newMatricula, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  } 
  
  static async addMatricula(matricula: Matricula): Promise<{ data: string | null, message: string }> {
    try {
      if (!matricula.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Matricula no tiene la estructura esperada.');
      }
      matricula.MTR_ID = uuidv4(); //asigna un identificador unico
      
      let data = matricula.sqlInsert();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Matricula');
      }
      return { data:matricula.MTR_ID, message: 'Se creo correctamente' }; // Retorna el ID del Matricula
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async deleteMatricula(id: String): Promise<{ data: boolean, message: string }> {
    try {
      const [result] = await baseDatos.execute<any>('delete FROM matricula WHERE MTR_ID = ?', [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Matricula');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateMatricula(matricula: Matricula): Promise<{ data: boolean, message: string }> {
    try {
      if (!matricula.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Matricula no tiene la estructura esperada.');
      }
      let data = matricula.sqlUpdate();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Matricula');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}
export default MatriculaNegocio;