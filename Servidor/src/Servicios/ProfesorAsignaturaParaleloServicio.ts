
import { Router } from 'express';
const router = Router();
import ProfesorAsignaturaParaleloNegocio from '../Negocio/ProfesorAsignaturaParaleloNegocio';
import ProfesorAsignaturaParaleloEntidad from '../Entidades/ProfesorAsignaturaParaleloEntidad';
import { TypeRequest } from '../sistema/Interfaces/TypeRequest';

router.post('/profesorasignaturaparalelo', async (req, res) => {
   try {
const profesor_asignatura_paralelo: ProfesorAsignaturaParaleloEntidad = req.body;
const response = await ProfesorAsignaturaParaleloNegocio.insert(profesor_asignatura_paralelo);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.put('/profesorasignaturaparalelo', async (req, res) => {
  try {
    const  profesor_asignatura_paralelo: ProfesorAsignaturaParaleloEntidad = req.body;
    const response = await ProfesorAsignaturaParaleloNegocio.update(profesor_asignatura_paralelo);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.code });
   }
});

router.patch('/profesorasignaturaparalelo', async (req, res) => {
   try {
    const { masivo, type, data}: TypeRequest = req.body;
    let response;
    if(masivo && type === 'updateEstado'){
      response = await ProfesorAsignaturaParaleloNegocio.updateEstado(data);
    }else if(masivo && type === 'delete'){
      //response = await ProfesorAsignaturaParaleloNegocio.updateEstado(data);
    }
      
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});


router.delete('/profesorasignaturaparalelo', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await ProfesorAsignaturaParaleloNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

  router.get('/profesorasignaturaparalelo', async (req, res) => {
    try {
      let profesor_asignatura_paralelo;
      const by = req.query.by as string;
      if (!by) {
        return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
      }
      const id = req.query.id as string;
      
      switch (by) {
        case 'all':
          profesor_asignatura_paralelo = await ProfesorAsignaturaParaleloNegocio.getAll();
          break;
        case 'enabled':
          profesor_asignatura_paralelo = await ProfesorAsignaturaParaleloNegocio.getEnabled();
          break;
        case 'id':
          profesor_asignatura_paralelo = await ProfesorAsignaturaParaleloNegocio.getById(id);
          break;
          
        default:
          return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
      }
      res.json(profesor_asignatura_paralelo);
    } catch (error: any) {
      res.status(500).json({ message: error.code });
    }
  });
  
export default router;
