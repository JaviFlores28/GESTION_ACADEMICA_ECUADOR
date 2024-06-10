class ProfesorAsignaturaParaleloEntidad {
  PRF_ASG_PRLL_ID: string;
  ASG_ID: string;
  PRF_ID: string;
  AL_ID: string;
  CRS_ID: string;
  PRLL_ID: string;
  ESTADO: number;

  constructor(PRF_ASG_PRLL_ID: string, ASG_ID: string, PRF_ID: string, AL_ID: string, CRS_ID: string, PRLL_ID: string, ESTADO: number) {
    this.PRF_ASG_PRLL_ID = PRF_ASG_PRLL_ID;
    this.ASG_ID = ASG_ID;
    this.PRF_ID = PRF_ID;
    this.AL_ID = AL_ID;
    this.CRS_ID = CRS_ID;
    this.PRLL_ID = PRLL_ID;
    this.ESTADO = ESTADO;
  }

  toArrayInsert(): any[] {
    return [this.PRF_ASG_PRLL_ID, this.ASG_ID, this.PRF_ID, this.AL_ID, this.CRS_ID, this.PRLL_ID, this.ESTADO];
  }

  toArrayUpdate(): any[] {
    return [this.ASG_ID, this.PRF_ID, this.AL_ID, this.CRS_ID, this.PRLL_ID, this.ESTADO, this.PRF_ASG_PRLL_ID];
  }
}

export default ProfesorAsignaturaParaleloEntidad;
