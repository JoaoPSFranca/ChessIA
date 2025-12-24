# Chess AI Engine

Progressive chess engine with move evaluation and classification system.

## Project Goals

- Build a functional chess engine from scratch
- Implement gradual AI learning (material → position → tactics → strategy)
- Classify moves like Chess.com (Brilliant, Great, Best, Blunder, etc.)
- Achieve ~1800-2200 ELO strength

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Chess Logic**: chess.js
- **Board UI**: react-chessboard
- **State Management**: Zustand
- **Engine**: Custom minimax with alpha-beta pruning
- **Evaluation**: NNUE (optional)

## Installation

```bash
npm install
npm run dev
```

## Development Roadmap

- [x] Phase 1: Visual board with animations
- [ ] Phase 2: Complete chess rules engine
- [ ] Phase 3: Static position evaluation
- [ ] Phase 4: Minimax search algorithm
- [ ] Phase 5: Move classification system
- [ ] Phase 6: Opening book
- [ ] Phase 7: Endgame tablebases
- [ ] Phase 8: Performance optimizations
- [ ] Phase 9: NNUE integration (optional)

## Current Strength
ELO: TBD | Depth: TBD plies | Nodes/sec: TBD

## License
MIT
