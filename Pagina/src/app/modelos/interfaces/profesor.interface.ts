export interface Profesor {
  PRF_ID: string;
    PRF_FECH_INGR_INST: Date;
    PRF_FECH_INGR_MAG: Date;
    USR_ID: string;
    ESTADO: boolean;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;
}