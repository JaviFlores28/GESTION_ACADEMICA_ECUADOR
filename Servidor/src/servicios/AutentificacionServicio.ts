import speakeasy from 'speakeasy';
import { Router, Request, Response, } from 'express';
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

    })
);

function requireAuth(req: Request, res: Response, next: () => void) {
    const sesion = req.session.user;
    if (!sesion || !sesion.USR_ID || (sesion.HAS_2FA && !sesion.AUTHENTICATED)) {
        return res.status(401).json({ message: 'No autenticado.' });
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

    res.json({ response: true, message: 'Inicio de sesión exitoso.', data: { AUTHENTICATED: usuario.AUTHENTICATED,req: req.session } });
});

router.post('/authentificated', async (req: Request, res: Response) => {
    const { TOKEN } = req.body;
    const sesion = req.session.user;

    if (!sesion) {
        return res.status(401).json({ message: 'Usuario no autenticado.' });
    }

    if (sesion.HAS_2FA) {
        if (!TOKEN) {
            return res.status(400).json({ response: false, data: null, message: 'Se requiere un código de autenticación de dos factores.' });
        }

        const isValidToken = speakeasy.totp.verify({
            secret: sesion.FA_KEY,
            encoding: 'base32',
            token: TOKEN,
        });

        if (!isValidToken) {
            return res.status(401).json({ message: 'Código de autenticación inválido.' });
        }
    }
    req.session.user.AUTHENTICATED = true;
    res.json({ response: true, data: req.session, message: 'Inicio de sesión exitoso.' });
});

router.get('/perfil', (req, res) => {
    // Verificar si el usuario está autenticado consultando la sesión
    if (req.session.user) {
      res.json({data:`Bienvenido, ${req.session.user}`});
    } else {
      res.status(401).send('No autorizado');
    }
  });

router.post('/enable-2fa', requireAuth, async (req: Request, res: Response) => {
    const { TOKEN } = req.body;
    const sesion = req.session.user as Autentificacion;
    if (!sesion) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    if (!TOKEN) {
        return res.status(400).json({ message: 'Se requiere un código de autenticación de dos factores.' });
    }

    const isValidToken = speakeasy.totp.verify({
        secret: sesion.FA_KEY,
        encoding: 'base32',
        token: TOKEN,
    });

    if (!isValidToken) {
        return res.status(401).json({ message: 'Código de autenticación inválido.' });
    }
    const response = await AutentificacionNegocio.update2FA(sesion.USR_ID);
    res.json(response);
});


router.get('/get-qr', requireAuth, async (req: Request, res: Response) => {
    try {
        const sesion = req.session.user;
        if (!sesion) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const options: speakeasy.OtpauthURLOptions = {
            secret: sesion.FA_KEY,
            label: sesion.USUARIO,
            issuer: 'UEFBC',
            type: 'totp',
            algorithm: 'sha256',
            period: 60,
            encoding: 'base32'
        };
        const otpauthUrl = speakeasy.otpauthURL(options);
        const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);
        res.json({ message: 'URL del código QR obtenida correctamente', data: { qrCodeUrl } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al generar el código QR.' });
    }
});


router.post('/disable-2fa', (req: Request, res: Response) => {
    /*  const { username } = req.session.userData;
 
     if (!users[username]) {
         return res.status(404).json({ message: 'Usuario no encontrado.' });
     }
 
     users[username].isTwoFactorEnabled = false;
  */
    res.json({ message: 'Autenticación de dos factores deshabilitada.' });
});

router.post('/isLoggedIn', (req: Request, res: Response) => {
    const sesion = req.session.user;
    console.log(sesion);

    if (!sesion) {
        return res.status(401).json({ response: false, data: null, message: 'Usuario no autenticado.' });
    }
    res.json({ response: true, data: true, message: 'Existe un usuario logeado.' });
});




export default router;
