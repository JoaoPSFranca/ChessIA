import { Chessboard } from 'react-chessboard'
import { getCustomPieces } from './utils/customPieces'
import { useChessGame } from './hooks/useChessGame';

function App() {
  const { 
    game,
    position, 
    moveHistory, 
    gameStatus, 
    orientation,
    makeMove, 
    undoMove, 
    resetGame, 
    flipBoard 
  } = useChessGame();

  const handlePieceDrop = (sourceSquare: string, targetSquare: string) => {
    return makeMove(sourceSquare, targetSquare);
  };

  // Board Config
  const chessboardOptions = {
    id: 'WizardChess',
    position: game.fen(),
    pieces: getCustomPieces(),
    boardOrientation: orientation,
    darkSquareStyle: { backgroundColor: '#2c2539' },
    lightSquareStyle: { backgroundColor: '#574c63' },
    onPieceDrop: handlePieceDrop,
    arePiecesDraggable: true,
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#1a1a1a'
    }}>
      <div style={{ maxWidth: '600px', width: '100%', padding: '20px' }}>
        <h1 style={{
          textAlign: 'center',
          color: '#b8a0d4',                    // Lilás claro
          fontFamily: '"Cinzel", serif',       // Fonte medieval elegante
          fontSize: '3rem',
          fontWeight: 700,
          marginBottom: '30px',
          textShadow: `
            0 0 10px rgba(184, 160, 212, 0.8),
            0 0 20px rgba(138, 103, 186, 0.6),
            0 0 30px rgba(106, 27, 154, 0.4),
            2px 2px 4px rgba(0, 0, 0, 0.9)
          `,                                    // Brilho mágico roxo
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>
          Wizard Chess AI
        </h1>
        <div style={{
          padding: '15px',
          borderRadius: '12px',
          backgroundColor: '#1a1520',
          border: '3px solid #4a3f5c',
          boxShadow: '0 10px 40px rgba(106, 27, 154, 0.4), inset 0 0 30px rgba(0, 0, 0, 0.5)',
        }}>
          <Chessboard options={chessboardOptions} />
        </div>
      </div>
    </div>
  )
}

export default App
