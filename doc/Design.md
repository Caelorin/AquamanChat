# 系统设计文档 (Design Document)
## 海王撩妹指南 - 技术架构设计

---

### 📋 文档信息

- **项目名称**: 海王撩妹指南
- **文档类型**: 系统设计文档
- **版本**: v1.0.0
- **创建日期**: 2024年
- **最后更新**: 2024年
- **负责人**: 开发团队

---

## 1. 系统概述

### 1.1 技术架构简介

本项目采用现代化的前端单页应用架构，基于React生态系统构建，使用Next.js作为全栈框架，实现服务端渲染和静态站点生成，提供优秀的用户体验和性能表现。

### 1.2 设计原则

- **组件化**: 采用组件化开发模式，提高代码复用性和维护性
- **响应式**: 移动优先的响应式设计，适配多种设备
- **类型安全**: 使用TypeScript确保代码质量和开发效率
- **性能优化**: 代码分割、懒加载等性能优化策略
- **用户体验**: 流畅的动画效果和直观的交互设计

---

## 2. 技术栈选型

### 2.1 前端技术栈

| 技术/库 | 版本 | 作用 | 选择理由 |
|---------|------|------|----------|
| **Next.js** | 13.5.1 | React全栈框架 | 提供SSR、SSG、API路由等功能 |
| **React** | 18.2.0 | UI库 | 主流React库，生态丰富 |
| **TypeScript** | 5.2.2 | 编程语言 | 类型安全，提高开发效率 |
| **Tailwind CSS** | 3.3.3 | CSS框架 | 原子化CSS，快速开发 |
| **Framer Motion** | 11.0.8 | 动画库 | 丰富的动画效果 |
| **Radix UI** | 最新版 | 无头UI组件 | 无障碍性好，可定制性强 |

### 2.2 开发工具链

| 工具 | 版本 | 作用 |
|------|------|------|
| **ESLint** | 8.49.0 | 代码质量检查 |
| **Autoprefixer** | 10.4.15 | CSS兼容性处理 |
| **date-fns** | 3.6.0 | 日期处理库 |
| **clsx** | 2.1.1 | 条件CSS类名处理 |

---

## 3. 系统架构设计

### 3.1 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                    用户界面层 (UI Layer)                  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   侧边栏    │  │  联系人列表  │  │   聊天窗口   │      │
│  │  Sidebar    │  │ContactList  │  │ ChatWindow  │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
├─────────────────────────────────────────────────────────┤
│                   组件层 (Component Layer)               │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ UI组件库    │  │  布局组件    │  │  业务组件    │      │
│  │   (ui/)     │  │ (layout/)   │  │ (chat/...)  │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
├─────────────────────────────────────────────────────────┤
│                   逻辑层 (Logic Layer)                   │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Hooks     │  │    Utils    │  │    Types    │      │
│  │  (hooks/)   │  │   (lib/)    │  │  (lib/)     │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
├─────────────────────────────────────────────────────────┤
│                   数据层 (Data Layer)                    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ LocalStorage│  │  AI API     │  │   Constants │      │
│  │   存储      │  │   接口      │  │    常量     │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────┘
```

### 3.2 模块设计

#### 3.2.1 用户界面模块

**Sidebar (侧边栏)**
- 功能: 应用导航，添加联系人入口
- 组件: `components/sidebar/Sidebar.tsx`
- 特性: 图标导航，状态指示

**ContactList (联系人列表)**
- 功能: 显示和管理联系人
- 组件: `components/contacts/ContactList.tsx`
- 特性: 搜索过滤，最后活跃时间显示

**ChatWindow (聊天窗口)**
- 功能: 消息展示和发送
- 组件: `components/chat/ChatWindow.tsx`
- 特性: 消息气泡，实时打字指示

#### 3.2.2 数据管理模块

**本地存储管理**
```typescript
// 数据结构设计
interface Contact {
  id: string;              // 唯一标识符
  name: string;            // 联系人姓名
  avatar: string;          // 头像URL
  lastActive: string;      // 最后活跃时间
}

interface Message {
  id: string;              // 消息唯一标识
  sender: 'user' | 'ai';   // 发送者类型
  content: string;         // 消息内容
  timestamp: string;       // 发送时间
  isStreaming?: boolean;   // 是否为流式消息
}

// 存储键值对
const STORAGE_KEYS = {
  CONTACTS: 'contacts',           // 联系人列表
  CHAT_HISTORY: 'chatHistory',    // 聊天记录
  USER_PREFERENCES: 'userPrefs'   // 用户偏好设置
}
```

---

## 4. 组件设计规范

### 4.1 组件分类

#### 4.1.1 基础UI组件 (components/ui/)
- **设计原则**: 无业务逻辑，纯展示组件
- **命名规范**: PascalCase，描述性命名
- **文件结构**: 每个组件独立文件夹，包含index.ts导出

示例组件:
```typescript
// components/ui/button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick 
}) => {
  // 组件实现
}
```

#### 4.1.2 业务组件 (components/chat/, components/contacts/)
- **设计原则**: 包含特定业务逻辑
- **状态管理**: 使用React Hooks管理状态
- **数据流**: 通过props传递数据和回调函数

#### 4.1.3 布局组件 (components/layout/)
- **设计原则**: 负责页面整体布局
- **响应式**: 根据屏幕尺寸调整布局
- **状态提升**: 管理子组件间的共享状态

### 4.2 Hooks设计

#### 4.2.1 useLocalStorage Hook
```typescript
// hooks/useLocalStorage.ts
function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 实现本地存储的读写逻辑
  // 支持SSR，避免hydration问题
  // 提供类型安全的接口
}
```

#### 4.2.2 自定义业务Hooks
- **useChat**: 管理聊天状态和消息处理
- **useContacts**: 管理联系人操作
- **useTheme**: 管理主题切换

---

## 5. 样式系统设计

### 5.1 Tailwind CSS配置

#### 5.1.1 主题色彩系统
```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        // 语义化颜色命名
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... 更多颜色定义
      }
    }
  }
}
```

#### 5.1.2 响应式断点
```css
/* 移动优先的响应式设计 */
sm: '640px',   /* 小屏设备 */
md: '768px',   /* 平板设备 */
lg: '1024px',  /* 桌面设备 */
xl: '1280px',  /* 大屏设备 */
```

### 5.2 CSS变量系统

#### 5.2.1 明暗主题支持
```css
/* app/globals.css */
:root {
  /* 亮色主题变量 */
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  /* ... 更多变量 */
}

.dark {
  /* 暗色主题变量 */
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... 更多变量 */
}
```

---

## 6. 状态管理设计

### 6.1 状态分类

#### 6.1.1 本地组件状态
- 使用`useState`管理简单状态
- 使用`useReducer`管理复杂状态逻辑

#### 6.1.2 跨组件状态
- 通过Context API共享状态
- 状态提升到最近的公共父组件

#### 6.1.3 持久化状态
- 使用`useLocalStorage` Hook
- 自动同步本地存储和组件状态

### 6.2 数据流设计

```
用户操作 → 组件事件处理 → 状态更新 → 重新渲染 → UI更新
    ↓
本地存储同步 → 数据持久化
```

---

## 7. 性能优化策略

### 7.1 代码层面优化

#### 7.1.1 组件优化
- 使用`React.memo`避免不必要的重渲染
- 使用`useCallback`和`useMemo`优化函数和计算
- 合理使用`useEffect`依赖项

#### 7.1.2 包大小优化
- 按需导入第三方库
- 使用动态导入进行代码分割
- Tree-shaking移除未使用的代码

### 7.2 加载性能优化

#### 7.2.1 图片优化
- 使用Next.js Image组件
- 支持WebP格式和响应式图片
- 懒加载非关键图片

#### 7.2.2 首屏加载优化
- 关键资源优先加载
- 骨架屏提升用户体验
- 服务端渲染优化SEO

---

## 8. 安全性设计

### 8.1 数据安全

#### 8.1.1 本地数据保护
- 敏感数据不存储在localStorage
- 数据加密存储（如需要）
- 定期清理过期数据

#### 8.1.2 输入验证
- 用户输入内容过滤
- XSS攻击防护
- 文件上传安全检查

### 8.2 隐私保护

- 不收集用户个人信息
- 聊天数据仅本地存储
- 用户可自主删除数据

---

## 9. 错误处理和监控

### 9.1 错误边界

```typescript
// 错误边界组件设计
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 错误日志记录
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### 9.2 用户反馈

- Toast消息提示用户操作结果
- 错误页面友好提示
- 操作确认和撤销机制

---

## 10. 测试策略

### 10.1 测试分类

- **单元测试**: 组件和工具函数测试
- **集成测试**: 多组件协作测试
- **端到端测试**: 用户操作流程测试

### 10.2 测试工具

- **Jest**: 单元测试框架
- **React Testing Library**: 组件测试
- **Cypress**: 端到端测试

---

## 11. 部署和运维

### 11.1 构建配置

```javascript
// next.config.js
const nextConfig = {
  output: 'export',          // 静态导出
  eslint: {
    ignoreDuringBuilds: true // 忽略构建时的ESLint错误
  },
  images: { 
    unoptimized: true        // 禁用图片优化
  }
};
```

### 11.2 部署方案

- **静态部署**: 支持Vercel、Netlify等平台
- **CDN加速**: 全球内容分发网络
- **缓存策略**: 合理设置缓存头

---

## 12. 扩展性设计

### 12.1 模块化架构

- 插件化AI回复系统
- 可扩展的主题系统
- 灵活的组件组合方式

### 12.2 国际化支持

- 多语言文本外化
- 日期时间本地化
- 文化差异适配

---

## 13. 开发规范

### 13.1 代码规范

- **命名规范**: 
  - 组件: PascalCase
  - 函数: camelCase  
  - 常量: UPPER_SNAKE_CASE
  - 文件: kebab-case

- **注释规范**:
  - 组件必须有JSDoc注释
  - 复杂逻辑必须添加解释
  - API接口必须有类型定义

### 13.2 Git工作流

- **分支命名**: feature/功能名称, bugfix/问题描述
- **提交信息**: 使用约定式提交规范
- **代码审查**: 必须通过Code Review

---

**文档结束**

*本文档将随着项目发展持续更新和完善* 