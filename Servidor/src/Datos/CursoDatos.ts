
import pool from '../System/Conexion/BaseDatos';
import { Respuesta } from '../System/Interfaces/Respuesta';
import CursoEntidad from '../Entidades/CursoEntidad';
import { v4 as uuidv4 } from 'uuid';

class CursoDatos {

  static sqlInsert: string = `INSERT INTO curso (CRS_ID, CRS_NOM, CRS_TIPO, CRS_ORDEN, ESTADO, CREADOR_ID)VALUES(?, ?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE curso SET CRS_NOM=?,CRS_TIPO=?,CRS_ORDEN=?,ESTADO=? WHERE CRS_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE curso SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  CRS_ID IN';
  static sqlDelete: string = `DELETE FROM curso WHERE CRS_ID = ?`;
  static sqlSelect: string = `SELECT * FROM curso`;
  static sqlGetById: string = 'SELECT * FROM curso WHERE CRS_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM curso WHERE ESTADO = 1';
  
  
  static async insert(curso: CursoEntidad ): Promise<Respuesta> {
    try {
      curso.CRS_ID = uuidv4(); //asigna un identificador unico
      
      const newCurso = new CursoEntidad(curso.CRS_ID, curso.CRS_NOM, curso.CRS_TIPO, curso.CRS_ORDEN, curso.ESTADO, curso.CREADOR_ID);

      let sql =this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newCurso.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Curso');
      }
      return {response: true, data:newCurso.CRS_ID, message: 'Se creo correctamente' }; // Retorna el ID del Curso
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async update(curso: CursoEntidad): Promise<Respuesta> {
    try {
      const newCurso = new CursoEntidad(curso.CRS_ID, curso.CRS_NOM, curso.CRS_TIPO, curso.CRS_ORDEN, curso.ESTADO, curso.CREADOR_ID);
      let sql =this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newCurso.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Curso');
      }
      return {response: true, data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
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
      return {response: false, data: null, message: error.message };
    }
  }
  
  static async delete(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlDelete;
      const [result] = await pool.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Curso');
      }
      return { response: true, data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getAll(): Promise<Respuesta> {
    try {
      let sql = this.sqlSelect;
      
      const [rows] = await pool.execute<any>(sql);
      return { response: true, data: rows as CursoEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetById;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Curso no encontrado');
      }
      let newCurso = rows[0] as CursoEntidad;
      return {response: true, data: newCurso, message: 'Encontrado' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      let sql = this.sqlGetEnabled;
      

      const [rows] = await pool.execute<any>(sql);
      return {response: false, data: rows as CursoEntidad[], message: '' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  


}
export default CursoDatos;
