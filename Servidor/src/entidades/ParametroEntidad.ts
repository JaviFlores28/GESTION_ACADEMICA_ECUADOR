
class ParametroEntidad {
  PRMT_ID: string;
  PRMT_NOM: string;
  PRMT_DESCR: string;
  PRMT_URL_IMG: string;
  ESTADO: number;

  constructor(PRMT_ID: string, PRMT_NOM: string, PRMT_DESCR: string, PRMT_URL_IMG: string, ESTADO: number) {
    this.PRMT_ID = PRMT_ID;
    this.PRMT_NOM = PRMT_NOM;
    this.PRMT_DESCR = PRMT_DESCR;
    this.PRMT_URL_IMG = PRMT_URL_IMG;
    this.ESTADO = ESTADO;
  }

  toArrayInsert(): any[] {
    return [this.PRMT_ID, this.PRMT_NOM, this.PRMT_DESCR, this.PRMT_URL_IMG, this.ESTADO];
  }

  toArrayUpdate(): any[] {
    return [this.PRMT_NOM, this.PRMT_DESCR, this.PRMT_URL_IMG, this.ESTADO, this.PRMT_ID];
  }
}

export default ParametroEntidad;
