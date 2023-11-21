class PeriodoEntidad {
  PRD_ID: string;
  PRD_NOM: string;
  PRD_TIPO: string;
  AL_ID: string;
  ESTADO: string;
  CREADOR_ID: string;

  constructor(PRD_ID: string, PRD_NOM: string, PRD_TIPO: string, AL_ID: string, ESTADO: string, CREADOR_ID: string) {
    this.PRD_ID = PRD_ID;
    this.PRD_NOM = PRD_NOM;
    this.PRD_TIPO = PRD_TIPO;
    this.AL_ID = AL_ID;
    this.ESTADO = ESTADO;
    this.CREADOR_ID = CREADOR_ID;
  }

  toArrayInsert(): any[] {
    return [this.PRD_ID, this.PRD_NOM, this.PRD_TIPO, this.AL_ID, this.ESTADO, this.CREADOR_ID];
  }

  toArrayUpdate(): any[] {
    return [this.PRD_NOM, this.PRD_TIPO, this.AL_ID, this.ESTADO, this.PRD_ID];
  }
}

export default PeriodoEntidad;
