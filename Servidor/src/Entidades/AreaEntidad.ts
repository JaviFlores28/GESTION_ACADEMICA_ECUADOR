
class Area {
  AREA_ID: string;
    AREA_NOM: string;
    ESTADO: boolean;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(AREA_ID: string, AREA_NOM: string, ESTADO: boolean, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.AREA_ID = AREA_ID;
      this.AREA_NOM = AREA_NOM;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
      this.FECHA_CREACION = FECHA_CREACION;
    }

    

}
export default Area;
