import { Chess } from 'chess.js'

// O engine agora é apenas uma função pura sem hooks
export const makeRandomMove = (game: Chess): string | null => {
  const possibleMoves = game.moves()

  // Exit if the game is over
  if (game.isGameOver() || possibleMoves.length === 0) {
    return null
  }

  // Pick a random move
  const randomIndex = Math.floor(Math.random() * possibleMoves.length)
  const randomMove = possibleMoves[randomIndex]

  // Make the move
  const move = game.move(randomMove)
  
  return move ? move.san : null
}
