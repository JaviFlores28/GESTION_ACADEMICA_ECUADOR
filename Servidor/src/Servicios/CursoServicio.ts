
import { Router } from 'express';
const router = Router();
import CursoNegocio from '../Negocio/CursoNegocio';
import CursoEntidad from '../Entidades/CursoEntidad';

router.post('/curso', async (req, res) => {
   try {
const curso: CursoEntidad = req.body;
const response = await CursoNegocio.insert(curso);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/curso', async (req, res) => {
  try {
    const  curso: CursoEntidad = req.body;
    const response = await CursoNegocio.update(curso);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/curso', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await CursoNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/curso', async (req, res) => {
   try {
    let  curso;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    if (by === 'all') {
      
      curso = await CursoNegocio.getAll();
    } else if (by === 'enabled') {
      
      curso = await CursoNegocio.getEnabled();
    } else if (by === 'id') {
      const id = req.query.id as string;
      curso = await CursoNegocio.getById(id);
    } 
    res.json(curso);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

export default router;
