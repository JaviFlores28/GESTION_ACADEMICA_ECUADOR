
import { Router } from 'express';
const router = Router();
import CalificacionesCualitativasNegocio from '../Negocio/CalificacionesCualitativasNegocio';
import CalificacionesCualitativasEntidad from '../Entidades/CalificacionesCualitativasEntidad';

router.post('/calificacionescualitativas', async (req, res) => {
   try {
const calificaciones_cualitativas: CalificacionesCualitativasEntidad = req.body;
const response = await CalificacionesCualitativasNegocio.insert(calificaciones_cualitativas);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/calificacionescualitativas', async (req, res) => {
  try {
    const  calificaciones_cualitativas: CalificacionesCualitativasEntidad = req.body;
    const response = await CalificacionesCualitativasNegocio.update(calificaciones_cualitativas);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/calificacionescualitativas', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await CalificacionesCualitativasNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/calificacionescualitativas', async (req, res) => {
   try {
    let  calificaciones_cualitativas;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    if (by === 'all') {
      
      calificaciones_cualitativas = await CalificacionesCualitativasNegocio.getAll();
    } else if (by === 'enabled') {
      
      calificaciones_cualitativas = await CalificacionesCualitativasNegocio.getEnabled();
    } else if (by === 'id') {
      const id = req.query.id as string;
      calificaciones_cualitativas = await CalificacionesCualitativasNegocio.getById(id);
    } 
    res.json(calificaciones_cualitativas);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

export default router;
