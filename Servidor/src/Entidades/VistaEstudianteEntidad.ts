
class VistaEstudianteEntidad {
  ID: string;
    EST_DNI: string;
    EST_NOM: string;
    REPRESENTANTE: string;
    ESTADO: number;    
    constructor(ID: string, EST_DNI: string, EST_NOM: string, REPRESENTANTE: string, ESTADO: number) {
       this.ID = ID;
      this.EST_DNI = EST_DNI;
      this.EST_NOM = EST_NOM;
      this.REPRESENTANTE = REPRESENTANTE;
      this.ESTADO = ESTADO;
    }

    toArrayInsert(): any[] {
      return [this.ID,this.EST_DNI,this.EST_NOM,this.REPRESENTANTE,this.ESTADO];
    } 
    toArrayUpdate(): any[] {
      return [this.ID,this.EST_DNI,this.EST_NOM,this.REPRESENTANTE,this.ESTADO, this.ID];
    }
}

export default VistaEstudianteEntidad;
