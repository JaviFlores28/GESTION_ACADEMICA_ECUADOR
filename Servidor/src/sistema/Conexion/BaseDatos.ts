import { createPool } from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises'; // Utilizando fs/promises para trabajar con promesas

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
  } catch (error) {
    console.error('Error al crear la base de datos: ', error);
  }
}

async function createTables() {
  try {
    // Leer el contenido del archivo SQL
    const sqlScript = await fs.readFile('SQL/UEFBC.sql', 'utf-8');

    // Obtener una conexión de la piscina
    const connection = await pool.getConnection();

    try {
      // Dividir el script en consultas individuales
      const queries = sqlScript.split(';').filter((query) => query.trim() !== '');

      // Ejecutar cada consulta por separado
      for (const query of queries) {
        const result = await connection.query(query);
        if (!result[0]) {
          console.error('Error al ejecutar la consulta:', result[0]);
        }
      }

    } finally {
      // Liberar la conexión de vuelta a la piscina
      connection.release();
    }
  } catch (error: any) {
    console.error('Error al ejecutar el script SQL: ', error);
    console.error('SQL State:', error.sqlState);
    console.error('SQL Message:', error.sqlMessage);
  }
}

async function insertOnTables() {
  try {
    // Leer el contenido del archivo SQL
    const sqlScript = await fs.readFile('SQL/Datos.sql', 'utf-8');

    // Obtener una conexión de la piscina
    const connection = await pool.getConnection();

    try {
      // Dividir el script en consultas individuales
      const queries = sqlScript.split(';').filter((query) => query.trim() !== '');

      // Ejecutar cada consulta por separado
      for (const query of queries) {
        const result = await connection.query(query);
        if (!result[0]) {
          console.error('Error al ejecutar la consulta:', result[0]);
        }
      }

    } finally {
      // Liberar la conexión de vuelta a la piscina
      connection.release();
    }
  } catch (error: any) {
    console.error('Error al ejecutar el script SQL: ', error);
    console.error('SQL State:', error.sqlState);
    console.error('SQL Message:', error.sqlMessage);
  }
}

async function runDatabaseSetup() {
  try {
    await createDatabase();
    await createTables();
    await insertOnTables();
  } catch (error) {
    console.error('Error during database setup:', error);
  }
}

runDatabaseSetup();

export default pool;
