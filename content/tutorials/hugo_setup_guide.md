# Hugo 网站搭建指南 — okx-cps项目

## 环境要求

### 1. 系统要求
- **操作系统**：Windows 10+, macOS 10.13+, Linux
- **内存**：至少 2GB RAM
- **磁盘空间**：至少 500MB 可用空间

### 2. 软件依赖
- **Git**：版本控制
- **Go**（仅Hugo扩展开发需要）
- **文本编辑器**：VS Code, Sublime Text, 或任何Markdown编辑器

## 安装步骤

### 步骤1：安装Hugo

#### macOS (Homebrew)
```bash
brew install hugo
```

#### Windows (Chocolatey)
```bash
choco install hugo-extended
```

#### Windows (Scoop)
```bash
scoop install hugo-extended
```

#### Linux (APT)
```bash
sudo apt-get install hugo
```

#### Linux (Snap)
```bash
sudo snap install hugo
```

#### 手动安装（所有平台）
1. 访问 https://github.com/gohugoio/hugo/releases
2. 下载对应版本（推荐 hugo_extended 版本）
3. 解压并添加到系统PATH

### 步骤2：验证安装
```bash
hugo version
```
预期输出：`hugo v0.120.4+extended ...`（版本可能不同）

### 步骤3：创建新站点
```bash
# 进入项目目录
cd /path/to/projects

# 创建Hugo站点
hugo new site okx-cps-website --force

# 进入站点目录
cd okx-cps-website
```

### 步骤4：初始化Git仓库
```bash
# 初始化Git
git init

# 创建.gitignore
cat > .gitignore << EOF
# Hugo
/public/
/resources/_gen/

# OS
.DS_Store
Thumbs.db

# Editor
.idea/
.vscode/
*.swp
*.swo
EOF

# 初始提交
git add .
git commit -m "Initial commit: Hugo site structure"
```

## 主题选择与安装

### 主题需求分析
基于okx-cps项目需求：
1. **SEO优化**：良好语义化，快速加载
2. **内容友好**：清晰阅读体验，代码高亮
3. **响应式**：移动端友好
4. **简单定制**：易于修改样式
5. **文档完整**：良好使用文档

### 推荐主题

#### 选项1：PaperMod（推荐）
- **特点**：简洁，快速，功能完整
- **GitHub**：https://github.com/adityatelange/hugo-PaperMod
- **安装**：
  ```bash
  git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
  git submodule update --init --recursive
  ```

#### 选项2：Hugo-Theme-Stack
- **特点**：卡片式设计，现代化
- **GitHub**：https://github.com/CaiJimmy/hugo-theme-stack
- **适合**：内容展示型网站

#### 选项3：Blowfish
- **特点**：功能丰富，定制性强
- **GitHub**：https://github.com/nunocoracao/blowfish
- **适合**：需要多种内容类型的网站

### 主题配置（以PaperMod为例）
1. **设置主题**：
   ```toml
   # config.toml
   theme = "PaperMod"
   ```

2. **基础配置**：
   ```toml
   baseURL = "https://okx-cps.example.com/"
   languageCode = "zh-cn"
   title = "OKX加密货币教程 - 从入门到精通"
   ```

## 站点结构配置

### 目录结构
```
okx-cps-website/
├── archetypes/          # 内容模板
├── content/            # 网站内容
│   ├── posts/         # 博客文章
│   ├── tutorials/     # 教程系列
│   ├── tools/         # 工具页面
│   └── _index.md      # 首页
├── data/              # 数据文件
├── layouts/           # 布局模板
├── static/            # 静态资源
│   ├── images/       # 图片
│   ├── js/          # JavaScript
│   └── css/         # 自定义CSS
├── themes/            # 主题
└── config.toml        # 配置文件
```

### 内容组织
1. **教程分类**：
   ```
   content/
   ├── tutorials/
   │   ├── beginner/          # 新手入门
   │   ├── platform-guides/   # 平台指南
   │   ├── trading-basics/    # 交易基础
   │   └── security/          # 安全指南
   ├── tools/
   │   ├── fee-calculator/    # 手续费计算器
   │   └── risk-assessment/   # 风险评估
   └── posts/                # 博客文章
   ```

2. **前端配置**（config.toml）：
   ```toml
   [params]
     # 网站信息
     description = "专业的OKX加密货币教程，从注册到交易，一步步教你成为加密货币投资者"
     keywords = "OKX,加密货币,比特币,交易教程,数字货币"
     
     # 社交链接
     GitHub = "https://github.com/yourusername"
     Email = "contact@example.com"
     
     # 功能开关
     enableSearch = true
     enableComments = false  # 初期关闭评论
     enableShare = true
   
   [menu]
     # 导航菜单
     [[menu.main]]
       identifier = "tutorials"
       name = "教程"
       url = "/tutorials/"
       weight = 10
     
     [[menu.main]]
       identifier = "tools"
       name = "工具"
       url = "/tools/"
       weight = 20
     
     [[menu.main]]
       identifier = "about"
       name = "关于"
       url = "/about/"
       weight = 30
   ```

## 开发工作流

### 本地开发
```bash
# 启动开发服务器
hugo server -D

# 访问 http://localhost:1313
# -D 参数包含草稿内容
```

### 内容创建
```bash
# 创建新教程
hugo new tutorials/beginner/okx-registration-guide.md

# 创建新工具页面
hugo new tools/fee-calculator.md

# 创建博客文章
hugo new posts/2024-01-15-crypto-market-update.md
```

### 构建发布
```bash
# 构建静态文件
hugo --minify

# 输出到 public/ 目录
# 可部署到 GitHub Pages, Netlify, Vercel 等
```

## 部署选项

### 选项1：GitHub Pages（免费推荐）
1. **创建仓库**：`username.github.io` 或项目仓库
2. **配置GitHub Actions**：
   ```yaml
   # .github/workflows/hugo.yml
   name: Deploy Hugo site to Pages
   
   on:
     push:
       branches: ["main"]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
           with:
             submodules: recursive
         
         - name: Setup Hugo
           uses: peaceiris/actions-hugo@v2
           
         - name: Build
           run: hugo --minify
           
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
   ```

### 选项2：Netlify（免费）
1. 连接Git仓库
2. 构建命令：`hugo --minify`
3. 发布目录：`public`
4. 环境变量：`HUGO_VERSION = 0.120.4`

### 选项3：Vercel（免费）
1. 导入Git仓库
2. 框架预设：Hugo
3. 自动部署

## 自定义开发

### 自定义布局
1. **覆盖主题布局**：
   ```
   layouts/
   ├── _default/
   │   ├── baseof.html    # 基础布局
   │   ├── single.html    # 单页布局
   │   └── list.html      # 列表布局
   └── partials/
       ├── header.html    # 页头
       ├── footer.html    # 页脚
       └── sidebar.html   # 侧边栏
   ```

2. **自定义样式**：
   ```css
   /* assets/css/custom.css */
   :root {
     --primary-color: #1a73e8;
     --secondary-color: #34a853;
   }
   
   .content {
     max-width: 800px;
     margin: 0 auto;
     line-height: 1.8;
   }
   ```

### 工具集成
1. **手续费计算器**：
   ```html
   <!-- layouts/tools/single.html -->
   <div id="fee-calculator">
     <input type="number" id="trade-amount" placeholder="交易金额">
     <select id="trade-type">
       <option value="spot">现货交易</option>
       <option value="future">合约交易</option>
     </select>
     <button onclick="calculateFee()">计算手续费</button>
     <div id="result"></div>
   </div>
   
   <script>
   function calculateFee() {
     // 手续费计算逻辑
   }
   </script>
   ```

2. **分析追踪**：
   ```html
   <!-- layouts/partials/head.html -->
   {{ if not .Site.IsServer }}
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   {{ end }}
   ```

## 测试与验证

### 功能测试清单
- [ ] 首页加载正常
- [ ] 导航菜单功能正常
- [ ] 内容页面显示正确
- [ ] 移动端响应式正常
- [ ] 搜索功能工作正常
- [ ] 工具页面交互正常
- [ ] 链接无404错误
- [ ] 图片加载正常

### 性能测试
```bash
# 构建性能测试
hugo --minify --verbose

# 使用 Lighthouse 测试
# 通过 Chrome DevTools 或 PageSpeed Insights
```

### SEO检查清单
- [ ] 所有页面有唯一title和description
- [ ] 语义化HTML结构
- [ ] 图片有alt属性
- [ ] 规范URL设置正确
- [ ] sitemap.xml可访问
- [ ] robots.txt配置正确
- [ ] 页面加载速度 < 2秒

## 维护与更新

### 日常维护
1. **内容更新**：
   ```bash
   # 创建新内容
   hugo new section/filename.md
   
   # 本地预览
   hugo server -D
   
   # 构建发布
   hugo --minify
   ```

2. **主题更新**：
   ```bash
   # 更新主题子模块
   git submodule update --remote --merge
   ```

3. **Hugo版本更新**：
   ```bash
   # 检查更新
   hugo version
   
   # 根据系统更新
   brew upgrade hugo  # macOS
   choco upgrade hugo-extended  # Windows
   ```

### 备份策略
1. **代码备份**：Git仓库（GitHub/GitLab）
2. **内容备份**：定期导出content/目录
3. **配置备份**：备份config.toml和自定义文件
4. **数据库备份**：如有动态数据

## 故障排除

### 常见问题
1. **Hugo server不工作**：
   - 检查端口占用：`hugo server -p 8080`
   - 检查防火墙设置
   - 验证Hugo安装

2. **主题不显示**：
   - 检查config.toml中theme设置
   - 验证主题目录存在
   - 检查主题子模块初始化

3. **构建错误**：
   - 检查Markdown语法
   - 验证front matter格式
   - 检查模板语法

4. **部署问题**：
   - 检查GitHub Actions配置
   - 验证构建命令
   - 检查文件权限

### 调试技巧
```bash
# 详细构建日志
hugo --verbose

# 调试模式
hugo server --debug

# 清理缓存
hugo --gc
```

## 下一步行动

### 立即执行
1. [ ] 在开发环境安装Hugo
2. [ ] 创建Hugo站点骨架
3. [ ] 安装并配置PaperMod主题
4. [ ] 设置基础内容结构
5. [ ] 配置本地开发环境

### 短期目标（1周内）
1. [ ] 完成网站基础功能
2. [ ] 创建首批内容页面
3. [ ] 开发第一个工具页面
4. [ ] 设置分析追踪
5. [ ] 部署到测试环境

### 长期规划
1. [ ] 优化SEO配置
2. [ ] 开发更多交互工具
3. [ ] 建立内容更新流程
4. [ ] 监控与分析优化
5. [ ] 用户反馈收集

---
**文档版本**：v1.0  
**创建时间**：2026-02-23  
**适用环境**：需要实际安装Hugo的开发环境  
**当前限制**：当前工作环境无法安装Hugo，需在合适环境执行  
**备用方案**：如无法安装Hugo，可考虑GitHub Codespaces或Docker环境