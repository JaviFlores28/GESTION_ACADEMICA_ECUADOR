
      class AreaEntidad {
        AREA_ID: string;
    AREA_NOM: string;
    ESTADO: number; 
           
          constructor(AREA_ID: string, AREA_NOM: string, ESTADO: number) {
             this.AREA_ID = AREA_ID;
      this.AREA_NOM = AREA_NOM;
      this.ESTADO = ESTADO;
          }
      
          toArrayInsert(): any[] {
            return [this.AREA_ID,this.AREA_NOM,this.ESTADO];
          }
      
          toArrayUpdate(): any[] {
            return [this.AREA_NOM,this.ESTADO, this.AREA_ID];
          }
      }
      
      export default AreaEntidad;
      