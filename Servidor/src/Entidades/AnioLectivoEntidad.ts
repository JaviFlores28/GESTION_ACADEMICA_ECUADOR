
class AnioLectivo {
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
    FECHA_CREACION?: Date | undefined;    
    constructor(AL_ID: string, AL_NOM: string, AL_INICIO: Date, AL_FIN: Date, AL_POR_PRD: number, AL_POR_EXAM: number, CLFN__MIN_APR: number, CLFN__MIN_PERD: number, NUM_PRD: number, NUM_EXAM: number, NUM_PRCL: number, NUM_SUSP: number, ESTADO: boolean, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.AL_ID = AL_ID;
      this.AL_NOM = AL_NOM;
      this.AL_INICIO = AL_INICIO;
      this.AL_FIN = AL_FIN;
      this.AL_POR_PRD = AL_POR_PRD;
      this.AL_POR_EXAM = AL_POR_EXAM;
      this.CLFN__MIN_APR = CLFN__MIN_APR;
      this.CLFN__MIN_PERD = CLFN__MIN_PERD;
      this.NUM_PRD = NUM_PRD;
      this.NUM_EXAM = NUM_EXAM;
      this.NUM_PRCL = NUM_PRCL;
      this.NUM_SUSP = NUM_SUSP;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
      this.FECHA_CREACION = FECHA_CREACION;
    }

    

}
export default AnioLectivo;
