
class Paralelo {
  PRLL_ID: string;
    PRLL_NOM: string;
    CRS_ID: string;
    AL_ID: string;
    ESTADO: boolean;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(PRLL_ID: string, PRLL_NOM: string, CRS_ID: string, AL_ID: string, ESTADO: boolean, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.PRLL_ID = PRLL_ID;
      this.PRLL_NOM = PRLL_NOM;
      this.CRS_ID = CRS_ID;
      this.AL_ID = AL_ID;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
      this.FECHA_CREACION = FECHA_CREACION;
    }

    

}
export default Paralelo;
