import { Router } from 'express';
const router = Router();
import EstudianteCursoParaleloNegocio from '../negocio/EstudianteCursoParaleloNegocio';
import EstudianteCursoParaleloEntidad from '../entidades/EstudianteCursoParaleloEntidad';
import { TypeRequest } from '../sistema/interfaces/TypeRequest';

router.post('/estudiantecursoparalelo', async (req, res) => {
  try {
    const { masivo, data }: TypeRequest = req.body;
    let response;
    if (!masivo) {
      response = await EstudianteCursoParaleloNegocio.insert(data);
    } else {
      response = await EstudianteCursoParaleloNegocio.insertMasivo(data);
    }

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/estudiantecursoparalelo', async (req, res) => {
  try {
    const estudiante_curso_paralelo: EstudianteCursoParaleloEntidad = req.body;
    const response = await EstudianteCursoParaleloNegocio.update(estudiante_curso_paralelo);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/estudiantecursoparalelo', async (req, res) => {
  try {
    const { type, data }: TypeRequest = req.body;
    let response;
    switch (type) {
      case 'updateEstado':
        response = await EstudianteCursoParaleloNegocio.updateEstado(data);
        break;
      case 'delete':
        // Handle delete case
        break;
      case 'getByCursoParalelo':
        response = await EstudianteCursoParaleloNegocio.getByCursoParalelo(data);
        break;
      default:
        return res.status(400).json({ message: 'Tipo de solicitud inválida.' });
    }
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
    res.status(500).json({ message: error.message });
  }
});
export default router;
