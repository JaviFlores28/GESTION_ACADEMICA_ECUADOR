
import pool from '../Datos/BaseDatos';
import Paralelo from '../Entidades/ParaleloEntidad';
import { v4 as uuidv4 } from 'uuid';


class ParaleloNegocio {

  static async getParalelo(): Promise<{ data: Paralelo[], message: string }> {
    try {
      let sql = 'SELECT a.`PRLL_ID` as id,a.`PRLL_ID`, a.`PRLL_NOM`, CONCAT(b.`CRS_NOM`, \'-\', b.`CRS_TIPO`) as CRS_NOM, c.AL_NOM, a.`ESTADO` FROM `paralelo` as a JOIN `curso` as b ON a.`CRS_ID` = b.`CRS_ID` JOIN `anio_lectivo` as c ON a.`AL_ID` = c.`AL_ID` AND C.ESTADO=1 ORDER BY a.CRS_ID ASC;';
      const [rows] = await pool.execute<any>(sql);
      return { data: rows as Paralelo[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }

  static async getEnabledParalelo(cursoId: string): Promise<{ data: Paralelo[], message: string }> {
    try {
      let sql = 'SELECT a.`PRLL_ID` as id,a.`PRLL_ID`, a.`PRLL_NOM`, CONCAT(b.`CRS_NOM`, \'-\', b.`CRS_TIPO`) as CRS_NOM, c.AL_NOM, a.`ESTADO` FROM `paralelo` as a JOIN `curso` as b ON a.`CRS_ID` = b.`CRS_ID` JOIN `anio_lectivo` as c ON a.`AL_ID` = c.`AL_ID` WHERE a.ESTADO = 1 AND c.ESTADO = 1 AND a.CRS_ID = ? ORDER BY a.CRS_ID ASC;';
      const [rows] = await pool.execute<any>(sql, [cursoId]);
      return { data: rows as Paralelo[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }

  static async searchById(id: String): Promise<{ data: Paralelo | null; message: string }> {
    try {
      let sql = 'SELECT * FROM paralelo WHERE PRLL_ID = ?';
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Paralelo no encontrado');
      }
      let newParalelo = rows[0] as Paralelo;

      return { data: newParalelo, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }

  static async addParalelo(paralelo: Paralelo): Promise<{ data: string | null, message: string }> {
    try {
      if (!paralelo.isValid()) { //validar estructura del objeto
        throw new Error('Objeto de tipo Paralelo no tiene la estructura esperada.');
      }
      paralelo.PRLL_ID = uuidv4(); //asigna un identificador unico
      let sql = paralelo.sqlInsert();
      const [result] = await pool.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Paralelo');
      }
      return { data: paralelo.PRLL_ID, message: 'Se creo correctamente' }; // Retorna el ID del Paralelo
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }

  static async deleteParalelo(id: String): Promise<{ data: boolean, message: string }> {
    try {
      let sql = 'delete FROM paralelo WHERE PRLL_ID = ?';
      const [result] = await pool.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Paralelo');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }

  static async updateParalelo(paralelo: Paralelo): Promise<{ data: boolean, message: string }> {
    try {
      if (!paralelo.isValid()) { //validar estructura del objeto
        throw new Error('Objeto de tipo Paralelo no tiene la estructura esperada.');
      }
      let sql = paralelo.sqlUpdate();
      const [result] = await pool.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Paralelo');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }

}
export default ParaleloNegocio;