
import baseDatos from '../Datos/BaseDatos';
import Estudiante from '../Entidades/EstudianteEntidad';
import { v4 as uuidv4 } from 'uuid';


class EstudianteNegocio {

  static async getEstudiante(): Promise<{ data: Estudiante[], message: string }> {
    try {
      let sql = 'SELECT `EST_ID` as id , `EST_DNI`, concat (`EST_NOM`,\' \', `EST_NOM2`,\' \',`EST_APE`,\' \',`EST_APE2`) AS EST_NOM, `EST_PRV`, `EST_CAN`,`ESTADO` FROM estudiante';
      const [rows] = await baseDatos.execute<any>(sql);
      return { data: rows as Estudiante[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }

  static async getEnabledEstudiante(): Promise<{ data: Estudiante[], message: string }> {
    try {
      let sql = 'SELECT * FROM estudiante where Estado=1';
      const [rows] = await baseDatos.execute<any>(sql);
      return { data: rows as Estudiante[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }

  static async getEnabledEstudianteByCurso(cursoid: any): Promise<{ data: Estudiante[], message: string }> {
    try {
      console.log(cursoid);
      let sql = `SELECT b.* FROM matricula as a JOIN estudiante as b ON a.EST_ID = b.EST_ID WHERE a.CRS_ID =? AND B.ESTADO=1;`;
      const [rows] = await baseDatos.execute<any>(sql, [cursoid]);
      return { data: rows as Estudiante[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }

  static async searchById(id: String): Promise<{ data: Estudiante | null; message: string }> {
    try {
      let sql = 'SELECT * FROM estudiante WHERE EST_ID = ?';
      const [rows] = await baseDatos.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Estudiante no encontrado');
      }
      let newEstudiante = rows[0] as Estudiante;

      return { data: newEstudiante, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }

  static async addEstudiante(estudiante: Estudiante): Promise<{ data: string | null, message: string }> {
    try {
      if (!estudiante.isValid()) { //validar estructura del objeto
        throw new Error('Objeto de tipo Estudiante no tiene la estructura esperada.');
      }
      estudiante.EST_ID = uuidv4(); //asigna un identificador unico
      let sql = estudiante.sqlInsert();
      const [result] = await baseDatos.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Estudiante');
      }
      return { data: estudiante.EST_ID, message: 'Se creo correctamente' }; // Retorna el ID del Estudiante
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }

  static async deleteEstudiante(id: String): Promise<{ data: boolean, message: string }> {
    try {
      let sql = 'delete FROM estudiante WHERE EST_ID = ?';
      const [result] = await baseDatos.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Estudiante');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }

  static async updateEstudiante(estudiante: Estudiante): Promise<{ data: boolean, message: string }> {
    try {
      if (!estudiante.isValid()) { //validar estructura del objeto
        throw new Error('Objeto de tipo Estudiante no tiene la estructura esperada.');
      }
      let sql = estudiante.sqlUpdate();
      const [result] = await baseDatos.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Estudiante');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }

}
export default EstudianteNegocio;