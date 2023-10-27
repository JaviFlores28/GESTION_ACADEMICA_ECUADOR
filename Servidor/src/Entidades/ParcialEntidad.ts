
class Parcial {
  PRCL_ID: string;
    PRCL_NOM: string;
    PRCL_INI: Date;
    PRCL_FIN: Date;
    ESTADO: string;
    PRCL_TIPO: string;
    PRD_ID: string;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(PRCL_ID: string, PRCL_NOM: string, PRCL_INI: Date, PRCL_FIN: Date, ESTADO: string, PRCL_TIPO: string, PRD_ID: string, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.PRCL_ID = PRCL_ID;
      this.PRCL_NOM = PRCL_NOM;
      this.PRCL_INI = PRCL_INI;
      this.PRCL_FIN = PRCL_FIN;
      this.ESTADO = ESTADO;
      this.PRCL_TIPO = PRCL_TIPO;
      this.PRD_ID = PRD_ID;
      this.CREADOR_ID = CREADOR_ID;
      this.FECHA_CREACION = FECHA_CREACION;
    }

    

}
export default Parcial;
