import { gamesModel, Game } from '../models/games.model';

const generateRandomMove = (): { origen: string; destino: string } => {
  const letters = 'ABCDEFGH';
  const getLetter = () => letters.charAt(Math.floor(Math.random() * letters.length));
  const getNumber = () => Math.floor(Math.random() * 8) + 1;
  return {
    origen: getLetter() + getNumber(),
    destino: getLetter() + getNumber()
  };
};

const getRandomWinner = (jugadores: Game['jugadores']): { ganadorId: number | null; razon: string } => {
  const rand = Math.random();
  if (rand < 0.33) return { ganadorId: null, razon: 'tablas' };
  if (rand < 0.66) return { ganadorId: jugadores[0].usuarioId, razon: 'simulacion' };
  return { ganadorId: jugadores[1].usuarioId, razon: 'simulacion' };
};

export const startSimulation = (gameId: number): void => {
  const game = gamesModel.findById(gameId);
  if (!game || !game.modoSimulacion) return;

  // Clear any existing interval just in case
  if (game.intervaloSimulacion) {
    clearInterval(game.intervaloSimulacion);
  }

  console.log(`[Simulación] Iniciando partida ${gameId}`);

  const interval = setInterval(() => {
    const currentGame = gamesModel.findById(gameId);
    if (!currentGame || currentGame.estado !== 'activa') {
      clearInterval(interval);
      return;
    }

    const colorMoving = currentGame.turno;
    const playerMoving = currentGame.jugadores.find(p => p.color === colorMoving);
    
    if (playerMoving) {
      const movePos = generateRandomMove();
      console.log(`[Simulación] Partida ${gameId}: Jugador ${playerMoving.usuarioId} (${colorMoving}) mueve de ${movePos.origen} a ${movePos.destino}`);
      
      gamesModel.addMoveToGame(gameId, {
        jugadorId: playerMoving.usuarioId,
        color: colorMoving,
        origen: movePos.origen,
        destino: movePos.destino,
        timestamp: new Date()
      });
    }

    // 10% chance to finish
    if (Math.random() < 0.10) {
      console.log(`[Simulación] Partida ${gameId} FINALIZADA aleatoriamente.`);
      const result = getRandomWinner(currentGame.jugadores);
      gamesModel.finishGame(gameId, result);
      clearInterval(interval);
    }

  }, 5000);

  gamesModel.update(gameId, { intervaloSimulacion: interval });
};

export const stopSimulation = (gameId: number): boolean => {
  const game = gamesModel.findById(gameId);
  if (game && game.intervaloSimulacion) {
    clearInterval(game.intervaloSimulacion);
    gamesModel.update(gameId, { intervaloSimulacion: null, modoSimulacion: false });
    console.log(`[Simulación] Partida ${gameId} detenida manualmente.`);
    return true;
  }
  return false;
};
