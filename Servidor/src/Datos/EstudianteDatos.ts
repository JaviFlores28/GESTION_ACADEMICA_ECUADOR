
import pool from '../Default/Conexion/BaseDatos';
import { Respuesta } from '../Default/Interfaces/Respuesta';
import EstudianteEntidad from '../Entidades/EstudianteEntidad';
import { v4 as uuidv4 } from 'uuid';

class EstudianteDatos {
  static sqlInsert: string = `INSERT INTO estudiante (EST_ID, EST_DNI, EST_NOM, EST_NOM2, EST_APE, EST_APE2, EST_FECH_NAC, EST_GEN, EST_PRV, EST_CAN, EST_PARR, EST_DIR, EST_NAC, EST_ETN, EST_NAC_ETN, EST_COM_ETN, EST_COD_ELE, EST_NEC_ASO_DIS, EST_NEC_NO_ASO_DIS, EST_ENF_CAT, EST_NUM_CONA, EST_INTE, EST_TV, EST_RAD, EST_PC, EST_CEL, REPR_ID, REL_EST_REP, ESTADO, CREADOR_ID)VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE estudiante SET EST_DNI=?,EST_NOM=?,EST_NOM2=?,EST_APE=?,EST_APE2=?,EST_FECH_NAC=?,EST_GEN=?,EST_PRV=?,EST_CAN=?,EST_PARR=?,EST_DIR=?,EST_NAC=?,EST_ETN=?,EST_NAC_ETN=?,EST_COM_ETN=?,EST_COD_ELE=?,EST_NEC_ASO_DIS=?,EST_NEC_NO_ASO_DIS=?,EST_ENF_CAT=?,EST_NUM_CONA=?,EST_INTE=?,EST_TV=?,EST_RAD=?,EST_PC=?,EST_CEL=?,REPR_ID=?,REL_EST_REP=?,ESTADO=? WHERE EST_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE estudiante SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  EST_ID IN';
  static sqlDelete: string = `DELETE FROM estudiante WHERE EST_ID = ?`;
  static sqlSelect: string = `SELECT * FROM vista_estudiante `;
  static sqlGetById: string = 'SELECT * FROM estudiante WHERE EST_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM vista_estudiante WHERE ESTADO = 1';
  
  
  static async insert(estudiante: EstudianteEntidad ): Promise<Respuesta> {
    try {
      estudiante.EST_ID = uuidv4(); //asigna un identificador unico
      
      const newEstudiante = new EstudianteEntidad(estudiante.EST_ID, estudiante.EST_DNI, estudiante.EST_NOM, estudiante.EST_NOM2, estudiante.EST_APE, estudiante.EST_APE2, estudiante.EST_FECH_NAC, estudiante.EST_GEN, estudiante.EST_PRV, estudiante.EST_CAN, estudiante.EST_PARR, estudiante.EST_DIR, estudiante.EST_NAC, estudiante.EST_ETN, estudiante.EST_NAC_ETN, estudiante.EST_COM_ETN, estudiante.EST_COD_ELE, estudiante.EST_NEC_ASO_DIS, estudiante.EST_NEC_NO_ASO_DIS, estudiante.EST_ENF_CAT, estudiante.EST_NUM_CONA, estudiante.EST_INTE, estudiante.EST_TV, estudiante.EST_RAD, estudiante.EST_PC, estudiante.EST_CEL, estudiante.REPR_ID, estudiante.REL_EST_REP, estudiante.ESTADO, estudiante.CREADOR_ID);

      let sql =this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newEstudiante.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Estudiante');
      }
      return {response: true, data:newEstudiante.EST_ID, message: 'Se creo correctamente' }; // Retorna el ID del Estudiante
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async update(estudiante: EstudianteEntidad): Promise<Respuesta> {
    try {
      const newEstudiante = new EstudianteEntidad(estudiante.EST_ID, estudiante.EST_DNI, estudiante.EST_NOM, estudiante.EST_NOM2, estudiante.EST_APE, estudiante.EST_APE2, estudiante.EST_FECH_NAC, estudiante.EST_GEN, estudiante.EST_PRV, estudiante.EST_CAN, estudiante.EST_PARR, estudiante.EST_DIR, estudiante.EST_NAC, estudiante.EST_ETN, estudiante.EST_NAC_ETN, estudiante.EST_COM_ETN, estudiante.EST_COD_ELE, estudiante.EST_NEC_ASO_DIS, estudiante.EST_NEC_NO_ASO_DIS, estudiante.EST_ENF_CAT, estudiante.EST_NUM_CONA, estudiante.EST_INTE, estudiante.EST_TV, estudiante.EST_RAD, estudiante.EST_PC, estudiante.EST_CEL, estudiante.REPR_ID, estudiante.REL_EST_REP, estudiante.ESTADO, estudiante.CREADOR_ID);
      let sql =this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newEstudiante.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Estudiante');
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
        throw new Error('No se pudo eliminar el objeto de tipo Estudiante');
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
      return { response: true, data: rows as EstudianteEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getById(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetById;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Estudiante no encontrado');
      }
      let newEstudiante = rows[0] as EstudianteEntidad;
      return {response: true, data: newEstudiante, message: 'Encontrado' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabled(): Promise<Respuesta> {
    try {
      let sql = this.sqlGetEnabled;
      
      const [rows] = await pool.execute<any>(sql);
      return {response: true, data: rows as EstudianteEntidad[], message: '' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  


}
export default EstudianteDatos;
