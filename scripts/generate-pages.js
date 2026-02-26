#!/usr/bin/env node

/**
 * 静态页面生成脚本
 * 使用模板系统生成所有静态页面
 * 版本: 1.0 - 阶段1基础架构收尾
 */

const fs = require('fs');
const path = require('path');

// 配置
const config = {
  templateDir: path.join(__dirname, '../templates'),
  outputDir: path.join(__dirname, '..'),
  dataDir: path.join(__dirname, '../data')
};

// 确保输出目录存在
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 读取模板文件
function readTemplate(templateName) {
  const templatePath = path.join(config.templateDir, templateName);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`模板文件不存在: ${templatePath}`);
  }
  return fs.readFileSync(templatePath, 'utf8');
}

// 简单的模板渲染
function renderTemplate(template, data) {
  let result = template;
  
  // 替换变量 {{variable}}
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(pattern, value);
    }
  }
  
  // 处理条件块 {{#if condition}}...{{/if}}
  result = result.replace(/{{\s*#if\s+(\w+)\s*}}([\s\S]*?){{\s*\/if\s*}}/g, (match, condition, content) => {
    return data[condition] ? content : '';
  });
  
  // 处理循环块 {{#each array}}...{{/each}}
  result = result.replace(/{{\s*#each\s+(\w+)\s*}}([\s\S]*?){{\s*\/each\s*}}/g, (match, arrayName, content) => {
    const items = data[arrayName] || [];
    return items.map(item => {
      let itemContent = content;
      // 替换item的属性
      for (const [key, value] of Object.entries(item)) {
        const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        itemContent = itemContent.replace(pattern, value);
      }
      // 处理item的条件
      itemContent = itemContent.replace(/{{\s*#if\s+(\w+)\s*}}([\s\S]*?){{\s*\/if\s*}}/g, (match, condition, innerContent) => {
        return item[condition] ? innerContent : '';
      });
      return itemContent;
    }).join('');
  });
  
  // 处理三重大括号 {{{content}}} (不转义HTML)
  result = result.replace(/{{{([^}]+)}}}/g, (match, variable) => {
    const key = variable.trim();
    return data[key] || '';
  });
  
  return result;
}

// 页面数据定义
const pageData = {
  // 首页
  home: {
    title: 'OKX教程中心',
    description: '专业的OKX交易教程和研究平台。Delphi Digital像素级复刻。',
    sideNavItems: [
      { id: 'home', label: 'home', href: '/', active: true },
      { id: 'research', label: 'Research', href: '/search', active: false },
      { id: 'library', label: 'Library', href: '/explore', active: false },
      { id: 'saved', label: 'Saved', href: '/bookmarks', active: false },
      { id: 'tools', label: 'Tools', href: '/projects', active: false }
    ],
    helpItems: [
      { id: 'conentus', label: 'Conentus', href: '#' },
      { id: 'faq', label: 'FAQ', href: '#' },
      { id: 'feedback', label: 'Feedback', href: '#' }
    ],
    showContentTabs: true,
    content: fs.readFileSync(path.join(config.templateDir, 'pages/home.html'), 'utf8'),
    pageScripts: '/scripts/app.js',
    initFunction: 'initApp'
  },
  
  // 搜索页面
  search: {
    title: 'Research - 搜索',
    description: 'Delphi Digital像素级复刻 - 高级搜索和研究页面',
    sideNavItems: [
      { id: 'home', label: 'home', href: '/', active: false },
      { id: 'research', label: 'Research', href: '/search', active: true },
      { id: 'library', label: 'Library', href: '/explore', active: false },
      { id: 'saved', label: 'Saved', href: '/bookmarks', active: false },
      { id: 'tools', label: 'Tools', href: '/projects', active: false }
    ],
    helpItems: [
      { id: 'conentus', label: 'Conentus', href: '#' },
      { id: 'faq', label: 'FAQ', href: '#' },
      { id: 'feedback', label: 'Feedback', href: '#' }
    ],
    showContentTabs: false,
    content: fs.readFileSync(path.join(config.templateDir, 'pages/search.html'), 'utf8'),
    pageScripts: '/scripts/pages/search.js',
    initFunction: 'initSearchPage'
  },
  
  // 知识库页面
  explore: {
    title: 'Library - 知识库',
    description: 'Delphi Digital像素级复刻 - 知识库和探索页面',
    sideNavItems: [
      { id: 'home', label: 'home', href: '/', active: false },
      { id: 'research', label: 'Research', href: '/search', active: false },
      { id: 'library', label: 'Library', href: '/explore', active: true },
      { id: 'saved', label: 'Saved', href: '/bookmarks', active: false },
      { id: 'tools', label: 'Tools', href: '/projects', active: false }
    ],
    helpItems: [
      { id: 'conentus', label: 'Conentus', href: '#' },
      { id: 'faq', label: 'FAQ', href: '#' },
      { id: 'feedback', label: 'Feedback', href: '#' }
    ],
    showContentTabs: false,
    content: fs.readFileSync(path.join(config.templateDir, 'pages/explore.html'), 'utf8'),
    pageScripts: '/scripts/pages/explore.js',
    initFunction: 'initExplorePage'
  },
  
  // 书签页面
  bookmarks: {
    title: 'Saved - 书签',
    description: 'Delphi Digital像素级复刻 - 书签和收藏页面',
    sideNavItems: [
      { id: 'home', label: 'home', href: '/', active: false },
      { id: 'research', label: 'Research', href: '/search', active: false },
      { id: 'library', label: 'Library', href: '/explore', active: false },
      { id: 'saved', label: 'Saved', href: '/bookmarks', active: true },
      { id: 'tools', label: 'Tools', href: '/projects', active: false }
    ],
    helpItems: [
      { id: 'conentus', label: 'Conentus', href: '#' },
      { id: 'faq', label: 'FAQ', href: '#' },
      { id: 'feedback', label: 'Feedback', href: '#' }
    ],
    showContentTabs: false,
    content: fs.readFileSync(path.join(config.templateDir, 'pages/bookmarks.html'), 'utf8'),
    pageScripts: '/scripts/pages/bookmarks.js',
    initFunction: 'initBookmarksPage'
  },
  
  // 项目库页面
  projects: {
    title: 'Tools - 项目库',
    description: 'Delphi Digital像素级复刻 - 项目库和工具页面',
    sideNavItems: [
      { id: 'home', label: 'home', href: '/', active: false },
      { id: 'research', label: 'Research', href: '/search', active: false },
      { id: 'library', label: 'Library', href: '/explore', active: false },
      { id: 'saved', label: 'Saved', href: '/bookmarks', active: false },
      { id: 'tools', label: 'Tools', href: '/projects', active: true }
    ],
    helpItems: [
      { id: 'conentus', label: 'Conentus', href: '#' },
      { id: 'faq', label: 'FAQ', href: '#' },
      { id: 'feedback', label: 'Feedback', href: '#' }
    ],
    showContentTabs: false,
    content: fs.readFileSync(path.join(config.templateDir, 'pages/projects.html'), 'utf8'),
    pageScripts: '/scripts/pages/projects.js',
    initFunction: 'initProjectsPage'
  },
  
  // 帮助页面
  help: {
    title: 'Help - 帮助中心',
    description: 'Delphi Digital像素级复刻 - 帮助和支持页面',
    sideNavItems: [
      { id: 'home', label: 'home', href: '/', active: false },
      { id: 'research', label: 'Research', href: '/search', active: false },
      { id: 'library', label: 'Library', href: '/explore', active: false },
      { id: 'saved', label: 'Saved', href: '/bookmarks', active: false },
      { id: 'tools', label: 'Tools', href: '/projects', active: false },
      { id: 'help', label: 'Help', href: '/help', active: true }
    ],
    helpItems: [
      { id: 'conentus', label: 'Conentus', href: '#' },
      { id: 'faq', label: 'FAQ', href: '#' },
      { id: 'feedback', label: 'Feedback', href: '#' }
    ],
    showContentTabs: false,
    content: fs.readFileSync(path.join(config.templateDir, 'pages/help.html'), 'utf8'),
    pageScripts: '/scripts/pages/help.js',
    initFunction: 'initHelpPage'
  },
  
  // Sector Performance Dashboard (Data Apps模块)
  'sector-performance': {
    title: 'Sector Performance Dashboard',
    description: 'Delphi Digital像素级复刻 - 行业表现数据仪表板',
    sideNavItems: [
      { id: 'home', label: 'home', href: '/', active: false },
      { id: 'research', label: 'Research', href: '/search', active: false },
      { id: 'library', label: 'Library', href: '/explore', active: false },
      { id: 'saved', label: 'Saved', href: '/bookmarks', active: false },
      { id: 'tools', label: 'Tools', href: '/projects', active: false },
      { id: 'help', label: 'Help', href: '/help', active: false }
    ],
    helpItems: [
      { id: 'conentus', label: 'Conentus', href: '#' },
      { id: 'faq', label: 'FAQ', href: '#' },
      { id: 'feedback', label: 'Feedback', href: '#' }
    ],
    showContentTabs: false,
    content: fs.readFileSync(path.join(config.templateDir, 'pages/sector-performance.html'), 'utf8'),
    pageScripts: '/scripts/pages/data-apps.js',
    initFunction: 'initDataAppsPage'
  },
  
  // BTC Game Theory Tool (Data Apps模块)
  'btc-game-theory': {
    title: 'BTC Game Theory Tool',
    description: 'Delphi Digital像素级复刻 - 比特币博弈论分析工具',
    sideNavItems: [
      { id: 'home', label: 'home', href: '/', active: false },
      { id: 'research', label: 'Research', href: '/search', active: false },
      { id: 'library', label: 'Library', href: '/explore', active: false },
      { id: 'saved', label: 'Saved', href: '/bookmarks', active: false },
      { id: 'tools', label: 'Tools', href: '/projects', active: false },
      { id: 'help', label: 'Help', href: '/help', active: false }
    ],
    helpItems: [
      { id: 'conentus', label: 'Conentus', href: '#' },
      { id: 'faq', label: 'FAQ', href: '#' },
      { id: 'feedback', label: 'Feedback', href: '#' }
    ],
    showContentTabs: false,
    content: fs.readFileSync(path.join(config.templateDir, 'pages/btc-game-theory.html'), 'utf8'),
    pageScripts: '/scripts/pages/data-apps.js',
    initFunction: 'initDataAppsPage'
  }
};

// 生成单个页面
function generatePage(pageId, data) {
  console.log(`🔄 生成页面: ${pageId}`);
  
  // 读取基础模板
  const template = readTemplate('base.html');
  
  // 渲染模板
  const html = renderTemplate(template, data);
  
  // 确定输出路径
  let outputPath;
  if (pageId === 'home') {
    outputPath = path.join(config.outputDir, 'index.html');
  } else if (pageId === 'sector-performance' || pageId === 'btc-game-theory') {
    // Data Apps页面生成在 data/apps/ 目录下
    const dataAppsDir = path.join(config.outputDir, 'data', 'apps', pageId);
    ensureDir(dataAppsDir);
    outputPath = path.join(dataAppsDir, 'index.html');
  } else {
    const pageDir = path.join(config.outputDir, pageId);
    ensureDir(pageDir);
    outputPath = path.join(pageDir, 'index.html');
  }
  
  // 写入文件
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`✅ 页面生成完成: ${outputPath}`);
  
  return outputPath;
}

// 生成所有页面
function generateAllPages() {
  console.log('🚀 开始生成所有静态页面...');
  console.log('='.repeat(50));
  
  const generated = [];
  
  // 生成每个页面
  for (const [pageId, data] of Object.entries(pageData)) {
    try {
      const outputPath = generatePage(pageId, data);
      generated.push({ pageId, path: outputPath });
    } catch (error) {
      console.error(`❌ 页面 ${pageId} 生成失败:`, error.message);
    }
  }
  
  console.log('='.repeat(50));
  console.log(`✅ 页面生成完成，共生成 ${generated.length} 个页面`);
  
  // 输出摘要
  console.log('\n📋 生成页面列表:');
  generated.forEach((page, index) => {
    console.log(`  ${index + 1}. ${page.pageId} → ${page.path}`);
  });
  
  return generated;
}

// 创建页面内容模板（如果不存在）
function createPageTemplatesIfNeeded() {
  console.log('📝 检查页面模板...');
  
  const templatePagesDir = path.join(config.templateDir, 'pages');
  ensureDir(templatePagesDir);
  
  // 默认页面内容模板
  const defaultTemplates = {
    'home.html': `
<!-- 首页内容 -->
<div class="mb-8">
    <h1 class="text-4xl font-semibold text-white mb-2" id="page-title">All</h1>
    <div class="flex items-center space-x-2 text-sm text-tertiary" id="page-stats">
        <span id="total-count">Loading...</span>
    </div>
</div>

<!-- 内容标签导航 -->
<div class="mb-8">
    <div class="flex flex-wrap gap-2">
        <button class="nav-tab active" data-tab="all">All</button>
        <button class="nav-tab" data-tab="reports">Reports</button>
        <button class="nav-tab" data-tab="alpha">Alpha Insights</button>
        <button class="nav-tab" data-tab="notes">Notes</button>
        <button class="nav-tab" data-tab="media">Media</button>
        <button class="nav-tab" data-tab="reads">Reads</button>
    </div>
</div>

<!-- 筛选和排序 -->
<div class="mb-8 flex flex-col md:flex-row md:items-center justify-between">
    <div class="flex flex-wrap gap-2 mb-4 md:mb-0">
        <button class="filter-btn active" data-filter="all">全部</button>
        <button class="filter-btn" data-filter="today">今日</button>
        <button class="filter-btn" data-filter="week">本周</button>
        <button class="filter-btn" data-filter="month">本月</button>
    </div>
    
    <div class="flex items-center space-x-2">
        <span class="text-sm text-tertiary">排序:</span>
        <select class="input py-2 text-sm" id="sort-select">
            <option value="newest">最新</option>
            <option value="popular">最受欢迎</option>
            <option value="trending">趋势</option>
        </select>
    </div>
</div>

<!-- 内容网格 -->
<div id="content-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <!-- 内容卡片动态加载 -->
</div>

<!-- 分页 -->
<div class="flex items-center justify-between">
    <button class="btn btn-secondary" id="prev-btn" disabled>
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        上一页
    </button>
    
    <div class="flex items-center space-x-2" id="page-numbers">
        <!-- 页码动态生成 -->
    </div>
    
    <button class="btn btn-secondary" id="next-btn" disabled>
        下一页
        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
    </button>
</div>
    `,
    
    'search.html': `
<!-- 搜索页面内容 -->
<div class="mb-8">
    <h1 class="text-4xl font-semibold text-white mb-2">Research</h1>
    <p class="text-tertiary">高级搜索和研究工具</p>
</div>

<div class="bg-dark-800 rounded-xl p-6 mb-8">
    <h2 class="text-2xl font-semibold text-white mb-4">搜索功能开发中</h2>
    <p class="text-tertiary mb-4">Research页面正在开发中，将提供高级搜索和研究工具。</p>
    <div class="flex space-x-4">
        <a href="/" class="btn btn-primary">返回首页</a>
        <a href="/explore" class="btn btn-secondary">浏览知识库</a>
    </div>
</div>
    `,
    
    'explore.html': `
<!-- 知识库页面内容 -->
<div class="mb-8">
    <h1 class="text-4xl font-semibold text-white mb-2">Library</h1>
    <p class="text-tertiary">知识库和探索页面</p>
</div>

<div class="bg-dark-800 rounded-xl p-6 mb-8">
    <h2 class="text-2xl font-semibold text-white mb-4">知识库开发中</h2>
    <p class="text-tertiary mb-4">Library页面正在开发中，将提供多层级知识库导航和内容探索。</p>
    <div class="flex space-x-4">
        <a href="/" class="btn btn-primary">返回首页</a>
        <a href="/search" class="btn btn-secondary">使用搜索</a>
    </div>
</div>
    `,
    
    'bookmarks.html': `
<!-- 书签页面内容 -->
<div class="mb-8">
    <h1 class="text-4xl font-semibold text-white mb-2">Saved</h1>
    <p class="text-tertiary">书签和收藏页面</p>
</div>

<div class="bg-dark-800 rounded-xl p-6 mb-8">
    <h2 class="text-2xl font-semibold text-white mb-4">书签功能开发中</h2>
    <p class="text-tertiary mb-4">Saved页面正在开发中，将提供书签管理和收藏内容查看功能。</p>
    <div class="flex space-x-4">
        <a href="/" class="btn btn-primary">返回首页</a>
        <a href="/explore" class="btn btn-secondary">浏览知识库</a>
    </div>
</div>
    `,
    
    'projects.html': `
<!-- 项目库页面内容 -->
<div class="mb-8">
    <h1 class="text-4xl font-semibold text-white mb-2">Tools</h1>
    <p class="text-tertiary">项目库和工具页面</p>
</div>

<div class="bg-dark-800 rounded-xl p-6 mb-8">
    <h2 class="text-2xl font-semibold text-white mb-4">项目库开发中</h2>
    <p class="text-tertiary mb-4">Tools页面正在开发中，将提供项目库、数据分析工具和仪表板。</p>
    <div class="flex space-x-4">
        <a href="/" class="btn btn-primary">返回首页</a>
        <a href="/search" class="btn btn-secondary">使用搜索</a>
    </div>
</div>
    `
  };
  
  // 检查并创建缺失的模板
  let createdCount = 0;
  for (const [filename, content] of Object.entries(defaultTemplates)) {
    const filePath = path.join(templatePagesDir, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content.trim(), 'utf8');
      console.log(`📄 创建模板: ${filename}`);
      createdCount++;
    }
  }
  
  if (createdCount > 0) {
    console.log(`✅ 创建了 ${createdCount} 个页面模板`);
  } else {
    console.log('✅ 所有页面模板已存在');
  }
}

// 主函数
function main() {
  console.log('🎯 Delphi Digital静态页面生成器');
  console.log('📅', new Date().toISOString());
  console.log('='.repeat(50));
  
  try {
    // 1. 创建页面模板（如果不存在）
    createPageTemplatesIfNeeded();
    
    // 2. 生成所有页面
    generateAllPages();
    
    // 3. 创建页面JavaScript占位文件
    createPageScriptsIfNeeded();
    
    console.log('\n🎉 静态页面生成完成！');
    console.log('🚀 现在可以访问以下页面:');
    console.log('  首页: /index.html');
    console.log('  搜索: /search/index.html');
    console.log('  知识库: /explore/index.html');
    console.log('  书签: /bookmarks/index.html');
    console.log('  项目库: /projects/index.html');
    
  } catch (error) {
    console.error('❌ 生成过程出错:', error);
    process.exit(1);
  }
}

// 创建页面JavaScript占位文件
function createPageScriptsIfNeeded() {
  console.log('\n📝 检查页面JavaScript文件...');
  
  const scriptsDir = path.join(config.outputDir, 'scripts', 'pages');
  ensureDir(scriptsDir);
  
  const pageScripts = ['search', 'explore', 'bookmarks', 'projects'];
  let createdCount = 0;
  
  for (const page of pageScripts) {
    const filePath = path.join(scriptsDir, `${page}.js`);
    if (!fs.existsSync(filePath)) {
      const content = `
// ${page.charAt(0).toUpperCase() + page.slice(1)}页面脚本
// 版本: 1.0 - 页面特定功能

function init${page.charAt(0).toUpperCase() + page.slice(1)}Page() {
  console.log('🚀 ${page}页面初始化');
  
  // 页面特定初始化逻辑
  // 这里可以添加页面特定的交互和功能
  
  // 示例: 绑定事件
  document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ ${page}页面DOM加载完成');
    
    // 这里可以添加页面特定的DOM操作
  });
}

// 全局访问
window.init${page.charAt(0).toUpperCase() + page.slice(1)}Page = init${page.charAt(0).toUpperCase() + page.slice(1)}Page;
      `.trim();
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`📄 创建脚本: ${page}.js`);
      createdCount++;
    }
  }
  
  if (createdCount > 0) {
    console.log(`✅ 创建了 ${createdCount} 个页面脚本`);
  } else {
    console.log('✅ 所有页面脚本已存在');
  }
}

// 执行主函数
if (require.main === module) {
  main();
}

// 导出函数供其他模块使用
module.exports = {
  generatePage,
  generateAllPages,
  createPageTemplatesIfNeeded,
  createPageScriptsIfNeeded
};