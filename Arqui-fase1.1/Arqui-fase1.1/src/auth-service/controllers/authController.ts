import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import QRCode from 'qrcode';
import { sessionManager } from '../services/sessionManager';

const USERS_SERVICE_URL = 'http://localhost:3001';
const GAMES_SERVICE_URL = 'http://localhost:3004';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretajedrez';

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = '648996421508-d85p8fhulav357bv26l9ag54iglppsce.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://dc21a558feb4f2.lhr.life/auth/google/callback';

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  // Existing login logic remains...
  try {
    const { correoElectronico, contrasena } = req.body;
    if (!correoElectronico || !contrasena) {
      res.status(400).json({ error: 'Faltan campos obligatorios' });
      return;
    }
    const response = await axios.get(`${USERS_SERVICE_URL}/internal/users/email/${correoElectronico}`);
    const user = response.data;
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }
    const tokenJwt = jwt.sign({ usuarioId: user.usuarioId, correoElectronico: user.correoElectronico }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ tokenJwt, usuarioId: user.usuarioId, nombreUsuario: user.nombreUsuario });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const generateQr = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionId = sessionManager.createSession();

    // Generate Google Auth URL
    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
      state: sessionId,
    });

    // Generate QR Code data (the authUrl itself)
    const qrCodeDataUrl = await QRCode.toDataURL(authUrl);

    res.json({
      sessionId,
      qrCodeDataUrl,
      authUrl
    });
  } catch (error) {
    console.error('Error in generateQr:', error);
    res.status(500).json({ error: 'Error generating QR' });
  }
};

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  const { code, state: sessionId } = req.query;

  if (!code || !sessionId) {
    res.status(400).send('Faltan parámetros code o state');
    return;
  }

  try {
    // 1. Validate Session
    const session = sessionManager.getSession(sessionId as string);
    if (!session || session.status !== 'pending') {
      res.status(400).send('Sesión de QR inválida o expirada');
      return;
    }

    // 2. Exchange code for tokens
    const { tokens } = await client.getToken(code as string);
    client.setCredentials(tokens);

    // 3. Get user info from Google
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    const { email, name } = userInfoResponse.data;

    // 4. Unified Auth Flow (UPSERT) via Users Service
    // We'll call a new endpoint in users-service that handles this logic
    const upsertResponse = await axios.post(`${USERS_SERVICE_URL}/internal/users/upsert`, {
      correoElectronico: email,
      nombreUsuario: name || email.split('@')[0],
      provider: 'google'
    });
    const user = upsertResponse.data;

    // 5. Generate Application JWT
    const tokenJwt = jwt.sign({ usuarioId: user.usuarioId, correoElectronico: user.correoElectronico }, JWT_SECRET, { expiresIn: '8h' });

    // 6. Update Session State
    sessionManager.updateSession(sessionId as string, {
      status: 'authenticated',
      userData: { usuarioId: user.usuarioId, nombreUsuario: user.nombreUsuario },
      jwt: tokenJwt
    });

    // 7. Notify Games Service via internal HTTP
    // This will trigger the WebSocket message to the PC
    try {
      await axios.post(`${GAMES_SERVICE_URL}/internal/auth-notify`, {
        sessionId,
        tokenJwt,
        user: { usuarioId: user.usuarioId, nombreUsuario: user.nombreUsuario }
      });
    } catch (notifyError) {
      console.error('Failed to notify Games Service:', notifyError);
    }

    // 8. Redirect Mobile to a "Success" page (can be a simple HTML)
    res.send('<h1>Autenticación Exitosa</h1><p>Puedes cerrar esta ventana y regresar a tu computadora.</p>');

  } catch (error) {
    console.error('Error in googleCallback:', error);
    res.status(500).send('Error durante la autenticación con Google');
  }
};
