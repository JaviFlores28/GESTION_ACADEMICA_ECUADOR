
import { Router } from 'express';
const router = Router();
import UsuarioNegocio from '../negocio/UsuarioNegocio';
import UsuarioEntidad from '../entidades/UsuarioEntidad';
import { TypeRequest } from '../sistema/interfaces/TypeRequest';

router.post('/usuario', async (req, res) => {
   try {
const { usuario, detalle } = req.body;
const response = await UsuarioNegocio.insert(usuario, detalle);

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message:error.message });
  }
});

router.put('/usuario', async (req, res) => {
  try {
    const  usuario: UsuarioEntidad = req.body;
    const response = await UsuarioNegocio.update(usuario);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message:error.message });
   }
});

router.patch('/usuario', async (req, res) => {
   try {
    const { masivo, type, data}: TypeRequest = req.body;
    let response;
    if(masivo && type === 'updateEstado'){
      response = await UsuarioNegocio.updateEstado(data);
    }else if(masivo && type === 'delete'){
      //response = await UsuarioNegocio.updateEstado(data);
    }else if(!masivo && type === 'getByUser'){
   response = await UsuarioNegocio.getByUser(data.usuario,data.pswd);
}  
      
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message:error.message });
  }
});


router.delete('/usuario', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await UsuarioNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message:error.message });
  }
});

  router.get('/usuario', async (req, res) => {
    try {
      let usuario;
      const by = req.query.by as string;
      if (!by) {
        return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
      }
      const id = req.query.id as string;
        const tipo = req.query.tipo as string;
      switch (by) {
        case 'all':
          usuario = await UsuarioNegocio.getAll(tipo);
          break;
        case 'enabled':
          usuario = await UsuarioNegocio.getEnabled(tipo);
          break;
        case 'id':
          usuario = await UsuarioNegocio.getById(id);
          break;
          
        default:
          return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
      }
      res.json(usuario);
    } catch (error: any) {
      res.status(500).json({ message:error.message });
    }
  });
  
export default router;
