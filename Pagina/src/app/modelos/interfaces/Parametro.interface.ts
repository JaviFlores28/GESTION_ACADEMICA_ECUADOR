export interface Parametro {
  PRMT_ID: string;
   PRMT_NOM: string;
   PRMT_DESCR: string;
   PRMT_URL_IMG: string;
   ESTADO: boolean;
   CREADOR_ID: string;
   FECHA_CREACION?:Date | undefined;
}