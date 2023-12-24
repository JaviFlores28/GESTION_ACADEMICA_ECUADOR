export interface Autentificacion {
    USR_ID: string;
    USR_DNI: string;
    USR_NOM: string;
    USR_EMAIL: string;
    USUARIO: string;
    USR_PSWD: string;
    HAS_2FA: number;
    FA_KEY: string;
    ROL_PRF: number;
    ROL_REPR: number;
    ROL_ADMIN: number;
    ESTADO: number;
    AUTHENTICATED?: boolean;
}