
import { Router } from 'express';
const router = Router();
import ParcialNegocio from '../Negocio/ParcialNegocio';
import ParcialEntidad from '../Entidades/ParcialEntidad';
import { TypeRequest } from '../sistema/Interfaces/TypeRequest';

router.post('/parcial', async (req, res) => {
   try {
const parcial: ParcialEntidad = req.body;
const response = await ParcialNegocio.insert(parcial);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.put('/parcial', async (req, res) => {
  try {
    const  parcial: ParcialEntidad = req.body;
    const response = await ParcialNegocio.update(parcial);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.code });
   }
});

router.patch('/parcial', async (req, res) => {
   try {
    const { masivo, type, data}: TypeRequest = req.body;
    let response;
    if(masivo && type === 'updateEstado'){
      response = await ParcialNegocio.updateEstado(data);
    }else if(masivo && type === 'delete'){
      //response = await ParcialNegocio.updateEstado(data);
    }
      
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});


router.delete('/parcial', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await ParcialNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

  router.get('/parcial', async (req, res) => {
    try {
      let parcial;
      const by = req.query.by as string;
      if (!by) {
        return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
      }
      const id = req.query.id as string;
      
      switch (by) {
        case 'all':
          parcial = await ParcialNegocio.getAll();
          break;
        case 'enabled':
          parcial = await ParcialNegocio.getEnabled();
          break;
        case 'id':
          parcial = await ParcialNegocio.getById(id);
          break;
          
        default:
          return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
      }
      res.json(parcial);
    } catch (error: any) {
      res.status(500).json({ message: error.code });
    }
  });
  
export default router;
