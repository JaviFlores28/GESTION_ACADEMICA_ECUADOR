
class AsignaturaEntidad {
  ASG_ID: string;
    ASG_NOM: string;
    ASG_TIPO: string;
    AREA_ID: string;
    ESTADO: number;
    CREADOR_ID: string;    
    constructor(ASG_ID: string, ASG_NOM: string, ASG_TIPO: string, AREA_ID: string, ESTADO: number, CREADOR_ID: string) {
       this.ASG_ID = ASG_ID;
      this.ASG_NOM = ASG_NOM;
      this.ASG_TIPO = ASG_TIPO;
      this.AREA_ID = AREA_ID;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
    }

    toArrayInsert(): any[] {
      return [this.ASG_ID,this.ASG_NOM,this.ASG_TIPO,this.AREA_ID,this.ESTADO,this.CREADOR_ID];
    } 
    toArrayUpdate(): any[] {
      return [this.ASG_NOM,this.ASG_TIPO,this.AREA_ID,this.ESTADO, this.ASG_ID];
    }
}

export default AsignaturaEntidad;
