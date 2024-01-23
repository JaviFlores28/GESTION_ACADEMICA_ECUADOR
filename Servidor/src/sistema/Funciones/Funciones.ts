import CryptoJS from 'crypto-js';
import 'dotenv/config';
//import winston from 'winston';
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
  static mapErrorCodeToMessage(code: string, msg?: string): string {
    const errorMessages: { [key: string]: string; } = {
      'ER_DUP_ENTRY': 'Entrada duplicada. Ya existe un registro con ese valor.',
      'ER_ROW_IS_REFERENCED_2': 'No se puede eliminar este objeto porque está siendo referenciado por otros registros.',
      'ER_NO_REFERENCED_ROW_2': 'No se puede agregar o actualizar este registro hijo porque no existe el registro padre correspondiente.',
      'ER_PARSE_ERROR': 'Error de sintaxis en la consulta SQL.',
      'ER_DATA_TOO_LONG': 'Los datos son demasiado largos para el campo correspondiente.',
      'ER_ACCESS_DENIED_ERROR': 'Acceso denegado. El usuario no tiene los permisos necesarios para realizar la operación.',
      'ECONNREFUSED': 'Base de datos inaccesible.'
    };
    return errorMessages[code] || '' + msg;
  }

  /*  static logger = winston.createLogger({
    level: 'silly',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'servidor.log' }),
      //new winston.transports.Console()
    ],
  }); */
}

export default Funciones;
