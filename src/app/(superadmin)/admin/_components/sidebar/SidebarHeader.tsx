import { FiX } from "react-icons/fi";
import { ThemeToggleButton } from "@/components/ui/ThemeToggleButton";

export const SidebarHeader = ({ onToggle }: { onToggle: () => void }) => {
    
    return (
        <div className="flex items-center justify-between p-6 border-b border-primary">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-sm">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">My PymeApp</h1>
              <p className="text-xs text-muted">Admin Panel</p>
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