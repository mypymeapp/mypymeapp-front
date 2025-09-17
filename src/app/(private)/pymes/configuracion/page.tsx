import { redirect } from 'next/navigation';
import { PATHROUTES } from '@/constants/pathroutes';

export default function ConfiguracionPage() {
  redirect(PATHROUTES.pymes.configuracion_perfil);
  return null;
}