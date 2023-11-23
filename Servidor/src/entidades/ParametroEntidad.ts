
class ParametroEntidad {
  PRMT_ID: string;
    PRMT_NOM: string;
    PRMT_DESCR: string;
    PRMT_URL_IMG: string;
    ESTADO: number;
    CREADOR_ID: string; 
     
    constructor(PRMT_ID: string, PRMT_NOM: string, PRMT_DESCR: string, PRMT_URL_IMG: string, ESTADO: number, CREADOR_ID: string) {
       this.PRMT_ID = PRMT_ID;
      this.PRMT_NOM = PRMT_NOM;
      this.PRMT_DESCR = PRMT_DESCR;
      this.PRMT_URL_IMG = PRMT_URL_IMG;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
    }

    toArrayInsert(): any[] {
      return [this.PRMT_ID,this.PRMT_NOM,this.PRMT_DESCR,this.PRMT_URL_IMG,this.ESTADO,this.CREADOR_ID];
    }

    toArrayUpdate(): any[] {
      return [this.PRMT_NOM,this.PRMT_DESCR,this.PRMT_URL_IMG,this.ESTADO, this.PRMT_ID];
    }
}

export default ParametroEntidad;
