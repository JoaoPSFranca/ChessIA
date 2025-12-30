import { useState } from 'react'
import type { Square } from 'chess.js'
import { Chessboard, type SquareHandlerArgs } from 'react-chessboard'
import { getCustomPieces } from './utils/customPieces'
import { useChessGame } from './hooks/useChessGame'
import { Toast } from './components/Toast'

function App() {
  const { game, moveLog, orientation, getGameStatus, makeMove, resetGame } = useChessGame();
  
  // Estados para click-to-move
  const [selectedSquare, setSelectedSquare] = useState<Square | undefined>(undefined)
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({})
  
  // Estado para toast
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null)

  // Mostrar movimentos possíveis
  function getMoveOptions(square: Square) {
      // get the moves for the square
      const moves = game.moves({
        square,
        verbose: true
      });

      // if no moves, clear the option squares
      if (moves.length === 0) {
        setOptionSquares({});
        return false;
      }

      // create a new object to store the option squares
      const newSquares: Record<string, React.CSSProperties> = {};

      // loop through the moves and set the option squares
      for (const move of moves) {
        newSquares[move.to] = {
          background: game.get(move.to) && game.get(move.to)?.color !== game.get(square)?.color ? 'radial-gradient(circle, rgba(220, 38, 38, 0.6) 85%, transparent 85%)' // larger circle for capturing
          : 'radial-gradient(circle, rgba(138, 103, 186, 0.5) 25%, transparent 25%)',
          borderRadius: '50%'
        };
      }

      // set the square clicked to move from to yellow
      newSquares[square] = {
        background: 'rgba(184, 160, 212, 0.5)',
        border: '2px solid #8a67ba',
      };

      // set the option squares
      setOptionSquares(newSquares);

      // return true to indicate that there are move options
      return true;
    }

  // Handler de click em uma casa
  const onSquareClick = ({ square, piece }: SquareHandlerArgs) => {
    console.log("Entrou no click");
 
    if (!selectedSquare) {
      // Se há peça selecionada
      if (piece) {
        const hasMoveOptions = getMoveOptions(square as Square);

        if (hasMoveOptions) {
          setSelectedSquare(square as Square);
        } else {
          setToast({ message: 'Esta peça não pode se mover!', type: 'error' });
        }

        return;
      }
      
      // Se clica em lugar aleatório só sai
      setSelectedSquare(undefined);
      setOptionSquares({});
      return;
    }

    const moves = game.moves({
        square: selectedSquare,
        verbose: true
      });
    const foundMove = moves.find(m => m.from === selectedSquare && m.to === square);

    // not a valid move
    if (!foundMove) {
      const hasMoveOptions = getMoveOptions(square as Square);
      setSelectedSquare(hasMoveOptions ? square as Square : undefined);

      return;
    }

    // Tentar fazer o movimento
    const moveSuccess = makeMove(selectedSquare as string, square as string);
    
    if (moveSuccess) {
      setSelectedSquare(undefined);
      setOptionSquares({});
    } else {
      setToast({ message: 'Movimento Não Realizado por motivos de não sei. ', type: 'error' });

      const hasMoveOptions = getMoveOptions(square as Square);

      if (hasMoveOptions) {
        setSelectedSquare(square as Square);
      } else {
        setToast({ message: 'Movimento deu errado e ainda pegou peça errada!', type: 'error' });
      }

      return;
    }
  }

  // Handler de drag & drop
  const handlePieceDrop = (move: { sourceSquare: string; targetSquare: string }) => {
    console.log("Entrou no drag and drop");

    const { sourceSquare, targetSquare } = move
    const success = makeMove(sourceSquare, targetSquare)
    
    if (!success) {
      setToast({ message: 'Movimento inválido!', type: 'error' })
    }
    
    // Limpar seleção
    setSelectedSquare(undefined)
    setOptionSquares({})
    
    return success
  }

  // Configurações do tabuleiro
  const chessboardOptions = {
    id: 'WizardChess',
    position: game.fen(),
    pieces: getCustomPieces(),
    boardOrientation: orientation,
    darkSquareStyle: { backgroundColor: '#2c2539' },
    lightSquareStyle: { backgroundColor: '#574c63' },
    squareStyles: optionSquares, 
    onSquareClick, 
    onPieceDrop: handlePieceDrop,
    lightSquareNotationStyle: { color: '#2c2539' },
    darkSquareNotationStyle: { color: '#574c63' },
    boardStyle: {
      borderRadius: '3px',
    },
  } as any

  const status = getGameStatus()
  const isGameOver = game.isGameOver()

  return (
    <>
      {/* Toast de notificação */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0a1a 0%, #1a1520 50%, #2d2539 100%)',
        padding: '20px',
      }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '30px',
          maxWidth: '1200px',
          width: '100%',
        }}>
          {/* Coluna Esquerda - Tabuleiro */}
          <div style={{ maxWidth: '600px' }}>
            {/* Título */}
            <h1 style={{
              textAlign: 'center',
              color: '#b8a0d4',
              fontFamily: '"Cinzel", serif',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              marginBottom: '25px',
              textShadow: `
                0 0 10px rgba(184, 160, 212, 0.8),
                0 0 20px rgba(138, 103, 186, 0.6),
                0 0 30px rgba(106, 27, 154, 0.4),
                2px 2px 4px rgba(0, 0, 0, 0.9)
              `,
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}>
              Wizard Chess AI
            </h1>

            {/* Status do Jogo */}
            <div style={{
              textAlign: 'center',
              marginBottom: '20px',
              padding: '15px',
              background: 'linear-gradient(135deg, rgba(106, 27, 154, 0.2) 0%, rgba(74, 63, 92, 0.2) 100%)',
              borderRadius: '10px',
              border: '2px solid rgba(184, 160, 212, 0.3)',
              boxShadow: '0 4px 15px rgba(106, 27, 154, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.3)',
            }}>
              <div style={{
                color: isGameOver ? '#ff6b9d' : '#b8a0d4',
                fontFamily: '"Cinzel", serif',
                fontSize: '1.3rem',
                fontWeight: 600,
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                letterSpacing: '2px',
              }}>
                {status}
              </div>
            </div>

            {/* Tabuleiro */}
            <div style={{
              padding: '20px',
              borderRadius: '15px',
              background: 'linear-gradient(135deg, #1a1520 0%, #2c2539 100%)',
              border: '4px solid #4a3f5c',
              boxShadow: `
                0 10px 40px rgba(106, 27, 154, 0.5),
                inset 0 0 30px rgba(0, 0, 0, 0.5),
                0 0 60px rgba(138, 103, 186, 0.2)
              `,
              position: 'relative',
            }}>
              {/* Ornamento de canto superior esquerdo */}
              <div style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                width: '40px',
                height: '40px',
                borderTop: '4px solid #8a67ba',
                borderLeft: '4px solid #8a67ba',
                borderRadius: '15px 0 0 0',
              }} />
              
              {/* Ornamento de canto inferior direito */}
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '40px',
                height: '40px',
                borderBottom: '4px solid #8a67ba',
                borderRight: '4px solid #8a67ba',
                borderRadius: '0 0 15px 0',
              }} />

              <Chessboard options={chessboardOptions} />
            </div>

            {/* Botão Reset */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: '25px',
            }}>
              <button
                onClick={() => {
                  resetGame()
                  setSelectedSquare(undefined)
                  setOptionSquares({})
                }}
                style={{
                  background: 'linear-gradient(135deg, #4a3f5c 0%, #6a1b9a 100%)',
                  color: '#e6d9f5',
                  border: '3px solid #8a67ba',
                  padding: '14px 40px',
                  fontSize: '1.2rem',
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 600,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  transition: 'all 0.3s ease',
                  boxShadow: `
                    0 6px 20px rgba(106, 27, 154, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                  e.currentTarget.style.boxShadow = `
                    0 10px 30px rgba(106, 27, 154, 0.6),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2),
                    0 0 25px rgba(138, 103, 186, 0.5)
                  `
                  e.currentTarget.style.borderColor = '#b8a0d4'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = `
                    0 6px 20px rgba(106, 27, 154, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `
                  e.currentTarget.style.borderColor = '#8a67ba'
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>
                  ♟️ New Game
                </span>
              </button>
            </div>
          </div>

          {/* Coluna Direita - Move History */}
          <div style={{
            width: '340px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1a1520 0%, #2c2539 100%)',
              borderRadius: '15px',
              border: '3px solid #4a3f5c',
              boxShadow: `
                0 10px 40px rgba(106, 27, 154, 0.3),
                inset 0 0 30px rgba(0, 0, 0, 0.4)
              `,
              height: '680px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(106, 27, 154, 0.3) 0%, rgba(74, 63, 92, 0.3) 100%)',
                borderBottom: '2px solid #4a3f5c',
              }}>
                <h2 style={{
                  color: '#b8a0d4',
                  fontFamily: '"Cinzel", serif',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  margin: 0,
                  textAlign: 'center',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  textShadow: '0 2px 10px rgba(184, 160, 212, 0.5)',
                }}>
                  Move History
                </h2>
              </div>

              {/* Move List */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#6a1b9a #2c2539',
              }}>
                {moveLog.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    color: '#8a67ba',
                    fontFamily: 'serif',
                    fontSize: '1.1rem',
                    fontStyle: 'italic',
                    marginTop: '40px',
                    opacity: 0.6,
                  }}>
                    No moves yet...
                  </div>
                ) : (
                  <div>
                    {Array.from({ length: Math.ceil(moveLog.length / 2) }, (_, i) => {
                      const moveNumber = i + 1
                      const whiteMove = moveLog[i * 2]
                      const blackMove = moveLog[i * 2 + 1]
                      const isLastMove = (i * 2 + 1) >= moveLog.length - 1 || (i * 2) === moveLog.length - 1

                      return (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 15px',
                            marginBottom: '8px',
                            background: isLastMove
                              ? 'linear-gradient(135deg, rgba(138, 103, 186, 0.3) 0%, rgba(106, 27, 154, 0.2) 100%)'
                              : 'rgba(74, 63, 92, 0.2)',
                            borderRadius: '8px',
                            border: isLastMove
                              ? '2px solid rgba(184, 160, 212, 0.4)'
                              : '1px solid rgba(74, 63, 92, 0.3)',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            if (!isLastMove) {
                              e.currentTarget.style.background = 'rgba(74, 63, 92, 0.4)'
                              e.currentTarget.style.borderColor = 'rgba(138, 103, 186, 0.3)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isLastMove) {
                              e.currentTarget.style.background = 'rgba(74, 63, 92, 0.2)'
                              e.currentTarget.style.borderColor = 'rgba(74, 63, 92, 0.3)'
                            }
                          }}
                        >
                          <span style={{
                            color: '#8a67ba',
                            fontFamily: '"Cinzel", serif',
                            fontSize: '1rem',
                            fontWeight: 600,
                            marginRight: '15px',
                            minWidth: '30px',
                          }}>
                            {moveNumber}.
                          </span>

                          <span style={{
                            color: '#e6d9f5',
                            fontFamily: 'monospace',
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            minWidth: '60px',
                          }}>
                            {whiteMove}
                          </span>

                          {blackMove && (
                            <span style={{
                              color: '#d4b3e8',
                              fontFamily: 'monospace',
                              fontSize: '1.1rem',
                              fontWeight: 500,
                              marginLeft: '20px',
                            }}>
                              {blackMove}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CSS para scrollbar customizada */}
        <style>
          {`
            div::-webkit-scrollbar {
              width: 10px;
            }
            div::-webkit-scrollbar-track {
              background: #2c2539;
              border-radius: 10px;
            }
            div::-webkit-scrollbar-thumb {
              background: linear-gradient(135deg, #6a1b9a 0%, #8a67ba 100%);
              border-radius: 10px;
              border: 2px solid #2c2539;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(135deg, #8a67ba 0%, #b8a0d4 100%);
            }
          `}
        </style>
      </div>
    </>
  )
}

export default App
