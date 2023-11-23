
import { Router } from 'express';
const router = Router();
import CalificacionesCuantitativasNegocio from '../negocio/CalificacionesCuantitativasNegocio';
import CalificacionesCuantitativasEntidad from '../entidades/CalificacionesCuantitativasEntidad';
import { TypeRequest } from '../sistema/interfaces/TypeRequest';

router.post('/calificacionescuantitativas', async (req, res) => {
   try {
const calificaciones_cuantitativas: CalificacionesCuantitativasEntidad = req.body;
const response = await CalificacionesCuantitativasNegocio.insert(calificaciones_cuantitativas);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.put('/calificacionescuantitativas', async (req, res) => {
  try {
    const  calificaciones_cuantitativas: CalificacionesCuantitativasEntidad = req.body;
    const response = await CalificacionesCuantitativasNegocio.update(calificaciones_cuantitativas);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.code });
   }
});

router.patch('/calificacionescuantitativas', async (req, res) => {
   try {
    const { masivo, type, data}: TypeRequest = req.body;
    let response;
    if(masivo && type === 'updateEstado'){
      response = await CalificacionesCuantitativasNegocio.updateEstado(data);
    }else if(masivo && type === 'delete'){
      //response = await CalificacionesCuantitativasNegocio.updateEstado(data);
    }
      
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});


router.delete('/calificacionescuantitativas', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await CalificacionesCuantitativasNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

  router.get('/calificacionescuantitativas', async (req, res) => {
    try {
      let calificaciones_cuantitativas;
      const by = req.query.by as string;
      if (!by) {
        return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
      }
      const id = req.query.id as string;
      
      switch (by) {
        case 'all':
          calificaciones_cuantitativas = await CalificacionesCuantitativasNegocio.getAll();
          break;
        case 'enabled':
          calificaciones_cuantitativas = await CalificacionesCuantitativasNegocio.getEnabled();
          break;
        case 'id':
          calificaciones_cuantitativas = await CalificacionesCuantitativasNegocio.getById(id);
          break;
          
        default:
          return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
      }
      res.json(calificaciones_cuantitativas);
    } catch (error: any) {
      res.status(500).json({ message: error.code });
    }
  });
  
export default router;
