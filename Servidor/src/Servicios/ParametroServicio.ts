
import { Router } from 'express';
const router = Router();
import ParametroNegocio from '../Negocio/ParametroNegocio';
import ParametroEntidad from '../Entidades/ParametroEntidad';

router.get('/parametro', async (req, res) => {
   try {
    const parametro = await ParametroNegocio.getParametro();
    res.json(parametro);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/parametro', async (req, res) => {
   try {
    const request = req.body;
    const parametro = new ParametroEntidad(request.PRMT_ID, request.PRMT_NOM, request.PRMT_DESCR, request.PRMT_URL_IMG, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await ParametroNegocio.addParametro(parametro);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/parametro', async (req, res) => {
  try {
    const request = req.body;
    const parametro = new ParametroEntidad(request.PRMT_ID, request.PRMT_NOM, request.PRMT_DESCR, request.PRMT_URL_IMG, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
    const response = await ParametroNegocio.updateParametro(parametro);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/parametro/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ParametroNegocio.deleteParametro(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/parametro/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ParametroNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
