export interface CalificacionesPeriodo {
  CAL_ID: string;
   PRF_ASG_PRLL_ID: string;
   PRLL_EST_ID: string;
   CALIFICACION_CNTVA: number;
   CALIFICACION_CLTVA: string;
   PRD_ID: string;
   ESTADO: boolean;
   CREADOR_ID: string;
   FECHA_CREACION?:Date | undefined;
}