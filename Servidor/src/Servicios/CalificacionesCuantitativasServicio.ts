
import { Router } from 'express';
const router = Router();
import CalificacionesCuantitativasNegocio from '../Negocio/CalificacionesCuantitativasNegocio';
import CalificacionesCuantitativasEntidad from '../Entidades/CalificacionesCuantitativasEntidad';

router.post('/calificacionescuantitativas', async (req, res) => {
   try {
const calificaciones_cuantitativas: CalificacionesCuantitativasEntidad = req.body;
const response = await CalificacionesCuantitativasNegocio.insert(calificaciones_cuantitativas);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/calificacionescuantitativas', async (req, res) => {
  try {
    const  calificaciones_cuantitativas: CalificacionesCuantitativasEntidad = req.body;
    const response = await CalificacionesCuantitativasNegocio.update(calificaciones_cuantitativas);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.patch('/calificacionescuantitativas', async (req, res) => {
   try {
    const { masivo, data }: { masivo: boolean, data: any } = req.body;
    let response;
    if(!masivo){
      //response = await CalificacionesCuantitativasNegocio.updateEstado(data);
    }else{
      response = await CalificacionesCuantitativasNegocio.updateEstado(data);
    }    
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/calificacionescuantitativas', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await CalificacionesCuantitativasNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/calificacionescuantitativas', async (req, res) => {
   try {
    let  calificaciones_cuantitativas;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    if (by === 'all') {
      
      calificaciones_cuantitativas = await CalificacionesCuantitativasNegocio.getAll();
    } else if (by === 'enabled') {
      
      calificaciones_cuantitativas = await CalificacionesCuantitativasNegocio.getEnabled();
    } else if (by === 'id') {
      const id = req.query.id as string;
      calificaciones_cuantitativas = await CalificacionesCuantitativasNegocio.getById(id);
    } 
    res.json(calificaciones_cuantitativas);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

export default router;
