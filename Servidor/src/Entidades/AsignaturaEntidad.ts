
class Asignatura {
  ASG_ID: string;
    ASG_NOM: string;
    ASG_TIPO: string;
    AREA_ID: string;
    CRS_ID: string;
    ESTADO: boolean;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(ASG_ID: string, ASG_NOM: string, ASG_TIPO: string, AREA_ID: string, CRS_ID: string, ESTADO: boolean, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.ASG_ID = ASG_ID;
      this.ASG_NOM = ASG_NOM;
      this.ASG_TIPO = ASG_TIPO;
      this.AREA_ID = AREA_ID;
      this.CRS_ID = CRS_ID;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
      this.FECHA_CREACION = FECHA_CREACION;
    }

    

}
export default Asignatura;
