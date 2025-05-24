// DeepSeek API 测试 - 按照官方文档格式
const OpenAI = require('openai');

// 严格按照官方文档配置
const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-1c5d35d209824ef3bb63a8a8e85f9297'
});

// 测试基础对话
async function testBasicChat() {
  console.log('🧪 测试1: 基础对话 (按照官方文档格式)');
  
  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello!" }
      ],
      stream: false
    });
    
    console.log('✅ 基础对话测试成功!');
    console.log('响应:', completion.choices[0]?.message?.content);
    console.log('模型:', completion.model);
    console.log('用量:', completion.usage);
    console.log('---');
    
  } catch (error) {
    console.error('❌ 基础对话测试失败:', {
      name: error.name,
      message: error.message,
      status: error.status,
      code: error.code
    });
  }
}

// 测试中文对话
async function testChineseChat() {
  console.log('🧪 测试2: 中文对话');
  
  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "user", content: "你好，请用中文回复" }
      ],
      stream: false,
      temperature: 0.7,
      max_tokens: 100
    });
    
    console.log('✅ 中文对话测试成功!');
    console.log('响应:', completion.choices[0]?.message?.content);
    console.log('---');
    
  } catch (error) {
    console.error('❌ 中文对话测试失败:', error.message);
  }
}

// 测试多轮对话
async function testMultiTurnChat() {
  console.log('🧪 测试3: 多轮对话');
  
  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "你是一个友好的助手" },
        { role: "user", content: "我今天心情不好" },
        { role: "assistant", content: "我理解你的感受，愿意和我聊聊发生了什么吗？" },
        { role: "user", content: "工作压力太大了" }
      ],
      stream: false,
      temperature: 0.8
    });
    
    console.log('✅ 多轮对话测试成功!');
    console.log('响应:', completion.choices[0]?.message?.content);
    console.log('---');
    
  } catch (error) {
    console.error('❌ 多轮对话测试失败:', error.message);
  }
}

// 测试API连接性
async function testConnection() {
  console.log('🧪 测试4: API连接性检查');
  
  try {
    // 简单的连接测试
    const response = await fetch('https://api.deepseek.com', {
      method: 'GET'
    });
    
    console.log('✅ API端点可访问, 状态码:', response.status);
    
  } catch (error) {
    console.error('❌ API连接测试失败:', error.message);
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('🚀 开始DeepSeek API全面测试...');
  console.log('API配置:', {
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-1c5d35d209824ef3bb63a8a8e85f9297'
  });
  console.log('====================================');
  
  await testConnection();
  await testBasicChat();
  await testChineseChat();
  await testMultiTurnChat();
  
  console.log('🏁 所有测试完成!');
}

runAllTests(); 