
      class EstudianteCursoParaleloEntidad {
        EST_CRS_PRLL_ID: string;
    EST_CRS_ID: string;
    AL_ID: string;
    PRLL_ID: string;
    PASE: string;
    ESTADO: number; 
           
          constructor(EST_CRS_PRLL_ID: string, EST_CRS_ID: string, AL_ID: string, PRLL_ID: string, PASE: string, ESTADO: number) {
             this.EST_CRS_PRLL_ID = EST_CRS_PRLL_ID;
      this.EST_CRS_ID = EST_CRS_ID;
      this.AL_ID = AL_ID;
      this.PRLL_ID = PRLL_ID;
      this.PASE = PASE;
      this.ESTADO = ESTADO;
          }
      
          toArrayInsert(): any[] {
            return [this.EST_CRS_PRLL_ID,this.EST_CRS_ID,this.AL_ID,this.PRLL_ID,this.PASE,this.ESTADO];
          }
      
          toArrayUpdate(): any[] {
            return [this.EST_CRS_ID,this.AL_ID,this.PRLL_ID,this.PASE,this.ESTADO, this.EST_CRS_PRLL_ID];
          }
      }
      
      export default EstudianteCursoParaleloEntidad;
      