// src/utils/customPieces.tsx
import React from "react";
import type { JSX } from "react";

export const customPieces = () => {
  const pieceCodes = ['wP','wN','wB','wR','wQ','wK','bP','bN','bB','bR','bQ','bK'] as const;
  const pieces: Record<string, (props: { squareWidth: number; isDragging?: boolean }) => JSX.Element> = {};

  pieceCodes.forEach((code) => {
    pieces[code] = ({ squareWidth }) => {
      // build path via public/ (Vite serves public at root)
      const src = `/pieces/${code}.svg`;
      const size = Math.round(squareWidth * 0.85);
      return (
        <img
          src={src}
          alt={code}
          style={{
            width: size,
            height: size,
            objectFit: "contain",
            pointerEvents: "none",    // evita problemas com drag
            userSelect: "none",
            display: "block",
          }}
        />
      );
    };
  });

  return pieces;
};
