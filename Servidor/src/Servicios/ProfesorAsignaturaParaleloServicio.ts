
import { Router } from 'express';
const router = Router();
import ProfesorAsignaturaParaleloNegocio from '../Negocio/ProfesorAsignaturaParaleloNegocio';
import ProfesorAsignaturaParaleloEntidad from '../Entidades/ProfesorAsignaturaParaleloEntidad';

router.post('/profesorasignaturaparalelo', async (req, res) => {
   try {
const profesor_asignatura_paralelo: ProfesorAsignaturaParaleloEntidad = req.body;
const response = await ProfesorAsignaturaParaleloNegocio.insert(profesor_asignatura_paralelo);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profesorasignaturaparalelo', async (req, res) => {
  try {
    const  profesor_asignatura_paralelo: ProfesorAsignaturaParaleloEntidad = req.body;
    const response = await ProfesorAsignaturaParaleloNegocio.update(profesor_asignatura_paralelo);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.patch('/profesorasignaturaparalelo', async (req, res) => {
   try {
    const { masivo, data }: { masivo: boolean, data: any } = req.body;
    let response;
    if(!masivo){
      //response = await ProfesorAsignaturaParaleloNegocio.updateEstado(data);
    }else{
      response = await ProfesorAsignaturaParaleloNegocio.updateEstado(data);
    }    
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/profesorasignaturaparalelo', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await ProfesorAsignaturaParaleloNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/profesorasignaturaparalelo', async (req, res) => {
   try {
    let  profesor_asignatura_paralelo;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    if (by === 'all') {
      
      profesor_asignatura_paralelo = await ProfesorAsignaturaParaleloNegocio.getAll();
    } else if (by === 'enabled') {
      
      profesor_asignatura_paralelo = await ProfesorAsignaturaParaleloNegocio.getEnabled();
    } else if (by === 'id') {
      const id = req.query.id as string;
      profesor_asignatura_paralelo = await ProfesorAsignaturaParaleloNegocio.getById(id);
    } 
    res.json(profesor_asignatura_paralelo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

export default router;
