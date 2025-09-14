

import { Card } from '@/components/ui/Card';
import { FolderKanban } from 'lucide-react';


export default function ComprasPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Registro de Compras</h1>
        
      </div>

      
      <Card>
        <div className="flex flex-col items-center justify-center text-center p-12">
          <FolderKanban className="w-16 h-16 text-primary/50 mb-4" />
          <h2 className="text-xl font-semibold text-foreground">Módulo en Desarrollo</h2>
          <p className="text-foreground/60 mt-2">
            La funcionalidad de Compras está siendo conectada al backend.
            <br />
            ¡Estará disponible muy pronto!
          </p>
        </div>
      </Card>
      
    </div>
  );
}