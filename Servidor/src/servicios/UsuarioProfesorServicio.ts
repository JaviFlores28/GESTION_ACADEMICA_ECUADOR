
import { Router } from 'express';
const router = Router();
import UsuarioProfesorNegocio from '../negocio/UsuarioProfesorNegocio';
import UsuarioProfesorEntidad from '../entidades/UsuarioProfesorEntidad';
import { TypeRequest } from '../sistema/interfaces/TypeRequest';

router.post('/usuarioprofesor', async (req, res) => {
   try {
const usuario_profesor: UsuarioProfesorEntidad = req.body;
const response = await UsuarioProfesorNegocio.insert(usuario_profesor);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message:error.message });
  }
});

router.put('/usuarioprofesor', async (req, res) => {
  try {
    const  usuario_profesor: UsuarioProfesorEntidad = req.body;
    const response = await UsuarioProfesorNegocio.update(usuario_profesor);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message:error.message });
   }
});

router.patch('/usuarioprofesor', async (req, res) => {
   try {
    const { masivo, type, data}: TypeRequest = req.body;
    let response;
    if(masivo && type === 'updateEstado'){
      response = await UsuarioProfesorNegocio.updateEstado(data);
    }else if(masivo && type === 'delete'){
      //response = await UsuarioProfesorNegocio.updateEstado(data);
    }
      
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message:error.message });
  }
});


router.delete('/usuarioprofesor', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await UsuarioProfesorNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message:error.message });
  }
});

  router.get('/usuarioprofesor', async (req, res) => {
    try {
      let usuario_profesor;
      const by = req.query.by as string;
      if (!by) {
        return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
      }
      const id = req.query.id as string;
      
      switch (by) {
        case 'all':
          usuario_profesor = await UsuarioProfesorNegocio.getAll();
          break;
        case 'enabled':
          usuario_profesor = await UsuarioProfesorNegocio.getEnabled();
          break;
        case 'id':
          usuario_profesor = await UsuarioProfesorNegocio.getById(id);
          break;
          
        default:
          return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
      }
      res.json(usuario_profesor);
    } catch (error: any) {
      res.status(500).json({ message:error.message });
    }
  });
  
export default router;
