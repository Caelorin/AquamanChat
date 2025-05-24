"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import ContactList from '@/components/contacts/ContactList';
import ChatWindow from '@/components/chat/ChatWindow';
import { Contact, Message } from '@/lib/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AnimatePresence } from 'framer-motion';
import AddContactModal from '@/components/contacts/AddContactModal';
import { DEFAULT_SYSTEM_PROMPT } from '@/lib/constants';

const ChatLayout = () => {
  const [contacts, setContacts] = useLocalStorage<Contact[]>('contacts', []);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [chatHistory, setChatHistory] = useLocalStorage<Record<string, Message[]>>('chatHistory', {});
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [currentView, setCurrentView] = useState<'sidebar' | 'contacts' | 'chat'>(
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'contacts' : 'chat'
  );
  const [pendingAIResponse, setPendingAIResponse] = useState<{
    contactId: string;
    messageId: string;
    systemPrompt: string;
    conversationHistory: { role: string; content: string }[];
  } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setCurrentView('chat');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (activeContact && !chatHistory[activeContact.id]) {
      setChatHistory(prev => ({
        ...prev,
        [activeContact.id]: []
      }));
    }
  }, [activeContact, chatHistory, setChatHistory]);

  // 监听chatHistory变化，当联系人消息添加后触发AI回复
  useEffect(() => {
    if (pendingAIResponse && activeContact) {
      const currentMessages = chatHistory[activeContact.id] || [];
      console.log('🔍 检查状态同步:', {
        contactId: activeContact.id,
        currentMessagesCount: currentMessages.length,
        pendingResponse: pendingAIResponse.messageId
      });
      
      // 确保联系人消息已经在chatHistory中
      if (currentMessages.length > 0) {
        console.log('✅ 状态已同步，开始AI回复');
        // 状态已同步，清除pending状态并开始AI回复
        const response = pendingAIResponse;
        setPendingAIResponse(null);
        
        // 通知ChatWindow开始AI回复
        triggerAIResponse(response);
      }
    }
  }, [chatHistory, pendingAIResponse, activeContact]);

  // 新增：触发AI回复的函数
  const triggerAIResponse = (responseDetails: {
    contactId: string;
    messageId: string;
    systemPrompt: string;
    conversationHistory: { role: string; content: string }[];
  }) => {
    // 这里我们需要通过其他方式通知ChatWindow开始AI回复
    // 我们可以使用自定义事件或者状态管理
    window.dispatchEvent(new CustomEvent('triggerAIResponse', { 
      detail: responseDetails 
    }));
  };

  const handleContactSelect = (contact: Contact) => {
    setActiveContact(contact);
    if (isMobileView) {
      setCurrentView('chat');
    }
  };

  const handleAddContact = (newContact: Contact) => {
    setContacts([...contacts, newContact]);
    setChatHistory(prev => ({
      ...prev,
      [newContact.id]: []
    }));
    setIsAddContactModalOpen(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!activeContact || !content.trim()) return;

    console.log('📤 发送消息:', content, '联系人:', activeContact.name);

    // Add contact message (用户输入的内容显示为联系人发送的消息)
    const contactMessage: Message = {
      id: Date.now().toString(),
      sender: 'contact',
      content: content,
      timestamp: new Date().toISOString(),
    };

    console.log('📝 创建联系人消息:', contactMessage);

    // 获取当前聊天历史并构建对话上下文
    const currentHistory = chatHistory[activeContact.id] || [];
    const conversationHistory = [
      // 将历史消息转换为AI API格式
      ...currentHistory.map(msg => ({
        role: msg.sender === 'contact' ? 'user' : 'assistant',
        content: msg.content
      })),
      // 添加当前用户消息
      { role: 'user', content }
    ];

    // 准备AI回复详情
    const responseMessageId = `response-${Date.now()}`;
    const responseDetails = {
      contactId: activeContact.id,
      messageId: responseMessageId,
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      conversationHistory: conversationHistory
    };

    console.log('🤖 设置待处理AI回复:', {
      ...responseDetails,
      conversationHistoryLength: conversationHistory.length
    });
    
    // 设置待处理的AI回复
    setPendingAIResponse(responseDetails);

    // 添加联系人消息到chatHistory
    setChatHistory(prev => {
      const updated = {
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), contactMessage]
      };
      console.log('💾 更新聊天历史 - 联系人消息:', {
        contactId: activeContact.id,
        messagesCount: updated[activeContact.id].length,
        lastMessage: updated[activeContact.id][updated[activeContact.id].length - 1]
      });
      return updated;
    });

    // 返回undefined，AI回复将通过事件触发
    return undefined;
  };

  const handleBackToContacts = () => {
    setCurrentView('contacts');
  };

  const handleOpenAddContactModal = () => {
    setIsAddContactModalOpen(true);
  };

  return (
    <div className="h-full flex rounded-lg overflow-hidden shadow-xl bg-background">
      {(!isMobileView || currentView === 'sidebar') && (
        <Sidebar onAddContact={handleOpenAddContactModal} setCurrentView={setCurrentView} currentView={currentView} />
      )}
      
      {(!isMobileView || currentView === 'contacts') && (
        <ContactList 
          contacts={contacts}
          onSelectContact={handleContactSelect}
          activeContactId={activeContact?.id}
          setCurrentView={setCurrentView}
          currentView={currentView}
        />
      )}
      
      {(!isMobileView || currentView === 'chat') && (
        <ChatWindow 
          activeContact={activeContact}
          messages={activeContact ? (chatHistory[activeContact.id] || []) : []}
          onSendMessage={handleSendMessage}
          setChatHistory={setChatHistory}
          onBack={handleBackToContacts}
          isMobileView={isMobileView}
        />
      )}

      <AnimatePresence>
        {isAddContactModalOpen && (
          <AddContactModal 
            isOpen={isAddContactModalOpen} 
            onClose={() => setIsAddContactModalOpen(false)}
            onAddContact={handleAddContact}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatLayout;