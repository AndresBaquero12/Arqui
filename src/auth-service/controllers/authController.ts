import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const USERS_SERVICE_URL = 'http://localhost:3001';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretajedrez';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correoElectronico, contrasena } = req.body;

    if (!correoElectronico || !contrasena) {
      res.status(400).json({ error: 'Faltan campos obligatorios (correoElectronico, contrasena)' });
      return;
    }

    let user;
    try {
      const response = await axios.get(`${USERS_SERVICE_URL}/internal/users/email/${correoElectronico}`);
      user = response.data;
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }
      throw err;
    }

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const tokenJwt = jwt.sign({ usuarioId: user.usuarioId, correoElectronico: user.correoElectronico }, JWT_SECRET, { expiresIn: '8h' });

    res.json({
      tokenJwt,
      usuarioId: user.usuarioId,
      nombreUsuario: user.nombreUsuario,
      Estado: "Activo"
    });

  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};
