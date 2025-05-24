// 测试聊天风格脚本 - 测试多条消息和表情使用频率
const OpenAI = require('openai');

const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-1c5d35d209824ef3bb63a8a8e85f9297'
});

// 更新后的系统提示词
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

// 简单的表情检测函数
function countEmojis(text) {
  // 检测常见的表情符号
  const commonEmojis = ['😀', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😈', '😉', '😊', '😋', '😌', '😍', '😎', '😏', '😐', '😑', '😒', '😓', '😔', '😕', '😖', '😗', '😘', '😙', '😚', '😛', '😜', '😝', '😞', '😟', '😠', '😡', '😢', '😣', '😤', '😥', '😦', '😧', '😨', '😩', '😪', '😫', '😬', '😭', '😮', '😯', '😰', '😱', '😲', '😳', '😴', '😵', '😶', '😷', '🙂', '🙃', '🙄', '🙅', '🙆', '🙇', '🙈', '🙉', '🙊', '🙋', '🙌', '🙍', '🙎', '🙏', '❤️', '💕', '💖', '💗', '💘', '💙', '💚', '💛', '💜', '💝', '💞', '💟', '💪', '👍', '👎', '👌', '👏', '🤝', '🤗', '🤔', '🤭', '🤫', '🤐', '🤨', '🤩', '🤪', '🤬', '🤮', '🤯', '🥰', '🥱', '🥳', '🥺', '🥲', '🥹', '😶‍🌫️', '😮‍💨', '😵‍💫', '❣️', '💔', '❤️‍🔥', '❤️‍🩹', '💋', '🫶', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '🫦'];
  
  let count = 0;
  for (const emoji of commonEmojis) {
    count += (text.split(emoji).length - 1);
  }
  return count;
}

async function testChatStyle() {
  console.log('🧪 测试新的聊天风格：多条消息+减少表情...');
  
  const testCases = [
    { role: "user", content: "hi" },
    { role: "user", content: "你好呀" },
    { role: "user", content: "你吃饭了吗？" },
    { role: "user", content: "我今天好累啊" },
    { role: "user", content: "你在干嘛呢" },
    { role: "user", content: "想你了" },
    { role: "user", content: "明天有空吗" }
  ];
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n--- 测试 ${i + 1}: "${testCase.content}" ---`);
    
    try {
      const completion = await client.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          testCase
        ],
        stream: false,
        temperature: 0.7,
        max_tokens: 150
      });
      
      const response = completion.choices[0]?.message?.content;
      console.log('原始回复:', response);
      
      // 检查是否包含括号说明
      const hasBrackets = response.includes('（') || response.includes('(');
      console.log('包含解释性文字:', hasBrackets ? '❌ 是' : '✅ 否');
      
      // 检查是否包含多条消息分隔符
      const messages = response.split('|||').filter(msg => msg.trim().length > 0);
      console.log('消息数量:', messages.length);
      
      if (messages.length > 1) {
        console.log('📬 分拆后的消息:');
        messages.forEach((msg, idx) => {
          console.log(`  ${idx + 1}. ${msg.trim()}`);
        });
      }
      
      // 统计表情使用
      const emojiCount = countEmojis(response);
      console.log('表情数量:', emojiCount);
      
      // 分析回复质量
      const quality = analyzeResponse(response);
      console.log('回复质量:', quality);
      
    } catch (error) {
      console.error('测试失败:', error.message);
    }
    
    // 等待一下避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  console.log('\n🏁 测试完成!');
}

function analyzeResponse(response) {
  const issues = [];
  
  // 检查是否过于正式
  if (response.includes('您') || response.includes('请问')) {
    issues.push('过于正式');
  }
  
  // 检查是否太短
  if (response.length < 5) {
    issues.push('回复太短');
  }
  
  // 检查是否包含指导性语言
  if (response.includes('建议') || response.includes('应该') || response.includes('可以')) {
    issues.push('包含指导性语言');
  }
  
  // 检查表情是否过多
  const emojiCount = countEmojis(response);
  if (emojiCount > 2) {
    issues.push('表情过多');
  }
  
  return issues.length === 0 ? '✅ 良好' : `⚠️ ${issues.join(', ')}`;
}

testChatStyle(); 