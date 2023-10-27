
class Curso {
  CRS_ID: string;
    CRS_NOM: string;
    CRS_TIPO: string;
    CRS_ORDEN: number;
    ESTADO: boolean;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(CRS_ID: string, CRS_NOM: string, CRS_TIPO: string, CRS_ORDEN: number, ESTADO: boolean, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.CRS_ID = CRS_ID;
      this.CRS_NOM = CRS_NOM;
      this.CRS_TIPO = CRS_TIPO;
      this.CRS_ORDEN = CRS_ORDEN;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
      this.FECHA_CREACION = FECHA_CREACION;
    }

    

}
export default Curso;
