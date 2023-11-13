
class CalificacionesCualitativasEntidad {
  CAL_ID: string;
    PRF_ASG_PRLL_ID: string;
    EST_CRS_PRLL_ID: string;
    CALIFICACION: string;
    PRD_ID: string;
    ESTADO: number;
    CREADOR_ID: string;    
    constructor(CAL_ID: string, PRF_ASG_PRLL_ID: string, EST_CRS_PRLL_ID: string, CALIFICACION: string, PRD_ID: string, ESTADO: number, CREADOR_ID: string) {
       this.CAL_ID = CAL_ID;
      this.PRF_ASG_PRLL_ID = PRF_ASG_PRLL_ID;
      this.EST_CRS_PRLL_ID = EST_CRS_PRLL_ID;
      this.CALIFICACION = CALIFICACION;
      this.PRD_ID = PRD_ID;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
    }

    toArrayInsert(): any[] {
      return [this.CAL_ID,this.PRF_ASG_PRLL_ID,this.EST_CRS_PRLL_ID,this.CALIFICACION,this.PRD_ID,this.ESTADO,this.CREADOR_ID];
    } 
    toArrayUpdate(): any[] {
      return [this.PRF_ASG_PRLL_ID,this.EST_CRS_PRLL_ID,this.CALIFICACION,this.PRD_ID,this.ESTADO, this.CAL_ID];
    }
}

export default CalificacionesCualitativasEntidad;
