
import { Router } from 'express';
const router = Router();
import UsuarioNegocio from '../Negocio/UsuarioNegocio';
import UsuarioEntidad from '../Entidades/UsuarioEntidad';

router.post('/usuario', async (req, res) => {
   try {
const { usuario, detalle } = req.body;
const response = await UsuarioNegocio.insert(usuario, detalle);

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/usuario', async (req, res) => {
  try {
    const  usuario: UsuarioEntidad = req.body;
    const response = await UsuarioNegocio.update(usuario);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.patch('/usuario', async (req, res) => {
   try {
    const { masivo, data }: { masivo: boolean, data: any } = req.body;
    let response;
    if(!masivo){
      //response = await UsuarioNegocio.updateEstado(data);
    }else{
      response = await UsuarioNegocio.updateEstado(data);
    }    
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/usuario', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await UsuarioNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/usuario', async (req, res) => {
   try {
    let  usuario;
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    if (by === 'all') {
       const tipo = req.query.tipo as string;
      usuario = await UsuarioNegocio.getAll(tipo);
    } else if (by === 'enabled') {
        const tipo = req.query.tipo as string;
      usuario = await UsuarioNegocio.getEnabled(tipo);
    } else if (by === 'id') {
      const id = req.query.id as string;
      usuario = await UsuarioNegocio.getById(id);
    } 
    res.json(usuario);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.patch('/usuario', async (req, res) => {
  try {
    const {usuario, pswd} = req.body;
    const response = await UsuarioNegocio.getByUser(usuario,pswd);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
