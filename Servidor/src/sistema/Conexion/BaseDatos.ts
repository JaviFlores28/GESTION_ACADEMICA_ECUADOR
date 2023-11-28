import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import 'dotenv/config';
import { readFile } from 'fs/promises';
class BaseDatos {
  
  private static pool: Pool;

  constructor() {
    if (!BaseDatos.pool) {
      const access: PoolOptions = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      };
      BaseDatos.pool = mysql.createPool(access);
    }
  }

  async getPool() {
    await BaseDatos.pool.query('USE ' + process.env.DB_DATABASE);
    return BaseDatos.pool;
  }

  async createDatabase() {
    try {
      console.log('Creando base de datos...');
      // crea la base de datos
      const result = await BaseDatos.pool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`);
      console.log(result[0]);

      // lee el archivo sql
      console.log('Creando tablas...');
      let sqlScript = await readFile('SQL/TABLAS.sql', 'utf-8');
      // array de consultas
      const queries = sqlScript.split(';').filter((query) => query.trim() !== '');
      // cambia a la base de datos creada
      await BaseDatos.pool.query('USE ' + process.env.DB_DATABASE);
      // ejecuta cada consulta
      for (const query of queries) {
        const result = await BaseDatos.pool.query(query);
        if (!result[0]) {
          throw new Error('Error al ejecutar la consulta:' + result[0]);
        }
      }
      console.log('Base de datos creada');
    } catch (error: any) {
      console.log(error);
    }
  }

  async defaultData() {
    try {
      console.log('Agregando datos por defecto...');
      const sqlScript = await readFile('SQL/DATOS_TEST.sql', 'utf-8');
      const queries = sqlScript.split(';').filter((query) => query.trim() !== '');
      for (const query of queries) {
        const result = await BaseDatos.pool.query(query);
        if (!result[0]) {
          throw new Error('Error al ejecutar la consulta:' + result[0]);
        }
      }
      console.log('Datos agregados');
    } catch (error: any) {
      console.log(error);
    }
  }

}
export default BaseDatos;
