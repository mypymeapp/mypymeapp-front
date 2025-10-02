'use client';

import { FiX } from "react-icons/fi";
import { ThemeToggleButton } from "@/components/ui/ThemeToggleButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export const SidebarHeader = ({ onToggle }: { onToggle: () => void }) => {
    const router = useRouter();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Detectar tema actual
    useEffect(() => {
      setMounted(true);
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);

      // Observar cambios en el tema
      const observer = new MutationObserver(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setIsDarkMode(isDark);
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });

      return () => observer.disconnect();
    }, []);

    const handleLogoClick = () => {
      router.push('/admin');
    };

    // Determinar qué logo mostrar según el tema
    const logoSrc = mounted && isDarkMode ? '/logo-dark.png' : '/logo-light.png';
    
    return (
        <div className="flex items-center justify-between p-6 border-b border-primary">
          <div 
            onClick={handleLogoClick}
            className="cursor-pointer group flex-1"
          >
            <div className="w-32 h-16 relative transition-transform group-hover:scale-105">
              <Image
                src={logoSrc}
                alt="My PymeApp Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <ThemeToggleButton />

            {/* Close button for mobile */}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg transition-colors cursor-pointer"
            >
              <FiX size={20} className="text-primary font-bold" />
            </button>
          </div>
        </div>
    )
}