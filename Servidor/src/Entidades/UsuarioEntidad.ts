import Funciones from "../Modelos/Funciones";
class Usuario {
  USR_ID: string;
  USR_DNI: string;
  USR_NOM: string;
  USR_NOM2: string;
  USR_APE: string;
  USR_APE2: string;
  USR_DIR: string;
  USR_TEL: string;
  USR_CEL: string;
  USR_EMAIL: string;
  USR_FECH_NAC: Date;
  USR_GEN: string;
  USUARIO: string;
  USR_PSWD: string;
  ROL_PRF: boolean;
  ROL_REPR: boolean;
  ROL_ADMIN: boolean;
  ESTADO: boolean;
  FECHA_CREACION?: Date | undefined;
  constructor(USR_ID: string, USR_DNI: string, USR_NOM: string, USR_NOM2: string, USR_APE: string, USR_APE2: string, USR_DIR: string, USR_TEL: string, USR_CEL: string, USR_EMAIL: string, USR_FECH_NAC: Date, USR_GEN: string, ROL_PRF: boolean, ROL_REPR: boolean, ROL_ADMIN: boolean, ESTADO: boolean, FECHA_CREACION?: Date | undefined) {
    this.USR_ID = USR_ID;
    this.USR_DNI = USR_DNI;
    this.USR_NOM = USR_NOM;
    this.USR_NOM2 = USR_NOM2;
    this.USR_APE = USR_APE;
    this.USR_APE2 = USR_APE2;
    this.USR_DIR = USR_DIR;
    this.USR_TEL = USR_TEL;
    this.USR_CEL = USR_CEL;
    this.USR_EMAIL = USR_EMAIL;
    this.USR_FECH_NAC = USR_FECH_NAC;
    this.USR_GEN = USR_GEN;
    this.USUARIO = this.crearUsuario(USR_DNI, USR_NOM, USR_NOM2, USR_APE);
    this.USR_PSWD = Funciones.encrypt(USR_DNI);
    this.ROL_PRF = ROL_PRF;
    this.ROL_REPR = ROL_REPR;
    this.ROL_ADMIN = ROL_ADMIN;
    this.ESTADO = ESTADO;
    this.FECHA_CREACION = FECHA_CREACION;
  }


  crearUsuario(dni: string, nom: string, nom2: string, ape: string) {
    let usr = '';
    usr += nom[0] || ''; // Agregamos el primer carácter de nom1 si existe
    usr += nom2[0] || '';// Usa ?. para evitar problemas con valores null o undefined
    usr += ape || '';
    usr += dni.substring(dni.length - 4); // Obtener los últimos 4 caracteres
    return usr;
  }

}
export default Usuario;
