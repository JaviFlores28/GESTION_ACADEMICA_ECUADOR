import { createPool } from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import Funciones from '../funciones/Funciones';

dotenv.config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

async function createDatabase() {
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
    Funciones.logger.error(error.errors);
  }
}

async function createTables() {
  try {
    // Leer el contenido del archivo SQL
    const sqlScript = await fs.readFile('SQL/UEFBC.sql', 'utf-8');

    // Dividir el script en consultas individuales
    const queries = sqlScript.split(';').filter((query) => query.trim() !== '');

    // Ejecutar cada consulta por separado
    for (const query of queries) {
      const result = await pool.query(query);
      if (!result[0]) {
        throw new Error('Error al ejecutar la consulta:' + result[0]);
      }
    }
  } catch (error: any) {
    Funciones.logger.error(error);
  }
}

async function insertOnTables() {
  try {
    // Leer el contenido del archivo SQL
    const sqlScript = await fs.readFile('SQL/DatosTest.sql', 'utf-8');

    // Dividir el script en consultas individuales
    const queries = sqlScript.split(';').filter((query) => query.trim() !== '');

    // Ejecutar cada consulta por separado
    for (const query of queries) {
      const result = await pool.query(query);
      if (!result[0]) {
        throw new Error('Error al ejecutar la consulta:' + result[0]);
      }
    }

  } catch (error: any) {
    Funciones.logger.error(error);
  }
}

async function runDatabaseSetup() {
  try {
    await createDatabase();
    await createTables();
    await insertOnTables();
  } catch (error: any) {
    Funciones.logger.error(error);
  }
}

runDatabaseSetup();

export default pool;
