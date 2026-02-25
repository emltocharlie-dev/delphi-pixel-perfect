// Tools页面脚本 - 项目库和工具集合
// 版本: 1.0 - 演示项目库功能

// 项目库状态
const ProjectsState = {
  projects: [],
  filteredProjects: [],
  currentFilter: 'all',
  currentSearch: '',
  currentCategory: '',
  currentSort: 'name',
  isLoading: true,
  stats: {
    totalProjects: 0,
    layer1Count: 0,
    defiCount: 0,
    toolsCount: 0,
    categories: {}
  }
};

// DOM元素缓存
const ProjectsDOM = {
  // 计数和按钮
  projectCount: null,
  refreshProjectsBtn: null,
  
  // 筛选和搜索
  searchInput: null,
  categorySelect: null,
  sortSelect: null,
  filterButtons: null,
  
  // 内容网格
  projectsGrid: null,
  popularTools: null,
  categoryOverview: null,
  projectCategories: null,
  
  // 统计
  statsTotalProjects: null,
  statsLayer1: null,
  statsDefi: null,
  statsTools: null
};

// 初始化Tools页面
function initProjectsPage() {
  console.log('🚀 Tools页面初始化');
  
  // 缓存DOM元素
  cacheProjectsDOMElements();
  
  // 设置事件监听器
  setupProjectsEventListeners();
  
  // 加载项目库数据
  loadProjectsData();
  
  console.log('✅ Tools页面初始化完成');
}

// 缓存DOM元素
function cacheProjectsDOMElements() {
  // 计数和按钮
  ProjectsDOM.projectCount = document.getElementById('project-count');
  ProjectsDOM.refreshProjectsBtn = document.getElementById('refresh-projects-btn');
  
  // 筛选和搜索
  ProjectsDOM.searchInput = document.getElementById('project-search-input');
  ProjectsDOM.categorySelect = document.getElementById('project-category-select');
  ProjectsDOM.sortSelect = document.getElementById('project-sort-select');
  ProjectsDOM.filterButtons = document.querySelectorAll('.filter-btn[data-type]');
  
  // 内容网格
  ProjectsDOM.projectsGrid = document.getElementById('projects-grid');
  ProjectsDOM.popularTools = document.getElementById('popular-tools');
  ProjectsDOM.categoryOverview = document.getElementById('category-overview');
  ProjectsDOM.projectCategories = document.getElementById('project-categories');
  
  // 统计
  ProjectsDOM.statsTotalProjects = document.getElementById('stats-total-projects');
  ProjectsDOM.statsLayer1 = document.getElementById('stats-layer1');
  ProjectsDOM.statsDefi = document.getElementById('stats-defi');
  ProjectsDOM.statsTools = document.getElementById('stats-tools');
  
  console.log('🔍 缓存了', Object.keys(ProjectsDOM).length, '个DOM元素');
}

// 设置事件监听器
function setupProjectsEventListeners() {
  // 刷新按钮
  if (ProjectsDOM.refreshProjectsBtn) {
    ProjectsDOM.refreshProjectsBtn.addEventListener('click', refreshProjects);
  }
  
  // 搜索输入
  if (ProjectsDOM.searchInput) {
    ProjectsDOM.searchInput.addEventListener('input', (e) => {
      ProjectsState.currentSearch = e.target.value;
      filterProjects();
    });
    
    ProjectsDOM.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        filterProjects();
      }
    });
  }
  
  // 分类筛选
  if (ProjectsDOM.categorySelect) {
    ProjectsDOM.categorySelect.addEventListener('change', (e) => {
      ProjectsState.currentCategory = e.target.value;
      filterProjects();
    });
  }
  
  // 排序选择
  if (ProjectsDOM.sortSelect) {
    ProjectsDOM.sortSelect.addEventListener('change', (e) => {
      ProjectsState.currentSort = e.target.value;
      sortProjects();
    });
  }
  
  // 筛选按钮
  ProjectsDOM.filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      filterProjectsByType(type);
      
      // 更新活动状态
      ProjectsDOM.filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  console.log('🔌 设置了Tools页面事件监听器');
}

// 加载项目库数据
async function loadProjectsData() {
  try {
    console.log('📚 加载项目库数据...');
    
    // 设置加载状态
    setLoadingState(true);
    
    // 使用扩展性数据服务层获取数据
    let projectsData;
    
    if (typeof ContentManager !== 'undefined' && ContentManager.newApi) {
      // 使用新的API服务
      const api = ContentManager.newApi;
      projectsData = await api.getProjects();
    } else if (typeof StaticDataService !== 'undefined') {
      // 使用静态数据服务
      projectsData = StaticDataService.getProjects();
    } else {
      // 生成示例数据
      projectsData = generateSampleProjectsData();
    }
    
    // 更新状态
    ProjectsState.projects = projectsData.projects || [];
    ProjectsState.filteredProjects = [...ProjectsState.projects];
    
    // 计算统计
    calculateProjectsStats();
    
    // 渲染页面
    updateProjectCount();
    renderProjectsGrid();
    renderCategoryOverview();
    renderProjectCategories();
    updateStatsDisplay();
    
    // 排序项目
    sortProjects();
    
    console.log('✅ 项目库数据加载完成:', {
      total: ProjectsState.projects.length,
      filtered: ProjectsState.filteredProjects.length
    });
    
  } catch (error) {
    console.error('❌ 加载项目库数据失败:', error);
    showErrorMessage('加载项目库数据失败，请刷新页面重试');
  } finally {
    // 清除加载状态
    setLoadingState(false);
  }
}

// 生成示例项目库数据
function generateSampleProjectsData() {
  return {
    projects: [
      {
        id: 'bitcoin',
        slug: 'bitcoin',
        name: 'Bitcoin',
        description: 'The original cryptocurrency and digital gold standard. Bitcoin ETF flow analysis and on-chain metrics.',
        category: 'layer-1',
        tags: ['Store of Value', 'ETF', 'Layer 1', 'Institutional'],
        status: 'active',
        tools: 3,
        marketCap: '$1.2T',
        popularity: 95,
        featured: true,
        color: 'orange',
        icon: '₿'
      },
      {
        id: 'ethereum',
        slug: 'ethereum',
        name: 'Ethereum',
        description: 'The leading smart contract platform and decentralized application ecosystem.',
        category: 'layer-1',
        tags: ['Smart Contracts', 'DeFi', 'Layer 2', 'Staking'],
        status: 'active',
        tools: 3,
        marketCap: '$420B',
        popularity: 90,
        featured: true,
        color: 'purple',
        icon: 'Ξ'
      },
      {
        id: 'solana',
        slug: 'solana',
        name: 'Solana',
        description: 'High-performance blockchain with focus on scalability and low transaction costs.',
        category: 'layer-1',
        tags: ['High TPS', 'Modular', 'EVM Compatible', 'Gaming'],
        status: 'active',
        tools: 2,
        marketCap: '$85B',
        popularity: 85,
        featured: true,
        color: 'pink',
        icon: '◎'
      },
      {
        id: 'uniswap',
        slug: 'uniswap',
        name: 'Uniswap',
        description: 'Leading decentralized exchange protocol on Ethereum and other chains.',
        category: 'defi',
        tags: ['DEX', 'AMM', 'DeFi', 'Governance'],
        status: 'active',
        tools: 1,
        marketCap: '$12B',
        popularity: 80,
        featured: false,
        color: 'pink',
        icon: '🦄'
      },
      {
        id: 'aave',
        slug: 'aave',
        name: 'Aave',
        description: 'Decentralized lending and borrowing protocol with multi-chain support.',
        category: 'defi',
        tags: ['Lending', 'Borrowing', 'DeFi', 'Safety Module'],
        status: 'active',
        tools: 1,
        marketCap: '$9.5B',
        popularity: 75,
        featured: false,
        color: 'blue',
        icon: '👻'
      },
      {
        id: 'makerdao',
        slug: 'makerdao',
        name: 'MakerDAO',
        description: 'Decentralized credit platform and stablecoin issuer (DAI).',
        category: 'defi',
        tags: ['Stablecoin', 'DAI', 'DeFi', 'Governance'],
        status: 'active',
        tools: 1,
        marketCap: '$8.2B',
        popularity: 70,
        featured: false,
        color: 'green',
        icon: '⚙️'
      },
      {
        id: 'arbitrum',
        slug: 'arbitrum',
        name: 'Arbitrum',
        description: 'Ethereum Layer 2 scaling solution using optimistic rollups.',
        category: 'layer-2',
        tags: ['Layer 2', 'Rollups', 'Scaling', 'EVM'],
        status: 'active',
        tools: 2,
        marketCap: 'N/A',
        popularity: 82,
        featured: true,
        color: 'blue',
        icon: '⚡'
      },
      {
        id: 'optimism',
        slug: 'optimism',
        name: 'Optimism',
        description: 'Ethereum Layer 2 using optimistic rollups with focus on EVM equivalence.',
        category: 'layer-2',
        tags: ['Layer 2', 'Rollups', 'EVM', 'OP Stack'],
        status: 'active',
        tools: 2,
        marketCap: 'N/A',
        popularity: 78,
        featured: false,
        color: 'red',
        icon: '🔴'
      },
      {
        id: 'cosmos',
        slug: 'cosmos',
        name: 'Cosmos',
        description: 'Interoperable blockchain ecosystem with IBC protocol.',
        category: 'infrastructure',
        tags: ['Interoperability', 'IBC', 'Cosmos SDK', 'Hub'],
        status: 'active',
        tools: 1,
        marketCap: '$35B',
        popularity: 72,
        featured: false,
        color: 'blue',
        icon: '⚛️'
      },
      {
        id: 'chainlink',
        slug: 'chainlink',
        name: 'Chainlink',
        description: 'Decentralized oracle network providing real-world data to blockchains.',
        category: 'infrastructure',
        tags: ['Oracles', 'Data', 'DeFi', 'CCIP'],
        status: 'active',
        tools: 1,
        marketCap: '$18B',
        popularity: 76,
        featured: false,
        color: 'blue',
        icon: '🔗'
      }
    ]
  };
}

// 计算项目统计
function calculateProjectsStats() {
  const stats = {
    totalProjects: ProjectsState.projects.length,
    layer1Count: 0,
    defiCount: 0,
    toolsCount: 0,
    categories: {}
  };
  
  ProjectsState.projects.forEach(project => {
    // 按分类计数
    if (!stats.categories[project.category]) {
      stats.categories[project.category] = 0;
    }
    stats.categories[project.category]++;
    
    // 特定分类计数
    switch (project.category) {
      case 'layer-1':
        stats.layer1Count++;
        break;
      case 'defi':
        stats.defiCount++;
        break;
      case 'analytics':
        stats.toolsCount++;
        break;
    }
    
    // 工具计数 (所有项目的tools字段总和)
    if (project.tools) {
      stats.toolsCount += project.tools;
    }
  });
  
  ProjectsState.stats = stats;
}

// 更新项目计数
function updateProjectCount() {
  if (ProjectsDOM.projectCount) {
    ProjectsDOM.projectCount.textContent = ProjectsState.filteredProjects.length;
  }
}

// 渲染项目网格
function renderProjectsGrid() {
  if (!ProjectsDOM.projectsGrid) return;
  
  if (ProjectsState.filteredProjects.length === 0) {
    ProjectsDOM.projectsGrid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-700 flex items-center justify-center">
          <svg class="w-8 h-8 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-white font-medium mb-2">未找到匹配的项目</h3>
        <p class="text-tertiary mb-4">${getNoProjectsMessage()}</p>
        <button class="btn btn-primary" onclick="clearFilters()">清除筛选</button>
      </div>
    `;
    return;
  }
  
  const fragment = document.createDocumentFragment();
  
  ProjectsState.filteredProjects.forEach(project => {
    const projectCard = createProjectCard(project);
    fragment.appendChild(projectCard);
  });
  
  ProjectsDOM.projectsGrid.innerHTML = '';
  ProjectsDOM.projectsGrid.appendChild(fragment);
}

// 获取无项目消息
function getNoProjectsMessage() {
  if (ProjectsState.currentSearch) {
    return `没有找到包含 "${ProjectsState.currentSearch}" 的项目`;
  }
  
  if (ProjectsState.currentCategory) {
    const categoryNames = {
      'layer-1': 'Layer 1',
      'layer-2': 'Layer 2',
      'defi': 'DeFi',
      'infrastructure': '基础设施',
      'gaming': '游戏/NFT',
      'analytics': '数据分析'
    };
    return `没有找到 ${categoryNames[ProjectsState.currentCategory] || ProjectsState.currentCategory} 分类的项目`;
  }
  
  if (ProjectsState.currentFilter !== 'all') {
    const filterNames = {
      'popular': '热门',
      'new': '最新',
      'tools': '工具'
    };
    return `没有找到 ${filterNames[ProjectsState.currentFilter] || ProjectsState.currentFilter} 项目`;
  }
  
  return '暂无项目数据';
}

// 创建项目卡片
function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'bg-dark-800 rounded-xl p-6 hover:bg-dark-700 transition-colors cursor-pointer';
  card.dataset.id = project.id;
  card.dataset.category = project.category;
  
  // 颜色映射
  const colorClasses = {
    blue: 'bg-blue-600/20 text-blue-600',
    green: 'bg-green-600/20 text-green-600',
    red: 'bg-red-600/20 text-red-600',
    orange: 'bg-orange-600/20 text-orange-600',
    purple: 'bg-purple-600/20 text-purple-600',
    pink: 'bg-pink-600/20 text-pink-600',
    yellow: 'bg-yellow-600/20 text-yellow-600'
  };
  
  const colorClass = colorClasses[project.color] || colorClasses.blue;
  
  // 分类名称
  const categoryNames = {
    'layer-1': 'Layer 1',
    'layer-2': 'Layer 2',
    'defi': 'DeFi',
    'infrastructure': '基础设施',
    'gaming': '游戏/NFT',
    'analytics': '数据分析'
  };
  
  card.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center text-2xl font-semibold">
            ${project.icon || '📊'}
          </div>
          <div>
            <h3 class="text-white font-semibold text-xl">${project.name}</h3>
            <div class="text-xs text-tertiary">${categoryNames[project.category] || project.category}</div>
          </div>
        </div>
        ${project.featured ? `
          <span class="text-xs font-medium px-2 py-1 bg-yellow-600/10 text-yellow-600 rounded">
            精选
          </span>
        ` : ''}
      </div>
      
      <p class="text-tertiary text-sm">${project.description}</p>
      
      ${project.tags && project.tags.length > 0 ? `
        <div class="flex flex-wrap gap-2">
          ${project.tags.map(tag => `
            <span class="px-2 py-1 bg-dark-700 rounded text-xs text-tertiary">${tag}</span>
          `).join('')}
        </div>
      ` : ''}
      
      <div class="pt-4 border-t border-dark-700 flex items-center justify-between">
        <div class="space-y-1">
          ${project.marketCap ? `
            <div class="text-xs text-tertiary">市值: ${project.marketCap}</div>
          ` : ''}
          ${project.tools ? `
            <div class="text-xs text-tertiary">${project.tools}个分析工具</div>
          ` : ''}
        </div>
        
        <div class="flex items-center space-x-2">
          <div class="text-xs text-tertiary">人气: ${project.popularity}%</div>
          <a href="/projects/${project.slug}" class="text-primary hover:underline text-sm">
            查看详情 →
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

// 渲染分类概览
function renderCategoryOverview() {
  if (!ProjectsDOM.categoryOverview) return;
  
  const categories = [
    {
      id: 'layer-1',
      name: 'Layer 1 项目',
      description: '基础层区块链协议，如比特币、以太坊、Solana等',
      icon: '🏗️',
      color: 'orange',
      count: ProjectsState.stats.layer1Count
    },
    {
      id: 'defi',
      name: 'DeFi 协议',
      description: '去中心化金融应用，包括交易、借贷、稳定币等',
      icon: '🏦',
      color: 'green',
      count: ProjectsState.stats.defiCount
    },
    {
      id: 'infrastructure',
      name: '基础设施',
      description: '区块链基础设施，如预言机、跨链桥、开发工具等',
      icon: '⚙️',
      color: 'blue',
      count: ProjectsState.stats.categories['infrastructure'] || 0
    },
    {
      id: 'layer-2',
      name: 'Layer 2 解决方案',
      description: '以太坊二层扩容方案，如Rollups、侧链等',
      icon: '⚡',
      color: 'purple',
      count: ProjectsState.stats.categories['layer-2'] || 0
    },
    {
      id: 'analytics',
      name: '分析工具',
      description: '数据分析、监控和可视化工具',
      icon: '📊',
      color: 'pink',
      count: ProjectsState.stats.toolsCount
    },
    {
      id: 'gaming',
      name: '游戏/NFT',
      description: '区块链游戏、NFT市场和元宇宙项目',
      icon: '🎮',
      color: 'yellow',
      count: ProjectsState.stats.categories['gaming'] || 0
    }
  ];
  
  ProjectsDOM.categoryOverview.innerHTML = '';
  
  categories.forEach(category => {
    if (category.count === 0) return;
    
    const card = document.createElement('div');
    card.className = 'bg-dark-800 rounded-lg p-6 hover:bg-dark-700 transition-colors cursor-pointer';
    card.dataset.category = category.id;
    
    card.innerHTML = `
      <div class="flex items-center mb-4">
        <div class="w-12 h-12 rounded-lg bg-${category.color}-600/20 flex items-center justify-center text-2xl text-${category.color}-600 mr-4">
          ${category.icon}
        </div>
        <div>
          <h3 class="text-white font-semibold">${category.name}</h3>
          <div class="text-2xl font-bold text-white">${category.count}</div>
        </div>
      </div>
      <p class="text-tertiary text-sm mb-4">${category.description}</p>
      <button class="btn btn-secondary btn-sm w-full" onclick="filterByCategory('${category.id}')">
        查看所有 ${category.name}
      </button>
    `;
    
    card.addEventListener('click', (e) => {
      if (!e.target.closest('button')) {
        filterByCategory(category.id);
      }
    });
    
    ProjectsDOM.categoryOverview.appendChild(card);
  });
}

// 渲染项目分类标签
function renderProjectCategories() {
  if (!ProjectsDOM.projectCategories) return;
  
  const categories = [
    { id: 'layer-1', name: 'Layer 1', count: ProjectsState.stats.layer1Count },
    { id: 'defi', name: 'DeFi', count: ProjectsState.stats.defiCount },
    { id: 'layer-2', name: 'Layer 2', count: ProjectsState.stats.categories['layer-2'] || 0 },
    { id: 'infrastructure', name: '基础设施', count: ProjectsState.stats.categories['infrastructure'] || 0 },
    { id: 'analytics', name: '分析工具', count: ProjectsState.stats.toolsCount }
  ].filter(cat => cat.count > 0);
  
  ProjectsDOM.projectCategories.innerHTML = '';
  
  categories.forEach(category => {
    const tag = document.createElement('span');
    tag.className = 'px-3 py-1.5 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm cursor-pointer transition-colors';
    tag.textContent = `${category.name} (${category.count})`;
    tag.dataset.category = category.id;
    tag.addEventListener('click', () => filterByCategory(category.id));
    
    ProjectsDOM.projectCategories.appendChild(tag);
  });
}

// 按分类筛选
function filterByCategory(categoryId) {
  console.log('🔍 按分类筛选:', categoryId);
  
  ProjectsState.currentCategory = categoryId;
  
  // 更新选择器
  if (ProjectsDOM.categorySelect) {
    ProjectsDOM.categorySelect.value = categoryId;
  }
  
  filterProjects();
}

// 按类型筛选项目
function filterProjectsByType(type) {
  ProjectsState.currentFilter = type;
  filterProjects();
}

// 筛选项目
function filterProjects() {
  let filtered = [...ProjectsState.projects];
  
  // 按搜索词筛选
  if (ProjectsState.currentSearch) {
    const searchTerm = ProjectsState.currentSearch.toLowerCase();
    filtered = filtered.filter(project => 
      project.name.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
  }
  
  // 按分类筛选
  if (ProjectsState.currentCategory) {
    filtered = filtered.filter(project => project.category === ProjectsState.currentCategory);
  }
  
  // 按类型筛选
  switch (ProjectsState.currentFilter) {
    case 'popular':
      filtered = filtered.filter(project => project.popularity >= 80);
      break;
    case 'new':
      // 这里可以添加时间逻辑，暂时用featured替代
      filtered = filtered.filter(project => project.featured);
      break;
    case 'tools':
      filtered = filtered.filter(project => project.tools && project.tools > 0);
      break;
  }
  
  ProjectsState.filteredProjects = filtered;
  
  // 更新UI
  updateProjectCount();
  renderProjectsGrid();
}

// 排序项目
function sortProjects() {
  if (ProjectsState.currentSort === 'name') {
    ProjectsState.filteredProjects.sort((a, b) => a.name.localeCompare(b.name));
  } else if (ProjectsState.currentSort === 'popularity') {
    ProjectsState.filteredProjects.sort((a, b) => b.popularity - a.popularity);
  } else if (ProjectsState.currentSort === 'marketcap') {
    // 处理非数字市值
    ProjectsState.filteredProjects.sort((a, b) => {
      const valA = parseMarketCap(a.marketCap);
      const valB = parseMarketCap(b.marketCap);
      return valB - valA;
    });
  } else if (ProjectsState.currentSort === 'newest') {
    // 暂时用featured和popularity组合
    ProjectsState.filteredProjects.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.popularity - a.popularity;
    });
  }
  
  renderProjectsGrid();
}

// 解析市值字符串
function parseMarketCap(marketCap) {
  if (!marketCap || marketCap === 'N/A') return 0;
  
  const str = marketCap.toLowerCase();
  let value = parseFloat(str.replace(/[^\d.-]/g, ''));
  
  if (str.includes('t')) value *= 1e12;
  else if (str.includes('b')) value *= 1e9;
  else if (str.includes('m')) value *= 1e6;
  else if (str.includes('k')) value *= 1e3;
  
  return value;
}

// 更新统计显示
function updateStatsDisplay() {
  if (ProjectsDOM.statsTotalProjects) {
    ProjectsDOM.statsTotalProjects.textContent = ProjectsState.stats.totalProjects;
  }
  
  if (ProjectsDOM.statsLayer1) {
    ProjectsDOM.statsLayer1.textContent = ProjectsState.stats.layer1Count;
  }
  
  if (ProjectsDOM.statsDefi) {
    ProjectsDOM.statsDefi.textContent = ProjectsState.stats.defiCount;
  }
  
  if (ProjectsDOM.statsTools) {
    ProjectsDOM.statsTools.textContent = ProjectsState.stats.toolsCount;
  }
}

// 刷新项目
function refreshProjects() {
  console.log('🔄 刷新项目数据');
  
  // 在实际应用中，这里会重新从服务器获取数据
  // 这里只是重新加载
  
  loadProjectsData();
  showMessage('项目数据已刷新');
}

// 清除筛选
function clearFilters() {
  ProjectsState.currentSearch = '';
  ProjectsState.currentCategory = '';
  ProjectsState.currentFilter = 'all';
  ProjectsState.currentSort = 'name';
  
  // 重置UI
  if (ProjectsDOM.searchInput) ProjectsDOM.searchInput.value = '';
  if (ProjectsDOM.categorySelect) ProjectsDOM.categorySelect.value = '';
  if (ProjectsDOM.sortSelect) ProjectsDOM.sortSelect.value = 'name';
  
  ProjectsDOM.filterButtons.forEach(btn => {
    if (btn.getAttribute('data-type') === 'all') {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // 重新筛选和排序
  ProjectsState.filteredProjects = [...ProjectsState.projects];
  sortProjects();
  updateProjectCount();
  renderProjectsGrid();
  
  showMessage('所有筛选已清除');
}

// 设置加载状态
function setLoadingState(isLoading) {
  ProjectsState.isLoading = isLoading;
  
  if (isLoading) {
    console.log('⏳ 项目库加载中...');
  } else {
    console.log('✅ 项目库加载完成');
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
  
  // 在实际实现中，可以显示错误提示
}

// 全局访问
window.initProjectsPage = initProjectsPage;
window.refreshProjects = refreshProjects;
window.clearFilters = clearFilters;
window.filterByCategory = filterByCategory;