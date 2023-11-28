import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import 'dotenv/config';
import { readFile } from 'fs/promises';
import { ColumnData } from '../interfaces/ColumnData';
import { MappedProperty } from '../interfaces/MappedProperty';
class BaseDatos {

  private static pool: Pool;

  // Constructor privado para evitar la creación de instancias desde fuera de la clase
  private constructor() {
    const access: PoolOptions = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    };
    // Inicializar el pool solo si aún no está creado
    BaseDatos.pool = mysql.createPool(access);
  }

  // Método para obtener la única instancia de la clase
  public static getInstance(): Pool {
    if (!BaseDatos.pool) {
      // Si la instancia aún no se ha creado, crear una nueva instancia
      new BaseDatos();
    }
    return BaseDatos.pool;
  }


  public static async getInstanceDataBase() {
    if (!BaseDatos.pool) {
      // Si la instancia aún no se ha creado, crear una nueva instancia
      new BaseDatos();
    }
    await BaseDatos.pool.query('USE ' + process.env.DB_DATABASE);
    return BaseDatos.pool;
  }

  static async createDatabase() {
    try {
      console.log('Creando base de datos...');
      // crea la base de datos
      const result = await BaseDatos.getInstance().query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`);
      console.log(result[0]);

      // lee el archivo sql
      console.log('Creando tablas...');
      let sqlScript = await readFile('SQL/TABLAS.sql', 'utf-8');
      // array de consultas
      const queries = sqlScript.split(';').filter((query) => query.trim() !== '');
      
      // ejecuta cada consulta
      for (const query of queries) {
        const pool = await BaseDatos.getInstanceDataBase();
        const result = await pool.query(query);
        if (!result[0]) {
          throw new Error('Error al ejecutar la consulta:' + result[0]);
        }
      }
      console.log('Base de datos creada');
    } catch (error: any) {
      console.log(error);
    }
  }

  static async defaultData() {
    try {
      console.log('Agregando datos por defecto...');
      const sqlScript = await readFile('SQL/DATOS_TEST.sql', 'utf-8');
      const queries = sqlScript.split(';').filter((query) => query.trim() !== '');
      for (const query of queries) {
        const pool = await BaseDatos.getInstanceDataBase();
        const result = await pool.query(query);
        if (!result[0]) {
          throw new Error('Error al ejecutar la consulta:' + result[0]);
        }
      }
      console.log('Datos agregados');
    } catch (error: any) {
      console.log(error);
    }
  }

  static getMappedType(fieldType: string | string[], propertyName: string) {
    if (fieldType.includes('tinyint')) {
      return 'number';
    } else if (fieldType.includes('char') || fieldType.includes('varchar') || fieldType.includes('enum')) {
      return 'string';
    } else if (fieldType.includes('date') || fieldType.includes('datetime')) {
      return `${propertyName === 'FECHA_CREACION' ? 'Date | undefined' : 'Date'}`;
    } else if (fieldType.includes('int') || fieldType.includes('float') || fieldType.includes('double') || fieldType.includes('decimal')) {
      return 'number';
    } else {
      return 'any';
    }
  }

  static mapProperties(properties: any): MappedProperty[] {
    return properties.map((column: ColumnData) => {
      const fieldType = column.Type.toLowerCase();
      const propertyName = column.Field;
      const mappedType = this.getMappedType(fieldType, propertyName);
      const key = column.Key;

      return { name: propertyName, type: mappedType, key: key, type_old: fieldType };
    });
  }

  static async getTableInfo(tableName: string) {
    const [results] = await BaseDatos.getInstance().execute(`DESCRIBE ${tableName}`);
    return results;
  }

}
export default BaseDatos;
