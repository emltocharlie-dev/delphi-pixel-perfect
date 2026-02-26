# Delphi Digital 设计规范（已获取信息）

## 获取时间
2026年2月25日 12:50 UTC

## 信息来源
1. 网站HTML头信息
2. CSS字体文件
3. 有限的页面内容

## 字体系统

### 主字体
- **BB Modern Pro**: 主标题/品牌字体
  - 变体: Regular, Condensed, SemiCondensed, XCondensed, XXCondensed
  - 格式: OTF (OpenType)

- **NeurialGrotesk**: 正文字体
  - 变体: Regular, Medium, Bold
  - 格式: WOFF2

### 字体使用推测
1. **BB Modern Pro**: 用于logo、大标题、品牌元素
2. **NeurialGrotesk**: 用于正文、导航、UI文本

## 色彩系统（需要确认）
*基于加密货币研究网站典型色彩推测：*

### 可能的主色调
1. **深色主题** (可能性高):
   - 背景: #0f0f0f 或 #111111
   - 文字: #ffffff 或 #f0f0f0
   - 次要文字: #888888 或 #aaaaaa

2. **品牌色** (需要确认):
   - 主色: 可能是深蓝、紫色或专业深色
   - 强调色: 可能是亮蓝、绿色或橙色

### 建议临时色彩方案
```css
:root {
  /* 深色主题推测 */
  --bg-primary: #0f0f0f;
  --bg-secondary: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #aaaaaa;
  --accent-primary: #3b82f6; /* 蓝色作为临时强调色 */
  --accent-secondary: #10b981; /* 绿色作为临时次要强调色 */
}
```

## 布局特征（需要确认）

### 导航结构
基于有限信息推测：
1. **顶部导航**: 固定位置，包含logo和主分类
2. **标签页导航**: "All, Reports, Alpha Insights, Notes, Media, Reads"
3. **可能有的侧边栏**: 用于筛选或目录

### 内容区域
1. **内容卡片网格**: 研究文章/报告以卡片形式展示
2. **筛选功能**: 按时间、分类、标签等筛选
3. **搜索功能**: 全局搜索框

## 需要用户提供的视觉信息

### 紧急需要（像素级复刻必须）：
1. **完整截图**:
   - 首页全屏（桌面端）
   - 导航菜单展开状态
   - 内容卡片详细视图
   - 移动端视图

2. **色彩准确值**:
   - 背景色、文字色、链接色
   - 按钮、卡片、边框颜色
   - 悬停状态颜色变化

3. **布局细节**:
   - 间距系统（padding, margin, gap）
   - 边框半径、阴影效果
   - 响应式断点行为

### 重要但可推断：
1. **组件样式**: 按钮、输入框、卡片、模态框等
2. **交互状态**: 悬停、激活、禁用状态
3. **动画效果**: 过渡动画、加载状态

## 临时设计决策（用于开始开发）

### 色彩系统（临时）
使用专业深色主题，OKX品牌红色作为强调色调整：

```css
:root {
  /* OKX品牌红色调整版 */
  --okx-red: #f6465d;
  --okx-red-dark: #d93a4e;
  
  /* 深色主题 */
  --bg-primary: #111111;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #222222;
  
  /* 文字颜色 */
  --text-primary: #ffffff;
  --text-secondary: #aaaaaa;
  --text-tertiary: #666666;
  
  /* 边框和分隔线 */
  --border-color: #333333;
  --border-light: #444444;
  
  /* 状态色 */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

### 布局系统（临时）
基于现代Web设计最佳实践：

```css
/* 间距系统 */
:root {
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */
  --spacing-2xl: 3rem;    /* 48px */
}

/* 容器宽度 */
:root {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}
```

### 字体系统（基于实际获取）
```css
/* 字体定义 */
@font-face {
  font-family: 'BB Modern Pro';
  src: url('path/to/BBModernPro.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'NeurialGrotesk';
  src: url('path/to/NeurialGrotesk-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}

/* 字体使用 */
:root {
  --font-heading: 'BB Modern Pro', sans-serif;
  --font-body: 'NeurialGrotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* 字体大小 */
  --text-xs: 0.75rem;   /* 12px */
  --text-sm: 0.875rem;  /* 14px */
  --text-base: 1rem;    /* 16px */
  --text-lg: 1.125rem;  /* 18px */
  --text-xl: 1.25rem;   /* 20px */
  --text-2xl: 1.5rem;   /* 24px */
  --text-3xl: 1.875rem; /* 30px */
  --text-4xl: 2.25rem;  /* 36px */
}
```

## 开发策略

### 阶段1：基础框架（现在开始）
1. 使用临时设计规范创建HTML/CSS基础
2. 实现基础布局结构
3. 准备字体和资源占位

### 阶段2：视觉调整（获得准确信息后）
1. 更新色彩为准确值
2. 调整间距和布局细节
3. 优化字体使用和大小

### 阶段3：交互实现
1. 导航和标签切换功能
2. 基本筛选和搜索交互
3. 响应式行为

## 风险说明
1. **色彩不准确**: 使用临时色彩，后续需要调整
2. **布局偏差**: 基于推测的布局可能与实际有差异
3. **字体缺失**: 实际字体文件可能无法获取，使用替代字体
4. **交互细节缺失**: 复杂交互可能无法完全复现

## 建议
1. **优先获取完整截图**：这是最紧急的需求
2. **提供色彩值**：使用浏览器开发者工具获取准确色彩
3. **确认布局细节**：间距、边框、阴影等参数

---
**文档版本**: v1.0  
**状态**: 等待视觉材料补充  
**下一步**: 开始基础框架开发，同时等待准确设计信息