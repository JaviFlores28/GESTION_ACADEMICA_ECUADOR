
import baseDatos from '../Datos/BaseDatos';
import ProfesorAsignaturaParalelo from '../Entidades/ProfesorAsignaturaParaleloEntidad';
import { v4 as uuidv4 } from 'uuid';


class ProfesorAsignaturaParaleloNegocio {
  
  static async getProfesorAsignaturaParalelo(): Promise<{ data: ProfesorAsignaturaParalelo[], message: string }> {
    try {
      let sql = 'SELECT * FROM profesor_asignatura_paralelo';
      const [rows] = await baseDatos.execute<any>(sql);
      return { data: rows as ProfesorAsignaturaParalelo[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabledProfesorAsignaturaParalelo(): Promise<{ data: ProfesorAsignaturaParalelo[], message: string }> {
    try {
      let sql = 'SELECT * FROM profesor_asignatura_paralelo where Estado=1';
      const [rows] = await baseDatos.execute<any>(sql);
      return { data: rows as ProfesorAsignaturaParalelo[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async searchById(id: String): Promise<{ data: ProfesorAsignaturaParalelo | null; message: string }> {
    try {
      let sql = 'SELECT * FROM profesor_asignatura_paralelo WHERE PRF_ASG_PRLL_ID = ?';
      const [rows] = await baseDatos.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo ProfesorAsignaturaParalelo no encontrado');
      }
      let newProfesorAsignaturaParalelo = rows[0] as ProfesorAsignaturaParalelo;
      
      return { data: newProfesorAsignaturaParalelo, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  } 
  
  static async addProfesorAsignaturaParalelo(profesor_asignatura_paralelo: ProfesorAsignaturaParalelo): Promise<{ data: string | null, message: string }> {
    try {
      if (!profesor_asignatura_paralelo.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo ProfesorAsignaturaParalelo no tiene la estructura esperada.');
      }
      profesor_asignatura_paralelo.PRF_ASG_PRLL_ID = uuidv4(); //asigna un identificador unico
      let sql = profesor_asignatura_paralelo.sqlInsert();
      const [result] = await baseDatos.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar ProfesorAsignaturaParalelo');
      }
      return { data:profesor_asignatura_paralelo.PRF_ASG_PRLL_ID, message: 'Se creo correctamente' }; // Retorna el ID del ProfesorAsignaturaParalelo
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async deleteProfesorAsignaturaParalelo(id: String): Promise<{ data: boolean, message: string }> {
    try {
      let sql = 'delete FROM profesor_asignatura_paralelo WHERE PRF_ASG_PRLL_ID = ?';
      const [result] = await baseDatos.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo ProfesorAsignaturaParalelo');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateProfesorAsignaturaParalelo(profesor_asignatura_paralelo: ProfesorAsignaturaParalelo): Promise<{ data: boolean, message: string }> {
    try {
      if (!profesor_asignatura_paralelo.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo ProfesorAsignaturaParalelo no tiene la estructura esperada.');
      }
      let sql = profesor_asignatura_paralelo.sqlUpdate();
      const [result] = await baseDatos.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar ProfesorAsignaturaParalelo');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}
export default ProfesorAsignaturaParaleloNegocio;