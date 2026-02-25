// Saved页面脚本 - 书签和收藏管理
// 版本: 1.0 - 演示书签管理功能

// 书签状态
const BookmarksState = {
  bookmarks: [],
  filteredBookmarks: [],
  currentFilter: 'all',
  currentType: 'all',
  tags: [],
  isLoading: true,
  stats: {
    articles: 0,
    projects: 0,
    tools: 0,
    totalTags: 0
  }
};

// DOM元素缓存
const BookmarksDOM = {
  // 计数和按钮
  bookmarkCount: null,
  syncBookmarksBtn: null,
  
  // 筛选
  typeFilters: null,
  bookmarkFilters: null,
  
  // 内容网格
  bookmarksGrid: null,
  demoBookmarks: null,
  
  // 统计
  statsArticles: null,
  statsProjects: null,
  statsTools: null,
  statsTags: null,
  
  // 导出/导入按钮
  exportJsonBtn: null,
  exportCsvBtn: null,
  importBtn: null,
  syncExternalBtn: null
};

// 初始化Saved页面
function initBookmarksPage() {
  console.log('🚀 Saved页面初始化');
  
  // 缓存DOM元素
  cacheBookmarksDOMElements();
  
  // 设置事件监听器
  setupBookmarksEventListeners();
  
  // 加载书签数据
  loadBookmarksData();
  
  console.log('✅ Saved页面初始化完成');
}

// 缓存DOM元素
function cacheBookmarksDOMElements() {
  // 计数和按钮
  BookmarksDOM.bookmarkCount = document.getElementById('bookmark-count');
  BookmarksDOM.syncBookmarksBtn = document.getElementById('sync-bookmarks-btn');
  
  // 筛选
  BookmarksDOM.typeFilters = document.querySelectorAll('.filter-btn');
  BookmarksDOM.bookmarkFilters = document.getElementById('bookmark-filters');
  
  // 内容网格
  BookmarksDOM.bookmarksGrid = document.getElementById('bookmarks-grid');
  BookmarksDOM.demoBookmarks = document.getElementById('demo-bookmarks');
  
  // 统计
  BookmarksDOM.statsArticles = document.getElementById('stats-articles');
  BookmarksDOM.statsProjects = document.getElementById('stats-projects');
  BookmarksDOM.statsTools = document.getElementById('stats-tools');
  BookmarksDOM.statsTags = document.getElementById('stats-tags');
  
  // 导出/导入按钮
  BookmarksDOM.exportJsonBtn = document.getElementById('export-json-btn');
  BookmarksDOM.exportCsvBtn = document.getElementById('export-csv-btn');
  BookmarksDOM.importBtn = document.getElementById('import-btn');
  BookmarksDOM.syncExternalBtn = document.getElementById('sync-external-btn');
  
  console.log('🔍 缓存了', Object.keys(BookmarksDOM).length, '个DOM元素');
}

// 设置事件监听器
function setupBookmarksEventListeners() {
  // 同步按钮
  if (BookmarksDOM.syncBookmarksBtn) {
    BookmarksDOM.syncBookmarksBtn.addEventListener('click', syncBookmarks);
  }
  
  // 类型筛选
  BookmarksDOM.typeFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      filterBookmarksByType(type);
      
      // 更新活动状态
      BookmarksDOM.typeFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  // 导出按钮
  if (BookmarksDOM.exportJsonBtn) {
    BookmarksDOM.exportJsonBtn.addEventListener('click', exportBookmarksAsJson);
  }
  
  if (BookmarksDOM.exportCsvBtn) {
    BookmarksDOM.exportCsvBtn.addEventListener('click', exportBookmarksAsCsv);
  }
  
  // 导入按钮
  if (BookmarksDOM.importBtn) {
    BookmarksDOM.importBtn.addEventListener('click', importBookmarks);
  }
  
  if (BookmarksDOM.syncExternalBtn) {
    BookmarksDOM.syncExternalBtn.addEventListener('click', syncExternalBookmarks);
  }
  
  console.log('🔌 设置了Saved页面事件监听器');
}

// 加载书签数据
async function loadBookmarksData() {
  try {
    console.log('📚 加载书签数据...');
    
    // 设置加载状态
    setLoadingState(true);
    
    // 生成示例书签数据 (因为没有真正的用户系统)
    BookmarksState.bookmarks = generateSampleBookmarks();
    BookmarksState.filteredBookmarks = [...BookmarksState.bookmarks];
    
    // 提取标签
    extractTagsFromBookmarks();
    
    // 计算统计
    calculateBookmarksStats();
    
    // 渲染页面
    updateBookmarkCount();
    renderBookmarkFilters();
    renderBookmarksGrid();
    updateStatsDisplay();
    
    // 显示示例内容
    showDemoBookmarks();
    
    console.log('✅ 书签数据加载完成:', {
      total: BookmarksState.bookmarks.length,
      tags: BookmarksState.tags.length
    });
    
  } catch (error) {
    console.error('❌ 加载书签数据失败:', error);
    showErrorMessage('加载书签数据失败，请刷新页面重试');
  } finally {
    // 清除加载状态
    setLoadingState(false);
  }
}

// 生成示例书签数据
function generateSampleBookmarks() {
  return [
    {
      id: '1',
      type: 'article',
      title: 'Solana: The Modular Future of Blockchain',
      description: 'An in-depth analysis of Solana architecture and its position in the modular blockchain ecosystem.',
      url: '/article?slug=solana-the-modular',
      addedAt: '2026-02-24T10:30:00Z',
      tags: ['Solana', 'Blockchain', 'Infrastructure', 'Research'],
      metadata: {
        author: 'Alex Thompson',
        readTime: 12,
        views: 12500
      }
    },
    {
      id: '2',
      type: 'article',
      title: 'Bitcoin ETF Flows Analysis: Institutional Adoption Trends',
      description: 'Weekly analysis of Bitcoin ETF flows and institutional adoption patterns.',
      url: '/article?slug=bitcoin-etf-flows-analysis',
      addedAt: '2026-02-23T14:20:00Z',
      tags: ['Bitcoin', 'ETF', 'Finance', 'Institutional'],
      metadata: {
        author: 'Maria Chen',
        readTime: 8,
        views: 8900
      }
    },
    {
      id: '3',
      type: 'project',
      title: 'Bitcoin',
      description: 'The original cryptocurrency and digital gold standard.',
      url: '/projects/bitcoin',
      addedAt: '2026-02-22T09:15:00Z',
      tags: ['Bitcoin', 'Store of Value', 'Layer 1', 'ETF'],
      metadata: {
        tools: 3,
        marketCap: '$1.2T'
      }
    },
    {
      id: '4',
      type: 'project',
      title: 'Ethereum',
      description: 'The leading smart contract platform and decentralized application ecosystem.',
      url: '/projects/ethereum',
      addedAt: '2026-02-21T16:45:00Z',
      tags: ['Ethereum', 'Smart Contracts', 'DeFi', 'Layer 2'],
      metadata: {
        tools: 3,
        marketCap: '$420B'
      }
    },
    {
      id: '5',
      type: 'tool',
      title: 'Sector Performance Dashboard',
      description: 'Real-time performance metrics across crypto sectors.',
      url: '/data-apps/sector-performance',
      addedAt: '2026-02-20T11:30:00Z',
      tags: ['Dashboard', 'Analytics', 'Performance', 'Data'],
      metadata: {
        type: 'interactive',
        metrics: ['performance', 'volume', 'dominance']
      }
    },
    {
      id: '6',
      type: 'article',
      title: 'Ethereum Layer 2 Ecosystem: State of the Union',
      description: 'Comprehensive overview of the Ethereum Layer 2 scaling solutions landscape.',
      url: '/article?slug=ethereum-layer2-ecosystem',
      addedAt: '2026-02-19T13:40:00Z',
      tags: ['Ethereum', 'Layer 2', 'Scaling', 'Rollups'],
      metadata: {
        author: 'James Wilson',
        readTime: 15,
        views: 7450
      }
    }
  ];
}

// 从书签中提取标签
function extractTagsFromBookmarks() {
  const allTags = new Set();
  
  BookmarksState.bookmarks.forEach(bookmark => {
    if (bookmark.tags && Array.isArray(bookmark.tags)) {
      bookmark.tags.forEach(tag => allTags.add(tag));
    }
  });
  
  BookmarksState.tags = Array.from(allTags).sort();
}

// 计算书签统计
function calculateBookmarksStats() {
  const stats = {
    articles: 0,
    projects: 0,
    tools: 0,
    totalTags: BookmarksState.tags.length
  };
  
  BookmarksState.bookmarks.forEach(bookmark => {
    switch (bookmark.type) {
      case 'article':
        stats.articles++;
        break;
      case 'project':
        stats.projects++;
        break;
      case 'tool':
        stats.tools++;
        break;
    }
  });
  
  BookmarksState.stats = stats;
}

// 更新书签计数
function updateBookmarkCount() {
  if (BookmarksDOM.bookmarkCount) {
    BookmarksDOM.bookmarkCount.textContent = BookmarksState.bookmarks.length;
  }
}

// 渲染书签筛选器
function renderBookmarkFilters() {
  if (!BookmarksDOM.bookmarkFilters) return;
  
  if (BookmarksState.tags.length === 0) {
    BookmarksDOM.bookmarkFilters.innerHTML = `
      <div class="text-sm text-tertiary">暂无标签</div>
    `;
    return;
  }
  
  BookmarksDOM.bookmarkFilters.innerHTML = '';
  
  BookmarksState.tags.forEach(tag => {
    const tagElement = document.createElement('span');
    tagElement.className = 'px-3 py-1.5 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm cursor-pointer transition-colors';
    tagElement.textContent = tag;
    tagElement.dataset.tag = tag;
    tagElement.addEventListener('click', () => filterBookmarksByTag(tag));
    
    BookmarksDOM.bookmarkFilters.appendChild(tagElement);
  });
}

// 按类型筛选书签
function filterBookmarksByType(type) {
  BookmarksState.currentType = type;
  
  if (type === 'all') {
    BookmarksState.filteredBookmarks = [...BookmarksState.bookmarks];
  } else {
    BookmarksState.filteredBookmarks = BookmarksState.bookmarks.filter(
      bookmark => bookmark.type === type
    );
  }
  
  renderBookmarksGrid();
  updateStatsDisplay();
}

// 按标签筛选书签
function filterBookmarksByTag(tag) {
  console.log('🔍 按标签筛选:', tag);
  
  BookmarksState.filteredBookmarks = BookmarksState.bookmarks.filter(
    bookmark => bookmark.tags && bookmark.tags.includes(tag)
  );
  
  BookmarksState.currentFilter = 'tag';
  
  renderBookmarksGrid();
  
  // 显示筛选状态
  showMessage(`显示标签为 "${tag}" 的收藏`);
}

// 渲染书签网格
function renderBookmarksGrid() {
  if (!BookmarksDOM.bookmarksGrid) return;
  
  if (BookmarksState.filteredBookmarks.length === 0) {
    BookmarksDOM.bookmarksGrid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-700 flex items-center justify-center">
          <svg class="w-8 h-8 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h3 class="text-white font-medium mb-2">暂无收藏内容</h3>
        <p class="text-tertiary mb-4">${getNoResultsMessage()}</p>
        <div class="flex flex-col sm:flex-row gap-2 justify-center">
          <button class="btn btn-primary" onclick="clearFilters()">清除筛选</button>
          <a href="/explore" class="btn btn-secondary">探索知识库</a>
        </div>
      </div>
    `;
    return;
  }
  
  const fragment = document.createDocumentFragment();
  
  BookmarksState.filteredBookmarks.forEach(bookmark => {
    const bookmarkCard = createBookmarkCard(bookmark);
    fragment.appendChild(bookmarkCard);
  });
  
  BookmarksDOM.bookmarksGrid.innerHTML = '';
  BookmarksDOM.bookmarksGrid.appendChild(fragment);
}

// 获取无结果消息
function getNoResultsMessage() {
  if (BookmarksState.currentType !== 'all') {
    const typeNames = {
      'articles': '文章',
      'projects': '项目',
      'tools': '工具'
    };
    return `没有找到${typeNames[BookmarksState.currentType] || '此类型'}的收藏`;
  }
  
  if (BookmarksState.currentFilter === 'tag') {
    return '没有找到此标签的收藏';
  }
  
  return '保存您感兴趣的内容，方便以后快速访问';
}

// 创建书签卡片
function createBookmarkCard(bookmark) {
  const card = document.createElement('div');
  card.className = 'bg-dark-800 rounded-xl p-6 hover:bg-dark-700 transition-colors cursor-pointer';
  card.dataset.id = bookmark.id;
  card.dataset.type = bookmark.type;
  
  // 类型样式
  const typeConfig = {
    article: {
      label: '文章',
      color: 'blue',
      icon: '📄'
    },
    project: {
      label: '项目',
      color: 'green',
      icon: '📊'
    },
    tool: {
      label: '工具',
      color: 'purple',
      icon: '🛠️'
    }
  };
  
  const config = typeConfig[bookmark.type] || typeConfig.article;
  const colorClass = `bg-${config.color}-600/10 text-${config.color}-600`;
  
  // 格式化添加时间
  const addedDate = bookmark.addedAt ? 
    new Date(bookmark.addedAt).toLocaleDateString('zh-CN') : '未知日期';
  
  card.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-xs font-medium px-2 py-1 ${colorClass} rounded">
            ${config.icon} ${config.label}
          </span>
          <span class="text-xs text-tertiary">${addedDate}</span>
        </div>
        <button class="text-tertiary hover:text-white bookmark-remove-btn" data-id="${bookmark.id}">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <h3 class="text-white font-semibold text-lg leading-tight">${bookmark.title}</h3>
      
      <p class="text-tertiary text-sm">${bookmark.description}</p>
      
      ${bookmark.tags && bookmark.tags.length > 0 ? `
        <div class="flex flex-wrap gap-2">
          ${bookmark.tags.map(tag => `
            <span class="px-2 py-1 bg-dark-700 rounded text-xs text-tertiary">${tag}</span>
          `).join('')}
        </div>
      ` : ''}
      
      ${bookmark.metadata ? `
        <div class="pt-4 border-t border-dark-700 flex items-center justify-between text-sm">
          <div class="text-tertiary">
            ${getMetadataText(bookmark.type, bookmark.metadata)}
          </div>
          <a href="${bookmark.url}" class="text-primary hover:underline">
            查看详情 →
          </a>
        </div>
      ` : ''}
    </div>
  `;
  
  // 添加点击事件 (排除删除按钮)
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.bookmark-remove-btn')) {
      window.location.href = bookmark.url;
    }
  });
  
  // 删除按钮事件
  const removeBtn = card.querySelector('.bookmark-remove-btn');
  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeBookmark(bookmark.id);
    });
  }
  
  return card;
}

// 获取元数据文本
function getMetadataText(type, metadata) {
  switch (type) {
    case 'article':
      return `${metadata.author} • ${metadata.readTime}分钟 • ${metadata.views?.toLocaleString()}次查看`;
    case 'project':
      return `${metadata.tools}个工具 • ${metadata.marketCap}`;
    case 'tool':
      return `${metadata.type} • ${metadata.metrics?.length || 0}个指标`;
    default:
      return '';
  }
}

// 移除书签
function removeBookmark(bookmarkId) {
  console.log('🗑️ 移除书签:', bookmarkId);
  
  // 从状态中移除
  BookmarksState.bookmarks = BookmarksState.bookmarks.filter(
    bookmark => bookmark.id !== bookmarkId
  );
  
  // 更新筛选后的书签
  if (BookmarksState.currentType === 'all') {
    BookmarksState.filteredBookmarks = BookmarksState.filteredBookmarks.filter(
      bookmark => bookmark.id !== bookmarkId
    );
  } else {
    BookmarksState.filteredBookmarks = BookmarksState.filteredBookmarks.filter(
      bookmark => bookmark.id !== bookmarkId && bookmark.type === BookmarksState.currentType
    );
  }
  
  // 重新计算统计和标签
  extractTagsFromBookmarks();
  calculateBookmarksStats();
  
  // 更新UI
  updateBookmarkCount();
  renderBookmarkFilters();
  renderBookmarksGrid();
  updateStatsDisplay();
  
  showMessage('书签已移除');
}

// 更新统计显示
function updateStatsDisplay() {
  if (BookmarksDOM.statsArticles) {
    BookmarksDOM.statsArticles.textContent = BookmarksState.stats.articles;
  }
  
  if (BookmarksDOM.statsProjects) {
    BookmarksDOM.statsProjects.textContent = BookmarksState.stats.projects;
  }
  
  if (BookmarksDOM.statsTools) {
    BookmarksDOM.statsTools.textContent = BookmarksState.stats.tools;
  }
  
  if (BookmarksDOM.statsTags) {
    BookmarksDOM.statsTags.textContent = BookmarksState.stats.totalTags;
  }
}

// 显示示例书签
function showDemoBookmarks() {
  if (BookmarksDOM.demoBookmarks && BookmarksState.bookmarks.length === 0) {
    BookmarksDOM.demoBookmarks.classList.remove('hidden');
  }
}

// 同步书签
function syncBookmarks() {
  console.log('🔄 同步书签');
  
  // 在实际应用中，这里会同步到服务器
  // 这里只是演示
  
  showMessage('书签同步完成');
}

// 导出书签为JSON
function exportBookmarksAsJson() {
  console.log('📤 导出书签为JSON');
  
  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    totalBookmarks: BookmarksState.bookmarks.length,
    bookmarks: BookmarksState.bookmarks
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `delphi-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  showMessage('书签已导出为JSON文件');
}

// 导出书签为CSV
function exportBookmarksAsCsv() {
  console.log('📤 导出书签为CSV');
  
  // 简单的CSV转换
  const headers = ['类型', '标题', '描述', '标签', '添加时间', 'URL'];
  
  const csvRows = [
    headers.join(','),
    ...BookmarksState.bookmarks.map(bookmark => [
      bookmark.type,
      `"${bookmark.title.replace(/"/g, '""')}"`,
      `"${bookmark.description.replace(/"/g, '""')}"`,
      `"${(bookmark.tags || []).join(';')}"`,
      bookmark.addedAt,
      bookmark.url
    ].join(','))
  ];
  
  const csvString = csvRows.join('\n');
  const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvString);
  
  const exportFileDefaultName = `delphi-bookmarks-${new Date().toISOString().split('T')[0]}.csv`;
  
  const linkElement = document.createElement