
class ParaleloEstudiante {
  PRLL_EST_ID: string;
    PRLL_ID: string;
    MTR_ID: string;
    ESTADO: boolean;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(PRLL_EST_ID: string, PRLL_ID: string, MTR_ID: string, ESTADO: boolean, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.PRLL_EST_ID = PRLL_EST_ID;
      this.PRLL_ID = PRLL_ID;
      this.MTR_ID = MTR_ID;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
      this.FECHA_CREACION = FECHA_CREACION;
    }

    

}
export default ParaleloEstudiante;
