
      class EstudianteCursoEntidad {
        EST_CRS_ID: string;
    EST_ID: string;
    CRS_ID: string;
    ESTADO: number; 
           
          constructor(EST_CRS_ID: string, EST_ID: string, CRS_ID: string, ESTADO: number) {
             this.EST_CRS_ID = EST_CRS_ID;
      this.EST_ID = EST_ID;
      this.CRS_ID = CRS_ID;
      this.ESTADO = ESTADO;
          }
      
          toArrayInsert(): any[] {
            return [this.EST_CRS_ID,this.EST_ID,this.CRS_ID,this.ESTADO];
          }
      
          toArrayUpdate(): any[] {
            return [this.EST_ID,this.CRS_ID,this.ESTADO, this.EST_CRS_ID];
          }
      }
      
      export default EstudianteCursoEntidad;
      