// Delphi Digital像素级复刻 - 主应用脚本
// 版本: v1.0 - 像素级交互实现

// 应用状态
const AppState = {
  currentTab: 'all',
  currentFilter: 'all',
  currentSort: 'newest',
  currentPage: 1,
  searchQuery: '',
  itemsPerPage: 6,
  isLoading: false
};

// DOM元素缓存
const DOM = {
  // 导航
  navTabs: null,
  mobileMenuBtn: null,
  mobileMenu: null,
  
  // 内容区域
  contentGrid: null,
  pageTitle: null,
  pageStats: null,
  
  // 筛选
  filterBtns: null,
  sortSelect: null,
  
  // 搜索
  searchInput: null,
  mobileSearchInput: null,
  
  // 分页
  prevBtn: null,
  nextBtn: null,
  pageNumbers: null,
  
  // 加载状态
  appLoading: null
};

// 初始化应用
function initApp() {
  console.log('Delphi Digital像素级复刻应用初始化...');
  
  // 缓存DOM元素
  cacheDOMElements();
  
  // 设置事件监听器
  setupEventListeners();
  
  // 加载初始数据
  loadContent();
  
  // 更新统计数据
  updateStats();
}

// 缓存DOM元素
function cacheDOMElements() {
  // 导航
  DOM.navTabs = document.querySelectorAll('.nav-tab');
  DOM.mobileMenuBtn = document.getElementById('mobile-menu-btn');
  DOM.mobileMenu = document.getElementById('mobile-menu');
  
  // 内容区域
  DOM.contentGrid = document.getElementById('content-grid');
  DOM.pageTitle = document.getElementById('page-title');
  DOM.pageStats = document.getElementById('page-stats');
  
  // 筛选
  DOM.filterBtns = document.querySelectorAll('.filter-btn');
  DOM.sortSelect = document.getElementById('sort-select');
  
  // 搜索
  DOM.searchInput = document.getElementById('search-input');
  DOM.mobileSearchInput = document.getElementById('mobile-search-input');
  
  // 分页
  DOM.prevBtn = document.getElementById('prev-btn');
  DOM.nextBtn = document.getElementById('next-btn');
  DOM.pageNumbers = document.getElementById('page-numbers');
  
  // 加载状态
  DOM.appLoading = document.getElementById('app-loading');
}

// 设置事件监听器
function setupEventListeners() {
  // 导航标签切换
  DOM.navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      switchTab(tabId);
    });
  });
  
  // 移动端菜单
  if (DOM.mobileMenuBtn) {
    DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  // 筛选按钮
  DOM.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      applyFilter(filter);
    });
  });
  
  // 排序选择
  if (DOM.sortSelect) {
    DOM.sortSelect.addEventListener('change', (e) => {
      AppState.currentSort = e.target.value;
      AppState.currentPage = 1;
      loadContent();
    });
  }
  
  // 搜索输入 (桌面端)
  if (DOM.searchInput) {
    DOM.searchInput.addEventListener('input', debounce((e) => {
      AppState.searchQuery = e.target.value.trim();
      AppState.currentPage = 1;
      loadContent();
    }, 300));
  }
  
  // 搜索输入 (移动端)
  if (DOM.mobileSearchInput) {
    DOM.mobileSearchInput.addEventListener('input', debounce((e) => {
      AppState.searchQuery = e.target.value.trim();
      AppState.currentPage = 1;
      loadContent();
    }, 300));
  }
  
  // 分页按钮
  if (DOM.prevBtn) {
    DOM.prevBtn.addEventListener('click', () => {
      if (AppState.currentPage > 1) {
        AppState.currentPage--;
        loadContent();
        updatePaginationUI();
      }
    });
  }
  
  if (DOM.nextBtn) {
    DOM.nextBtn.addEventListener('click', () => {
      const totalArticles = ContentManager.getArticlesByDelphiTag(AppState.currentTab).length;
      const totalPages = Math.ceil(totalArticles / AppState.itemsPerPage);
      
      if (AppState.currentPage < totalPages) {
        AppState.currentPage++;
        loadContent();
        updatePaginationUI();
      }
    });
  }
  
  // 窗口大小变化时关闭移动端菜单
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && DOM.mobileMenu && !DOM.mobileMenu.classList.contains('hidden')) {
      DOM.mobileMenu.classList.add('hidden');
    }
  });
}

// 切换标签
function switchTab(tabId) {
  console.log(`切换到标签: ${tabId}`);
  
  // 更新活动状态
  DOM.navTabs.forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.tab === tabId) {
      tab.classList.add('active');
    }
  });
  
  // 更新应用状态
  AppState.currentTab = tabId;
  AppState.currentPage = 1;
  AppState.searchQuery = '';
  
  // 清空搜索框
  if (DOM.searchInput) DOM.searchInput.value = '';
  if (DOM.mobileSearchInput) DOM.mobileSearchInput.value = '';
  
  // 更新页面标题
  updatePageTitle(tabId);
  
  // 重新加载内容
  loadContent();
  
  // 更新统计数据
  updateStats();
  
  // 关闭移动端菜单
  if (DOM.mobileMenu && !DOM.mobileMenu.classList.contains('hidden')) {
    DOM.mobileMenu.classList.add('hidden');
  }
}

// 更新页面标题
function updatePageTitle(tabId) {
  if (!DOM.pageTitle) return;
  
  const tagNames = ContentManager.getDelphiTags();
  DOM.pageTitle.textContent = tagNames[tabId] || tagNames.all;
}

// 应用筛选
function applyFilter(filter) {
  console.log(`应用筛选: ${filter}`);
  
  // 更新筛选按钮状态
  DOM.filterBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.filter === filter) {
      btn.classList.add('active');
    }
  });
  
  // 更新应用状态
  AppState.currentFilter = filter;
  AppState.currentPage = 1;
  
  // 重新加载内容
  loadContent();
  
  // 显示通知
  showNotification(`已应用筛选: ${getFilterDisplayName(filter)}`);
}

// 获取筛选显示名称
function getFilterDisplayName(filter) {
  const filterNames = {
    'all': '全部',
    'today': '今日',
    'week': '本周',
    'month': '本月'
  };
  
  return filterNames[filter] || filter;
}

// 加载内容
function loadContent() {
  if (!DOM.contentGrid) return;
  
  // 显示加载状态
  showLoading();
  
  // 模拟加载延迟 (实际应用中可移除)
  setTimeout(() => {
    // 获取数据
    let articles = [];
    
    // 如果有搜索查询，优先搜索
    if (AppState.searchQuery) {
      articles = ContentManager.searchArticles(AppState.searchQuery);
    } else {
      // 按标签获取文章
      articles = ContentManager.getArticlesByDelphiTag(AppState.currentTab);
      
      // 应用时间筛选
      if (AppState.currentFilter !== 'all') {
        articles = ContentManager.filterByTime(AppState.currentFilter);
      }
    }
    
    // 应用排序
    articles = ContentManager.sortArticles(articles, AppState.currentSort);
    
    // 应用分页
    const paginated = ContentManager.paginate(
      articles, 
      AppState.currentPage, 
      AppState.itemsPerPage
    );
    
    // 渲染内容
    renderContent(paginated.data);
    
    // 更新分页UI
    updatePaginationUI(paginated);
    
    // 更新页面统计
    updatePageStats(articles.length, paginated.totalPages);
    
    // 如果没有数据，显示空状态
    if (paginated.data.length === 0) {
      showEmptyState();
    }
  }, 500);
}

// 渲染内容
function renderContent(articles) {
  if (!DOM.contentGrid) return;
  
  // 清空当前内容
  DOM.contentGrid.innerHTML = '';
  
  // 如果没有数据，显示空状态
  if (!articles || articles.length === 0) {
    showEmptyState();
    return;
  }
  
  // 创建内容卡片
  articles.forEach(article => {
    const card = createContentCard(article);
    DOM.contentGrid.appendChild(card);
  });
}

// 创建内容卡片
function createContentCard(article) {
  // 用户指令: list形式，一行一篇文章摘要入口，不要用3列宫格，就用一列，展开
  // 改为创建列表项 (list item) 而不是卡片 (card)
  const listItem = document.createElement('article');
  listItem.className = 'content-list-item bg-card border border-dark rounded-lg p-5 mb-4 transition-all duration-200 hover:border-light hover:shadow-md hover:bg-dark-800';
  listItem.setAttribute('data-id', article.id);
  
  // 格式化日期
  const formattedDate = formatDate(article.publishedDate);
  
  // 列表项内容 - 水平布局，一行一篇文章摘要
  listItem.innerHTML = `
    <div class="flex flex-col md:flex-row md:items-start justify-between">
      <!-- 左侧: 分类和标题区域 -->
      <div class="flex-1 mb-4 md:mb-0 md:mr-6">
        <!-- 分类标签 -->
        <div class="flex items-center mb-2">
          <span class="card-category">
            ${article.category}
          </span>
          <span class="text-xs text-tertiary ml-3">${article.author}</span>
        </div>
        
        <!-- 标题 -->
        <h3 class="text-lg font-semibold text-white mb-2 line-clamp-1">
          ${article.title}
        </h3>
        
        <!-- 描述 -->
        <p class="text-sm text-tertiary mb-3 line-clamp-2">
          ${article.description}
        </p>
      </div>
      
      <!-- 右侧: 元数据区域 -->
      <div class="flex flex-col items-start md:items-end space-y-2">
        <!-- 日期 -->
        <div class="flex items-center text-xs text-tertiary">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>${formattedDate}</span>
        </div>
        
        <!-- 浏览量和点赞数 -->
        <div class="flex items-center space-x-4 text-xs text-tertiary">
          <span class="flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>${formatNumber(article.views)}</span>
          </span>
          <span class="flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span>${formatNumber(article.likes)}</span>
          </span>
        </div>
      </div>
    </div>
  `;
  
  // 添加点击事件
  listItem.addEventListener('click', (e) => {
    // 防止事件冒泡（如果内部元素也有点击事件）
    e.stopPropagation();
    console.log(`点击文章: ${article.id} - ${article.title}`);
    // 导航到文章详情页 (无扩展名URL，与_redirects配置一致)
    window.location.href = `article?slug=${article.slug}`;
  });
  
  return listItem;
}

// 显示加载状态
function showLoading() {
  if (!DOM.contentGrid) return;
  
  DOM.contentGrid.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-12 animate-fadeIn">
      <div class="loading-spinner mb-4"></div>
      <p class="text-tertiary">加载内容中...</p>
    </div>
  `;
}

// 显示空状态
function showEmptyState() {
  if (!DOM.contentGrid) return;
  
  DOM.contentGrid.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-16 animate-fadeIn">
      <div class="text-6xl mb-4">📭</div>
      <h3 class="text-xl font-semibold text-primary mb-2">没有找到内容</h3>
      <p class="text-tertiary mb-6 text-center max-w-md">
        ${AppState.searchQuery ? 
          `没有找到与"${AppState.searchQuery}"相关的内容` : 
          '尝试调整筛选条件或选择其他标签'}
      </p>
      <div class="flex space-x-3">
        ${AppState.searchQuery ? 
          `<button class="btn btn-secondary" onclick="clearSearch()">清除搜索</button>` : 
          ''}
        <button class="btn btn-outline" onclick="resetFilters()">重置筛选</button>
      </div>
    </div>
  `;
}

// 更新分页UI
function updatePaginationUI(paginated = null) {
  if (!DOM.prevBtn || !DOM.nextBtn || !DOM.pageNumbers) return;
  
  // 如果没有分页数据，从当前状态计算
  if (!paginated) {
    const articles = ContentManager.getArticlesByDelphiTag(AppState.currentTab);
    paginated = ContentManager.paginate(
      articles,
      AppState.currentPage,
      AppState.itemsPerPage
    );
  }
  
  // 更新上一页/下一页按钮状态
  DOM.prevBtn.disabled = !paginated.hasPrev;
  DOM.prevBtn.classList.toggle('disabled', !paginated.hasPrev);
  
  DOM.nextBtn.disabled = !paginated.hasNext;
  DOM.nextBtn.classList.toggle('disabled', !paginated.hasNext);
  
  // 更新页码显示 (简化版本)
  if (paginated.totalPages <= 1) {
    DOM.pageNumbers.innerHTML = '';
    return;
  }
  
  let pageButtons = '';
  const maxVisiblePages = 5;
  let startPage = Math.max(1, AppState.currentPage - 2);
  let endPage = Math.min(paginated.totalPages, startPage + maxVisiblePages - 1);
  
  // 调整起始页，确保显示最大页数
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  // 第一页
  if (startPage > 1) {
    pageButtons += `<button class="btn btn-secondary w-10 h-10" data-page="1">1</button>`;
    if (startPage > 2) {
      pageButtons += `<span class="px-2 text-tertiary flex items-center">...</span>`;
    }
  }
  
  // 中间页码
  for (let i = startPage; i <= endPage; i++) {
    const active = i === AppState.currentPage;
    pageButtons += `
      <button class="btn btn-secondary w-10 h-10 ${active ? 'active' : ''}" data-page="${i}">
        ${i}
      </button>
    `;
  }
  
  // 最后一页
  if (endPage < paginated.totalPages) {
    if (endPage < paginated.totalPages - 1) {
      pageButtons += `<span class="px-2 text-tertiary flex items-center">...</span>`;
    }
    pageButtons += `<button class="btn btn-secondary w-10 h-10" data-page="${paginated.totalPages}">${paginated.totalPages}</button>`;
  }
  
  DOM.pageNumbers.innerHTML = pageButtons;
  
  // 添加页码点击事件
  DOM.pageNumbers.querySelectorAll('button[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page);
      if (page !== AppState.currentPage) {
        AppState.currentPage = page;
        loadContent();
        updatePaginationUI();
      }
    });
  });
}

// 更新页面统计
function updatePageStats(totalItems = null, totalPages = null) {
  if (!DOM.pageStats) return;
  
  if (totalItems === null) {
    const articles = ContentManager.getArticlesByDelphiTag(AppState.currentTab);
    totalItems = articles.length;
    totalPages = Math.ceil(totalItems / AppState.itemsPerPage);
  }
  
  const statsText = AppState.searchQuery ? 
    `找到 ${totalItems} 个结果` : 
    `${totalItems} 篇文章 • 第 ${AppState.currentPage} 页 / 共 ${totalPages} 页`;
  
  DOM.pageStats.innerHTML = statsText;
}

// 更新总体统计数据
function updateStats() {
  const stats = ContentManager.getStats();
  console.log('网站统计数据:', stats);
  // 这里可以更新全局统计数据，比如在页脚显示
}

// 切换移动端菜单
function toggleMobileMenu() {
  if (!DOM.mobileMenu) return;
  
  DOM.mobileMenu.classList.toggle('hidden');
  
  // 更新按钮图标
  if (DOM.mobileMenuBtn) {
    const isOpen = !DOM.mobileMenu.classList.contains('hidden');
    DOM.mobileMenuBtn.innerHTML = isOpen ? 
      `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>` :
      `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>`;
  }
}

// 显示通知
function showNotification(message, type = 'info') {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = 'notification fixed top-4 right-4 z-50';
  notification.innerHTML = `
    <div class="bg-tertiary border-l-4 border-blue-600 text-white px-4 py-3 rounded-md shadow-lg flex items-center animate-slideInUp">
      <div class="mr-3">
        ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
      </div>
      <div>${message}</div>
    </div>
  `;
  
  // 添加到页面
  document.body.appendChild(notification);
  
  // 3秒后移除
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// 工具函数：防抖
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 工具函数：格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// 工具函数：格式化数字
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// 清除搜索
function clearSearch() {
  AppState.searchQuery = '';
  AppState.currentPage = 1;
  
  if (DOM.searchInput) DOM.searchInput.value = '';
  if (DOM.mobileSearchInput) DOM.mobileSearchInput.value = '';
  
  loadContent();
  showNotification('已清除搜索');
}

// 重置筛选
function resetFilters() {
  AppState.currentFilter = 'all';
  AppState.currentSort = 'newest';
  AppState.currentPage = 1;
  
  // 更新UI
  DOM.filterBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.filter === 'all') {
      btn.classList.add('active');
    }
  });
  
  if (DOM.sortSelect) {
    DOM.sortSelect.value = 'newest';
  }
  
  loadContent();
  showNotification('已重置所有筛选');
}

// 全局辅助函数
window.clearSearch = clearSearch;
window.resetFilters = resetFilters;

// 增强的启动函数 - 等待服务就绪
function enhancedInitApp() {
  console.log('🚀 增强启动: 检查服务就绪状态...');
  
  // 检查ContentManager是否可用
  if (typeof ContentManager === 'undefined') {
    console.warn('⚠️ ContentManager未定义，等待服务初始化...');
    
    // 等待服务就绪事件
    window.addEventListener('app:servicesReady', function onServicesReady(event) {
      console.log('✅ 服务就绪事件收到，启动应用:', event.detail);
      window.removeEventListener('app:servicesReady', onServicesReady);
      initApp();
    });
    
    // 处理服务失败
    window.addEventListener('app:servicesFailed', function onServicesFailed(event) {
      console.error('❌ 服务初始化失败:', event.detail);
      window.removeEventListener('app:servicesFailed', onServicesFailed);
      
      // 仍然尝试启动，使用降级模式
      console.warn('⚠️ 使用降级模式启动应用');
      initApp();
    });
    
    // 设置超时，防止永远等待
    setTimeout(() => {
      if (!window.appStarted) {
        console.warn('⚠️ 服务初始化超时，强制启动应用');
        window.appStarted = true;
        initApp();
      }
    }, 5000);
    
    return;
  }
  
  // ContentManager已可用，直接启动
  console.log('✅ ContentManager已就绪，直接启动应用');
  initApp();
}

// 标记应用已启动
window.appStarted = false;

// 启动应用
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhancedInitApp);
} else {
  enhancedInitApp();
}

console.log('Delphi Digital像素级复刻应用脚本加载完成');