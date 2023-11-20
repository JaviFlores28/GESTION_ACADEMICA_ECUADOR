
import { Router } from 'express';
const router = Router();
import UsuarioProfesorNegocio from '../Negocio/UsuarioProfesorNegocio';
import UsuarioProfesorEntidad from '../Entidades/UsuarioProfesorEntidad';

router.post('/usuarioprofesor', async (req, res) => {
   try {
const usuario_profesor: UsuarioProfesorEntidad = req.body;
const response = await UsuarioProfesorNegocio.insert(usuario_profesor);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/usuarioprofesor', async (req, res) => {
  try {
    const  usuario_profesor: UsuarioProfesorEntidad = req.body;
    const response = await UsuarioProfesorNegocio.update(usuario_profesor);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.patch('/usuarioprofesor', async (req, res) => {
   try {
    const { masivo, data }: { masivo: boolean, data: any } = req.body;
    let response;
    if(!masivo){
      //response = await UsuarioProfesorNegocio.updateEstado(data);
    }else{
      response = await UsuarioProfesorNegocio.updateEstado(data);
    }    
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/usuarioprofesor', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await UsuarioProfesorNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/usuarioprofesor', async (req, res) => {
   try {
    let  usuario_profesor;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    if (by === 'all') {
      
      usuario_profesor = await UsuarioProfesorNegocio.getAll();
    } else if (by === 'enabled') {
      
      usuario_profesor = await UsuarioProfesorNegocio.getEnabled();
    } else if (by === 'id') {
      const id = req.query.id as string;
      usuario_profesor = await UsuarioProfesorNegocio.getById(id);
    } 
    res.json(usuario_profesor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

export default router;
