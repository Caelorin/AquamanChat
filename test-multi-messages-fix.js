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