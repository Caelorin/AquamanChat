"use client";

import { useState, useEffect, useRef } from 'react';
import { Message, Contact } from '@/lib/types';
import { ChevronLeft, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageItem from './MessageItem';
import { fetchAIResponse, simulateMultipleMessages } from '../../lib/api';
import Image from 'next/image';

interface ChatWindowProps {
  activeContact: Contact | null;
  messages: Message[];
  onSendMessage: (content: string) => Promise<{
    contactId: string;
    messageId: string;
    systemPrompt: string;
    conversationHistory: { role: string; content: string }[];
  } | undefined>;
  setChatHistory: (
    updater: (prev: Record<string, Message[]>) => Record<string, Message[]>
  ) => void;
  onBack: () => void;
  isMobileView: boolean;
}

const ChatWindow = ({
  activeContact,
  messages,
  onSendMessage,
  setChatHistory,
  onBack,
  isMobileView
}: ChatWindowProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 监听AI回复触发事件
  useEffect(() => {
    const handleAIResponse = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const requestDetails = customEvent.detail;
      console.log('🎯 接收到AI回复触发事件:', requestDetails);
      
      if (!activeContact || requestDetails.contactId !== activeContact.id) {
        console.log('❌ 联系人不匹配，跳过AI回复');
        return;
      }

      setIsTyping(true);
      
      try {
        await fetchAIResponse({
          ...requestDetails,
          onToken: (token: string) => {
            setChatHistory(prev => {
              const currentMessages = prev[requestDetails.contactId] || [];
              console.log('🔄 AI回复更新前:', {
                contactId: requestDetails.contactId,
                messageId: requestDetails.messageId,
                currentMessagesCount: currentMessages.length,
                token: token,
                currentMessages: currentMessages.map(m => ({ id: m.id, sender: m.sender, content: m.content.substring(0, 20) + '...' }))
              });
              
              // 检查是否已经存在AI回复消息
              const existingResponseIndex = currentMessages.findIndex(
                m => m.id === requestDetails.messageId
              );
              
              let updatedMessages;
              if (existingResponseIndex !== -1) {
                // 更新现有的AI回复消息，保持其他消息不变
                updatedMessages = currentMessages.map((msg, index) => 
                  index === existingResponseIndex 
                    ? { ...msg, content: token }
                    : msg
                );
                console.log('✏️ 更新现有AI回复消息，位置:', existingResponseIndex);
              } else {
                // 添加新的AI回复消息到数组末尾
                const aiReplyMessage: Message = {
                  id: requestDetails.messageId,
                  sender: 'user', // AI回复显示为用户自己的消息
                  content: token,
                  timestamp: new Date().toISOString(),
                };
                updatedMessages = [...currentMessages, aiReplyMessage];
                console.log('➕ 添加新的AI回复消息:', aiReplyMessage);
              }
              
              console.log('💾 更新聊天历史 - AI回复:', {
                contactId: requestDetails.contactId,
                finalMessagesCount: updatedMessages.length,
                messages: updatedMessages.map(m => ({ id: m.id, sender: m.sender, content: m.content.substring(0, 20) + '...' }))
              });
              
              return {
                ...prev,
                [requestDetails.contactId]: updatedMessages
              };
            });
          },
          onMultipleMessages: (messages: string[]) => {
            // 处理多条消息
            console.log('📬 接收到多条消息:', messages);
            simulateMultipleMessages(
              messages,
              async (message: string, isLast: boolean): Promise<void> => {
                // 为每条消息生成独立的ID
                const messageId = `${requestDetails.messageId}-${Date.now()}-${Math.random()}`;
                
                return new Promise((resolve) => {
                  setChatHistory(prev => {
                    const currentMessages = prev[requestDetails.contactId] || [];
                    const aiReplyMessage: Message = {
                      id: messageId,
                      sender: 'user', // AI回复显示为用户自己的消息
                      content: message,
                      timestamp: new Date().toISOString(),
                    };
                    
                    console.log(`📤 添加第${messages.indexOf(message) + 1}条消息:`, message);
                    
                    // 使用setTimeout确保状态更新完成后再resolve
                    setTimeout(() => {
                      resolve();
                    }, 50); // 给React足够时间完成状态更新
                    
                    return {
                      ...prev,
                      [requestDetails.contactId]: [...currentMessages, aiReplyMessage]
                    };
                  });
                });
              },
              () => {
                console.log('✅ 所有消息发送完成');
                setIsTyping(false);
              }
            );
          },
          onComplete: () => {
            setIsTyping(false);
          }
        });
      } catch (error) {
        console.error('Error in response:', error);
        setIsTyping(false);
      }
    };

    // 添加事件监听器
    window.addEventListener('triggerAIResponse', handleAIResponse);
    
    // 清理函数
    return () => {
      window.removeEventListener('triggerAIResponse', handleAIResponse);
    };
  }, [activeContact, setChatHistory]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeContact) return;
    
    const message = inputValue;
    setInputValue('');

    // 发送消息，AI回复将通过事件触发
    await onSendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  return (
    <motion.div
      className="flex flex-col h-full flex-1 bg-card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {activeContact ? (
        <>
          <div className="p-4 border-b border-border flex items-center">
            {isMobileView && (
              <button
                className="p-1 mr-2 rounded-full hover:bg-secondary"
                onClick={onBack}
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div className="relative h-10 w-10 rounded-full overflow-hidden">
              <Image
                src={activeContact.avatar}
                alt={activeContact.name}
                fill
                className="object-cover"
              />
            </div>
            <h2 className="ml-3 font-medium">{activeContact.name}</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-secondary/30">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  activeContact={activeContact}
                  isFirst={index === 0 || messages[index - 1].sender !== message.sender}
                  isLast={
                    index === messages.length - 1 ||
                    messages[index + 1].sender !== message.sender
                  }
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入消息..."
                  className="w-full p-3 pr-12 bg-secondary rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary min-h-[40px] max-h-[120px] overflow-y-auto"
                  rows={1}
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || !activeContact || isTyping}
                className={`ml-2 p-3 rounded-full bg-primary text-primary-foreground flex items-center justify-center
                  ${inputValue.trim() && !isTyping ? 'opacity-100' : 'opacity-50'}`}
              >
                <Send size={18} />
              </motion.button>
            </div>
            {isTyping && (
              <div className="text-xs text-muted-foreground mt-1 ml-2">
                正在回复...
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">请选择一位联系人开始聊天</p>
            <p className="text-sm">或点击左侧加号添加新联系人</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChatWindow;