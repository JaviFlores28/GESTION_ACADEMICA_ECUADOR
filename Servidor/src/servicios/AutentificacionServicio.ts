import speakeasy from 'speakeasy';
import { Router, Request, Response, NextFunction } from 'express';
import session, { Session } from 'express-session';
import UsuarioEntidad from '../entidades/UsuarioEntidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import QRCode from 'qrcode';
import AutentificacionNegocio from '../negocio/AutentificacionNegocio';
import { Autentificacion } from '../sistema/interfaces/Autentificacion';

const router = Router();

function requireAuth(req: Request, res: Response, next: NextFunction) {
    const sesion = (req.session as CustomSession)?.user;
    if (!sesion || !sesion.USR_ID) {
        return res.status(401).json({ message: 'No autenticado.' });
    }
    next();
}

interface CustomSession extends Session {
    user?: UsuarioEntidad;
}


router.use(
    session({
        secret: process.env.KEY_ENCRYPT || 'UEFBC-2023-VF',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 3600000,
            secure: false,
        },
    })
);

router.post('/login', async (req: Request, res: Response) => {
    const { USUARIO, USR_PSWD, TOKEN } = req.body;

    const respuesta: Respuesta = await AutentificacionNegocio.login({ usuario: USUARIO, pswd: USR_PSWD });
    if (!respuesta.response) {
        return res.status(401).json(respuesta);
    }
    const usuario = respuesta.data as UsuarioEntidad;
    if (usuario.HAS_2FA) {
        if (!TOKEN) {
            return res.status(400).json({ response: false, data: null, message: 'Se requiere un código de autenticación de dos factores.' });
        }

        const isValidToken = speakeasy.totp.verify({
            secret: usuario.FA_KEY,
            encoding: 'base32',
            token: TOKEN,
        });

        if (!isValidToken) {
            return res.status(401).json({ message: 'Código de autenticación inválido.' });
        }
    }
    (req.session as CustomSession).user = usuario;

    res.json({ message: 'Inicio de sesión exitoso.' });
});

router.post('/enable-2fa', requireAuth, async (req: Request, res: Response) => {
    const { TOKEN } = req.body;
    const sesion = (req.session as CustomSession).user as Autentificacion;
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
console.log(sesion);

    const response = await AutentificacionNegocio.update2FA(sesion.USR_ID);
    res.json(response);
    //llamar funcion update HAS_2FA
});


router.get('/get-qr', requireAuth, async (req, res) => {
    try {
        const sesion = (req.session as CustomSession).user;
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


router.post('/disable-2fa', (req, res) => {
    /*  const { username } = req.session.userData;
 
     if (!users[username]) {
         return res.status(404).json({ message: 'Usuario no encontrado.' });
     }
 
     users[username].isTwoFactorEnabled = false;
  */
    res.json({ message: 'Autenticación de dos factores deshabilitada.' });
});



export default router;
