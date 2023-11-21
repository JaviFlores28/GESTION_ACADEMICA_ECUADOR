class CalificacionesCuantitativasEntidad {
  CAL_ID: string;
  PRF_ASG_PRLL_ID: string;
  EST_CRS_PRLL_ID: string;
  PRCL_ID: string;
  CALIFICACION: number;
  CREADOR_ID: string;

  constructor(CAL_ID: string, PRF_ASG_PRLL_ID: string, EST_CRS_PRLL_ID: string, PRCL_ID: string, CALIFICACION: number, CREADOR_ID: string) {
    this.CAL_ID = CAL_ID;
    this.PRF_ASG_PRLL_ID = PRF_ASG_PRLL_ID;
    this.EST_CRS_PRLL_ID = EST_CRS_PRLL_ID;
    this.PRCL_ID = PRCL_ID;
    this.CALIFICACION = CALIFICACION;
    this.CREADOR_ID = CREADOR_ID;
  }

  toArrayInsert(): any[] {
    return [this.CAL_ID, this.PRF_ASG_PRLL_ID, this.EST_CRS_PRLL_ID, this.PRCL_ID, this.CALIFICACION, this.CREADOR_ID];
  }

  toArrayUpdate(): any[] {
    return [this.PRF_ASG_PRLL_ID, this.EST_CRS_PRLL_ID, this.PRCL_ID, this.CALIFICACION, this.CAL_ID];
  }
}

export default CalificacionesCuantitativasEntidad;
