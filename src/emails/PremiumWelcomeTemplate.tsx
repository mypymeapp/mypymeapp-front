import React from 'react';
import { PATHROUTES } from '../constants/pathroutes';

interface PremiumWelcomeTemplateProps {
  userName: string;
  companyName: string;
}

export const PremiumWelcomeTemplate: React.FC<PremiumWelcomeTemplateProps> = ({ userName, companyName }) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const logoUrl = `${appUrl}/logo-light.png`;
  const dashboardUrl = `${appUrl}${PATHROUTES.pymes.dashboard}`;

  const containerStyle: React.CSSProperties = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f3f4f6',
    padding: '40px 20px',
  };
  const cardStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '40px',
    border: '1px solid #e5e7eb',
  };
  const logoContainerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '32px',
  };
  const h1Style: React.CSSProperties = {
    color: '#111827',
    fontSize: '24px',
  };
  const pStyle: React.CSSProperties = {
    color: '#374151',
    lineHeight: '1.6',
  };
  const buttonStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: '#0055A4',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginTop: '24px',
  };
  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: '32px',
    color: '#6b7280',
    fontSize: '12px',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={logoContainerStyle}>
          <img src={logoUrl} alt="My PYME App Logo" width="180" />
        </div>
        <h1 style={h1Style}>¡Bienvenido a Premium, {userName}!</h1>
        <p style={pStyle}>
          Gracias por llevar la gestión de <strong>{companyName}</strong> al siguiente nivel. Tu suscripción Premium ha sido activada y ya tienes acceso a todas nuestras herramientas avanzadas.
        </p>
        <p style={pStyle}>
          Explora los reportes inteligentes, consulta a nuestro asistente de IA y personaliza la aplicación a tu gusto.
        </p>
        <div style={{ textAlign: 'center' }}>
          <a href={dashboardUrl} style={buttonStyle}>
            Ir a mi Dashboard
          </a>
        </div>
      </div>
      <div style={footerStyle}>
        <p>© {new Date().getFullYear()} My PYME App. Todos los derechos reservados.</p>
      </div>
    </div>
  );
};