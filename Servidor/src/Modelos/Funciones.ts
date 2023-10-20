import * as CryptoJS from 'crypto-js';

import * as dotenv from 'dotenv';
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

}

export default Funciones