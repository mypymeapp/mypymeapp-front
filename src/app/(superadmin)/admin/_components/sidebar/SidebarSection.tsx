"use client";
import { motion, AnimatePresence } from "framer-motion";
import { RenderMenuItem } from "./SidebarItems";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarFooter } from "./SidebarFooter";
import { useAdmin } from "@/app/(superadmin)/admin/context/admin-context";

export default function SidebarSection() {
  const { sidebarOpen, toggleSidebar } = useAdmin();
  
  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={
          `w-80 h-screen bg-background border-r border-primary fixed left-0 top-0 z-50 shadow-xl transition-transform duration-300 
          flex flex-col lg:sticky lg:z-auto lg:shadow-none lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`
        }
      >
        {/* Header */}
        <SidebarHeader onToggle={toggleSidebar} />
        {/* Navigation */}
        <RenderMenuItem />
        {/* Footer */}
        <SidebarFooter />
      </aside>
    </>
  );
}
