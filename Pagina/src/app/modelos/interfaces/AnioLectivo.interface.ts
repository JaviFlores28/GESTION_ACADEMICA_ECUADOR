export interface AnioLectivo {
  AL_ID: string;
   AL_NOM: string;
   AL_INICIO: Date;
   AL_FIN: Date;
   AL_POR_PRD: number;
   AL_POR_EXAM: number;
   CLFN__MIN_APR: number;
   CLFN__MIN_PERD: number;
   NUM_PRD: number;
   NUM_EXAM: number;
   NUM_PRCL: number;
   NUM_SUSP: number;
   ESTADO: boolean;
   CREADOR_ID: string;
   FECHA_CREACION?:Date | undefined;
}