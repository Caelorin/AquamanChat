interface AIRequestParams {
  contactId: string;
  messageId: string;
  systemPrompt: string;
  conversationHistory: { role: string; content: string }[];
  onToken: (token: string) => void;
  onComplete: () => void;
  onMultipleMessages?: (messages: string[]) => void;
}

/**
 * 调用DeepSeek API获取AI回复
 * 按照官方文档格式重写，支持多条消息分别显示
 */
export async function fetchAIResponse({
  contactId,
  messageId,
  systemPrompt,
  conversationHistory,
  onToken,
  onComplete,
  onMultipleMessages,
}: AIRequestParams): Promise<void> {
  console.log('🤖 开始AI回复请求:', {
    contactId,
    messageId,
    conversationLength: conversationHistory.length
  });

  try {
    // 准备请求数据
    const requestData = {
      conversationHistory
    };

    console.log('📤 发送请求到后端API...');
    
    // 调用后端API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // 解析响应
    const data = await response.json();
    
    console.log('📦 收到API响应:', {
      success: data.success,
      hasContent: !!data.content,
      contentLength: data.content?.length,
      usage: data.usage,
      model: data.model
    });

    if (data.success && data.content) {
      // 检查是否包含多条消息分隔符
      const messages = data.content.split('|||').map((msg: string) => msg.trim()).filter((msg: string) => msg.length > 0);
      
      console.log('📝 解析消息数量:', messages.length);
      
      if (messages.length > 1 && onMultipleMessages) {
        // 处理多条消息
        console.log('🔄 处理多条消息:', messages);
        onMultipleMessages(messages);
      } else {
        // 单条消息，使用原有逻辑
        console.log('⌨️ 开始打字效果...');
        await simulateTyping(data.content, onToken);
        console.log('✅ 打字效果完成');
      }
    } else {
      // 使用备用回复
      console.log('⚠️ 使用备用回复:', data.content);
      onToken(data.content || '抱歉，回复生成失败');
    }
    
    onComplete();

  } catch (error) {
    console.error('❌ AI回复请求失败:', error);
    
    // 本地备用回复
    const fallbackResponses = [
      '不好意思，我刚才在想其他事情',
      '哈哈，你说得对呢',
      '嗯嗯，我也是这么想的',
      '有意思，继续说说呢',
      '说得不错啊'
    ];
    
    const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    console.log('🔄 使用本地备用回复:', fallback);
    
    onToken(fallback);
    onComplete();
  }
}

/**
 * 模拟真人打字效果
 */
async function simulateTyping(text: string, onToken: (token: string) => void): Promise<void> {
  let currentText = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    currentText += char;
    onToken(currentText);
    
    // 根据字符调整打字速度，让效果更自然
    let delay = 50; // 默认延迟
    
    if (char === '。' || char === '！' || char === '？') {
      delay = 150; // 句子结束稍慢
    } else if (char === '，' || char === '、') {
      delay = 100; // 标点稍慢
    } else if (char === ' ') {
      delay = 30; // 空格快一点
    } else {
      delay = Math.random() * 60 + 40; // 40-100ms随机延迟
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

/**
 * 分别处理多条消息的打字效果
 * 修复状态竞争问题，添加更真实的随机间隔
 */
export async function simulateMultipleMessages(
  messages: string[],
  onMessage: (message: string, isLast: boolean) => Promise<void>,
  onComplete: () => void
): Promise<void> {
  console.log('🔄 开始分别发送多条消息:', messages);
  
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const isLast = i === messages.length - 1;
    
    // 每条消息之间的随机间隔 - 模拟真人发消息的节奏
    if (i > 0) {
      // 真人发消息的间隔：短间隔(300-800ms)、中间隔(1-2s)、长间隔(2-3s)
      const randomType = Math.random();
      let delay: number;
      
      if (randomType < 0.5) {
        // 50% 概率短间隔 - 快速连发
        delay = 300 + Math.random() * 500; // 300-800ms
      } else if (randomType < 0.8) {
        // 30% 概率中间隔 - 正常思考时间
        delay = 1000 + Math.random() * 1000; // 1-2s
      } else {
        // 20% 概率长间隔 - 仔细思考或被打断
        delay = 2000 + Math.random() * 1000; // 2-3s
      }
      
      console.log(`⏰ 等待 ${Math.round(delay)}ms 后发送下一条消息...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    console.log(`📤 发送第 ${i + 1} 条消息:`, message);
    
    // 等待消息添加完成，避免状态竞争
    await onMessage(message, isLast);
    
    // 模拟真人打字时间 - 更真实的变化
    const baseTypingTime = message.length * 60; // 基础打字时间
    const randomFactor = 0.5 + Math.random(); // 0.5-1.5倍速度变化
    const extraThinkTime = Math.random() * 800; // 0-800ms额外思考时间
    const typingTime = baseTypingTime * randomFactor + extraThinkTime;
    
    console.log(`⌨️ 模拟打字时间: ${Math.round(typingTime)}ms`);
    await new Promise(resolve => setTimeout(resolve, typingTime));
  }
  
  onComplete();
} 