"use client";

import { PlusIcon, UserIcon, HomeIcon, SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onAddContact: () => void;
  setCurrentView: (view: 'sidebar' | 'contacts' | 'chat') => void;
  currentView: 'sidebar' | 'contacts' | 'chat';
}

const Sidebar = ({ onAddContact, setCurrentView, currentView }: SidebarProps) => {
  return (
    <motion.div 
      className="w-16 bg-secondary flex flex-col items-center py-6 border-r border-border"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center space-y-6 flex-1">
        <button 
          onClick={() => setCurrentView('contacts')}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200",
            currentView === 'contacts' && "bg-primary text-primary-foreground"
          )}
        >
          <HomeIcon size={20} />
        </button>
        
        <button 
          onClick={onAddContact}
          className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
        >
          <PlusIcon size={20} />
        </button>
        
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
          <UserIcon size={20} />
        </button>
      </div>
      
      <button className="w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
        <SettingsIcon size={20} />
      </button>
    </motion.div>
  );
};

export default Sidebar;