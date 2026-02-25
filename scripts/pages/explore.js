// Library页面脚本 - 知识库和多层级导航
// 版本: 1.0 - 集成扩展性数据服务层

// 知识库状态
const ExploreState = {
  currentCategory: '',
  currentSubcategory: '',
  categories: [],
  trendingContent: [],
  recentContent: [],
  featuredTopics: [],
  searchQuery: '',
  isLoading: true,
  stats: {
    totalArticles: 0,
    totalCategories: 0,
    totalTags: 0
  }
};

// DOM元素缓存
const ExploreDOM = {
  // 搜索
  searchInput: null,
  searchBtn: null,
  
  // 分类导航
  categoryNavigation: null,
  
  // 内容区域
  trendingContent: null,
  recentContent: null,
  featuredTopics: null,
  
  // 知识图谱
  totalArticles: null,
  totalCategories: null,
  totalTags: null,
  popularTags: null,
  
  // 加载状态
  loadingIndicator: null
};

// 初始化Library页面
function initExplorePage() {
  console.log('🚀 Library页面初始化');
  
  // 缓存DOM元素
  cacheExploreDOMElements();
  
  // 设置事件监听器
  setupExploreEventListeners();
  
  // 加载知识库数据
  loadExploreData();
  
  console.log('✅ Library页面初始化完成');
}

// 缓存DOM元素
function cacheExploreDOMElements() {
  // 搜索
  ExploreDOM.searchInput = document.getElementById('explore-search-input');
  ExploreDOM.searchBtn = document.getElementById('explore-search-btn');
  
  // 分类导航
  ExploreDOM.categoryNavigation = document.getElementById('category-navigation');
  
  // 内容区域
  ExploreDOM.trendingContent = document.getElementById('trending-content');
  ExploreDOM.recentContent = document.getElementById('recent-content');
  ExploreDOM.featuredTopics = document.getElementById('featured-topics');
  
  // 知识图谱
  ExploreDOM.totalArticles = document.getElementById('total-articles');
  ExploreDOM.totalCategories = document.getElementById('total-categories');
  ExploreDOM.totalTags = document.getElementById('total-tags');
  ExploreDOM.popularTags = document.getElementById('popular-tags');
  
  // 加载状态
  ExploreDOM.loadingIndicator = ExploreDOM.categoryNavigation?.querySelector('.loading-spinner')?.parentElement;
  
  console.log('🔍 缓存了', Object.keys(ExploreDOM).length, '个DOM元素');
}

// 设置事件监听器
function setupExploreEventListeners() {
  // 搜索按钮点击
  if (ExploreDOM.searchBtn) {
    ExploreDOM.searchBtn.addEventListener('click', performExploreSearch);
  }
  
  // 搜索输入回车键
  if (ExploreDOM.searchInput) {
    ExploreDOM.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performExploreSearch();
      }
    });
  }
  
  console.log('🔌 设置了Library页面事件监听器');
}

// 加载知识库数据
async function loadExploreData() {
  try {
    console.log('📚 加载知识库数据...');
    
    // 设置加载状态
    setLoadingState(true);
    
    // 使用扩展性数据服务层获取数据
    let exploreData;
    
    if (typeof ContentManager !== 'undefined' && ContentManager.newApi) {
      // 使用新的API服务
      const api = ContentManager.newApi;
      exploreData = await api.getExplore();
    } else if (typeof StaticDataService !== 'undefined') {
      // 使用静态数据服务
      exploreData = StaticDataService.getExplore();
    } else {
      // 生成示例数据
      exploreData = generateSampleExploreData();
    }
    
    // 更新状态
    ExploreState.categories = exploreData.categories || [];
    ExploreState.trendingContent = exploreData.trending || [];
    ExploreState.recentContent = exploreData.recentlyAdded || [];
    
    // 计算统计
    calculateExploreStats(exploreData);
    
    // 渲染页面
    renderCategoryNavigation();
    renderTrendingContent();
    renderRecentContent();
    updateKnowledgeGraph();
    
    console.log('✅ 知识库数据加载完成:', {
      categories: ExploreState.categories.length,
      trending: ExploreState.trendingContent.length,
      recent: ExploreState.recentContent.length
    });
    
  } catch (error) {
    console.error('❌ 加载知识库数据失败:', error);
    showErrorMessage('加载知识库数据失败，请刷新页面重试');
  } finally {
    // 清除加载状态
    setLoadingState(false);
  }
}

// 生成示例知识库数据
function generateSampleExploreData() {
  return {
    categories: [
      {
        slug: 'finance',
        name: 'Finance',
        description: 'Financial markets, economics, and investment strategies',
        icon: '💰',
        color: 'blue',
        articleCount: 45,
        subcategories: [
          { slug: 'asset-management', name: 'Asset Management', articleCount: 18 },
          { slug: 'trading', name: 'Trading', articleCount: 22 },
          { slug: 'macro', name: 'Macro Economics', articleCount: 5 }
        ],
        featuredArticles: [
          { slug: 'bitcoin-etf-flows-analysis', title: 'Bitcoin ETF Flows Analysis' },
          { slug: 'macro-outlook-2026', title: 'Macroeconomic Outlook 2026' }
        ]
      },
      {
        slug: 'infrastructure',
        name: 'Infrastructure',
        description: 'Blockchain infrastructure, protocols, and technology',
        icon: '⚙️',
        color: 'green',
        articleCount: 38,
        subcategories: [
          { slug: 'layer-1', name: 'Layer 1 Protocols', articleCount: 15 },
          { slug: 'layer-2', name: 'Layer 2 Solutions', articleCount: 12 },
          { slug: 'oracles', name: 'Oracles', articleCount: 8 },
          { slug: 'artificial-intelligence', name: 'Artificial Intelligence', articleCount: 3 }
        ],
        featuredArticles: [
          { slug: 'solana-the-modular', title: 'Solana: The Modular Future' },
          { slug: 'ethereum-layer2-ecosystem', title: 'Ethereum Layer 2 Ecosystem' }
        ]
      },
      {
        slug: 'defi',
        name: 'DeFi',
        description: 'Decentralized finance protocols and applications',
        icon: '🏦',
        color: 'yellow',
        articleCount: 32,
        subcategories: [
          { slug: 'lending', name: 'Lending', articleCount: 12 },
          { slug: 'dex', name: 'DEX', articleCount: 10 },
          { slug: 'yield', name: 'Yield', articleCount: 8 },
          { slug: 'derivatives', name: 'Derivatives', articleCount: 2 }
        ],
        featuredArticles: [
          { slug: 'defi-summer-2.0', title: 'DeFi Summer 2.0' },
          { slug: 'yield-optimization', title: 'Yield Optimization Strategies' }
        ]
      }
    ],
    trending: [
      { slug: 'solana-the-modular', title: 'Solana: The Modular Future', category: 'infrastructure', views: 12500 },
      { slug: 'bitcoin-etf-flows-analysis', title: 'Bitcoin ETF Flows Analysis', category: 'finance', views: 8900 },
      { slug: 'ai-blockchain-convergence', title: 'AI and Blockchain Convergence', category: 'infrastructure', views: 5300 }
    ],
    recentlyAdded: [
      { slug: 'nft-market-trends', title: 'NFT Market Trends Q1 2026', category: 'nft', added: '2026-02-25' },
      { slug: 'gaming-economy', title: 'Gaming Economy Analysis', category: 'gaming', added: '2026-02-24' },
      { slug: 'privacy-solutions', title: 'Privacy Solutions Overview', category: 'infrastructure', added: '2026-02-23' }
    ]
  };
}

// 计算知识库统计
function calculateExploreStats(exploreData) {
  // 文章总数
  let totalArticles = 0;
  if (exploreData.categories) {
    exploreData.categories.forEach(category => {
      totalArticles += category.articleCount || 0;
    });
  }
  
  // 分类数量
  const totalCategories = exploreData.categories ? exploreData.categories.length : 0;
  
  // 标签数量 (示例)
  const totalTags = 45; // 可以从数据中计算
  
  ExploreState.stats = {
    totalArticles,
    totalCategories,
    totalTags
  };
}

// 渲染分类导航
function renderCategoryNavigation() {
  if (!ExploreDOM.categoryNavigation) return;
  
  if (ExploreState.categories.length === 0) {
    ExploreDOM.categoryNavigation.innerHTML = `
      <div class="bg-dark-800 rounded-xl p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-700 flex items-center justify-center">
          <svg class="w-8 h-8 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-tertiary">暂无分类数据</p>
      </div>
    `;
    return;
  }
  
  const fragment = document.createDocumentFragment();
  
  ExploreState.categories.forEach(category => {
    const categoryCard = createCategoryCard(category);
    fragment.appendChild(categoryCard);
  });
  
  ExploreDOM.categoryNavigation.innerHTML = '';
  ExploreDOM.categoryNavigation.appendChild(fragment);
}

// 创建分类卡片
function createCategoryCard(category) {
  const card = document.createElement('div');
  card.className = 'bg-dark-800 rounded-xl p-6 hover:bg-dark-700 transition-colors cursor-pointer';
  card.dataset.category = category.slug;
  
  // 颜色映射
  const colorClasses = {
    blue: 'bg-blue-600/20 text-blue-600 border-blue-600/30',
    green: 'bg-green-600/20 text-green-600 border-green-600/30',
    yellow: 'bg-yellow-600/20 text-yellow-600 border-yellow-600/30',
    purple: 'bg-purple-600/20 text-purple-600 border-purple-600/30',
    red: 'bg-red-600/20 text-red-600 border-red-600/30',
    pink: 'bg-pink-600/20 text-pink-600 border-pink-600/30'
  };
  
  const colorClass = colorClasses[category.color] || colorClasses.blue;
  
  card.innerHTML = `
    <div class="flex flex-col md:flex-row md:items-start gap-4">
      <div class="flex-shrink-0">
        <div class="w-16 h-16 rounded-lg ${colorClass} border flex items-center justify-center text-2xl">
          ${category.icon || '📁'}
        </div>
      </div>
      
      <div class="flex-1">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-white font-semibold text-xl">${category.name}</h3>
          <span class="text-sm font-medium px-2 py-1 ${colorClass.replace('/20', '/10')} rounded">
            ${category.articleCount || 0} 篇文章
          </span>
        </div>
        
        <p class="text-tertiary mb-4">${category.description || '无描述'}</p>
        
        ${category.subcategories && category.subcategories.length > 0 ? `
          <div class="mb-4">
            <div class="text-sm text-tertiary mb-2">子分类:</div>
            <div class="flex flex-wrap gap-2">
              ${category.subcategories.map(subcat => `
                <span class="px-3 py-1.5 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm cursor-pointer transition-colors"
                      data-subcategory="${subcat.slug}"
                      onclick="navigateToSubcategory('${category.slug}', '${subcat.slug}')">
                  ${subcat.name} (${subcat.articleCount || 0})
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${category.featuredArticles && category.featuredArticles.length > 0 ? `
          <div class="pt-4 border-t border-dark-700">
            <div class="text-sm text-tertiary mb-2">精选文章:</div>
            <div class="space-y-2">
              ${category.featuredArticles.map(article => `
                <a href="/article?slug=${article.slug}" 
                   class="flex items-center text-sm text-primary hover:underline">
                  <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="truncate">${article.title}</span>
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="mt-4 pt-4 border-t border-dark-700 flex items-center justify-between">
          <div class="text-sm text-tertiary">
            点击探索 ${category.name} 分类
          </div>
          <button class="btn btn-secondary btn-sm" onclick="navigateToCategory('${category.slug}')">
            进入分类
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
  
  // 添加点击事件
  card.addEventListener('click', (e) => {
    // 如果点击的是子分类链接，不触发分类导航
    if (e.target.closest('[data-subcategory]') || e.target.closest('a')) {
      return;
    }
    navigateToCategory(category.slug);
  });
  
  return card;
}

// 导航到分类
function navigateToCategory(categorySlug) {
  console.log('📍 导航到分类:', categorySlug);
  
  // 这里可以跳转到分类页面或显示分类内容
  // 暂时使用控制台日志
  console.log(`将显示 ${categorySlug} 分类的内容`);
  
  // 在实际实现中，可以：
  // 1. 跳转到分类页面: /explore/${categorySlug}
  // 2. 或者动态加载分类内容
  // 3. 或者显示分类内容模态框
  
  // 示例: 显示提示
  showMessage(`正在加载 ${categorySlug} 分类的内容...`);
}

// 导航到子分类
function navigateToSubcategory(categorySlug, subcategorySlug) {
  console.log('📍 导航到子分类:', categorySlug, subcategorySlug);
  
  // 阻止事件冒泡
  event.stopPropagation();
  
  // 这里可以跳转到子分类页面
  console.log(`将显示 ${categorySlug}/${subcategorySlug} 子分类的内容`);
  
  // 示例: 显示提示
  showMessage(`正在加载 ${subcategorySlug} 子分类的内容...`);
}

// 渲染趋势内容
function renderTrendingContent() {
  if (!ExploreDOM.trendingContent) return;
  
  if (ExploreState.trendingContent.length === 0) {
    ExploreDOM.trendingContent.innerHTML = `
      <div class="col-span-full text-center py-8 text-tertiary">
        暂无趋势内容
      </div>
    `;
    return;
  }
  
  const fragment = document.createDocumentFragment();
  
  ExploreState.trendingContent.forEach((item, index) => {
    const contentCard = createContentCard(item, 'trending');
    fragment.appendChild(contentCard);
  });
  
  ExploreDOM.trendingContent.innerHTML = '';
  ExploreDOM.trendingContent.appendChild(fragment);
}

// 渲染最近内容
function renderRecentContent() {
  if (!ExploreDOM.recentContent) return;
  
  if (ExploreState.recentContent.length === 0) {
    ExploreDOM.recentContent.innerHTML = `
      <div class="col-span-full text-center py-8 text-tertiary">
        暂无最近添加的内容
      </div>
    `;
    return;
  }
  
  const fragment = document.createDocumentFragment();
  
  ExploreState.recentContent.forEach((item, index) => {
    const contentCard = createContentCard(item, 'recent');
    fragment.appendChild(contentCard);
  });
  
  ExploreDOM.recentContent.innerHTML = '';
  ExploreDOM.recentContent.appendChild(fragment);
}

// 创建内容卡片
function createContentCard(item, type = 'trending') {
  const card = document.createElement('div');
  card.className = 'bg-dark-800 rounded-xl p-6 hover:bg-dark-700 transition-colors cursor-pointer';
  card.dataset.slug = item.slug;
  
  const typeLabel = type === 'trending' ? '🔥 趋势' : '🆕 最新';
  const typeColor = type === 'trending' ? 'text-orange-600' : 'text-green-600';
  
  card.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium ${typeColor}">${typeLabel}</span>
        <span class="text-xs text-tertiary">${item.category || '未分类'}</span>
      </div>
      
      <h3 class="text-white font-semibold text-lg leading-tight">${item.title}</h3>
      
      ${item.views ? `
        <div class="flex items-center text-sm text-tertiary">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          ${item.views.toLocaleString()} 次查看
        </div>
      ` : ''}
      
      ${item.added ? `
        <div class="text-sm text-tertiary">
          添加时间: ${item.added}
        </div>
      ` : ''}
      
      <div class="pt-4 border-t border-dark-700">
        <a href="/article?slug=${item.slug}" class="text-primary hover:underline text-sm">
          阅读文章 →
        </a>
      </div>
    </div>
  `;
  
  // 添加点击事件
  card.addEventListener('click', () => {
    window.location.href = `/article?slug=${item.slug}`;
  });
  
  return card;
}

// 更新知识图谱
function updateKnowledgeGraph() {
  if (ExploreDOM.totalArticles) {
    ExploreDOM.totalArticles.textContent = ExploreState.stats.totalArticles.toLocaleString();
  }
  
  if (ExploreDOM.totalCategories) {
    ExploreDOM.totalCategories.textContent = ExploreState.stats.totalCategories.toLocaleString();
  }
  
  if (ExploreDOM.totalTags) {
    ExploreDOM.totalTags.textContent = ExploreState.stats.totalTags.toLocaleString();
  }
  
  // 渲染热门标签 (示例)
  if (ExploreDOM.popularTags) {
    const popularTags = [
      'Bitcoin', 'Ethereum', 'DeFi', 'NFT', 'Solana', 
      'Layer 2', 'Staking', 'Yield', 'GameFi', 'Web3'
    ];
    
    ExploreDOM.popularTags.innerHTML = popularTags.map(tag => `
      <span class="px-3 py-1.5 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm cursor-pointer transition-colors"
            onclick="searchByTag('${tag}')">
        ${tag}
      </span>
    `).join('');
  }
}

// 按标签搜索
function searchByTag(tag) {
  console.log('🔍 按标签搜索:', tag);
  
  // 设置搜索查询
  if (ExploreDOM.searchInput) {
    ExploreDOM.searchInput.value = tag;
  }
  
  // 执行搜索
  performExploreSearch();
}

// 执行知识库搜索
function performExploreSearch() {
  if (!ExploreDOM.searchInput) return;
  
  const query = ExploreDOM.searchInput.value.trim();
  
  if (!query) {
    showMessage('请输入搜索关键词');
    return;
  }
  
  console.log('🔍 在知识库中搜索:', query);
  
  // 跳转到搜索页面或显示搜索结果
  // 这里可以跳转到搜索页面，附带查询参数
  window.location.href = `/search?q=${encodeURIComponent(query)}`;
}

// 设置加载状态
function setLoadingState(isLoading) {
  ExploreState.isLoading = isLoading;
  
  if (ExploreDOM.loadingIndicator) {
    ExploreDOM.loadingIndicator.style.display = isLoading ? 'block' : 'none';
  }
  
  if (isLoading) {
    // 可以显示全局加载状态
    console.log('⏳ 知识库加载中...');
  } else {
    console.log('✅ 知识库加载完成');
  }
}

// 显示消息
function showMessage(message) {
  console.log('💬', message);
  
  // 在实际实现中，可以显示一个toast或通知
  // 这里使用控制台日志
}

// 显示错误消息
function showErrorMessage(message) {
  console.error('❌', message);
  
  if (ExploreDOM.categoryNavigation) {
    ExploreDOM.categoryNavigation.innerHTML = `
      <div class="bg-dark-800 rounded-xl p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600/20 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-white font-medium mb-2">加载失败</h3>
        <p class="text-tertiary">${message}</p>
        <button class="btn btn-primary mt-4" onclick="loadExploreData()">
          重试加载
        </button>
      </div>
    `;
  }
}

// 全局访问
window.initExplorePage = initExplorePage;
window.navigateToCategory = navigateToCategory;
window.navigateToSubcategory = navigateToSubcategory;
window.searchByTag = searchByTag;
window.performExploreSearch = performExploreSearch;
window.loadExploreData = loadExploreData;