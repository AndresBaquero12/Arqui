import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import gamesRoutes from './routes/games.routes';
import multiplayerRoutes from './routes/multiplayer.routes';
import {
  createRoom,
  joinRoom,
  registerSocket,
  unregisterSocket,
  broadcastToRoom,
  getClientMeta
} from './services/multiplayer.service';

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());

app.use('/games', gamesRoutes);
app.use('/games/multiplayer', multiplayerRoutes);

// Endpoint de prueba para verificar conectividad
app.get('/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ message: 'Games service is running', timestamp: new Date().toISOString() });
});


// WebSocket NO crea su propio servidor, se monta ENCIMA del HTTP existente.
// Ambos escuchan en el mismo puerto (3004) pero en paths distintos:
// HTTP  → localhost:3004/games, /test, etc.
// WS    → localhost:3004/ws
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

console.log('WebSocket server configured with path: /ws');

wss.on('connection', (socket: WebSocket) => {
  console.log('New WebSocket connection established');
  // Capa 1 de keepalive: ping-pong nativo del protocolo WebSocket.
  // El browser responde el pong automáticamente sin código extra en el front.
  (socket as any).isAlive = true;
  // Si llega pong, el cliente sigue vivo. Reactivamos la bandera.
  socket.on('pong', () => {
    (socket as any).isAlive = true;
    console.log('Received pong from client');
  });

  socket.on('error', (error) => {
    console.error('WebSocket socket error:', error);
  });

  socket.on('message', async (message: Buffer) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received WebSocket message:', data);
      const { action, payload } = data;


      //CREAR SALA, UNIRSE A SALA, HACER MOVIMIENTO
      if (action === 'createRoom') {
        console.log('Creating room for user:', payload);
        const room = createRoom(Number(payload.usuarioId), String(payload.nombre));// Crea la sala en memoria
        console.log('Room created:', room);
        registerSocket(socket, room.code, Number(payload.usuarioId), String(payload.nombre));// Asocia ESTE socket a esa sala
        // A partir de aquí el servidor sabe: "este socket pertenece a sala XYZ", y se genera el codigo
        socket.send(JSON.stringify({ type: 'roomCreated', payload: { code: room.code, roomId: room.roomId } }));
      }

      if (action === 'joinRoom') {
        const room = joinRoom(String(payload.code), Number(payload.usuarioId), String(payload.nombre));
        if (!room) {
          socket.send(JSON.stringify({ type: 'error', payload: 'Sala no encontrada o ya completa' }));
          return;
        }
        registerSocket(socket, room.code, Number(payload.usuarioId), String(payload.nombre));
        const otherPlayers = room.jugadores.filter(p => p.usuarioId !== Number(payload.usuarioId));
        socket.send(JSON.stringify({ type: 'roomJoined', payload: { code: room.code, roomId: room.roomId, otherPlayers } }));
        broadcastToRoom(room.code, { type: 'playerJoined', payload: { usuarioId: payload.usuarioId, nombre: payload.nombre } }, socket);
      }

      if (action === 'move') {
        const meta = getClientMeta(socket);
        if (!meta) {
          socket.send(JSON.stringify({ type: 'error', payload: 'No estás en una sala' }));
          return;
        }
        broadcastToRoom(meta.roomCode, { type: 'opponentMove', payload: payload }, socket);
      }

      if (action === 'heartbeat') {
        socket.send(JSON.stringify({ type: 'heartbeat', payload: 'alive' }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      socket.send(JSON.stringify({ type: 'error', payload: 'Formato de mensaje inválido' }));
    }
  });

  socket.on('close', (code, reason) => {
    console.log('WebSocket closed', { code, reason: reason.toString() });
    unregisterSocket(socket);
  });
});

// Cada 30s revisamos todos los clientes conectados.
// Si isAlive sigue en false (no respondió el pong anterior), lo terminamos.
// Si está vivo, lo ponemos en false y mandamos nuevo ping — esperamos su pong.
const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((client: WebSocket) => {
    const ws = client as any;
    if (ws.isAlive === false) {
      client.terminate();// No respondió: conexión nula, la matamos
      return;
    }
    ws.isAlive = false;// Asumimos muerto hasta que llegue el pong
    client.ping();
  });
}, 30000);
// Un solo puerto sirve los dos protocolos. El servidor detecta
// por el header "Upgrade: websocket" si es HTTP o WS.
server.listen(PORT, () => {
  console.log(`Games Service running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  clearInterval(heartbeatInterval);
  server.close();
});
