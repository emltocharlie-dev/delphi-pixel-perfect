// Research页面脚本 - 高级搜索和研究工具
// 版本: 1.0 - 集成扩展性数据服务层

// 搜索页面状态
const SearchState = {
  query: '',
  type: 'all',
  timeframe: 'all',
  sort: 'relevance',
  category: 'all',
  limit: 10,
  page: 1,
  totalResults: 0,
  totalPages: 0,
  isLoading: false,
  searchHistory: [],
  recentSearches: []
};

// DOM元素缓存
const SearchDOM = {
  // 搜索输入
  searchInput: null,
  searchType: null,
  searchTimeframe: null,
  searchSort: null,
  searchCategory: null,
  searchLimit: null,
  searchBtn: null,
  
  // 高级选项
  advancedOptions: null,
  toggleAdvancedBtn: null,
  
  // 搜索结果
  searchResults: null,
  searchStats: null,
  
  // 分页
  searchPagination: null,
  prevPageBtn: null,
  nextPageBtn: null,
  pageNumbers: null,
  
  // 搜索历史
  searchHistoryContainer: null,
  
  // 热门搜索
  popularSearchTags: null,
  searchSuggestions: null
};

// 初始化搜索页面
function initSearchPage() {
  console.log('🚀 Research页面初始化');
  
  // 缓存DOM元素
  cacheSearchDOMElements();
  
  // 设置事件监听器
  setupSearchEventListeners();
  
  // 加载搜索历史
  loadSearchHistory();
  
  // 初始化热门搜索
  initPopularSearches();
  
  console.log('✅ Research页面初始化完成');
}

// 缓存DOM元素
function cacheSearchDOMElements() {
  // 搜索输入
  SearchDOM.searchInput = document.getElementById('advanced-search-input');
  SearchDOM.searchType = document.getElementById('search-type');
  SearchDOM.searchTimeframe = document.getElementById('search-timeframe');
  SearchDOM.searchSort = document.getElementById('search-sort');
  SearchDOM.searchCategory = document.getElementById('search-category');
  SearchDOM.searchLimit = document.getElementById('search-limit');
  SearchDOM.searchBtn = document.getElementById('advanced-search-btn');
  
  // 高级选项
  SearchDOM.advancedOptions = document.getElementById('advanced-options');
  SearchDOM.toggleAdvancedBtn = document.getElementById('toggle-advanced-btn');
  
  // 搜索结果
  SearchDOM.searchResults = document.getElementById('search-results');
  SearchDOM.searchStats = document.getElementById('search-stats');
  
  // 分页
  SearchDOM.searchPagination = document.getElementById('search-pagination');
  SearchDOM.prevPageBtn = document.getElementById('prev-page-btn');
  SearchDOM.nextPageBtn = document.getElementById('next-page-btn');
  SearchDOM.pageNumbers = document.getElementById('page-numbers');
  
  // 搜索历史
  SearchDOM.searchHistoryContainer = document.getElementById('search-history');
  
  // 热门搜索
  SearchDOM.popularSearchTags = document.querySelectorAll('[data-tag]');
  SearchDOM.searchSuggestions = document.querySelectorAll('[data-suggestion]');
  
  console.log('🔍 缓存了', Object.keys(SearchDOM).length, '个DOM元素');
}

// 设置事件监听器
function setupSearchEventListeners() {
  // 搜索按钮点击
  if (SearchDOM.searchBtn) {
    SearchDOM.searchBtn.addEventListener('click', performSearch);
  }
  
  // 搜索输入回车键
  if (SearchDOM.searchInput) {
    SearchDOM.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
  
  // 高级选项切换
  if (SearchDOM.toggleAdvancedBtn) {
    SearchDOM.toggleAdvancedBtn.addEventListener('click', toggleAdvancedOptions);
  }
  
  // 分页按钮
  if (SearchDOM.prevPageBtn) {
    SearchDOM.prevPageBtn.addEventListener('click', () => changePage(-1));
  }
  
  if (SearchDOM.nextPageBtn) {
    SearchDOM.nextPageBtn.addEventListener('click', () => changePage(1));
  }
  
  // 热门搜索标签点击
  SearchDOM.popularSearchTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const query = tag.getAttribute('data-tag');
      setSearchQuery(query);
      performSearch();
    });
  });
  
  // 搜索建议点击
  SearchDOM.searchSuggestions.forEach(suggestion => {
    suggestion.addEventListener('click', () => {
      const query = suggestion.getAttribute('data-suggestion');
      setSearchQuery(query);
      performSearch();
    });
  });
  
  // 搜索类型变化
  if (SearchDOM.searchType) {
    SearchDOM.searchType.addEventListener('change', updateSearchStateFromUI);
  }
  
  // 时间范围变化
  if (SearchDOM.searchTimeframe) {
    SearchDOM.searchTimeframe.addEventListener('change', updateSearchStateFromUI);
  }
  
  // 排序方式变化
  if (SearchDOM.searchSort) {
    SearchDOM.searchSort.addEventListener('change', updateSearchStateFromUI);
  }
  
  // 分类变化
  if (SearchDOM.searchCategory) {
    SearchDOM.searchCategory.addEventListener('change', updateSearchStateFromUI);
  }
  
  // 每页数量变化
  if (SearchDOM.searchLimit) {
    SearchDOM.searchLimit.addEventListener('change', updateSearchStateFromUI);
  }
  
  console.log('🔌 设置了搜索页面事件监听器');
}

// 更新搜索状态从UI
function updateSearchStateFromUI() {
  if (SearchDOM.searchInput) {
    SearchState.query = SearchDOM.searchInput.value.trim();
  }
  
  if (SearchDOM.searchType) {
    SearchState.type = SearchDOM.searchType.value;
  }
  
  if (SearchDOM.searchTimeframe) {
    SearchState.timeframe = SearchDOM.searchTimeframe.value;
  }
  
  if (SearchDOM.searchSort) {
    SearchState.sort = SearchDOM.searchSort.value;
  }
  
  if (SearchDOM.searchCategory) {
    SearchState.category = SearchDOM.searchCategory.value;
  }
  
  if (SearchDOM.searchLimit) {
    SearchState.limit = parseInt(SearchDOM.searchLimit.value);
  }
}

// 设置搜索查询
function setSearchQuery(query) {
  SearchState.query = query;
  if (SearchDOM.searchInput) {
    SearchDOM.searchInput.value = query;
  }
}

// 切换高级选项
function toggleAdvancedOptions() {
  if (!SearchDOM.advancedOptions) return;
  
  const isHidden = SearchDOM.advancedOptions.classList.contains('hidden');
  
  if (isHidden) {
    SearchDOM.advancedOptions.classList.remove('hidden');
    SearchDOM.toggleAdvancedBtn.innerHTML = `
      <span>隐藏高级选项</span>
      <svg class="w-4 h-4 ml-1 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    `;
  } else {
    SearchDOM.advancedOptions.classList.add('hidden');
    SearchDOM.toggleAdvancedBtn.innerHTML = `
      <span>高级选项</span>
      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    `;
  }
}

// 执行搜索
async function performSearch() {
  // 更新搜索状态
  updateSearchStateFromUI();
  
  // 验证搜索查询
  if (!SearchState.query.trim()) {
    showSearchMessage('请输入搜索关键词');
    return;
  }
  
  // 设置加载状态
  setLoadingState(true);
  
  try {
    console.log('🔍 执行搜索:', SearchState);
    
    // 使用扩展性数据服务层进行搜索
    let searchResults;
    
    if (typeof ContentManager !== 'undefined' && ContentManager.newApi) {
      // 使用新的API服务
      const api = ContentManager.newApi;
      searchResults = await api.search(SearchState.query, {
        type: SearchState.type,
        limit: SearchState.limit,
        page: SearchState.page
      });
    } else if (typeof ContentManager !== 'undefined') {
      // 使用兼容的ContentManager
      if (SearchState.type === 'articles' || SearchState.type === 'all') {
        const articles = await ContentManager.searchArticles(SearchState.query);
        searchResults = {
          articles: articles,
          projects: [],
          total: articles.length
        };
      } else {
        searchResults = { articles: [], projects: [], total: 0 };
      }
    } else {
      // 回退到静态数据
      searchResults = {
        articles: [],
        projects: [],
        total: 0
      };
    }
    
    // 更新搜索状态
    SearchState.totalResults = searchResults.total || 
      (searchResults.articles?.length || 0) + (searchResults.projects?.length || 0);
    SearchState.totalPages = Math.ceil(SearchState.totalResults / SearchState.limit);
    
    // 渲染搜索结果
    renderSearchResults(searchResults);
    
    // 更新分页
    updatePagination();
    
    // 保存到搜索历史
    saveToSearchHistory(SearchState.query);
    
    // 显示搜索统计
    updateSearchStats();
    
    console.log('✅ 搜索完成，找到', SearchState.totalResults, '个结果');
    
  } catch (error) {
    console.error('❌ 搜索失败:', error);
    showSearchMessage('搜索失败，请稍后重试');
  } finally {
    // 清除加载状态
    setLoadingState(false);
  }
}

// 渲染搜索结果
function renderSearchResults(results) {
  if (!SearchDOM.searchResults) return;
  
  // 清空现有结果
  SearchDOM.searchResults.innerHTML = '';
  
  // 检查是否有结果
  const hasArticles = results.articles && results.articles.length > 0;
  const hasProjects = results.projects && results.projects.length > 0;
  
  if (!hasArticles && !hasProjects) {
    renderNoResults();
    return;
  }
  
  // 渲染文章结果
  if (hasArticles && (SearchState.type === 'all' || SearchState.type === 'articles')) {
    renderArticleResults(results.articles);
  }
  
  // 渲染项目结果
  if (hasProjects && (SearchState.type === 'all' || SearchState.type === 'projects')) {
    renderProjectResults(results.projects);
  }
}

// 渲染文章结果
function renderArticleResults(articles) {
  const fragment = document.createDocumentFragment();
  
  articles.forEach((article, index) => {
    const articleCard = createArticleCard(article);
    fragment.appendChild(articleCard);
  });
  
  SearchDOM.searchResults.appendChild(fragment);
}

// 创建文章卡片
function createArticleCard(article) {
  const card = document.createElement('div');
  card.className = 'bg-dark-800 rounded-xl p-6 hover:bg-dark-700 transition-colors cursor-pointer';
  card.dataset.slug = article.slug;
  card.dataset.type = 'article';
  
  // 文章标签
  const tagClass = article.delphiTag === 'reports' ? 'bg-blue-600/10 text-blue-600' :
                   article.delphiTag === 'alpha' ? 'bg-purple-600/10 text-purple-600' :
                   'bg-green-600/10 text-green-600';
  
  // 发布时间格式化
  const publishedDate = article.publishedDate ? 
    new Date(article.publishedDate).toLocaleDateString('zh-CN') : '未知日期';
  
  card.innerHTML = `
    <div class="flex flex-col md:flex-row md:items-start gap-4">
      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-2">
          <span class="text-xs font-medium px-2 py-1 rounded ${tagClass}">
            ${article.delphiTag || 'article'}
          </span>
          <span class="text-xs text-tertiary">${publishedDate}</span>
        </div>
        
        <h3 class="text-white font-semibold text-lg mb-2">${article.title || '无标题'}</h3>
        
        <p class="text-tertiary mb-4">${article.description || article.excerpt || '无描述'}</p>
        
        <div class="flex flex-wrap gap-2 mb-4">
          ${article.tags ? article.tags.map(tag => 
            `<span class="px-2 py-1 bg-dark-700 rounded text-xs text-tertiary">${tag}</span>`
          ).join('') : ''}
        </div>
        
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center space-x-4 text-tertiary">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              ${article.views || 0}
            </span>
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              ${article.likes || 0}
            </span>
            <span>${article.readTime || 5}分钟阅读</span>
          </div>
          
          <a href="/article?slug=${article.slug}" class="text-primary hover:underline">
            查看详情 →
          </a>
        </div>
      </div>
    </div>
  `;
  
  // 添加点击事件
  card.addEventListener('click', () => {
    window.location.href = `/article?slug=${article.slug}`;
  });
  
  return card;
}

// 渲染项目结果
function renderProjectResults(projects) {
  const fragment = document.createDocumentFragment();
  
  projects.forEach((project, index) => {
    const projectCard = createProjectCard(project);
    fragment.appendChild(projectCard);
  });
  
  SearchDOM.searchResults.appendChild(fragment);
}

// 创建项目卡片
function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'bg-dark-800 rounded-xl p-6 hover:bg-dark-700 transition-colors cursor-pointer';
  card.dataset.slug = project.slug;
  card.dataset.type = 'project';
  
  card.innerHTML = `
    <div class="flex flex-col md:flex-row md:items-start gap-4">
      <div class="flex-shrink-0">
        <div class="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center text-2xl">
          ${project.icon || '📊'}
        </div>
      </div>
      
      <div class="flex-1">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-white font-semibold text-lg">${project.name || '未知项目'}</h3>
          <span class="text-xs font-medium px-2 py-1 bg-green-600/10 text-green-600 rounded">
            项目
          </span>
        </div>
        
        <p class="text-tertiary mb-4">${project.description || '无描述'}</p>
        
        <div class="flex flex-wrap gap-2 mb-4">
          ${project.categories ? project.categories.map(category => 
            `<span class="px-2 py-1 bg-dark-700 rounded text-xs text-tertiary">${category}</span>`
          ).join('') : ''}
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          ${project.metrics ? Object.entries(project.metrics).map(([key, value]) => `
            <div class="text-center">
              <div class="text-xs text-tertiary mb-1">${key}</div>
              <div class="text-white font-medium">${value}</div>
            </div>
          `).join('') : ''}
        </div>
        
        <div class="flex items-center justify-between">
          <div class="text-sm text-tertiary">
            ${project.tools ? `${project.tools.length} 个工具` : '无工具'}
          </div>
          <a href="/projects/${project.slug}" class="text-primary hover:underline">
            查看项目 →
          </a>
        </div>
      </div>
    </div>
  `;
  
  // 添加点击事件
  card.addEventListener('click', () => {
    window.location.href = `/projects/${project.slug}`;
  });
  
  return card;
}

// 渲染无结果
function renderNoResults() {
  SearchDOM.searchResults.innerHTML = `
    <div class="bg-dark-800 rounded-xl p-8 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-700 flex items-center justify-center">
        <svg class="w-8 h-8 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-white font-medium mb-2">未找到结果</h3>
      <p class="text-tertiary mb-4">没有找到与 "<span class="text-primary">${SearchState.query}</span>" 相关的内容</p>
      <div class="flex flex-col sm:flex-row gap-2 justify-center">
        <button class="btn btn-secondary" onclick="clearSearch()">清除搜索</button>
        <button class="btn btn-primary" onclick="setSearchQuery(''); performSearch()">显示所有内容</button>
      </div>
    </div>
  `;
}

// 显示搜索消息
function showSearchMessage(message) {
  if (!SearchDOM.searchResults) return;
  
  SearchDOM.searchResults.innerHTML = `
    <div class="bg-dark-800 rounded-xl p-8 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-700 flex items-center justify-center">
        <svg class="w-8 h-8 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-tertiary">${message}</p>
    </div>
  `;
}

// 更新搜索统计
function updateSearchStats() {
  if (!SearchDOM.searchStats) return;
  
  if (SearchState.totalResults > 0) {
    SearchDOM.searchStats.innerHTML = `
      找到 <span class="text-primary">${SearchState.totalResults}</span> 个结果
      ${SearchState.totalPages > 1 ? `(第 ${SearchState.page}/${SearchState.totalPages} 页)` : ''}
    `;
  } else {
    SearchDOM.searchStats.textContent = '输入关键词开始搜索';
  }
}

// 设置加载状态
function setLoadingState(isLoading) {
  SearchState.isLoading = isLoading;
  
  if (SearchDOM.searchBtn) {
    SearchDOM.searchBtn.disabled = isLoading;
    SearchDOM.searchBtn.innerHTML = isLoading ? `
      <span class="flex items-center">
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        搜索中...
      </span>
    ` : '搜索';
  }
  
  if (isLoading) {
    showSearchMessage('搜索中...');
  }
}

// 更新分页
function updatePagination() {
  if (!SearchDOM.searchPagination) return;
  
  // 显示或隐藏分页
  if (SearchState.totalPages > 1) {
    SearchDOM.searchPagination.classList.remove('hidden');
    
    // 更新上一页按钮
    if (SearchDOM.prevPageBtn) {
      SearchDOM.prevPageBtn.disabled = SearchState.page <= 1;
    }
    
    // 更新下一页按钮
    if (SearchDOM.nextPageBtn) {
      SearchDOM.nextPageBtn.disabled = SearchState.page >= SearchState.totalPages;
    }
    
    // 更新页码
    if (SearchDOM.pageNumbers) {
      SearchDOM.pageNumbers.innerHTML = '';
      
      const maxPagesToShow = 5;
      let startPage = Math.max(1, SearchState.page - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(SearchState.totalPages, startPage + maxPagesToShow - 1);
      
      // 调整起始页
      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      // 创建页码按钮
      for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `px-3 py-1 rounded text-sm ${
          i === SearchState.page 
            ? 'bg-primary text-white' 
            : 'bg-dark-700 text-tertiary hover:bg-dark-600'
        }`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => goToPage(i));
        
        SearchDOM.pageNumbers.appendChild(pageBtn);
      }
    }
  } else {
    SearchDOM.searchPagination.classList.add('hidden');
  }
}

// 改变页码
function changePage(delta) {
  const newPage = SearchState.page + delta;
  
  if (newPage >= 1 && newPage <= SearchState.totalPages) {
    SearchState.page = newPage;
    performSearch();
  }
}

// 跳转到指定页
function goToPage(page) {
  if (page >= 1 && page <= SearchState.totalPages) {
    SearchState.page = page;
    performSearch();
  }
}

// 加载搜索历史
function loadSearchHistory() {
  try {
    const history = localStorage.getItem('delphi_search_history');
    if (history) {
      SearchState.searchHistory = JSON.parse(history);
      renderSearchHistory();
    }
  } catch (error) {
    console.error('❌ 加载搜索历史失败:', error);
  }
}

// 保存到搜索历史
function saveToSearchHistory(query) {
  if (!query.trim()) return;
  
  try {
    // 移除重复项
    SearchState.searchHistory = SearchState.searchHistory.filter(item => item !== query);
    
    // 添加到开头
    SearchState.searchHistory.unshift(query);
    
    // 限制历史记录数量
    if (SearchState.searchHistory.length > 10) {
      SearchState.searchHistory = SearchState.searchHistory.slice(0, 10);
    }
    
    // 保存到localStorage
    localStorage.setItem('delphi_search_history', JSON.stringify(SearchState.searchHistory));
    
    // 更新UI
    renderSearchHistory();
    
  } catch (error) {
    console.error('❌ 保存搜索历史失败:', error);
  }
}

// 渲染搜索历史
function renderSearchHistory() {
  if (!SearchDOM.searchHistoryContainer) return;
  
  if (SearchState.searchHistory.length === 0) {
    SearchDOM.searchHistoryContainer.innerHTML = `
      <div class="text-sm text-tertiary">暂无搜索历史</div>
    `;
    return;
  }
  
  SearchDOM.searchHistoryContainer.innerHTML = '';
  
  SearchState.searchHistory.forEach(query => {
    const historyItem = document.createElement('span');
    historyItem.className = 'px-3 py-1.5 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm cursor-pointer transition-colors';
    historyItem.textContent = query;
    historyItem.addEventListener('click', () => {
      setSearchQuery(query);
      performSearch();
    });
    
    SearchDOM.searchHistoryContainer.appendChild(historyItem);
  });
}

// 初始化热门搜索
function initPopularSearches() {
  // 热门搜索已经在HTML中静态定义
  // 这里可以添加动态加载热门搜索的逻辑
  console.log('🔥 热门搜索已初始化');
}

// 清除搜索
function clearSearch() {
  if (SearchDOM.searchInput) {
    SearchDOM.searchInput.value = '';
  }
  
  SearchState.query = '';
  SearchState.page = 1;
  
  // 显示初始状态
  showSearchMessage('输入关键词开始搜索');
  updateSearchStats();
  
  if (SearchDOM.searchPagination) {
    SearchDOM.searchPagination.classList.add('hidden');
  }
}

// 全局访问
window.initSearchPage = initSearchPage;
window.performSearch = performSearch;
window.clearSearch = clearSearch;
window.setSearchQuery = setSearchQuery;