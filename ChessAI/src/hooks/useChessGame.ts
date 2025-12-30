import { useState, useEffect } from 'react'
import { Chess } from 'chess.js'
import { makeRandomMove } from './useEngine'

export const useChessGame = () => {
  const [game, setGame] = useState(new Chess())
  const [moveLog, setMoveLog] = useState<string[]>([])
  const [orientation, setOrientation] = useState<'white' | 'black'>('white')
  const [aiColor, setAiColor] = useState<'w' | 'b' | null>(null)

  // Status do jogo
  const getGameStatus = () => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) return 'Checkmate!'
      if (game.isDraw()) return 'Draw!'
      if (game.isStalemate()) return 'Stalemate!'
      return 'Game Over!'
    }

    if (game.inCheck()) return 'Check!'
    return `${game.turn() === 'w' ? 'White' : 'Black'} to move`
  }

  // Fazer movimento do jogador
  const makeMove = (from: string, to: string) => {
    try {
      const gameCopy = new Chess(game.fen())
      const move = gameCopy.move({
        from,
        to,
        promotion: 'q',
      })

      if (move) {
        setGame(gameCopy)
        setMoveLog(prev => [...prev, move.san])
        return true
      }

      return false
    } catch (e) {
      console.error('Invalid move:', e)
      return false
    }
  }

  // Fazer movimento da IA
  const makeAiMove = () => {
    // Criar cópia do jogo
    const gameCopy = new Chess(game.fen())
    
    // Fazer movimento aleatório
    const moveSan = makeRandomMove(gameCopy)
    
    if (moveSan) {
      setGame(gameCopy)
      setMoveLog(prev => [...prev, moveSan])
    }
  }

  // Reset do jogo
  const resetGame = () => {
    const newGame = new Chess()
    const newOrientation = Math.random() < 0.5 ? 'white' : 'black'
    
    setGame(newGame)
    setMoveLog([])
    setOrientation(newOrientation)
    
    // Se o jogador for preto, IA joga primeiro (brancas)
    setAiColor(newOrientation === 'black' ? 'w' : 'b')
  }

  // UseEffect para IA jogar automaticamente
  useEffect(() => {
    // Se for a vez da IA e o jogo não acabou
    if (aiColor && game.turn() === aiColor && !game.isGameOver()) {
      // Delay de 500ms para parecer mais natural
      const timer = setTimeout(() => {
        makeAiMove()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [game.fen(), aiColor]) // Reage a mudanças no FEN

  // Inicializar no mount
  useEffect(() => {
    const initialOrientation = Math.random() < 0.5 ? 'white' : 'black'
    setOrientation(initialOrientation)
    setAiColor(initialOrientation === 'black' ? 'w' : 'b')

    // Se jogador for preto, IA joga primeiro
    if (initialOrientation === 'black') {
      setTimeout(() => {
        makeAiMove()
      }, 500)
    }
  }, []) // Apenas no mount

  return {
    game,
    moveLog,
    orientation,
    aiColor,
    getGameStatus,
    makeMove,
    resetGame,
  }
}
