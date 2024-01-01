
class ParaleloEntidad {
  PRLL_ID: string;
  PRLL_NOM: string;
  ESTADO: number;

  constructor(PRLL_ID: string, PRLL_NOM: string, ESTADO: number) {
    this.PRLL_ID = PRLL_ID;
    this.PRLL_NOM = PRLL_NOM;
    this.ESTADO = ESTADO;
  }

  toArrayInsert(): any[] {
    return [this.PRLL_ID, this.PRLL_NOM, this.ESTADO];
  }

  toArrayUpdate(): any[] {
    return [this.PRLL_NOM, this.ESTADO, this.PRLL_ID];
  }
}

export default ParaleloEntidad;
