
import pool from '../System/Conexion/BaseDatos';
import { Respuesta } from '../System/Interfaces/Respuesta';
import VistaEstudianteEntidad from '../Entidades/VistaEstudianteEntidad';
import { v4 as uuidv4 } from 'uuid';

class VistaEstudianteDatos {

  static sqlInsert: string = `INSERT INTO vista_estudiante (ID, EST_DNI, EST_NOM, REPRESENTANTE, ESTADO)VALUES(?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE vista_estudiante SET ID=?,EST_DNI=?,EST_NOM=?,REPRESENTANTE=?,ESTADO=? WHERE ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE vista_estudiante SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  ID IN';
  static sqlDelete: string = `DELETE FROM vista_estudiante WHERE ID = ?`;
  static sqlSelect: string = `SELECT * FROM vista_estudiante`;
  static sqlGetById: string = 'SELECT * FROM vista_estudiante WHERE ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM vista_estudiante WHERE ESTADO = 1';
  
  
  static async insert(vista_estudiante: VistaEstudianteEntidad ): Promise<Respuesta> {
    try {
      vista_estudiante.ID = uuidv4(); //asigna un identificador unico
      
      const newVistaEstudiante = new VistaEstudianteEntidad(vista_estudiante.ID, vista_estudiante.EST_DNI, vista_estudiante.EST_NOM, vista_estudiante.REPRESENTANTE, vista_estudiante.ESTADO);

      let sql =this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newVistaEstudiante.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar VistaEstudiante');
      }
      return {response: true, data:newVistaEstudiante.ID, message: 'Se creo correctamente' }; // Retorna el ID del VistaEstudiante
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async update(vista_estudiante: VistaEstudianteEntidad): Promise<Respuesta> {
    try {
      const newVistaEstudiante = new VistaEstudianteEntidad(vista_estudiante.ID, vista_estudiante.EST_DNI, vista_estudiante.EST_NOM, vista_estudiante.REPRESENTANTE, vista_estudiante.ESTADO);
      let sql =this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newVistaEstudiante.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar VistaEstudiante');
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
        throw new Error('No se pudo eliminar el objeto de tipo VistaEstudiante');
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
      return { response: true, data: rows as VistaEstudianteEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetById;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo VistaEstudiante no encontrado');
      }
      let newVistaEstudiante = rows[0] as VistaEstudianteEntidad;
      return {response: true, data: newVistaEstudiante, message: 'Encontrado' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      let sql = this.sqlGetEnabled;
      

      const [rows] = await pool.execute<any>(sql);
      return {response: true, data: rows as VistaEstudianteEntidad[], message: '' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  


}
export default VistaEstudianteDatos;
