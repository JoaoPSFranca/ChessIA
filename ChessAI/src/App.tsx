import { useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'

function App() {
  const [game] = useState(new Chess())

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
          color: '#f0d9b5',
          fontFamily: 'serif',
          fontSize: '2.5rem',
          marginBottom: '20px'
        }}>
          Wizard Chess AI
        </h1>
        <Chessboard 
          id="WizardChess"
          position={game.fen()}
          customDarkSquareStyle={{ backgroundColor: '#6b4423' }}
          customLightSquareStyle={{ backgroundColor: '#c4996d' }}
          boardOrientation="white"
        />
      </div>
    </div>
  )
}

export default App
