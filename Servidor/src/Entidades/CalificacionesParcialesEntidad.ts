
class CalificacionesParciales {
  CAL_ID: string;
    PRF_ASG_PRLL_ID: string;
    PRLL_EST_ID: string;
    PRCL_ID: string;
    CALIFICACION: number;
    ESTADO: boolean;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(CAL_ID: string, PRF_ASG_PRLL_ID: string, PRLL_EST_ID: string, PRCL_ID: string, CALIFICACION: number, ESTADO: boolean, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.CAL_ID = CAL_ID;
      this.PRF_ASG_PRLL_ID = PRF_ASG_PRLL_ID;
      this.PRLL_EST_ID = PRLL_EST_ID;
      this.PRCL_ID = PRCL_ID;
      this.CALIFICACION = CALIFICACION;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
      this.FECHA_CREACION = FECHA_CREACION;
    }

    

}
export default CalificacionesParciales;
