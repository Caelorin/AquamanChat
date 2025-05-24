"use client";

import { useState } from 'react';
import { Contact } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ContactListProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  activeContactId?: string;
  setCurrentView: (view: 'sidebar' | 'contacts' | 'chat') => void;
  currentView: 'sidebar' | 'contacts' | 'chat';
}

const ContactList = ({ 
  contacts, 
  onSelectContact, 
  activeContactId,
  setCurrentView,
  currentView
}: ContactListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLastMessageTime = (contact: Contact) => {
    const chatHistory = localStorage.getItem('chatHistory');
    if (!chatHistory) return null;
    
    const parsedHistory = JSON.parse(chatHistory);
    const contactHistory = parsedHistory[contact.id];
    
    if (!contactHistory || contactHistory.length === 0) return null;
    
    return new Date(contactHistory[contactHistory.length - 1].timestamp);
  };

  return (
    <motion.div 
      className="w-full md:w-72 bg-card border-r border-border flex flex-col"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-2 p-1 rounded-full hover:bg-secondary"
              onClick={() => setCurrentView('sidebar')}
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold">联系人</h2>
          </div>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="搜索"
            className="pl-8 pr-3 py-1 bg-secondary rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-muted-foreground">
            <p>没有联系人</p>
            <p className="text-sm">点击左侧 + 添加</p>
          </div>
        ) : (
          <ul>
            {filteredContacts.map(contact => {
              const lastMessageTime = getLastMessageTime(contact);
              
              return (
                <li 
                  key={contact.id}
                  onClick={() => onSelectContact(contact)}
                  className={cn(
                    "p-4 hover:bg-secondary cursor-pointer transition-colors duration-200",
                    activeContactId === contact.id && "bg-secondary"
                  )}
                >
                  <div className="flex items-center">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image 
                        src={contact.avatar} 
                        alt={contact.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{contact.name}</h3>
                        {lastMessageTime && (
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(lastMessageTime, { addSuffix: true, locale: zhCN })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default ContactList;