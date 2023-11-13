
import { Router } from 'express';
const router = Router();
import EstudianteCursoParaleloNegocio from '../Negocio/EstudianteCursoParaleloNegocio';
import EstudianteCursoParaleloEntidad from '../Entidades/EstudianteCursoParaleloEntidad';

router.post('/estudiantecursoparalelo', async (req, res) => {
   try {
const estudiante_curso_paralelo: EstudianteCursoParaleloEntidad = req.body;
const response = await EstudianteCursoParaleloNegocio.insert(estudiante_curso_paralelo);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/estudiantecursoparalelo', async (req, res) => {
  try {
    const  estudiante_curso_paralelo: EstudianteCursoParaleloEntidad = req.body;
    const response = await EstudianteCursoParaleloNegocio.update(estudiante_curso_paralelo);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/estudiantecursoparalelo', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await EstudianteCursoParaleloNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/estudiantecursoparalelo', async (req, res) => {
   try {
    let  estudiante_curso_paralelo;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    if (by === 'all') {
      
      estudiante_curso_paralelo = await EstudianteCursoParaleloNegocio.getAll();
    } else if (by === 'enabled') {
      
      estudiante_curso_paralelo = await EstudianteCursoParaleloNegocio.getEnabled();
    } else if (by === 'id') {
      const id = req.query.id as string;
      estudiante_curso_paralelo = await EstudianteCursoParaleloNegocio.getById(id);
    } 
    res.json(estudiante_curso_paralelo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

export default router;
