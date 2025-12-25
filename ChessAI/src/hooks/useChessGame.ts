import { useState, useCallback } from 'react';
import { Chess, Move } from 'chess.js';

export const useChessGame = () => {
  // Estado reativo do React
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState('active');
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');

  // Função para atualizar status após movimento
  const updateGameStatus = useCallback((gameInstance: Chess) => {
    if (gameInstance.isCheckmate()) {
      setGameStatus('checkmate');
    } else if (gameInstance.isCheck()) {
      setGameStatus('check');
    } else if (gameInstance.isDraw()) {
      setGameStatus('draw');
    } else if (gameInstance.isStalemate()) {
      setGameStatus('stalemate');
    } else {
      setGameStatus('active');
    }
  }, []);

  // makeMove: Tenta fazer um movimento
  const makeMove = useCallback((from: string, to: string, promotion?: string) => {
    const gameCopy = new Chess(game.fen());
    
    let move: Move | null = null;
    try {
      move = gameCopy.move({
        from,
        to,
        promotion: promotion || 'q' // Promoção padrão para Rainha
      });
      console.log("deu certo");
    } catch (error) {
        console.log("deu errado: ", error);
        return false; // Movimento inválido
    }
    
    if (move === null) {
        console.log("deu certo2");
        return false; // Movimento inválido
    }
    console.log("deu errado2");

    // Movimento válido! Atualizar estado
    setGame(gameCopy); // ✅ Atualizar instância do jogo
    setPosition(gameCopy.fen()); // ✅ Atualizar FEN
    setMoveHistory(gameCopy.history()); // ✅ Atualizar histórico
    updateGameStatus(gameCopy); // ✅ Atualizar status

    return true;
  }, [game, updateGameStatus]);

  // undoMove: Desfaz último movimento
  const undoMove = useCallback(() => {
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.undo();
    
    if (move) {
      setGame(gameCopy);
      setPosition(gameCopy.fen());
      setMoveHistory(gameCopy.history());
      updateGameStatus(gameCopy);
      return true;
    }
    
    return false;
  }, [game, updateGameStatus]);

  // resetGame: Reinicia o jogo
  const resetGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setPosition(newGame.fen());
    setMoveHistory([]);
    setGameStatus('active');
  }, []);

  // flipBoard: Inverte orientação
  const flipBoard = useCallback(() => {
    setOrientation(prev => prev === 'white' ? 'black' : 'white');
  }, []);

  return {
    game,
    position,
    moveHistory,
    gameStatus,
    orientation,
    makeMove,
    undoMove,
    resetGame,
    flipBoard,
  };
};
