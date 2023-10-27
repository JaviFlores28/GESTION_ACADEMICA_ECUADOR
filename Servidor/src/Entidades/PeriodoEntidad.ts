
class Periodo {
  PRD_ID: string;
    PRD_NOM: string;
    PRD_TIPO: string;
    AL_ID: string;
    ESTADO: string;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(PRD_ID: string, PRD_NOM: string, PRD_TIPO: string, AL_ID: string, ESTADO: string, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.PRD_ID = PRD_ID;
      this.PRD_NOM = PRD_NOM;
      this.PRD_TIPO = PRD_TIPO;
      this.AL_ID = AL_ID;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
      this.FECHA_CREACION = FECHA_CREACION;
    }

    

}
export default Periodo;
