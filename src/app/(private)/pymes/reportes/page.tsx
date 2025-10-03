'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Spinner, TextInput, Card } from 'flowbite-react';
import { Send, Cpu, Bot } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { askAI } from '@/app/services/ai.services'; 
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

const customTextInputTheme = {
  field: {
    input: {
      colors: {
        gray: "bg-card border-border text-foreground focus:ring-primary focus:border-primary",
      },
    },
  },
};

const ChatInterface = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "¡Hola! Soy tu asistente de IA. Pídeme un análisis y lo generaré para ti."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const companyId = session?.user?.companyId;
      const token = session?.accessToken;

      if (!companyId || !token) {
        throw new Error('No se pudo obtener la información de la empresa o el token.');
      }
      
      const response = await askAI({ question: input, companyId, token });
      
      const aiMessage: Message = { role: 'ai', content: response.answer };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'No se pudo obtener una respuesta.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full w-full flex flex-col p-0">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Bot className="text-primary" />
          Asistente IA
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col gap-1 max-w-lg ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-3 rounded-xl ${msg.role === 'user' ? 'bg-primary text-button-text rounded-br-none' : 'bg-card border border-border rounded-bl-none'}`}>
                <p className="text-sm font-normal whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
         {isLoading && (
          <div className="flex items-start gap-2.5 justify-start">
             <div className="p-3 rounded-xl bg-card border border-border rounded-bl-none">
                <Spinner size="sm" />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <TextInput
            theme={customTextInputTheme}
            className="flex-1 [&_input]:py-3"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pide un reporte..."
            disabled={isLoading}
            required
          />
          <Button type="submit" disabled={isLoading} className='bg-primary text-button-text'>
            {isLoading ? <Spinner size="sm" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default function ReportesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Cpu className="text-primary"/>
          Central de Reportes
        </h1>
        <p className="text-lg text-foreground/80 mt-1">Tu centro de mando para el análisis de datos y proyecciones.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 w-full mb-8 lg:mb-0">
          <DashboardCharts />
        </div>
        
        <div className="lg:col-span-1 w-full h-[calc(100vh-220px)]">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}