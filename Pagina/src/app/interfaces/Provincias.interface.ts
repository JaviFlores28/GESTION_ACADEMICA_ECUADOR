export interface Provincia {
  [key: string]: {
    provincia: string;
    cantones: {
      [key: string]: {
        canton: string;
        parroquias: {
          [key: string]: string;
        };
      };
    };
  };
}
