
import { Router } from 'express';
const router = Router();
import UsuarioNegocio from '../Negocio/UsuarioNegocio';
import UsuarioEntidad from '../Entidades/UsuarioEntidad';

router.get('/usuario', async (req, res) => {
   try {
    const usuario = await UsuarioNegocio.getUsuario();
    res.json(usuario);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.get('/usuarioEnabled', async (req, res) => {
   try {
    const usuario = await UsuarioNegocio.getEnabledUsuario();
    res.json(usuario);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});

router.post('/usuario', async (req, res) => {
   try {
    const request = req.body;
    const usuario = new UsuarioEntidad(request.USR_ID, request.USR_DNI, request.USR_NOM, request.USR_NOM2, request.USR_APE, request.USR_APE2, request.USR_DIR, request.USR_TEL, request.USR_CEL, request.USR_EMAIL, request.USR_FECH_NAC, request.USR_GEN, request.USUARIO, request.USR_PSWD, request.ROL_PRF, request.ROL_REPR, request.ROL_ADMIN, request.ESTADO, request.FECHA_CREACION);
    const response = await UsuarioNegocio.addUsuario(usuario);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/usuario', async (req, res) => {
  try {
    const request = req.body;
    const usuario = new UsuarioEntidad(request.USR_ID, request.USR_DNI, request.USR_NOM, request.USR_NOM2, request.USR_APE, request.USR_APE2, request.USR_DIR, request.USR_TEL, request.USR_CEL, request.USR_EMAIL, request.USR_FECH_NAC, request.USR_GEN, request.USUARIO, request.USR_PSWD, request.ROL_PRF, request.ROL_REPR, request.ROL_ADMIN, request.ESTADO, request.FECHA_CREACION);
    const response = await UsuarioNegocio.updateUsuario(usuario);
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});

router.delete('/usuario/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await UsuarioNegocio.deleteUsuario(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/usuario/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await UsuarioNegocio.searchById(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/usuario/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const {pswdNew, pswdOld} = req.body;
    const response = await UsuarioNegocio.updatePswdUsuario(id,pswdOld,pswdNew);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/UsuarioValidar', async (req, res) => {
  try {
    const {user, pswd} = req.body;
    const response = await UsuarioNegocio.validarUsuario(user,pswd);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
