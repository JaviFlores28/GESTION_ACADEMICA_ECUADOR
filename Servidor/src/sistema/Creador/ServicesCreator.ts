import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import Funciones from '../funciones/Funciones';

class ServicesCreator {
  tableName: string;
  capitalizedTableName: string;
  lowercaseTableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.capitalizedTableName = Funciones.stringToCapitalize(tableName);
    this.lowercaseTableName = Funciones.stringToCamelCase(tableName);
  }

  createGetRoute(): string {
    const otherGets = () => {
      switch (this.tableName) {
        case 'estudiante_curso':
          return `case 'noMatriculados':
              ${this.tableName} = await ${this.capitalizedTableName}Negocio.getNoMatriculados();
              break;
              case 'curso':
              ${this.tableName} = await ${this.capitalizedTableName}Negocio.getByCurso(id);
              break;`;
        case 'estudiante_curso_paralelo':
          return `case 'paralelo':
              ${this.tableName} = await ${this.capitalizedTableName}Negocio.getByParalelo(id);
              break;
              `;
        default:
          return '';
      }
    };

    const getroute = `
        router.get('/${this.lowercaseTableName}', async (req, res) => {
          try {
            let ${this.tableName};
            const by = req.query.by as string;
            if (!by) {
              return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
            }
            const id = req.query.id as string;
            ${this.tableName === 'usuario' ? `  const tipo = req.query.tipo as string;` : ''}
            switch (by) {
              case 'all':
                ${this.tableName} = await ${this.capitalizedTableName}Negocio.getAll(${this.tableName === 'usuario' ? `tipo` : ''});
                break;
              case 'enabled':
                ${this.tableName} = await ${this.capitalizedTableName}Negocio.getEnabled(${this.tableName === 'usuario' ? `tipo` : ''});
                break;
              case 'id':
                ${this.tableName} = await ${this.capitalizedTableName}Negocio.getById(id);
                break;
                ${otherGets()}
              default:
                return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
            }
            res.json(${this.tableName});
          } catch (error: any) {
            res.status(500).json({ message:error.message });
          }
        });`;

    return getroute;
  }

  createPostRoute(): string {
    const scriptUsuarioPost = `const { usuario, detalle } = req.body;
    const response = await ${this.capitalizedTableName}Negocio.insert(usuario, detalle);
    `;

    const scriptPost = `const ${this.tableName}: ${this.capitalizedTableName}Entidad = req.body;
    const response = await ${this.capitalizedTableName}Negocio.insert(${this.tableName});`;

    const scriptPostMasivo = `const { masivo, data }: TypeRequest = req.body;
      let response;
      if(!masivo){
         response = await ${this.capitalizedTableName}Negocio.insert(data);
      }else{
        response = await ${this.capitalizedTableName}Negocio.insertMasivo(data);
      }
    `;

    const typePost = () => {
      if (this.tableName === 'usuario') {
        return scriptUsuarioPost;
      } else if (this.tableName === 'estudiante_curso' || this.tableName === 'estudiante_curso_paralelo') {
        return scriptPostMasivo;
      } else {
        return scriptPost;
      }
    };

    const postroute = `
    router.post('/${this.lowercaseTableName}', async (req, res) => {
       try {
        ${typePost()}
        res.json(response);
      } catch (error: any) {
        res.status(500).json({ message:error.message });
      }
    });`;

    return postroute;
  }

  createPatchRoute(): string {

    const gets = () => {
      switch (this.tableName) {
        case 'usuario':
          return `case 'getByUser':
          response = await ${this.capitalizedTableName}Negocio.getByUser(data);
          break;`;
        case 'profesor_asignatura_paralelo':
          return `case 'getByPrf':
          response = await ${this.capitalizedTableName}Negocio.getByPrf(data);
          break;`;
        default:
          return '';
      }
    }

    const patchRoute = `
   router.patch('/${this.lowercaseTableName}', async (req, res) => {
      try {
       const {type, data}: TypeRequest = req.body;
       let response;
       switch (type) {
        case 'updateEstado':
          response = await ${this.capitalizedTableName}Negocio.updateEstado(data);
          break;
        case 'delete':
          // Handle delete case
          break;
        ${gets()}
        default:
          return res.status(400).json({ message: 'Tipo de solicitud inválido.' });
      }
       res.json(response);
     } catch (error: any) {
       res.status(500).json({ message:error.message });
     }
   });
   `;
    return patchRoute;
  }

  createPutRoute(): string {
    const putroute = `
    router.put('/${this.lowercaseTableName}', async (req, res) => {
      try {
        const  ${this.tableName}: ${this.capitalizedTableName}Entidad = req.body;
        const response = await ${this.capitalizedTableName}Negocio.update(${this.tableName});
        res.json(response);
      } catch (error: any) {
         res.status(500).json({ message:error.message });
       }
    });`;
    return putroute;
  }

  createDeleteRoute(): string {
    const deleteroute = `
      router.delete('/${this.lowercaseTableName}', async (req, res) => {
        try {
          const id = req.query.id as string;
          const response = await ${this.capitalizedTableName}Negocio.delete(id);
          res.json(response);
        } catch (error: any) {
          res.status(500).json({ message:error.message });
        }
      });`;
    return deleteroute;
  }

  async generateServiceFile(): Promise<void> {
    const content = `
      import { Router } from 'express';
      const router = Router();
      import ${this.capitalizedTableName}Negocio from '../negocio/${this.capitalizedTableName}Negocio';
      import ${this.capitalizedTableName}Entidad from '../entidades/${this.capitalizedTableName}Entidad';
      import { TypeRequest } from '../sistema/interfaces/TypeRequest';
      ${this.createPostRoute()}
      ${this.createPutRoute()}
      ${this.createPatchRoute()}
      ${this.createDeleteRoute()}
      ${this.createGetRoute()}
      export default router;
      `;
    const carpeta = path.join(__dirname, '../../servicios');
    const archivo = path.join(carpeta, `${this.capitalizedTableName}Servicio.ts`);

    if (!existsSync(carpeta)) {
      mkdirSync(carpeta, { recursive: true });
    }
    writeFileSync(archivo, content, 'utf8');
  }
}

export default ServicesCreator;
