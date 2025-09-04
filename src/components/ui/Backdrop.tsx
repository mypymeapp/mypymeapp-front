// Chicos, este componente lo hice para que cuando aparezca una notificación el fondo se ponga borroso, así la notificación toma la atención del usuario.


'use client';

import React from 'react';

interface BackdropProps {
  isVisible: boolean;
}

export const Backdrop: React.FC<BackdropProps> = ({ isVisible }) => {
  return (
    <div
      className={`fixed inset-0 z-40 bg-background/50 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    />
  );
};