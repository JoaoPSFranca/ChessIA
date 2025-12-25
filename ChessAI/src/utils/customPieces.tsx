export const getCustomPieces = () => {
  const pieceScales = {
    wK: 0.57, bK: 0.58,  // Reis
    wQ: 0.57, bQ: 0.52,  // Rainhas
    wB: 0.62, bB: 0.63,  // Bispos
    wR: 0.55, bR: 0.62,  // Torres
    wN: 0.60, bN: 0.64,  // Cavalos
    wP: 0.72, bP: 0.65,  // Peões
  };

  const result: Record<string, () => JSX.Element> = {};

  Object.entries(pieceScales).forEach(([piece, scale]) => {
    result[piece] = () => (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10%', // Espaço ao redor
        }}
      >
        <div
          style={{
            width: `${scale * 100}%`,   // Controla largura pelo container
            height: `${scale * 100}%`,  // Controla altura pelo container
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={`/pieces/${piece}.svg`}
            alt={piece}
            style={{
              width: '100%',     // Preenche o container
              height: '100%',    // Preenche o container
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
    );
  });

  return result;
};
