
import { Router } from 'express';
const router = Router();
import EstudianteCursoNegocio from '../Negocio/EstudianteCursoNegocio';
import EstudianteCursoEntidad from '../Entidades/EstudianteCursoEntidad';

router.post('/estudiantecurso', async (req, res) => {
   try {
const estudiante_curso: EstudianteCursoEntidad = req.body;
const response = await EstudianteCursoNegocio.insert(estudiante_curso);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/estudiantecurso', async (req, res) => {
  try {
    const  estudiante_curso: EstudianteCursoEntidad = req.body;
    const response = await EstudianteCursoNegocio.update(estudiante_curso);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/estudiantecurso', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await EstudianteCursoNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/estudiantecurso', async (req, res) => {
   try {
    let  estudiante_curso;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    if (by === 'all') {
      
      estudiante_curso = await EstudianteCursoNegocio.getAll();
    } else if (by === 'enabled') {
      
      estudiante_curso = await EstudianteCursoNegocio.getEnabled();
    } else if (by === 'id') {
      const id = req.query.id as string;
      estudiante_curso = await EstudianteCursoNegocio.getById(id);
    } else if (by === 'noMatriculados') {
    const id = req.query.id as string;
    estudiante_curso = await EstudianteCursoNegocio.getNoMatriculados();
  } 
    res.json(estudiante_curso);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

export default router;
