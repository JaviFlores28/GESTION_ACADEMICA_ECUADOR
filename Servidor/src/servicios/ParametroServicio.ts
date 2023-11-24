
import { Router } from 'express';
const router = Router();
import ParametroNegocio from '../negocio/ParametroNegocio';
import ParametroEntidad from '../entidades/ParametroEntidad';
import { TypeRequest } from '../sistema/interfaces/TypeRequest';

router.post('/parametro', async (req, res) => {
   try {
const parametro: ParametroEntidad = req.body;
const response = await ParametroNegocio.insert(parametro);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message:error.message });
  }
});

router.put('/parametro', async (req, res) => {
  try {
    const  parametro: ParametroEntidad = req.body;
    const response = await ParametroNegocio.update(parametro);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message:error.message });
   }
});

router.patch('/parametro', async (req, res) => {
   try {
    const { masivo, type, data}: TypeRequest = req.body;
    let response;
    if(masivo && type === 'updateEstado'){
      response = await ParametroNegocio.updateEstado(data);
    }else if(masivo && type === 'delete'){
      //response = await ParametroNegocio.updateEstado(data);
    }
      
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message:error.message });
  }
});


router.delete('/parametro', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await ParametroNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message:error.message });
  }
});

  router.get('/parametro', async (req, res) => {
    try {
      let parametro;
      const by = req.query.by as string;
      if (!by) {
        return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
      }
      const id = req.query.id as string;
      
      switch (by) {
        case 'all':
          parametro = await ParametroNegocio.getAll();
          break;
        case 'enabled':
          parametro = await ParametroNegocio.getEnabled();
          break;
        case 'id':
          parametro = await ParametroNegocio.getById(id);
          break;
          
        default:
          return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
      }
      res.json(parametro);
    } catch (error: any) {
      res.status(500).json({ message:error.message });
    }
  });
  
export default router;
