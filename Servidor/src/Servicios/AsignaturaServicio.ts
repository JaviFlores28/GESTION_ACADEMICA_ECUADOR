
import { Router } from 'express';
const router = Router();
import AsignaturaNegocio from '../Negocio/AsignaturaNegocio';
import AsignaturaEntidad from '../Entidades/AsignaturaEntidad';

router.post('/asignatura', async (req, res) => {
   try {
const asignatura: AsignaturaEntidad = req.body;
const response = await AsignaturaNegocio.insert(asignatura);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/asignatura', async (req, res) => {
  try {
    const  asignatura: AsignaturaEntidad = req.body;
    const response = await AsignaturaNegocio.update(asignatura);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/asignatura', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await AsignaturaNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/asignatura', async (req, res) => {
   try {
    let  asignatura;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    if (by === 'all') {
      
      asignatura = await AsignaturaNegocio.getAll();
    } else if (by === 'enabled') {
      
      asignatura = await AsignaturaNegocio.getEnabled();
    } else if (by === 'id') {
      const id = req.query.id as string;
      asignatura = await AsignaturaNegocio.getById(id);
    } 
    res.json(asignatura);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

export default router;
