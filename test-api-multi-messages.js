// 测试多条消息API功能
const http = require('http');

async function testMultiMessageAPI() {
  console.log('🧪 测试多条消息API功能...');
  
  const testCases = [
    "你吃饭了吗？",
    "想你了",
    "明天有空吗"
  ];
  
  for (let i = 0; i < testCases.length; i++) {
    const message = testCases[i];
    console.log(`\n--- 测试 ${i + 1}: "${message}" ---`);
    
    try {
      const result = await callAPI(message);
      console.log('API返回:', result);
      
      if (result.content && result.content.includes('|||')) {
        const messages = result.content.split('|||').filter(msg => msg.trim().length > 0);
        console.log(`✅ 检测到 ${messages.length} 条消息:`);
        messages.forEach((msg, idx) => {
          console.log(`  ${idx + 1}. ${msg.trim()}`);
        });
      } else {
        console.log('📝 单条消息:', result.content);
      }
      
    } catch (error) {
      console.error('❌ 测试失败:', error.message);
    }
    
    // 等待一下避免请求过快
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🏁 测试完成!');
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
    
    req.write(data);
    req.end();
  });
}

testMultiMessageAPI(); 