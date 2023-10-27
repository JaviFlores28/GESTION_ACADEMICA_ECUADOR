export interface Matricula {
  MTR_ID: string;
    CRS_ID: string;
    EST_ID: string;
    ESTADO: boolean;
    PASE: string;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;
}