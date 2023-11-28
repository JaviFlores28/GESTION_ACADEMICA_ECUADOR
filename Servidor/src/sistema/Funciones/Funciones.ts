import CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';
/* import winston from 'winston';
 */
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
