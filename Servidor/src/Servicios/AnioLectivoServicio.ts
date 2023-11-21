
import { Router } from 'express';
const router = Router();
import AnioLectivoNegocio from '../Negocio/AnioLectivoNegocio';
import AnioLectivoEntidad from '../Entidades/AnioLectivoEntidad';
import { TypeRequest } from '../sistema/Interfaces/TypeRequest';

router.post('/aniolectivo', async (req, res) => {
   try {
const anio_lectivo: AnioLectivoEntidad = req.body;
const response = await AnioLectivoNegocio.insert(anio_lectivo);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

router.put('/aniolectivo', async (req, res) => {
  try {
    const  anio_lectivo: AnioLectivoEntidad = req.body;
    const response = await AnioLectivoNegocio.update(anio_lectivo);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.code });
   }
});

router.patch('/aniolectivo', async (req, res) => {
   try {
    const { masivo, type, data}: TypeRequest = req.body;
    let response;
    if(masivo && type === 'updateEstado'){
      response = await AnioLectivoNegocio.updateEstado(data);
    }else if(masivo && type === 'delete'){
      //response = await AnioLectivoNegocio.updateEstado(data);
    }
      
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});


router.delete('/aniolectivo', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await AnioLectivoNegocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});

  router.get('/aniolectivo', async (req, res) => {
    try {
      let anio_lectivo;
      const by = req.query.by as string;
      if (!by) {
        return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
      }
      const id = req.query.id as string;
      
      switch (by) {
        case 'all':
          anio_lectivo = await AnioLectivoNegocio.getAll();
          break;
        case 'enabled':
          anio_lectivo = await AnioLectivoNegocio.getEnabled();
          break;
        case 'id':
          anio_lectivo = await AnioLectivoNegocio.getById(id);
          break;
          
        default:
          return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
      }
      res.json(anio_lectivo);
    } catch (error: any) {
      res.status(500).json({ message: error.code });
    }
  });
  
export default router;
