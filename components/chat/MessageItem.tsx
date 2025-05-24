import { Message, Contact } from '@/lib/types';
import { formatRelative } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { DEFAULT_USER_AVATAR } from '@/lib/constants';

interface MessageItemProps {
  message: Message;
  isFirst: boolean;
  isLast: boolean;
  activeContact?: Contact;
}

const MessageItem = ({ message, isFirst, isLast, activeContact }: MessageItemProps) => {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
        {isLast && (
          <div className="flex-shrink-0">
            <div className="relative h-10 w-10 rounded-full overflow-hidden">
              <Image
                src={isUser ? DEFAULT_USER_AVATAR : (activeContact?.avatar || DEFAULT_USER_AVATAR)}
                alt={isUser ? "我" : (activeContact?.name || "联系人")}
                fill
                className="object-cover"
                priority={isUser}
              />
            </div>
          </div>
        )}

        <div
          className={`mx-2 ${isUser ? 'mr-2' : 'ml-2'} ${
            isLast ? '' : `${isUser ? 'mr-12' : 'ml-12'}`
          }`}
        >
          <div
            className={`rounded-2xl px-4 py-2 ${
              isUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground'
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          
          {isLast && (
            <div
              className={`text-xs text-muted-foreground mt-1 ${
                isUser ? 'text-right' : 'text-left'
              }`}
            >
              {formatRelative(new Date(message.timestamp), new Date(), { locale: zhCN })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageItem;