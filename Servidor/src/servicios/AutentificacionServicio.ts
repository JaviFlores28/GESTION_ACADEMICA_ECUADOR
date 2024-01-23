import speakeasy from 'speakeasy';
import { Router, Request, Response } from 'express';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import QRCode from 'qrcode';
import AutentificacionNegocio from '../negocio/AutentificacionNegocio';
import { Autentificacion } from '../sistema/interfaces/Autentificacion';
import session from 'express-session';

declare module 'express-session' {
  interface Session {
    user: Autentificacion;
  }
}
const router = Router();

router.use(
  session({
    secret: process.env.KEY_ENCRYPT || 'UEFBC-2023-VF',
    resave: false,
    saveUninitialized: true,
    name: 'uefbc',
    cookie: {
      maxAge: 3600000,
      secure: false,
    },
  }),
);

function requireAuth(req: Request, res: Response, next: () => void) {
  const sesion = req.session.user;
  if (!sesion || !sesion.USR_ID || (sesion.HAS_2FA && !sesion.AUTHENTICATED)) {
    return res.json({ response: false, data: null, message: 'No autorizado.' });
  }
  return next();
}

router.post('/login', async (req: Request, res: Response) => {
  const { USUARIO, USR_PSWD } = req.body;

  const respuesta: Respuesta = await AutentificacionNegocio.login({ USUARIO: USUARIO, USR_PSWD: USR_PSWD });

  if (!respuesta.response) {
    return res.status(401).json(respuesta);
  }
  const usuario = respuesta.data as Autentificacion;
  usuario.AUTHENTICATED = true;

  if (usuario.HAS_2FA) {
    usuario.AUTHENTICATED = false;
  }
  req.session.user = usuario;
  res.json({ response: true, message: 'Inicio de sesión exitoso.', data: { AUTHENTICATED: usuario.AUTHENTICATED, USER_ID: usuario.USR_ID } });
});

router.post('/authentificated', async (req: Request, res: Response) => {
  const { TOKEN } = req.body;
  const sesion = req.session.user;

  if (!sesion) {
    return res.status(401).json({ response: false, data: null, message: 'No autorizado.' });
  }

  if (sesion.HAS_2FA) {
    if (!TOKEN) {
      return res.status(400).json({ response: false, data: null, message: 'Se requiere un código de autenticación de dos factores.' });
    }

    const isValidToken = speakeasy.totp.verify({ secret: sesion.FA_KEY, encoding: 'base32', token: TOKEN });

    if (!isValidToken) {
      return res.status(401).json({ message: 'Código de autenticación inválido.' });
    }
  }
  req.session.user.AUTHENTICATED = true;
  res.json({ response: true, data: { USER_ID: sesion.USR_ID }, message: 'Inicio de sesión exitoso.' });
});

router.post('/enable2fa', requireAuth, async (req: Request, res: Response) => {
  const { TOKEN } = req.body;
  const sesion = req.session.user;
  if (!sesion) {
    return res.status(404).json({ response: false, data: null, message: 'No autorizado.' });
  }
  if (!TOKEN) {
    return res.status(400).json({ response: false, data: null, message: 'Se requiere un código de autenticación de dos factores.' });
  }

  const isValidToken = speakeasy.totp.verify({ secret: sesion.FA_KEY, encoding: 'base32', token: TOKEN });

  if (!isValidToken) {
    return res.status(401).json({ response: false, data: null, message: 'Código de autenticación inválido.' });
  }
  const response = await AutentificacionNegocio.enable2FA(sesion.USR_ID);
  if (response.response) {
    req.session.user.HAS_2FA = 1;
  }
  res.json(response);
});

router.get('/disable2fa', requireAuth, async (req: Request, res: Response) => {
  const sesion = req.session.user;

  if (!sesion) {
    return res.status(401).json({ response: false, data: null, message: 'Usuario no autenticado.' });
  }
  const response = await AutentificacionNegocio.disable2FA(sesion.USR_ID);
  if (response.response) {
    req.session.user.HAS_2FA = 0;
  }
  res.json(response);
});

router.get('/getUser', requireAuth, (req: Request, res: Response) => {
  if (req.session.user) {
    if (req.session.user.AUTHENTICATED) {
      res.json({ response: true, data: req.session.user, message: '' });
    } else {
      res.json({ response: false, data: null, message: 'No autorizado' });
    }
  } else {
    res.json({ response: false, data: null, message: 'No autorizado' });
  }
});

router.get('/getqr', requireAuth, async (req: Request, res: Response) => {
  try {
    const sesion = req.session.user;
    if (!sesion) {
      return res.status(404).json({ response: false, data: null, message: 'No autorizado.' });
    }

    const options: speakeasy.OtpauthURLOptions = {
      secret: sesion.FA_KEY,
      label: sesion.USUARIO,
      issuer: 'UEFBC',
      type: 'totp',
      algorithm: 'sha256',
      period: 60,
      encoding: 'base32',
    };
    const otpauthUrl = speakeasy.otpauthURL(options);
    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);
    res.json({ response: false, message: 'URL del código QR obtenida correctamente', data: { qrCodeUrl } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: false, data: null, message: 'Error al generar el código QR.' });
  }
});

router.get('/isloggedin', (req: Request, res: Response) => {
  const sesion = req.session.user;
  if (!sesion || !sesion.AUTHENTICATED) {
    return res.json({ response: false, data: null, message: 'Usuario no autenticado.' });
  }
  res.json({ response: true, data: true, message: 'Existe un usuario logeado.' });
});

router.get('/logout', requireAuth, (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ response: false, data: null, message: 'Error al cerrar sesión.' });
    }
    res.json({ response: true, data: null, message: 'Sesión cerrada correctamente.' });
  });
});

export default router;
