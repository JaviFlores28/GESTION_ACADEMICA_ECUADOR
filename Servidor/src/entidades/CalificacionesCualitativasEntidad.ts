
class CalificacionesCualitativasEntidad {
  CAL_ID: string;
  PRF_ASG_PRLL_ID: string;
  EST_CRS_PRLL_ID: string;
  PRD_ID: string;
  CALIFICACION: string;
  ESTADO: number;

  constructor(CAL_ID: string, PRF_ASG_PRLL_ID: string, EST_CRS_PRLL_ID: string, PRD_ID: string, CALIFICACION: string, ESTADO: number) {
    this.CAL_ID = CAL_ID;
    this.PRF_ASG_PRLL_ID = PRF_ASG_PRLL_ID;
    this.EST_CRS_PRLL_ID = EST_CRS_PRLL_ID;
    this.PRD_ID = PRD_ID;
    this.CALIFICACION = CALIFICACION;
    this.ESTADO = ESTADO;
  }

  toArrayInsert(): any[] {
    return [this.CAL_ID, this.PRF_ASG_PRLL_ID, this.EST_CRS_PRLL_ID, this.PRD_ID, this.CALIFICACION, this.ESTADO];
  }

  toArrayUpdate(): any[] {
    return [this.PRF_ASG_PRLL_ID, this.EST_CRS_PRLL_ID, this.PRD_ID, this.CALIFICACION, this.ESTADO, this.CAL_ID];
  }
}

export default CalificacionesCualitativasEntidad;
