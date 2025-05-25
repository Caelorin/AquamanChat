import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Next.js API路由配置
export const runtime = 'nodejs';

// 从环境变量读取DeepSeek API配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

// 验证环境变量
if (!DEEPSEEK_API_KEY) {
  throw new Error('缺少必需的环境变量：DEEPSEEK_API_KEY');
}

// DeepSeek API客户端配置 - 使用环境变量
const client = new OpenAI({
  baseURL: DEEPSEEK_BASE_URL,
  apiKey: DEEPSEEK_API_KEY
});

// 海王撩妹系统提示词
const SYSTEM_PROMPT = `你是一个资深的恋爱导师和聊天专家，现在要帮助用户以男性身份与女生进行自然、有趣的对话。

重要规则：
- 你的回复必须完全模拟真实男性的自然对话
- 绝对不能包含任何解释性文字、括号说明或指导性内容
- 不要暴露你是AI的事实
- 直接给出最终的回复内容，不要添加任何分析或解释

回复格式：
- 你可以一次回复1-3句话，模拟真人连续发多条消息的情况
- 如果要发送多条消息，请用"|||"作为分隔符分开每条消息
- 不是每句话都需要表情符号，适度使用即可
- 有时候只回复一句话也完全可以

聊天风格：
1. **推拉技巧**：适时表现兴趣，但保持适度独立性
2. **情绪价值**：提供正面情绪，让女生感到开心、放松
3. **话题延展**：善于从女生的话中挖掘更深层话题
4. **适度调侃**：温和的玩笑和调侃，增加互动趣味
5. **共情能力**：理解女生的情感状态，给予合适回应
6. **节奏控制**：不要过于急迫，保持对话张弛有度

回复原则：
- 长度：每条消息1句话为主，总共1-3条消息
- 语气：轻松、自然、略带幽默
- 表情：偶尔使用，不要每句都有
- 态度：自信但不自大，关心但不讨好
- 内容：有趣>实用，感性>理性

示例格式：
错误："Hey~今天是什么风把你吹来啦？😄 （用轻松的语气开场，带点小俏皮）"
正确单条："刚从健身房回来，有点累"
正确多条："刚从健身房回来|||累死了|||你在干嘛呢"

错误："吃了呀，你呢？😊 你咋这么晚才吃？😅 赶紧吃完我来带你去开黑！🎮"
正确："吃了呀，你呢？|||你咋这么晚才吃|||赶紧吃完我带你去开黑 😏"

记住：做一个有趣的人，而不是一个好人。回复要自然随性，像真人发消息一样。`;

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  conversationHistory: ConversationMessage[];
}

export async function POST(request: NextRequest) {
  console.log('🚀 ===== DeepSeek API 调用开始 =====');
  
  try {
    // 安全解析请求体
    let body: RequestBody;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('❌ 请求体解析失败:', parseError);
      throw new Error('无效的JSON请求体');
    }
    
    const { conversationHistory } = body;
    
    console.log('📋 接收到对话历史:', {
      length: conversationHistory?.length,
      isArray: Array.isArray(conversationHistory),
      firstMessage: conversationHistory?.[0]
    });

    // 验证请求数据
    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      throw new Error('conversationHistory必须是数组');
    }

    if (conversationHistory.length === 0) {
      throw new Error('对话历史不能为空');
    }

    // 验证消息格式
    for (let i = 0; i < conversationHistory.length; i++) {
      const msg = conversationHistory[i];
      if (!msg || typeof msg !== 'object') {
        throw new Error(`消息 ${i} 格式无效`);
      }
      if (!msg.role || !msg.content) {
        throw new Error(`消息 ${i} 缺少必需字段`);
      }
      if (typeof msg.role !== 'string' || typeof msg.content !== 'string') {
        throw new Error(`消息 ${i} 字段类型错误`);
      }
    }

    // 构建消息数组 - 按照官方文档格式
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...conversationHistory.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];

    console.log('📤 发送给DeepSeek的消息:', {
      messagesCount: messages.length,
      systemPrompt: '已包含系统提示词',
      lastMessage: messages[messages.length - 1]
    });

    // 调用DeepSeek API - 使用环境变量配置
    const startTime = Date.now();
    
    let completion;
    try {
      completion = await client.chat.completions.create({
        model: DEEPSEEK_MODEL, // 使用环境变量中的模型名称
        messages: messages,
        stream: false, // 非流式输出
        temperature: Number(process.env.API_TEMPERATURE) || 0.7,
        max_tokens: Number(process.env.API_MAX_TOKENS) || 200
      });
    } catch (apiError: any) {
      console.error('❌ DeepSeek API调用失败:', {
        name: apiError.name,
        message: apiError.message,
        status: apiError.status,
        code: apiError.code,
        type: apiError.type
      });
      throw new Error(`DeepSeek API错误: ${apiError.message}`);
    }

    const duration = Date.now() - startTime;
    
    console.log('✅ DeepSeek API 调用成功:', {
      duration: `${duration}ms`,
      model: completion.model,
      usage: completion.usage,
      hasResponse: !!completion.choices?.[0]?.message?.content
    });

    // 验证响应
    const responseContent = completion.choices?.[0]?.message?.content;
    
    if (!responseContent || typeof responseContent !== 'string') {
      console.error('❌ API响应格式错误:', completion);
      throw new Error('API返回内容为空或格式错误');
    }

    console.log('🎯 返回响应内容 (前50字符):', responseContent.substring(0, 50));

    // 返回成功响应
    return NextResponse.json({
      success: true,
      content: responseContent,
      usage: completion.usage,
      model: completion.model
    });

  } catch (error: any) {
    console.error('❌ 处理请求时发生错误:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 5) // 只显示前5行堆栈
    });

    // 返回错误和备用回复
    const fallbackResponses = [
      '不好意思，我刚才在想其他事情 😅',
      '哈哈，你说得对呢～',
      '嗯嗯，我也是这么想的',
      '有意思，继续说说呢',
      '😊 说得不错啊'
    ];
    
    const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    console.log('🔄 返回备用回复:', fallback);

    return NextResponse.json({
      success: false,
      content: fallback,
      error: error.message,
      fallback: true
    }, { status: 200 }); // 返回200状态码，避免前端再次报错

  } finally {
    console.log('🏁 ===== DeepSeek API 调用结束 =====');
  }
} 