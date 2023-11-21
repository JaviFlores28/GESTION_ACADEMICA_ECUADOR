
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
    res.status(500).json({ message: error.code });
  }
});

router.put('/usuario', async (req, res) => {
  try {
    const  usuario: UsuarioEntidad = req.body;
    const response = await UsuarioNegocio.update(usuario);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.code });
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
    res.status(500).json({ message: error.code });
  }
});


router.delete('/usuario', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await UsuarioNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
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
      res.status(500).json({ message: error.code });
    }
  });
  

router.patch('/usuario', async (req, res) => {
  try {
    const {usuario, pswd} = req.body;
    const response = await UsuarioNegocio.getByUser(usuario,pswd);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});
export default router;
