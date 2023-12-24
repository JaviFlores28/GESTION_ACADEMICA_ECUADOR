
class UsuarioEntidad {
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
  FA_KEY: string;
  HAS_2FA: string;
  ROL_PRF: number;
  ROL_REPR: number;
  ROL_ADMIN: number;
  ESTADO: number;


  constructor(USR_ID: string, USR_DNI: string, USR_NOM: string, USR_NOM2: string, USR_APE: string, USR_APE2: string, USR_DIR: string, USR_TEL: string, USR_CEL: string, USR_EMAIL: string, USR_FECH_NAC: Date, USR_GEN: string, USUARIO: string, USR_PSWD: string, FA_KEY: string, HAS_2FA: string, ROL_PRF: number, ROL_REPR: number, ROL_ADMIN: number, ESTADO: number) {
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
    this.USUARIO = USUARIO;
    this.USR_PSWD = USR_PSWD;
    this.FA_KEY = FA_KEY;
    this.HAS_2FA = HAS_2FA;
    this.ROL_PRF = ROL_PRF;
    this.ROL_REPR = ROL_REPR;
    this.ROL_ADMIN = ROL_ADMIN;
    this.ESTADO = ESTADO;
  }

  toArrayInsert(): any[] {
    return [this.USR_ID, this.USR_DNI, this.USR_NOM, this.USR_NOM2, this.USR_APE, this.USR_APE2, this.USR_DIR, this.USR_TEL, this.USR_CEL, this.USR_EMAIL, this.USR_FECH_NAC, this.USR_GEN, this.USUARIO, this.USR_PSWD, this.FA_KEY, this.HAS_2FA, this.ROL_PRF, this.ROL_REPR, this.ROL_ADMIN, this.ESTADO];
  }

  toArrayUpdate(): any[] {
    return [this.USR_DNI, this.USR_NOM, this.USR_NOM2, this.USR_APE, this.USR_APE2, this.USR_DIR, this.USR_TEL, this.USR_CEL, this.USR_EMAIL, this.USR_FECH_NAC, this.USR_GEN, this.ROL_PRF, this.ROL_REPR, this.ROL_ADMIN, this.ESTADO, this.USR_ID];
  }
}

export default UsuarioEntidad;
