import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import 'dotenv/config';
import { ColumnData } from '../interfaces/ColumnData';
import { MappedProperty } from '../interfaces/MappedProperty';
import { readFileSync } from 'fs';
class BaseDatos {
  
  private static instancia: Pool;

  // Constructor privado para evitar la creación de instancias desde fuera de la clase
  private constructor() {}

  // Método para obtener la única instancia de la clase
  public static getInstance(): Pool {
    if (!BaseDatos.instancia) {
      const access: PoolOptions = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
      };
      // Inicializar el pool solo si aún no está creado
      BaseDatos.instancia = mysql.createPool(access);
    }
    return BaseDatos.instancia;
  }

  // Método para obtener la única instancia de la clase con la base de datos seleccionada
  public static async getInstanceDataBase(): Promise<Pool> {
    if (!BaseDatos.instancia) {
      const access: PoolOptions = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
      };
      // Inicializar el pool solo si aún no está creado
      BaseDatos.instancia = mysql.createPool(access);
    }
    await BaseDatos.instancia.query('USE ' + process.env.DB_DATABASE);
    return BaseDatos.instancia;
  }

  static async createDatabase(): Promise<void> {
    try {
      console.log('Creando base de datos...');
      // crea la base de datos
      const result = await BaseDatos.getInstance().query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`);
      if (!result[0]) {
        throw new Error('Error al crear la base de datos');
      }
      // lee el archivo sql
      console.log('Creando tablas...');
      let sqlScript = readFileSync('SQL/TABLAS.sql', 'utf-8');
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

  static async defaultData(): Promise<void> {
    try {
      console.log('Agregando datos por defecto...');
      const sqlScript = readFileSync('SQL/DATOS_TEST.sql', 'utf-8');
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

  static getMappedType(fieldType: string | string[]): string {
    if (fieldType.includes('tinyint')) {
      return 'number';
    } else if (fieldType.includes('char') || fieldType.includes('varchar') || fieldType.includes('enum')) {
      return 'string';
    } else if (fieldType.includes('date') || fieldType.includes('datetime')) {
      return 'Date';
    } else if (fieldType.includes('int') || fieldType.includes('float') || fieldType.includes('double') || fieldType.includes('decimal')) {
      return 'number';
    } else {
      return 'any';
    }
  }

  static mapProperties(properties: ColumnData[]): MappedProperty[] {
    return properties.map((column: ColumnData) => {
      const fieldType = column.Type.toLowerCase();
      const mappedType = this.getMappedType(fieldType);
      const key = column.Key;

      return { name: column.Field, type: mappedType, key: key, type_old: fieldType };
    });
  }

  static async getTableInfo(tableName: string): Promise<any> {
    const [results] = await (await BaseDatos.getInstanceDataBase()).execute(`DESCRIBE ${tableName}`);
    return results;
  }

}
export default BaseDatos;
