export interface Usuario {
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
}