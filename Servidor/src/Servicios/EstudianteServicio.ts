
import { Router } from 'express';
const router = Router();
import EstudianteNegocio from '../Negocio/EstudianteNegocio';
import EstudianteEntidad from '../Entidades/EstudianteEntidad';

router.post('/estudiante', async (req, res) => {
   try {
const estudiante: EstudianteEntidad = req.body;
const response = await EstudianteNegocio.insert(estudiante);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/estudiante', async (req, res) => {
  try {
    const  estudiante: EstudianteEntidad = req.body;
    const response = await EstudianteNegocio.update(estudiante);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/estudiante', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await EstudianteNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/estudiante', async (req, res) => {
   try {
    let  estudiante;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    if (by === 'all') {
      
      estudiante = await EstudianteNegocio.getAll();
    } else if (by === 'enabled') {
      
      estudiante = await EstudianteNegocio.getEnabled();
    } else if (by === 'id') {
      const id = req.query.id as string;
      estudiante = await EstudianteNegocio.getById(id);
    } 
    res.json(estudiante);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

export default router;
