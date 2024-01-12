import Funciones from '../sistema/funciones/Funciones';
import BaseDatos from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/Interfaces/Respuesta';
import EstudianteCursoParaleloEntidad from '../entidades/EstudianteCursoParaleloEntidad';
import { v4 as uuidv4 } from 'uuid';
import CalificacionesCualitativasDatos from './CalificacionesCualitativasDatos';
import CalificacionesCuantitativasDatos from './CalificacionesCuantitativasDatos';
import PeriodoDatos from './PeriodoDatos';
import ParcialDatos from './ParcialDatos';

class EstudianteCursoParaleloDatos {
  static sqlInsert: string = `INSERT INTO estudiante_curso_paralelo (EST_CRS_PRLL_ID, EST_CRS_ID, AL_ID, PRLL_ID, PASE, ESTADO)VALUES( ?, ?, ?, ?, ?, ?);`;
  static sqlUpdate: string = `UPDATE estudiante_curso_paralelo SET EST_CRS_ID=?,AL_ID=?,PRLL_ID=?,PASE=?,ESTADO=? WHERE EST_CRS_PRLL_ID=?;`;
  static sqlUpdateEstado: string = 'UPDATE estudiante_curso_paralelo SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  EST_CRS_PRLL_ID IN';
  static sqlDelete: string = `DELETE FROM estudiante_curso_paralelo WHERE EST_CRS_PRLL_ID = ?`;
  static sqlSelect: string = `SELECT * FROM vista_estudiante_curso_paralelo `;
  static sqlGetById: string = 'SELECT * FROM estudiante_curso_paralelo WHERE EST_CRS_PRLL_ID = ?';
  static sqlGetEnabled: string = 'SELECT * FROM vista_estudiante_curso_paralelo WHERE ESTADO = 1 ';
  static sqlGetByCursoParalelo: string = 'SELECT a.* FROM vista_estudiante_curso_paralelo AS a INNER JOIN estudiante_curso_paralelo AS b ON a.EST_CRS_PRLL_ID = b.EST_CRS_PRLL_ID INNER JOIN estudiante_curso AS c ON c.EST_CRS_ID = b.EST_CRS_ID WHERE b.PRLL_ID = ? AND b.AL_ID = ? AND b.ESTADO = 1 AND c.CRS_ID = ? AND c.ESTADO = 1 ORDER BY A.EST_CRS_NOM ASC;';

  static async insert(estudiante_curso_paralelo: EstudianteCursoParaleloEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      estudiante_curso_paralelo.EST_CRS_PRLL_ID = uuidv4();
      const newEstudianteCursoParalelo = new EstudianteCursoParaleloEntidad(estudiante_curso_paralelo.EST_CRS_PRLL_ID, estudiante_curso_paralelo.EST_CRS_ID, estudiante_curso_paralelo.AL_ID, estudiante_curso_paralelo.PRLL_ID, estudiante_curso_paralelo.PASE, estudiante_curso_paralelo.ESTADO);
      let sql = this.sqlInsert;
      const [result] = await pool.execute<any>(sql, newEstudianteCursoParalelo.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar EstudianteCursoParalelo');
      }
      return { response: true, data: newEstudianteCursoParalelo.EST_CRS_PRLL_ID, message: 'Se creo correctamente' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async update(estudiante_curso_paralelo: EstudianteCursoParaleloEntidad): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();

      const newEstudianteCursoParalelo = new EstudianteCursoParaleloEntidad(estudiante_curso_paralelo.EST_CRS_PRLL_ID, estudiante_curso_paralelo.EST_CRS_ID, estudiante_curso_paralelo.AL_ID, estudiante_curso_paralelo.PRLL_ID, estudiante_curso_paralelo.PASE, estudiante_curso_paralelo.ESTADO);
      let sql = this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, newEstudianteCursoParalelo.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar EstudianteCursoParalelo');
      }
      return { response: true, data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async updateEstado(ids: string[]): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
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

      return { response: true, data: true, message: 'Estado actualizado' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async delete(id: String): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlDelete;
      const [result] = await pool.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo EstudianteCursoParalelo');
      }
      return { response: true, data: true, message: 'Objeto eliminado' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getAll(): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlSelect;

      const [rows] = await pool.execute<any>(sql);
      if (rows.length <= 0) {
        throw new Error('No se encontraron datos para EstudianteCursoParalelo.');
      }
      return { response: true, data: rows as EstudianteCursoParaleloEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getById(id: String): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlGetById;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo EstudianteCursoParalelo no encontrado');
      }
      let newEstudianteCursoParalelo = rows[0] as EstudianteCursoParaleloEntidad;
      return { response: true, data: newEstudianteCursoParalelo, message: 'Encontrado' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async getEnabled(): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      let sql = this.sqlGetEnabled;

      const [rows] = await pool.execute<any>(sql);
      if (rows.length <= 0) {
        throw new Error('No se encontraron datos para EstudianteCursoParalelo.');
      }
      return { response: true, data: rows as EstudianteCursoParaleloEntidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async insertMasivo(data: any): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      const arrayIds = data.arrayIds;

      // Crear un array de valores para todos los registros utilizando map
      const valores = arrayIds.map((id: any) => [uuidv4(), id, data.AL_ID, data.PRLL_ID, data.PASE, data.ESTADO]);

      // Crear una cadena de marcadores de posición y una cadena de campos
      const placeholders = valores.map((fila: string | any[]) => `(${Array.from({ length: fila.length }, () => '?').join(',')})`).join(',');

      const campos = ['EST_CRS_PRLL_ID', 'EST_CRS_ID', 'AL_ID', 'PRLL_ID', 'PASE', 'ESTADO'].join(',');

      // Consulta SQL con la cláusula INSERT INTO y VALUES
      const sql = `INSERT INTO estudiante_curso_paralelo (${campos}) VALUES ${placeholders};`;

      // Ejecutar la consulta con el array de valores
      const [result] = await pool.execute<any>(sql, valores.flat());

      // Verificar si se afectaron filas
      if (result.affectedRows < 1) {
        throw new Error('No se pudieron insertar los datos');
      }

      return { response: true, data: true, message: 'Datos insertados correctamente' };
    } catch (error: any) {
      return { response: false, data: false, message: error.message };
    }
  }

  static async getByCursoParalelo(data: any): Promise<Respuesta> {
    try {
      const pool = await BaseDatos.getInstanceDataBase();
      const sql = this.sqlGetByCursoParalelo;
      let [estudiantes] = await pool.execute<any>(sql, [data.PRLL_ID, data.AL_ID, data.CRS_ID]);
      const allPeridos = (await PeriodoDatos.getEnabled()).data;
      const resultados = await Promise.all(
        estudiantes.map(async (estudiante: any) => {
          const res = await this.asignarParciales(allPeridos, estudiante, data);
          const resultado = {
            ...estudiante,
            periodos: [...res],
          };
          return resultado;
        }),
      );

      return { response: true, data: resultados as any[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message };
    }
  }

  static async asignarParciales(periodos: any, estudiante: any, data: any): Promise<any> {
    try {
      const resultados = await Promise.all(
        periodos.map(async (periodo: any) => {
          const calificacionesCualitativas = (await CalificacionesCualitativasDatos.getByEstAsg({ EST_CRS_PRLL_ID: estudiante.EST_CRS_PRLL_ID, PRF_ASG_PRLL_ID: data.PRF_ASG_PRLL_ID, PRCL_ID: periodo.PRCL_ID })).data;
          let CALIFICACION = calificacionesCualitativas?.CALIFICACION || '';
          let CAL_ID = calificacionesCualitativas?.CAL_ID || '0';
          const parciales = (await ParcialDatos.getByPeriodo(periodo.PRD_ID)).data;
          const calificaciones = await this.asignarCalificacionesParciales(parciales, estudiante, data);
          const resultado = {
            ...periodo,
            parciales: [...calificaciones],
            CALIFICACION: CALIFICACION,
            CAL_ID: CAL_ID,
          };
          return resultado;
        }),
      );
      return resultados;
    } catch (error) {
      console.log(error);
      return periodos;
    }
  }

  static async asignarCalificacionesParciales(parciales: any, estudiante: any, data: any) {
    try {
      const resultados = await Promise.all(
        parciales.map(async (parcial: any) => {
          const calificacionesCuantitativas = (await CalificacionesCuantitativasDatos.getByEstAsg({ EST_CRS_PRLL_ID: estudiante.EST_CRS_PRLL_ID, PRF_ASG_PRLL_ID: data.PRF_ASG_PRLL_ID, PRCL_ID: parcial.PRCL_ID })).data;
          let CALIFICACION = calificacionesCuantitativas?.CALIFICACION || '';
          let CAL_ID = calificacionesCuantitativas?.CAL_ID || '0';
          const resultado = {
            ...parcial,
            CALIFICACION: CALIFICACION,
            CAL_ID: CAL_ID,
          };
          return resultado;
        }),
      );
      return resultados;
    } catch (error) {
      console.error(error);
      return parciales;
    }
  }
}
export default EstudianteCursoParaleloDatos;
