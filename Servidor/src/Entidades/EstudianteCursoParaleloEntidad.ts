
class EstudianteCursoParaleloEntidad {
  EST_CRS_PRLL_ID: string;
    EST_ID: string;
    AL_ID: string;
    CRS_ID: string;
    PRLL_ID: string;
    PASE: string;
    ESTADO: number;
    CREADOR_ID: string;    
    constructor(EST_CRS_PRLL_ID: string, EST_ID: string, AL_ID: string, CRS_ID: string, PRLL_ID: string, PASE: string, ESTADO: number, CREADOR_ID: string) {
       this.EST_CRS_PRLL_ID = EST_CRS_PRLL_ID;
      this.EST_ID = EST_ID;
      this.AL_ID = AL_ID;
      this.CRS_ID = CRS_ID;
      this.PRLL_ID = PRLL_ID;
      this.PASE = PASE;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
    }

    toArrayInsert(): any[] {
      return [this.EST_CRS_PRLL_ID,this.EST_ID,this.AL_ID,this.CRS_ID,this.PRLL_ID,this.PASE,this.ESTADO,this.CREADOR_ID];
    } 
    toArrayUpdate(): any[] {
      return [this.EST_ID,this.AL_ID,this.CRS_ID,this.PRLL_ID,this.PASE,this.ESTADO, this.EST_CRS_PRLL_ID];
    }
}

export default EstudianteCursoParaleloEntidad;
