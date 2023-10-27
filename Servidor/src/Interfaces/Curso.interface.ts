export interface Curso {
  CRS_ID: string;
    CRS_NOM: string;
    CRS_TIPO: string;
    CRS_ORDEN: number;
    ESTADO: boolean;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;
}