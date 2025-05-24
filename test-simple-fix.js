/**
 * 简化测试：验证多条消息ID生成的唯一性
 */

console.log('🧪 测试多条消息ID生成唯一性...\n');

// 模拟多条消息
const messages = ['你好', '最近怎么样？', '有空一起吃饭吗？'];
const baseMessageId = 'ai-reply-123';

console.log('📋 测试消息:', messages);
console.log('📊 消息数量:', messages.length);

// 生成消息ID (使用修复后的逻辑)
const generatedIds = [];
messages.forEach((message, index) => {
  const messageIndex = index;
  const messageId = `${baseMessageId}-multi-${messageIndex}-${Date.now()}`;
  generatedIds.push(messageId);
  console.log(`✅ 消息 ${index + 1} ID: ${messageId}`);
});

// 检查唯一性
const uniqueIds = new Set(generatedIds);
const isUnique = uniqueIds.size === generatedIds.length;

console.log('\n🔍 唯一性检查:');
console.log('生成的ID数量:', generatedIds.length);
console.log('唯一ID数量:', uniqueIds.size);
console.log(`结果: ${isUnique ? '✅ 通过 - 所有ID都是唯一的' : '❌ 失败 - 存在重复ID'}`);

if (!isUnique) {
  console.log('重复的ID:', generatedIds.filter((id, index) => generatedIds.indexOf(id) !== index));
}

console.log('\n🎯 修复说明:');
console.log('- 使用消息索引 (messageIndex) 确保每条消息都有不同的ID');
console.log('- 格式: baseMessageId-multi-索引-时间戳');
console.log('- 这样可以避免消息互相覆盖的问题'); 