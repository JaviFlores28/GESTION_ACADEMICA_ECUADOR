
class CalificacionesPeriodo {
  CAL_ID: string;
    PRF_ASG_PRLL_ID: string;
    PRLL_EST_ID: string;
    CALIFICACION_CNTVA: number;
    CALIFICACION_CLTVA: string;
    PRD_ID: string;
    ESTADO: boolean;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(CAL_ID: string, PRF_ASG_PRLL_ID: string, PRLL_EST_ID: string, CALIFICACION_CNTVA: number, CALIFICACION_CLTVA: string, PRD_ID: string, ESTADO: boolean, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.CAL_ID = CAL_ID;
      this.PRF_ASG_PRLL_ID = PRF_ASG_PRLL_ID;
      this.PRLL_EST_ID = PRLL_EST_ID;
      this.CALIFICACION_CNTVA = CALIFICACION_CNTVA;
      this.CALIFICACION_CLTVA = CALIFICACION_CLTVA;
      this.PRD_ID = PRD_ID;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
      this.FECHA_CREACION = FECHA_CREACION;
    }

    

}
export default CalificacionesPeriodo;
