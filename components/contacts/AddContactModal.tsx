"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Contact } from '@/lib/types';
import { DEFAULT_AVATARS } from '@/lib/constants';
import { generateId } from '@/lib/utils';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (contact: Contact) => void;
}

const AddContactModal = ({ isOpen, onClose, onAddContact }: AddContactModalProps) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0]);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newContact: Contact = {
      id: generateId(),
      name: name.trim(),
      avatar: customAvatar || selectedAvatar,
      lastActive: new Date().toISOString(),
    };

    onAddContact(newContact);
    setName('');
    setSelectedAvatar(DEFAULT_AVATARS[0]);
    setCustomAvatar(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Read the file and convert it to a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomAvatar(event.target?.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: 0.1 } },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
    >
      <motion.div
        className="bg-card rounded-lg shadow-xl max-w-md w-full"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold">添加联系人</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              名称
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-input rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="输入联系人名称"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">头像</label>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {DEFAULT_AVATARS.map((avatar, index) => (
                <div
                  key={index}
                  className={`relative h-16 w-16 rounded-full overflow-hidden cursor-pointer border-2 ${
                    selectedAvatar === avatar && !customAvatar
                      ? 'border-primary'
                      : 'border-transparent'
                  }`}
                  onClick={() => {
                    setSelectedAvatar(avatar);
                    setCustomAvatar(null);
                  }}
                >
                  <Image
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label
                htmlFor="avatar-upload"
                className="flex items-center justify-center p-2 border border-dashed border-input rounded-md cursor-pointer hover:bg-secondary transition-colors"
              >
                {customAvatar ? (
                  <div className="flex items-center">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden mr-2">
                      <Image src={customAvatar} alt="Custom avatar" fill className="object-cover" />
                    </div>
                    <span>更换头像</span>
                  </div>
                ) : (
                  <span>{isUploading ? '上传中...' : '上传自定义头像'}</span>
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 text-sm rounded-md border border-input hover:bg-secondary transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              disabled={!name.trim()}
            >
              添加
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddContactModal;