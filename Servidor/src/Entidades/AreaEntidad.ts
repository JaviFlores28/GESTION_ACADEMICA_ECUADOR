
class AreaEntidad {
  AREA_ID: string;
    AREA_NOM: string;
    ESTADO: number;
    CREADOR_ID: string;    
    constructor(AREA_ID: string, AREA_NOM: string, ESTADO: number, CREADOR_ID: string) {
       this.AREA_ID = AREA_ID;
      this.AREA_NOM = AREA_NOM;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
    }

    toArrayInsert(): any[] {
      return [this.AREA_ID,this.AREA_NOM,this.ESTADO,this.CREADOR_ID];
    } 
    toArrayUpdate(): any[] {
      return [this.AREA_NOM,this.ESTADO, this.AREA_ID];
    }
}

export default AreaEntidad;
