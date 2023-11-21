
import { Router } from 'express';
const router = Router();
import ParametroNegocio from '../Negocio/ParametroNegocio';
import ParametroEntidad from '../Entidades/ParametroEntidad';

router.post('/parametro', async (req, res) => {
   try {
const parametro: ParametroEntidad = req.body;
const response = await ParametroNegocio.insert(parametro);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.put('/parametro', async (req, res) => {
  try {
    const  parametro: ParametroEntidad = req.body;
    const response = await ParametroNegocio.update(parametro);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.code });
   }
});

router.patch('/parametro', async (req, res) => {
   try {
    const { masivo, data }: { masivo: boolean, data: any } = req.body;
    let response;
    if(!masivo){
      //response = await ParametroNegocio.updateEstado(data);
    }else{
      response = await ParametroNegocio.updateEstado(data);
    }    
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});


router.delete('/parametro', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await ParametroNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
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
      res.status(500).json({ message: error.code });
    }
  });
  

export default router;
