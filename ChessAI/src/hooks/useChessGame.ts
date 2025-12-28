import { useState } from 'react';
import { Chess } from 'chess.js';

export const useChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [moveLog, setMoveLog] = useState<string[]>([]);
  const [orientation, setOrientation] = useState<'white' | 'black'>(Math.random() < 0.5 ? 'white' : 'black');

  const getGameStatus = () => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) return "Checkmate!";
      if (game.isDraw()) return "Draw!";
      if (game.isStalemate()) return "Stealmate!";

      return "Game Over!"
    }

    if (game.inCheck()) return "Check!";

    return `${game.turn() === 'w' ? 'White' : 'Black'} to move`;
  }

  const makeMove = (from: string, to: string) => {
    try {
      const move = game.move({
        from,
        to,
        promotion: "q",
      });

      if (move) {
        setGame(new Chess(game.fen()));
        setMoveLog(prev => [...prev, move.san]);
        return true;
      }

      return false;
    } catch (e) {
      console.error("Invalid move:", e);
      return false;
    }
  };

  const resetGame = () => {
    console.log("RESET GAME CALLED");
    setGame(new Chess());
    setMoveLog([]);

     setOrientation(Math.random() < 0.5 ? 'white' : 'black');
  };


  return {
    game,
    moveLog,

    orientation,

    getGameStatus,
    makeMove,
    resetGame
  }

  // const [position, setPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  // const [moveHistory, setMoveHistory] = useState<string[]>([]);
  // const [gameStatus, setGameStatus] = useState('active');
  // const [orientation, setOrientation] = useState<'white' | 'black'>('white');

  // // Função para atualizar status após movimento
  // const updateGameStatus = useCallback((gameInstance: Chess) => {
  //   if (gameInstance.isCheckmate()) {
  //     setGameStatus('checkmate');
  //   } else if (gameInstance.isCheck()) {
  //     setGameStatus('check');
  //   } else if (gameInstance.isDraw()) {
  //     setGameStatus('draw');
  //   } else if (gameInstance.isStalemate()) {
  //     setGameStatus('stalemate');
  //   } else {
  //     setGameStatus('active');
  //   }
  // }, []);

  // // makeMove: Tenta fazer um movimento
  // const makeMove = useCallback((from: string, to: string, promotion?: string) => {
  //   const gameCopy = new Chess(game.fen());

  //   let move: Move | null = null;
  //   try {
  //     move = gameCopy.move({
  //       from,
  //       to,
  //       promotion: promotion || 'q' // Promoção padrão para Rainha
  //     });
  //     console.log("deu certo");
  //   } catch (error) {
  //       console.log("deu errado: ", error);
  //       return false; // Movimento inválido
  //   }

  //   if (move === null) {
  //       console.log("deu certo2");
  //       return false; // Movimento inválido
  //   }
  //   console.log("deu errado2");

  //   // Movimento válido! Atualizar estado
  //   setGame(gameCopy); // ✅ Atualizar instância do jogo
  //   setPosition(gameCopy.fen()); // ✅ Atualizar FEN
  //   setMoveHistory(gameCopy.history()); // ✅ Atualizar histórico
  //   updateGameStatus(gameCopy); // ✅ Atualizar status

  //   return true;
  // }, [game, updateGameStatus]);

  // // undoMove: Desfaz último movimento
  // const undoMove = useCallback(() => {
  //   const gameCopy = new Chess(game.fen());
  //   const move = gameCopy.undo();

  //   if (move) {
  //     setGame(gameCopy);
  //     setPosition(gameCopy.fen());
  //     setMoveHistory(gameCopy.history());
  //     updateGameStatus(gameCopy);
  //     return true;
  //   }

  //   return false;
  // }, [game, updateGameStatus]);

  // // resetGame: Reinicia o jogo
  // const resetGame = useCallback(() => {
  //   const newGame = new Chess();
  //   setGame(newGame);
  //   setPosition(newGame.fen());
  //   setMoveHistory([]);
  //   setGameStatus('active');
  // }, []);

  // // flipBoard: Inverte orientação
  // const flipBoard = useCallback(() => {
  //   setOrientation(prev => prev === 'white' ? 'black' : 'white');
  // }, []);

  // return {
  //   game,
  //   position,
  //   moveHistory,
  //   gameStatus,
  //   orientation,
  //   makeMove,
  //   undoMove,
  //   resetGame,
  //   flipBoard,
  // };
};
