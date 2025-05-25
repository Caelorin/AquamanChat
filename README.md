# 🌊 AquamanChat - 海王撩妹指南

[![Next.js](https://img.shields.io/badge/Next.js-13.5.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![DeepSeek](https://img.shields.io/badge/DeepSeek-API-green)](https://www.deepseek.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)](https://tailwindcss.com/)

> 🎯 一个现代化的AI聊天应用，专门帮助提升聊天技巧，让每个人都能成为聊天高手！

## ✨ 核心特性

### 🤖 智能AI回复
- 集成 **DeepSeek API**，提供专业的聊天建议
- 支持**多条消息**分别发送，模拟真人聊天节奏
- **随机间隔**发送，让AI回复更加自然真实

### 💬 真实聊天体验
- **打字效果**模拟，增强沉浸感
- **联系人管理**，支持添加自定义聊天对象
- **聊天记录**本地保存，数据隐私保护

### 🎨 现代化设计
- **响应式布局**，完美适配桌面和移动端
- **深色/浅色主题**切换
- **流畅动画**效果，基于 Framer Motion
- **优雅UI组件**，基于 Radix UI

## 🚀 在线演示

访问：[AquamanChat Live Demo](https://aquamanchat.vercel.app) *(如已部署)*

## 📦 技术栈

- **框架**: Next.js 13.5.1 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + Radix UI
- **动画**: Framer Motion
- **AI**: DeepSeek API
- **状态**: React Hooks + Local Storage
- **图标**: Lucide React

## 🔧 本地开发

### 环境要求
- Node.js 16.8+ 
- npm 或 yarn

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/Caelorin/AquamanChat.git
cd AquamanChat
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **配置环境变量**
复制示例环境变量文件并配置你的API密钥：
```bash
cp .env.example .env.local
```

然后在 `.env.local` 文件中填入你的 DeepSeek API 密钥：
```bash
# DeepSeek API 配置
DEEPSEEK_API_KEY=your-deepseek-api-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat

# API参数配置
API_TEMPERATURE=0.7
API_MAX_TOKENS=200
```

⚠️ **安全提示**: 
- `.env.local` 文件已在 `.gitignore` 中，不会被提交到代码仓库
- 请勿在代码中硬编码API密钥
- 生产环境部署时，请在服务器环境变量中配置这些值

### 🚀 生产环境部署

**Vercel部署**：
1. 在 [Vercel Dashboard](https://vercel.com/) 中导入项目
2. 进入项目设置 → Environment Variables
3. 添加以下环境变量：
   - `DEEPSEEK_API_KEY`: 你的DeepSeek API密钥
   - `DEEPSEEK_BASE_URL`: https://api.deepseek.com
   - `DEEPSEEK_MODEL`: deepseek-chat
   - `API_TEMPERATURE`: 0.7
   - `API_MAX_TOKENS`: 200
4. 重新部署项目

**其他平台**：
- **Netlify**: 在站点设置中配置环境变量
- **自建服务器**: 设置系统环境变量或使用pm2等进程管理器

### 🔄 自动部署设置

**连接Git仓库到Vercel**：
1. 将代码推送到GitHub/GitLab/Bitbucket仓库
2. 在Vercel中导入项目时选择对应的Git仓库
3. 配置环境变量（见上方说明）
4. 部署完成后，每次push到主分支都会自动触发重新部署

**推荐的Git工作流**：
```bash
# 提交代码到主分支触发自动部署
git add .
git commit -m "feat: 添加新功能"
git push origin main
```

**部署状态检查**：
- Vercel控制台可查看部署日志
- GitHub Actions (可选) 提供额外的代码质量检查
- 部署失败时会收到邮件通知

4. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

5. **访问应用**
打开 [http://localhost:3000](http://localhost:3000)

## 🎯 使用指南

### 基本操作
1. **添加联系人**: 点击左侧"+"按钮，输入联系人信息
2. **开始聊天**: 选择联系人，在输入框中输入消息
3. **AI回复**: AI会以"撩妹"专家的身份给出回复建议
4. **多条消息**: AI可能会发送多条消息，模拟真人聊天

### 高级功能
- **主题切换**: 点击右上角主题按钮
- **清空聊天**: 长按消息可以清空对话记录
- **导出聊天**: 聊天记录自动保存到本地存储

## 🤖 AI 功能特色

### 聊天风格
- **推拉技巧**: 适时表现兴趣，保持神秘感
- **情绪价值**: 提供正面情绪，让对话轻松愉快
- **话题延展**: 善于挖掘更深层次的话题
- **适度调侃**: 温和幽默，增加互动趣味

### 回复模式
- **单条回复**: 简洁有力的单句回应
- **多条回复**: 模拟真人连续发送2-3条消息
- **随机间隔**: 300ms-3s的真实发送间隔

## 📁 项目结构

```
AquamanChat/
├── app/                    # Next.js App Router
│   ├── api/chat/          # API 路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── chat/             # 聊天相关组件
│   ├── contacts/         # 联系人组件
│   ├── layout/           # 布局组件
│   ├── providers/        # Context 提供者
│   ├── sidebar/          # 侧边栏组件
│   └── ui/               # UI 基础组件
├── doc/                  # 项目文档
├── hooks/                # 自定义 Hooks
├── lib/                  # 工具函数和类型
└── public/               # 静态资源
```

## 🔌 API 说明

### DeepSeek 集成
项目使用 DeepSeek API 提供智能回复功能：

```typescript
// 请求格式
POST /api/chat
{
  "conversationHistory": [
    {"role": "user", "content": "你好"}
  ]
}

// 响应格式
{
  "success": true,
  "content": "回复内容1|||回复内容2|||回复内容3",
  "usage": {...},
  "model": "deepseek-chat"
}
```

## 🛠️ 开发工具

- **测试脚本**: `test-*.js` 文件用于API测试
- **代码检查**: ESLint + TypeScript
- **样式检查**: Tailwind CSS IntelliSense

## 📈 后续规划

- [ ] 添加语音消息支持
- [ ] 实现聊天记录云同步
- [ ] 支持自定义AI角色
- [ ] 添加聊天数据分析
- [ ] 多语言支持
- [ ] PWA 支持

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🎖️ 致谢

- [DeepSeek](https://www.deepseek.com/) - 提供强大的AI能力
- [Next.js](https://nextjs.org/) - 优秀的React框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用的CSS框架
- [Radix UI](https://www.radix-ui.com/) - 无障碍UI组件

## 📞 联系方式

- GitHub: [@Caelorin](https://github.com/Caelorin)
- 项目链接: [https://github.com/Caelorin/AquamanChat](https://github.com/Caelorin/AquamanChat)

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！**

*Made with ❤️ by Caelorin*

</div> 