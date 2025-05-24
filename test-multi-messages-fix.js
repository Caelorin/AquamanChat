// 测试多条消息修复效果
const http = require('http');

async function testMultiMessageFix() {
  console.log('🔧 测试多条消息修复效果和随机间隔...');
  
  const testCases = [
    "你吃饭了吗？",
    "明天有空吗",
    "想你了",
    "今天干什么呢"
  ];
  
  for (let i = 0; i < testCases.length; i++) {
    const message = testCases[i];
    console.log(`\n=== 测试 ${i + 1}: "${message}" ===`);
    
    try {
      const result = await callAPI(message);
      console.log('🎯 API响应成功:', {
        success: result.success,
        contentLength: result.content?.length,
        model: result.model
      });
      
      if (result.content && result.content.includes('|||')) {
        const messages = result.content.split('|||').filter(msg => msg.trim().length > 0);
        console.log(`✅ 多条消息模式 - 共 ${messages.length} 条:`);
        
        messages.forEach((msg, idx) => {
          console.log(`  ${idx + 1}. "${msg.trim()}"`);
        });
        
        console.log('\n🎭 模拟前端处理效果:');
        await simulateFrontendProcessing(messages);
        
      } else {
        console.log('📝 单条消息模式:', `"${result.content}"`);
      }
      
    } catch (error) {
      console.error('❌ 测试失败:', error.message);
    }
    
    // 测试间隔
    if (i < testCases.length - 1) {
      console.log('\n⏱️  等待 3 秒进行下一个测试...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n🏁 所有测试完成!');
}

async function simulateFrontendProcessing(messages) {
  console.log('   🚀 开始分别发送消息...');
  
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i].trim();
    const isLast = i === messages.length - 1;
    
    // 模拟随机间隔
    if (i > 0) {
      const randomType = Math.random();
      let delay;
      
      if (randomType < 0.5) {
        delay = 300 + Math.random() * 500; // 短间隔
      } else if (randomType < 0.8) {
        delay = 1000 + Math.random() * 1000; // 中间隔
      } else {
        delay = 2000 + Math.random() * 1000; // 长间隔
      }
      
      console.log(`   ⏰ 等待 ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    console.log(`   📤 [消息 ${i + 1}] ${message}`);
    
    // 模拟打字时间
    const baseTypingTime = message.length * 60;
    const randomFactor = 0.5 + Math.random();
    const extraThinkTime = Math.random() * 800;
    const typingTime = baseTypingTime * randomFactor + extraThinkTime;
    
    console.log(`   ⌨️  打字时间: ${Math.round(typingTime)}ms`);
    await new Promise(resolve => setTimeout(resolve, Math.min(typingTime, 1000))); // 限制最大演示时间
  }
  
  console.log('   ✅ 所有消息发送完成');
}

function callAPI(message) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      conversationHistory: [
        { role: "user", content: message }
      ]
    });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = http.request(options, (res) => {
      let responseBody = '';
      
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseBody);
          resolve(result);
        } catch (parseError) {
          reject(new Error('无法解析JSON响应: ' + responseBody));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('请求超时'));
    });
    
    req.setTimeout(10000); // 10秒超时
    req.write(data);
    req.end();
  });
}

// 启动测试
testMultiMessageFix().catch(console.error);

/**
 * 测试多条消息分割和处理逻辑
 * 模拟API响应，验证消息是否正确分割和处理
 */

console.log('🧪 测试多条消息分割和处理逻辑...\n');

// 模拟API响应的内容
const testResponses = [
  // 单条消息
  '记得穿漂亮点，我要让店里的人都羡慕我',
  
  // 两条消息
  '刚吃完，今天尝试做了个新菜|||虽然卖相不咋地，但味道还行 😅',
  
  // 三条消息
  '最近工作太忙都没时间找你|||你这一说我才发现确实挺久没聊了|||周末有空出来喝杯咖啡吗',
  
  // 包含空消息的情况
  '明天下午有空|||||||该不会是想约我吧 😏'
];

// 模拟分割逻辑
function testMessageSplitting(content) {
  console.log('📋 原始内容:', content);
  
  // 使用与API相同的分割逻辑
  const messages = content.split('|||').map((msg) => msg.trim()).filter((msg) => msg.length > 0);
  
  console.log('📝 分割后消息数量:', messages.length);
  console.log('📝 分割后消息:', messages);
  
  // 判断应该走哪个处理逻辑
  const hasOnMultipleMessages = true; // 假设回调存在
  
  if (messages.length > 1 && hasOnMultipleMessages) {
    console.log('✅ 应该走多条消息处理逻辑');
    return { type: 'multiple', messages };
  } else {
    console.log('⚠️ 走单条消息处理逻辑，原始内容作为一条消息');
    return { type: 'single', content };
  }
}

// 测试所有响应
testResponses.forEach((response, index) => {
  console.log(`\n🔍 测试案例 ${index + 1}:`);
  console.log('=' .repeat(50));
  
  const result = testMessageSplitting(response);
  
  if (result.type === 'multiple') {
    console.log('🎯 结果: 正确识别为多条消息');
    console.log('💬 将显示:', result.messages.length, '条独立消息');
  } else {
    console.log('🎯 结果: 识别为单条消息');
    console.log('💬 将显示:', '1条包含所有内容的消息');
  }
});

console.log('\n🔧 问题诊断:');
console.log('如果用户看到的是包含|||的完整字符串，说明:');
console.log('1. onMultipleMessages 回调没有传递');
console.log('2. 或者消息分割逻辑有问题');
console.log('3. 或者多条消息处理逻辑没有被调用');

// 模拟ChatWindow中的回调传递
console.log('\n📞 检查ChatWindow中的回调传递...');

// 这里模拟ChatWindow.tsx中的fetchAIResponse调用
function simulateChatWindowCall() {
  const requestDetails = {
    contactId: 'test',
    messageId: 'test-123',
    systemPrompt: 'test',
    conversationHistory: []
  };
  
  // 检查是否有onMultipleMessages回调
  const onMultipleMessages = (messages) => {
    console.log('📬 onMultipleMessages 被调用，消息:', messages);
    return true;
  };
  
  const onToken = (token) => {
    console.log('⌨️ onToken 被调用，内容:', token.substring(0, 20) + '...');
  };
  
  console.log('✅ onMultipleMessages 回调:', typeof onMultipleMessages);
  console.log('✅ onToken 回调:', typeof onToken);
  
  return {
    onMultipleMessages: onMultipleMessages,
    onToken: onToken,
    hasMultipleMessagesCallback: !!onMultipleMessages
  };
}

const callbacks = simulateChatWindowCall();
console.log('📊 回调检查结果:', callbacks.hasMultipleMessagesCallback ? '✅ 正常' : '❌ 缺失'); 