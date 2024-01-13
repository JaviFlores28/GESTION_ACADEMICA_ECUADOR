export interface Parroquia {
    [codigoParroquia: string]: string;
  }
  
  export interface Canton {
    canton: string;
    parroquias: Parroquia;
  }
  
  export interface Provincia {
    codigo: string,
    provincia: string
    /*cantones: {
      [codigoCanton: string]: Canton;
    };*/
  }
  
  export interface DatosJson {
    [codigoProvincia: string]: Provincia;
  }
