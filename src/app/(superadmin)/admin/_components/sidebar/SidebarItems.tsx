import { FiHome, FiChevronDown, FiUserPlus, FiPhoneCall, FiUser } from "react-icons/fi";

import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  submenu?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <FiHome size={20} />,
    href: "/admin",
  },
  {
    id: "clients",
    label: "Clientes",
    icon: <FiUserPlus size={20} />,
    href: "/admin/clients",
    // submenu: [
    //   { id: "companies", label: "Empresas", icon: <FiShoppingBag size={16} />, href: "/admin/companies" },
    //   { id: "categories", label: "Categorias", icon: <FiFileText size={16} />, href: "/admin/companies/categories" }
    // ]
  },
  {
    id: "users",
    label: "Usuarios",
    icon: <FiUser size={20} />,
    href: "/admin/users",
  },
  {
    id: "support",
    label: "Soporte",
    icon: <FiPhoneCall size={20} />,
    href: "/admin/support"
  },
];

export const RenderMenuItem = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const urlPath = usePathname();
  
    const toggleSubmenu = (itemId: string) => {
      setExpandedItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    };
  return (
    <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0">
      {menuItems.map((item) => (
        <div key={item.id}>
          <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={item.href}
              onClick={() =>
                item.submenu ? toggleSubmenu(item.id) : undefined
              }
              className={`
                    w-full flex items-center justify-between p-3 rounded-xl
                    text-foreground transition-all duration-200 group
                    ${
                      urlPath === item.href
                        ? "border border-primary text-primary"
                        : ""
                    }
                  `}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`
                      p-2 rounded-lg transition-colors
                      ${
                        urlPath === item.href
                          ? "bg-blue-800 text-white"
                          : ""
                      }
                    `}
                >
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                {item.badge && (
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900 text-red-100 dark:text-red-100 rounded-full">
                    {item.badge}
                  </span>
                )}
                {item.submenu && (
                  <motion.div
                    animate={{
                      rotate: expandedItems.includes(item.id) ? 180 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronDown size={16} />
                  </motion.div>
                )}
              </div>
            </Link>
          </motion.div>

          {/* Submenu */}
          <AnimatePresence>
            {item.submenu && expandedItems.includes(item.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-4 mt-2 space-y-1 overflow-hidden"
              >
                {item.submenu.map((subItem) => (
                  <motion.button
                    onClick={() => toggleSubmenu(subItem.id)}
                    key={subItem.id}
                    whileHover={{ x: 4 }}
                    className="w-full flex items-center space-x-3 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="p-1 rounded bg-gray-100 dark:bg-gray-800">
                      {subItem.icon}
                    </div>
                    <span className="text-sm">{subItem.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  );
};
