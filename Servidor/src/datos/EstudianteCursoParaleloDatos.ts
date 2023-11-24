import AnioLectivoDatos from './AnioLectivoDatos';
import Funciones from '../sistema/funciones/Funciones';
import pool from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import EstudianteCursoParaleloEntidad from '../entidades/EstudianteCursoParaleloEntidad';
import { v4 as uuidv4 } from 'uuid';

class EstudianteCursoParaleloDatos {
  
  static sqlInsert: string = `INSERT INTO estudiante_curso_paralelo (EST_CRS_PRLL_ID, EST_CRS_ID, AL_ID, PRLL_ID, PASE, ESTADO, CREADOR_ID)VALUES(?, ?, ?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE estudiante_curso_paralelo SET EST_CRS_ID=?,AL_ID=?,PRLL_ID=?,PASE=?,ESTADO=? WHERE EST_CRS_PRLL_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE estudiante_curso_paralelo SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  EST_CRS_PRLL_ID IN';
  static sqlDelete: string = `DELETE FROM estudiante_curso_paralelo WHERE EST_CRS_PRLL_ID = ?`;
  static sqlSelect: string = `SELECT * FROM estudiante_curso_paralelo ORDER BY ESTADO DESC`;
  static sqlGetById: string = 'SELECT * FROM estudiante_curso_paralelo WHERE EST_CRS_PRLL_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM estudiante_curso_paralelo WHERE ESTADO = 1 ORDER BY ESTADO DESC';
  static sqlGetByParalelo: string = 'SELECT b.EST_CRS_PRLL_ID, a.* FROM vista_estudiante_curso as a JOIN estudiante_curso_paralelo as b ON a.EST_CRS_ID = b.EST_CRS_ID WHERE b.PRLL_ID =? AND b.ESTADO=1';
  
  static async insert(estudiante_curso_paralelo: EstudianteCursoParaleloEntidad ): Promise<Respuesta> {
    try {
      
      estudiante_curso_paralelo.EST_CRS_PRLL_ID = uuidv4(); 
      const newEstudianteCursoParalelo = new EstudianteCursoParaleloEntidad(estudiante_curso_paralelo.EST_CRS_PRLL_ID, estudiante_curso_paralelo.EST_CRS_ID, estudiante_curso_paralelo.AL_ID, estudiante_curso_paralelo.PRLL_ID, estudiante_curso_paralelo.PASE, estudiante_curso_paralelo.ESTADO, estudiante_curso_paralelo.CREADOR_ID);
      let sql =this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newEstudianteCursoParalelo.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar EstudianteCursoParalelo');
      }
      return {response: true, data:newEstudianteCursoParalelo.EST_CRS_PRLL_ID, message: 'Se creo correctamente' };
    } catch (error: any) {
      Funciones.logger.error(error.message);
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async update(estudiante_curso_paralelo: EstudianteCursoParaleloEntidad): Promise<Respuesta> {
    try {
      const newEstudianteCursoParalelo = new EstudianteCursoParaleloEntidad(estudiante_curso_paralelo.EST_CRS_PRLL_ID, estudiante_curso_paralelo.EST_CRS_ID, estudiante_curso_paralelo.AL_ID, estudiante_curso_paralelo.PRLL_ID, estudiante_curso_paralelo.PASE, estudiante_curso_paralelo.ESTADO, estudiante_curso_paralelo.CREADOR_ID);
      let sql =this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newEstudianteCursoParalelo.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar EstudianteCursoParalelo');
      }
      return {response: true, data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      Funciones.logger.error(error.message);
      return {response: false, data: null, message:error.message }; 
    }
  }
    
  static async updateEstado(ids: string[]): Promise<Respuesta> {
    try {
      // Crear una cadena de marcadores de posición para la cantidad de IDs en el array
      const placeholders = ids.map(() => '?').join(',');

      // Consulta SQL con cláusula IN y actualización del estado
      let sql = `${this.sqlUpdateEstado}(${placeholders});`;

      // Ejecutar la consulta con el array de valores
      const [result] = await pool.execute<any>(sql, ids);

      // Verificar si se afectaron filas
      if (result.affectedRows < 1) {
        throw new Error('No se pudo actualizar el estado');
      }

      return {response: true, data: true, message: 'Estado actualizado' };
    } catch (error: any) {
      Funciones.logger.error(error.message);
      return {response: false, data: null, message:error.message };
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlDelete;
      const [result] = await pool.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo EstudianteCursoParalelo');
      }
      return { response: true, data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      Funciones.logger.error(error.message);
      return { response: false, data: null, message:error.message }; 
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      let sql = this.sqlSelect;
      
      const [rows] = await pool.execute<any>(sql);
      return { response: true, data: rows as EstudianteCursoParaleloEntidad[], message: '' };
    } catch (error: any) {
      Funciones.logger.error(error.message);
      return { response: false, data: null, message:error.message }; 
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetById;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo EstudianteCursoParalelo no encontrado');
      }
      let newEstudianteCursoParalelo = rows[0] as EstudianteCursoParaleloEntidad;
      return {response: true, data: newEstudianteCursoParalelo, message: 'Encontrado' };
    } catch (error: any) {
      Funciones.logger.error(error.message);
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      let sql = this.sqlGetEnabled;
      
      const [rows] = await pool.execute<any>(sql);
      return {response: true, data: rows as EstudianteCursoParaleloEntidad[], message: '' };
    } catch (error: any) {
      Funciones.logger.error(error.message);
      return {response: false, data: null, message:error.message }; 
    }
  }
  
  static async insertMasivo(data:any): Promise<Respuesta> {
    try {
      const arrayIds = data.arrayIds;
      // Crear un array de valores para todos los registros utilizando map
      const valores = arrayIds.map((id: any) => [
        uuidv4(),
        id,
        data.AL_ID, data.PRLL_ID, data.PASE, data.ESTADO, data.CREADOR_ID
      ]);      
      // Crear una cadena de marcadores de posición y una cadena de campos
      const placeholders = valores
        .map((fila: string | any[]) => `(${Array.from({ length: fila.length }, () => '?').join(',')})`)
        .join(',');

      const campos = ['EST_CRS_PRLL_ID','EST_CRS_ID','AL_ID','PRLL_ID','PASE','ESTADO','CREADOR_ID'].join(',');

      // Consulta SQL con la cláusula INSERT INTO y VALUES
      const sql = `INSERT INTO estudiante_curso_paralelo (${campos}) VALUES ${placeholders};`;

      // Ejecutar la consulta con el array de valores
      const [result] = await pool.execute<any>(sql, valores.flat());

      // Verificar si se afectaron filas
      if (result.affectedRows < 1) {
        throw new Error('No se pudieron insertar las matrículas');
      }

      return {response: true, data: true, message: 'Matrículas insertadas correctamente' };
    } catch (error: any) {      
      Funciones.logger.error(error.message);
      return {response: false, data: false, message:error.message };
    }
  }
  static async getByParalelo(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetByParalelo;
      const [rows] = await pool.execute<any>(sql, [id]);
      return { response: true, data: rows as EstudianteCursoParaleloEntidad[], message: '' };
    } catch (error: any) {
      Funciones.logger.error(error.message);
      return {response: false, data: null, message:error.message }; 
    }
  }
}
export default EstudianteCursoParaleloDatos;
