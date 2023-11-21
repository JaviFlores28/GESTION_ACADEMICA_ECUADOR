
import { Router } from 'express';
const router = Router();
import EstudianteCursoNegocio from '../Negocio/EstudianteCursoNegocio';
import EstudianteCursoEntidad from '../Entidades/EstudianteCursoEntidad';

router.post('/estudiantecurso', async (req, res) => {
   try {
const { masivo, data }: { masivo: boolean, data: any } = req.body;
  let response;
  if(!masivo){
     response = await EstudianteCursoNegocio.insert(data);
  }else{
    response = await EstudianteCursoNegocio.insertMasivo(data);
  }

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.put('/estudiantecurso', async (req, res) => {
  try {
    const  estudiante_curso: EstudianteCursoEntidad = req.body;
    const response = await EstudianteCursoNegocio.update(estudiante_curso);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.code });
   }
});

router.patch('/estudiantecurso', async (req, res) => {
   try {
    const { masivo, data }: { masivo: boolean, data: any } = req.body;
    let response;
    if(!masivo){
      //response = await EstudianteCursoNegocio.updateEstado(data);
    }else{
      response = await EstudianteCursoNegocio.updateEstado(data);
    }    
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});


router.delete('/estudiantecurso', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await EstudianteCursoNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

  router.get('/estudiantecurso', async (req, res) => {
    try {
      let estudiante_curso;
      const by = req.query.by as string;
      if (!by) {
        return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
      }
      const id = req.query.id as string;
      
      switch (by) {
        case 'all':
          estudiante_curso = await EstudianteCursoNegocio.getAll();
          break;
        case 'enabled':
          estudiante_curso = await EstudianteCursoNegocio.getEnabled();
          break;
        case 'id':
          estudiante_curso = await EstudianteCursoNegocio.getById(id);
          break;
          case 'noMatriculados':
    estudiante_curso = await EstudianteCursoNegocio.getNoMatriculados();
    break;
  case 'curso':
    estudiante_curso = await EstudianteCursoNegocio.getByCurso(id);
    break;
        default:
          return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
      }
      res.json(estudiante_curso);
    } catch (error: any) {
      res.status(500).json({ message: error.code });
    }
  });
  

export default router;
