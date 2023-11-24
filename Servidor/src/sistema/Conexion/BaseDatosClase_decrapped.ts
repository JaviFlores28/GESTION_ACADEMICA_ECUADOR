import { createPool, Pool } from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises'; // Utilizando fs/promises para trabajar con promesas
import Funciones from '../funciones/Funciones';

dotenv.config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

class BaseDatos {
  private static pool: Pool;

  constructor() {
    // Check if pool is already created
    if (!BaseDatos.pool) {
      BaseDatos.pool = createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_DATABASE,
      });
    }
  }

  public static getPool(): Pool {
    return BaseDatos.pool;
  }

  private async createDatabase(): Promise<void> {
    try {
      // Crear una conexión sin especificar la base de datos
      const connectionWithoutDB = await createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
      }).getConnection();

      // Crear la base de datos si no existe
      await connectionWithoutDB.query(`CREATE DATABASE IF NOT EXISTS ${DB_DATABASE}`);

      // Liberar la conexión de vuelta al pool
      connectionWithoutDB.release();
    } catch (error: any) {
      Funciones.logger.error(error);
      //console.error('Error al crear la base de datos: ', error);
    }
  }

  private async createTables(): Promise<void> {
    try {
      // Leer el contenido del archivo SQL
      const sqlScript = await fs.readFile('SQL/UEFBC.sql', 'utf-8');

      // Dividir el script en consultas individuales
      const queries = sqlScript.split(';').filter((query) => query.trim() !== '');

      // Ejecutar cada consulta por separado
      for (const query of queries) {
        const result = await BaseDatos.pool.query(query);
        if (!result[0]) {
          console.error('Error al ejecutar la consulta:', result[0]);
        }
      }
    } catch (error: any) {
      Funciones.logger.error(error);
      /* console.error('Error al ejecutar el script SQL: ', error);
      console.error('SQL State:', error.sqlState);
      console.error('SQL Message:', error.sqlMessage); */
    }
  }

  private async insertOnTables(): Promise<void> {
    try {
      // Leer el contenido del archivo SQL
      const sqlScript = await fs.readFile('SQL/Datos.sql', 'utf-8');

      // Dividir el script en consultas individuales
      const queries = sqlScript.split(';').filter((query) => query.trim() !== '');

      // Ejecutar cada consulta por separado
      for (const query of queries) {
        const result = await BaseDatos.pool.query(query);
        if (!result[0]) {
          throw new Error('Error al ejecutar la consulta:', result[0]);
        }
      }
    } catch (error: any) {
      Funciones.logger.error(error);
      /*  console.error('Error al ejecutar el script SQL: ', error);
       console.error('SQL State:', error.sqlState);
       console.error('SQL Message:', error.sqlMessage); */
    }
  }

  public async runDatabaseSetup(): Promise<void> {
    try {
      await this.createDatabase();
      await this.createTables();
      await this.insertOnTables();
    } catch (error) {
      Funciones.logger.error(error);
      /* console.error('Error during database setup:', error); */
    }
  }
}

export default BaseDatos;
