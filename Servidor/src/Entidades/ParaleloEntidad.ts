class ParaleloEntidad {
  PRLL_ID: string;
  PRLL_NOM: string;
  ESTADO: number;
  CREADOR_ID: string;

  constructor(PRLL_ID: string, PRLL_NOM: string, ESTADO: number, CREADOR_ID: string) {
    this.PRLL_ID = PRLL_ID;
    this.PRLL_NOM = PRLL_NOM;
    this.ESTADO = ESTADO;
    this.CREADOR_ID = CREADOR_ID;
  }

  toArrayInsert(): any[] {
    return [this.PRLL_ID, this.PRLL_NOM, this.ESTADO, this.CREADOR_ID];
  }

  toArrayUpdate(): any[] {
    return [this.PRLL_NOM, this.ESTADO, this.PRLL_ID];
  }
}

export default ParaleloEntidad;
