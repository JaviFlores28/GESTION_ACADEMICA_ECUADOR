
class Matricula {
  MTR_ID: string;
    CRS_ID: string;
    EST_ID: string;
    ESTADO: boolean;
    PASE: string;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(MTR_ID: string, CRS_ID: string, EST_ID: string, ESTADO: boolean, PASE: string, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.MTR_ID = MTR_ID;
      this.CRS_ID = CRS_ID;
      this.EST_ID = EST_ID;
      this.ESTADO = ESTADO;
      this.PASE = PASE;
      this.CREADOR_ID = CREADOR_ID;
      this.FECHA_CREACION = FECHA_CREACION;
    }

    

}
export default Matricula;
