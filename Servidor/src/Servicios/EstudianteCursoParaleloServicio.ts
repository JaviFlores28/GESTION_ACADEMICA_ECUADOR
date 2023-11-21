
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
    res.status(500).json({ message: error.code });
  }
});

router.put('/estudiantecursoparalelo', async (req, res) => {
  try {
    const  estudiante_curso_paralelo: EstudianteCursoParaleloEntidad = req.body;
    const response = await EstudianteCursoParaleloNegocio.update(estudiante_curso_paralelo);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.code });
   }
});

router.patch('/estudiantecursoparalelo', async (req, res) => {
   try {
    const { masivo, data }: { masivo: boolean, data: any } = req.body;
    let response;
    if(!masivo){
      //response = await EstudianteCursoParaleloNegocio.updateEstado(data);
    }else{
      response = await EstudianteCursoParaleloNegocio.updateEstado(data);
    }    
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});


router.delete('/estudiantecursoparalelo', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await EstudianteCursoParaleloNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

  router.get('/estudiantecursoparalelo', async (req, res) => {
    try {
      let estudiante_curso_paralelo;
      const by = req.query.by as string;
      if (!by) {
        return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
      }
      const id = req.query.id as string;
      
      switch (by) {
        case 'all':
          estudiante_curso_paralelo = await EstudianteCursoParaleloNegocio.getAll();
          break;
        case 'enabled':
          estudiante_curso_paralelo = await EstudianteCursoParaleloNegocio.getEnabled();
          break;
        case 'id':
          estudiante_curso_paralelo = await EstudianteCursoParaleloNegocio.getById(id);
          break;
          
        default:
          return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
      }
      res.json(estudiante_curso_paralelo);
    } catch (error: any) {
      res.status(500).json({ message: error.code });
    }
  });
  

export default router;
