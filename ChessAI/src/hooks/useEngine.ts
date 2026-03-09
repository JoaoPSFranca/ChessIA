import { Chess, type PieceSymbol } from 'chess.js'

// O engine agora é apenas uma função pura sem hooks
export const makeOponentMove = (game: Chess): string | null => {
  const possibleMoves = game.moves()

  const pieceValue = (piece?: PieceSymbol) => {
    switch(piece) {
      case 'p': 
        return 1
      case 'r':
        return 5
      case 'q':
        return 9
      default:
        return 3
    }
  }

  // Exit if the game is over
  if (game.isGameOver() || possibleMoves.length === 0) {
    return null
  }

  let captures : { [moveset: string]: number } = {}

  possibleMoves.forEach(move => {
    const gameCopy = new Chess(game.fen())
    const m = gameCopy.move(move)
    if (m.isCapture())
      captures[move] = pieceValue(m.captured)
  }); 

  const sortedCaptures = Object.entries(captures)
  let definitiveMove = ''

  if (sortedCaptures.length > 0){
    console.log("Movimento de Captura")
    
    sortedCaptures.sort( ([, valorA], [, valorB]) => valorB - valorA)

    console.log(captures)
    console.log(sortedCaptures[0][0])

    const captureMove = sortedCaptures[0][0]
    
    definitiveMove = captureMove
  } else {
    console.log("Movimento Aleatório")

    // Pick a random move
    const randomIndex = Math.floor(Math.random() * possibleMoves.length)
    const randomMove = possibleMoves[randomIndex]

    definitiveMove = randomMove
  }

  // Make the move
  const move = game.move(definitiveMove)
  
  return move ? move.san : null
}
