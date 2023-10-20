
import baseDatos from '../Datos/BaseDatos';
import Funciones from '../Modelos/Funciones';
import Curso from '../Entidades/CursoEntidad';
import { v4 as uuidv4 } from 'uuid';

class CursoNegocio {
  
  static async getCurso(): Promise<{ data: Curso[], message: string }> {
    try {
      let data = 'SELECT * FROM curso';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as Curso[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async searchById(id: String): Promise<{ data: Curso | null; message: string }> {
    try {
      const [rows] = await baseDatos.execute<any>('SELECT * FROM curso WHERE CRS_ID = ?', [id]);
      if (rows.length <= 0) {
        throw new Error('Curso no encontrado');
      }
      let newCurso = rows[0] as Curso;
      
      return { data: newCurso, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  } 
  
  static async addCurso(curso: Curso): Promise<{ data: string | null, message: string }> {
    try {
      if (!curso.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Curso no tiene la estructura esperada.');
      }
      curso.CRS_ID = uuidv4(); //asigna un identificador unico
      
      let data = curso.sqlInsert();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Curso');
      }
      return { data:curso.CRS_ID, message: 'Se creo correctamente' }; // Retorna el ID del Curso
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async deleteCurso(id: String): Promise<{ data: boolean, message: string }> {
    try {
      const [result] = await baseDatos.execute<any>('delete FROM curso WHERE CRS_ID = ?', [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Curso');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateCurso(curso: Curso): Promise<{ data: boolean, message: string }> {
    try {
      if (!curso.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Curso no tiene la estructura esperada.');
      }
      let data = curso.sqlUpdate();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Curso');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}
export default CursoNegocio;