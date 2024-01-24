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
      'ER_DUP_ENTRY': '¡Ups! Parece que ya hay una entrada igual. Por favor, elige un valor único.',
      'ER_ROW_IS_REFERENCED_2': 'No podemos eliminar esto porque otros registros lo están usando. ¡Es muy popular!',
      'ER_NO_REFERENCED_ROW_2': 'No podemos agregar o actualizar este registro porque su "padre" no existe. ¡Vamos a necesitar al padre primero!',
      'ER_PARSE_ERROR': 'Parece que hubo un pequeño error en la forma en que formulaste tu pregunta SQL. ¿Podemos revisarlo juntos?',
      'ER_DATA_TOO_LONG': 'Lo siento, pero los datos que estás intentando ingresar son demasiado largos. ¿Puedes reducirlos un poco?',
      'ER_ACCESS_DENIED_ERROR': '¡Detente! Acceso denegado. Necesitarás permisos especiales para realizar esta operación.',
      'ECONNREFUSED': 'Oops, no podemos acceder a la base de datos en este momento. ¿Verificaste la conexión?',
      'ER_WRONG_ARGUMENTS': 'Oops, parece que hubo un problema con el formato. ¿Podrías revisar los datos ingresados?'    
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
