
class ParcialEntidad {
  PRCL_ID: string;
  PRCL_NOM: string;
  PRCL_INI: Date;
  PRCL_FIN: Date;
  ESTADO: number;
  PRCL_TIPO: string;
  PRD_ID: string;

  constructor(PRCL_ID: string, PRCL_NOM: string, PRCL_INI: Date, PRCL_FIN: Date, ESTADO: number, PRCL_TIPO: string, PRD_ID: string) {
    this.PRCL_ID = PRCL_ID;
    this.PRCL_NOM = PRCL_NOM;
    this.PRCL_INI = PRCL_INI;
    this.PRCL_FIN = PRCL_FIN;
    this.ESTADO = ESTADO;
    this.PRCL_TIPO = PRCL_TIPO;
    this.PRD_ID = PRD_ID;
  }

  toArrayInsert(): any[] {
    return [this.PRCL_ID, this.PRCL_NOM, this.PRCL_INI, this.PRCL_FIN, this.ESTADO, this.PRCL_TIPO, this.PRD_ID];
  }

  toArrayUpdate(): any[] {
    return [this.PRCL_NOM, this.PRCL_INI, this.PRCL_FIN, this.ESTADO, this.PRCL_TIPO, this.PRD_ID, this.PRCL_ID];
  }
}

export default ParcialEntidad;
