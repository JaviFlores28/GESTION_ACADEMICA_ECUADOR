class AnioLectivoEntidad {
  AL_ID: string;
  AL_NOM: string;
  AL_INICIO: Date;
  AL_FIN: Date;
  AL_POR_PRD: number;
  AL_POR_EXAM: number;
  CLFN_MIN_APR: number;
  CLFN_MIN_PERD: number;
  NUM_PRD: number;
  NUM_EXAM: number;
  NUM_PRCL: number;
  NUM_SUSP: number;
  ESTADO: number;
  CREADOR_ID: string;

  constructor(AL_ID: string, AL_NOM: string, AL_INICIO: Date, AL_FIN: Date, AL_POR_PRD: number, AL_POR_EXAM: number, CLFN_MIN_APR: number, CLFN_MIN_PERD: number, NUM_PRD: number, NUM_EXAM: number, NUM_PRCL: number, NUM_SUSP: number, ESTADO: number, CREADOR_ID: string) {
    this.AL_ID = AL_ID;
    this.AL_NOM = AL_NOM;
    this.AL_INICIO = AL_INICIO;
    this.AL_FIN = AL_FIN;
    this.AL_POR_PRD = AL_POR_PRD;
    this.AL_POR_EXAM = AL_POR_EXAM;
    this.CLFN_MIN_APR = CLFN_MIN_APR;
    this.CLFN_MIN_PERD = CLFN_MIN_PERD;
    this.NUM_PRD = NUM_PRD;
    this.NUM_EXAM = NUM_EXAM;
    this.NUM_PRCL = NUM_PRCL;
    this.NUM_SUSP = NUM_SUSP;
    this.ESTADO = ESTADO;
    this.CREADOR_ID = CREADOR_ID;
  }

  toArrayInsert(): any[] {
    return [this.AL_ID, this.AL_NOM, this.AL_INICIO, this.AL_FIN, this.AL_POR_PRD, this.AL_POR_EXAM, this.CLFN_MIN_APR, this.CLFN_MIN_PERD, this.NUM_PRD, this.NUM_EXAM, this.NUM_PRCL, this.NUM_SUSP, this.ESTADO, this.CREADOR_ID];
  }

  toArrayUpdate(): any[] {
    return [this.AL_NOM, this.AL_INICIO, this.AL_FIN, this.AL_POR_PRD, this.AL_POR_EXAM, this.CLFN_MIN_APR, this.CLFN_MIN_PERD, this.NUM_PRD, this.NUM_EXAM, this.NUM_PRCL, this.NUM_SUSP, this.ESTADO, this.AL_ID];
  }
}

export default AnioLectivoEntidad;
