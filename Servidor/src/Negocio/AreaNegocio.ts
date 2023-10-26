
import baseDatos from '../Datos/BaseDatos';
import Area from '../Entidades/AreaEntidad';
import { v4 as uuidv4 } from 'uuid';


class AreaNegocio {
  
  static async getArea(): Promise<{ data: Area[], message: string }> {
    try {
      let data = 'SELECT * FROM area';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as Area[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async getEnabledArea(): Promise<{ data: Area[], message: string }> {
    try {
      let data = 'SELECT * FROM area where Estado=1';
      const [rows] = await baseDatos.execute<any>(data);
      return { data: rows as Area[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async searchById(id: String): Promise<{ data: Area | null; message: string }> {
    try {
      const [rows] = await baseDatos.execute<any>('SELECT * FROM area WHERE AREA_ID = ?', [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo Area no encontrado');
      }
      let newArea = rows[0] as Area;
      
      return { data: newArea, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  } 
  
  static async addArea(area: Area): Promise<{ data: string | null, message: string }> {
    try {
      if (!area.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Area no tiene la estructura esperada.');
      }
      area.AREA_ID = uuidv4(); //asigna un identificador unico
      
      let data = area.sqlInsert();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar Area');
      }
      return { data:area.AREA_ID, message: 'Se creo correctamente' }; // Retorna el ID del Area
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async deleteArea(id: String): Promise<{ data: boolean, message: string }> {
    try {
      const [result] = await baseDatos.execute<any>('delete FROM area WHERE AREA_ID = ?', [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo Area');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
  static async updateArea(area: Area): Promise<{ data: boolean, message: string }> {
    try {
      if (!area.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo Area no tiene la estructura esperada.');
      }
      let data = area.sqlUpdate();
      const [result] = await baseDatos.execute<any>(data.query, data.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar Area');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }
  
}
export default AreaNegocio;