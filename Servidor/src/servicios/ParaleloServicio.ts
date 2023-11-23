
import { Router } from 'express';
const router = Router();
import ParaleloNegocio from '../negocio/ParaleloNegocio';
import ParaleloEntidad from '../entidades/ParaleloEntidad';
import { TypeRequest } from '../sistema/interfaces/TypeRequest';

router.post('/paralelo', async (req, res) => {
   try {
const paralelo: ParaleloEntidad = req.body;
const response = await ParaleloNegocio.insert(paralelo);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.put('/paralelo', async (req, res) => {
  try {
    const  paralelo: ParaleloEntidad = req.body;
    const response = await ParaleloNegocio.update(paralelo);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.code });
   }
});

router.patch('/paralelo', async (req, res) => {
   try {
    const { masivo, type, data}: TypeRequest = req.body;
    let response;
    if(masivo && type === 'updateEstado'){
      response = await ParaleloNegocio.updateEstado(data);
    }else if(masivo && type === 'delete'){
      //response = await ParaleloNegocio.updateEstado(data);
    }
      
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});


router.delete('/paralelo', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await ParaleloNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

  router.get('/paralelo', async (req, res) => {
    try {
      let paralelo;
      const by = req.query.by as string;
      if (!by) {
        return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
      }
      const id = req.query.id as string;
      
      switch (by) {
        case 'all':
          paralelo = await ParaleloNegocio.getAll();
          break;
        case 'enabled':
          paralelo = await ParaleloNegocio.getEnabled();
          break;
        case 'id':
          paralelo = await ParaleloNegocio.getById(id);
          break;
          
        default:
          return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
      }
      res.json(paralelo);
    } catch (error: any) {
      res.status(500).json({ message: error.code });
    }
  });
  
export default router;
