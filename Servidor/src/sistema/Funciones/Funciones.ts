import CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';
import { ColumnData } from '../interfaces/ColumnData';
import { MappedProperty } from '../interfaces/MappedProperty';
import winston from 'winston';

dotenv.config();
const { KEY_ENCRYPT } = process.env;

class Funciones {
  static encrypt(plaintext: string): string {
    const ciphertext = CryptoJS.AES.encrypt(plaintext, KEY_ENCRYPT || '').toString();
    return ciphertext;
  }

  static decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, KEY_ENCRYPT || '');
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  }

  static crearUsuario(dni: string, nom: string, nom2: string, ape: string) {
    let usr = '';
    usr += nom[0] || ''; // Agregamos el primer carácter de nom1 si existe
    usr += nom2[0] || ''; // Usa ?. para evitar problemas con valores null o undefined
    usr += ape || '';
    usr += dni.substring(dni.length - 4); // Obtener los últimos 4 caracteres
    return usr;
  }

  static capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static stringToCapitalize(word: string) {
    const words = word.split('_');
    const capitalizedWords = words.map((word: any) => this.capitalizeFirstLetter(word));
    return capitalizedWords.join('');
  }

  static stringToCamelCase(word: string) {
    return word.replace(/_(\w)/g, (_: any, match: string) => match.toLowerCase()).replace(/^\w/, (c: string) => c.toLowerCase());
  }

  static pswdValid(pswdInit: string, pswdSent: string): boolean {
    if (pswdInit === pswdSent) {
      return true;
    }
    return false;
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

  static mapProperties(properties: ColumnData[]): MappedProperty[] {
    return properties.map((column: ColumnData) => {
      const fieldType = column.Type.toLowerCase();
      const propertyName = column.Field;
      const mappedType = this.getMappedType(fieldType, propertyName);
      const key = column.Key;

      return { name: propertyName, type: mappedType, key: key, type_old: fieldType };
    });
  }

  static async getTableInfo(connection: any, tableName: any) {
    const [results] = await connection.execute(`DESCRIBE ${tableName}`);
    return results;
  }

  static async getPrimaryKey(connection: any, tableName: any) {
    const [results] = await connection.execute(`SHOW KEYS FROM ${tableName} WHERE Key_name = 'PRIMARY'`);
    return results;
  }

  static generatePropsDefinitions(propertiesData: MappedProperty[]) {
    return propertiesData
      .filter((property) => property.name !== 'FECHA_CREACION')
      .map((property) => `${property.name}: ${property.type};`)
      .join('\n    ');
  }

  static generatePropsConstruct(propertiesData: MappedProperty[]) {
    return propertiesData
      .filter((property) => property.name !== 'FECHA_CREACION')
      .map((property) => {
        return `${property.name}: ${property.type}`;
      })
      .join(', ');
  }

  static generatePropsValues(propertiesData: MappedProperty[]) {
    return propertiesData
      .filter((property) => property.name !== 'FECHA_CREACION')
      .map((property) => {
        return `this.${property.name} = ${property.name};`;
      })
      .join('\n      ');
  }

  static generateFunctionToarray(propertiesData: MappedProperty[], excludedProperties: string[]) {
    return propertiesData
      .filter((property) => !excludedProperties.includes(property.name))
      .map((property) => `this.${property.name}`)
      .join(',');
  }

  /* const excludedProperties = [
                'FECHA_CREACION',
                'ROL_PRF',
                'ROL_REPR',
                'ROL_ADMIN',
                'USUARIO',
                'USR_PSWD',
                'ESTADO'
            ]; 
    */
  static generatePropsIsValid(propertiesData: MappedProperty[], excludedProperties: string[]) {
    return propertiesData
      .filter((property) => !excludedProperties.includes(property.name))
      .map((property) => `!!this.${property.name}`)
      .join(' && ');
  }

  static generatePropsToArray(propertiesData: MappedProperty[], excludedProperties: string[]) {
    return propertiesData
      .filter((property) => !excludedProperties.includes(property.name))
      .map((property) => `'${property.name}'`)
      .join(',');
  }

  static generateObject(propertiesData: MappedProperty[], tableName: string, excludedProperties: string[]) {
    return propertiesData
      .filter((property) => !excludedProperties.includes(property.name))
      .map((property) => `${tableName}.${property.name}`)
      .join(', ');
  }

  static generateSqlInsert(propertiesData: MappedProperty[]) {
    const excludedProperties = ['FECHA_CREACION'];
    const filteredProperties = propertiesData.filter((property) => !excludedProperties.includes(property.name));

    const marcadores = filteredProperties.map(() => '?').join(', ');
    const headers = filteredProperties.map((property) => property.name).join(', ');
    return { headers, marcadores };
  }

  static generarSQLUpdate(propertiesData: MappedProperty[]) {
    const excludedProperties = ['USUARIO', 'USR_PSWD', 'FECHA_CREACION', 'CREADOR_ID'];
    return propertiesData
      .filter((property) => !excludedProperties.includes(property.name) && property.key !== 'PRI')
      .map((property) => `${property.name}=?`)
      .join(',');
  }

  static logger = winston.createLogger({
    level: 'silly',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'servidor.log' }),
      //new winston.transports.Console()
    ],
  });
}

export default Funciones;
