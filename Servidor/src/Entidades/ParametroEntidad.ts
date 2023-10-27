
class Parametro {
  PRMT_ID: string;
    PRMT_NOM: string;
    PRMT_DESCR: string;
    PRMT_URL_IMG: string;
    ESTADO: boolean;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(PRMT_ID: string, PRMT_NOM: string, PRMT_DESCR: string, PRMT_URL_IMG: string, ESTADO: boolean, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.PRMT_ID = PRMT_ID;
      this.PRMT_NOM = PRMT_NOM;
      this.PRMT_DESCR = PRMT_DESCR;
      this.PRMT_URL_IMG = PRMT_URL_IMG;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
      this.FECHA_CREACION = FECHA_CREACION;
    }

    

}
export default Parametro;
