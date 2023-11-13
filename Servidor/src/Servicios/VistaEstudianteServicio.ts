
import { Router } from 'express';
const router = Router();
import VistaEstudianteNegocio from '../Negocio/VistaEstudianteNegocio';
import VistaEstudianteEntidad from '../Entidades/VistaEstudianteEntidad';

router.post('/vistaestudiante', async (req, res) => {
   try {
const vista_estudiante: VistaEstudianteEntidad = req.body;
const response = await VistaEstudianteNegocio.insert(vista_estudiante);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/vistaestudiante', async (req, res) => {
  try {
    const  vista_estudiante: VistaEstudianteEntidad = req.body;
    const response = await VistaEstudianteNegocio.update(vista_estudiante);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/vistaestudiante', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await VistaEstudianteNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/vistaestudiante', async (req, res) => {
   try {
    let  vista_estudiante;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    if (by === 'all') {
      
      vista_estudiante = await VistaEstudianteNegocio.getAll();
    } else if (by === 'enabled') {
      
      vista_estudiante = await VistaEstudianteNegocio.getEnabled();
    } else if (by === 'id') {
      const id = req.query.id as string;
      vista_estudiante = await VistaEstudianteNegocio.getById(id);
    } 
    res.json(vista_estudiante);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

export default router;
