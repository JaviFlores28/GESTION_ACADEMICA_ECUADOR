
import { Router } from 'express';
const router = Router();
import EstudianteNegocio from '../Negocio/EstudianteNegocio';
import EstudianteEntidad from '../Entidades/EstudianteEntidad';
import { TypeRequest } from '../sistema/Interfaces/TypeRequest';

router.post('/estudiante', async (req, res) => {
   try {
const estudiante: EstudianteEntidad = req.body;
const response = await EstudianteNegocio.insert(estudiante);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.put('/estudiante', async (req, res) => {
  try {
    const  estudiante: EstudianteEntidad = req.body;
    const response = await EstudianteNegocio.update(estudiante);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.code });
   }
});

router.patch('/estudiante', async (req, res) => {
   try {
    const { masivo, type, data}: TypeRequest = req.body;
    let response;
    if(masivo && type === 'updateEstado'){
      response = await EstudianteNegocio.updateEstado(data);
    }else if(masivo && type === 'delete'){
      //response = await EstudianteNegocio.updateEstado(data);
    }
      
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});


router.delete('/estudiante', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await EstudianteNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

  router.get('/estudiante', async (req, res) => {
    try {
      let estudiante;
      const by = req.query.by as string;
      if (!by) {
        return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
      }
      const id = req.query.id as string;
      
      switch (by) {
        case 'all':
          estudiante = await EstudianteNegocio.getAll();
          break;
        case 'enabled':
          estudiante = await EstudianteNegocio.getEnabled();
          break;
        case 'id':
          estudiante = await EstudianteNegocio.getById(id);
          break;
          
        default:
          return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
      }
      res.json(estudiante);
    } catch (error: any) {
      res.status(500).json({ message: error.code });
    }
  });
  
export default router;
