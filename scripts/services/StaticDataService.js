// 静态数据服务 - 提供本地静态数据
// 版本: 1.0 - 扩展性架构基础数据源

/**
 * 静态数据服务
 * 提供本地静态数据，用于开发和API不可用时的回退
 * 数据格式与未来API响应格式保持一致
 */
class StaticDataService {
  constructor() {
    this.data = this.loadStaticData();
    this.cache = new Map();
    this.initCache();
  }
  
  // 加载静态数据
  loadStaticData() {
    return {
      // 文章数据
      articles: this.getSampleArticles(),
      
      // 项目数据
      projects: this.getSampleProjects(),
      
      // 数据应用数据
      dashboards: this.getSampleDashboards(),
      
      // 知识库数据
      explore: this.getSampleExploreData(),
      
      // 分析师数据
      analysts: this.getSampleAnalysts(),
      
      // 透明度数据
      transparency: this.getSampleTransparency(),
      
      // 统计数据
      stats: this.getSampleStats(),
      
      // 标签映射
      tags: this.getTagMappings(),
      
      // 分类数据
      categories: this.getCategories()
    };
  }
  
  // 初始化缓存
  initCache() {
    // 预缓存常用数据
    this.cache.set('articles_all', this.data.articles);
    this.cache.set('tags', this.data.tags);
    this.cache.set('stats', this.data.stats);
  }
  
  // ==================== 文章相关方法 ====================
  
  /**
   * 获取文章列表
   * @param {Object} options 选项
   * @param {string} options.tab 标签 (all, reports, alpha, notes, media, reads)
   * @param {string} options.filter 时间筛选 (all, today, week, month)
   * @param {string} options.sort 排序 (newest, popular, trending)
   * @param {number} options.page 页码
   * @param {number} options.limit 每页数量
   * @param {string} options.search 搜索关键词
   * @returns {Array} 文章列表
   */
  getArticles(options = {}) {
    const {
      tab = 'all',
      filter = 'all',
      sort = 'newest',
      page = 1,
      limit = 6,
      search = ''
    } = options;
    
    // 缓存键
    const cacheKey = `articles_${tab}_${filter}_${sort}_${page}_${limit}_${search}`;
    
    // 检查缓存
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    // 基础过滤
    let articles = [...this.data.articles];
    
    // 按标签筛选
    if (tab !== 'all') {
      articles = articles.filter(article => article.delphiTag === tab);
    }
    
    // 按时间筛选
    if (filter !== 'all') {
      articles = this.filterByTime(articles, filter);
    }
    
    // 搜索
    if (search) {
      articles = this.searchArticles(articles, search);
    }
    
    // 排序
    articles = this.sortArticles(articles, sort);
    
    // 分页
    const result = this.paginate(articles, page, limit);
    
    // 缓存结果
    this.cache.set(cacheKey, result);
    
    return result;
  }
  
  /**
   * 获取单个文章
   * @param {string} slug 文章slug
   * @returns {Object|null} 文章数据
   */
  getArticle(slug) {
    return this.data.articles.find(article => article.slug === slug) || null;
  }
  
  /**
   * 获取文章统计
   * @returns {Object} 统计数据
   */
  getArticleStats() {
    const stats = {
      total: this.data.articles.length,
      byTag: {}
    };
    
    // 按标签统计
    this.data.articles.forEach(article => {
      const tag = article.delphiTag || 'all';
      stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
    });
    
    return stats;
  }
  
  // ==================== 项目相关方法 ====================
  
  /**
   * 获取项目列表
   * @param {Object} options 选项
   * @returns {Array} 项目列表
   */
  getProjects(options = {}) {
    const { page = 1, limit = 12, category = '' } = options;
    
    let projects = [...this.data.projects];
    
    // 按分类筛选
    if (category) {
      projects = projects.filter(project => 
        project.categories.includes(category)
      );
    }
    
    // 分页
    return this.paginate(projects, page, limit);
  }
  
  /**
   * 获取单个项目
   * @param {string} slug 项目slug
   * @returns {Object|null} 项目数据
   */
  getProject(slug) {
    return this.data.projects.find(project => project.slug === slug) || null;
  }
  
  /**
   * 获取项目工具数据
   * @param {string} projectSlug 项目slug
   * @param {string} tool 工具名称
   * @returns {Object|null} 工具数据
   */
  getProjectTool(projectSlug, tool) {
    const project = this.getProject(projectSlug);
    if (!project || !project.tools) return null;
    
    return project.tools.find(t => t.id === tool) || null;
  }
  
  // ==================== 数据应用相关方法 ====================
  
  /**
   * 获取数据应用列表
   * @returns {Array} 数据应用列表
   */
  getDashboards() {
    return this.data.dashboards;
  }
  
  /**
   * 获取单个数据应用
   * @param {string} id 数据应用ID
   * @returns {Object|null} 数据应用数据
   */
  getDashboard(id) {
    return this.data.dashboards.find(dashboard => dashboard.id === id) || null;
  }
  
  /**
   * 获取行业表现仪表板数据
   * @returns {Object} 仪表板数据
   */
  getSectorPerformance() {
    return this.getDashboard('sector-performance');
  }
  
  /**
   * 获取BTC游戏理论仪表板数据
   * @returns {Object} 仪表板数据
   */
  getBtcGameTheory() {
    return this.getDashboard('btc-game-theory');
  }
  
  // ==================== 知识库相关方法 ====================
  
  /**
   * 获取知识库数据
   * @param {string} category 分类
   * @param {string} subcategory 子分类
   * @returns {Object} 知识库数据
   */
  getExplore(category = '', subcategory = '') {
    let data = { ...this.data.explore };
    
    // 如果指定了分类
    if (category) {
      const categoryData = data.categories.find(cat => cat.slug === category);
      if (!categoryData) return { categories: [] };
      
      data = { ...data, currentCategory: categoryData };
      
      // 如果指定了子分类
      if (subcategory && categoryData.subcategories) {
        const subcategoryData = categoryData.subcategories.find(
          sub => sub.slug === subcategory
        );
        if (subcategoryData) {
          data.currentSubcategory = subcategoryData;
        }
      }
    }
    
    return data;
  }
  
  // ==================== 分析师相关方法 ====================
  
  /**
   * 获取分析师列表
   * @returns {Array} 分析师列表
   */
  getAnalysts() {
    return this.data.analysts;
  }
  
  /**
   * 获取透明度数据
   * @returns {Object} 透明度数据
   */
  getTransparency() {
    return this.data.transparency;
  }
  
  // ==================== 搜索相关方法 ====================
  
  /**
   * 搜索内容
   * @param {string} query 搜索关键词
   * @param {Object} options 选项
   * @returns {Object} 搜索结果
   */
  search(query, options = {}) {
    const { type = 'all', limit = 20 } = options;
    
    const results = {
      query,
      type,
      articles: [],
      projects: [],
      total: 0
    };
    
    if (!query.trim()) return results;
    
    const searchLower = query.toLowerCase();
    
    // 搜索文章
    if (type === 'all' || type === 'articles') {
      results.articles = this.data.articles.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.description.toLowerCase().includes(searchLower) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // 搜索项目
    if (type === 'all' || type === 'projects') {
      results.projects = this.data.projects.filter(project =>
        project.name.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower)
      );
    }
    
    results.total = results.articles.length + results.projects.length;
    
    // 限制结果数量
    if (limit > 0) {
      results.articles = results.articles.slice(0, limit);
      results.projects = results.projects.slice(0, limit);
    }
    
    return results;
  }
  
  // ==================== 工具方法 ====================
  
  /**
   * 按时间筛选
   * @param {Array} articles 文章列表
   * @param {string} filter 时间筛选器
   * @returns {Array} 筛选后的文章
   */
  filterByTime(articles, filter) {
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (filter) {
      case 'today':
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      default:
        return articles;
    }
    
    return articles.filter(article => {
      const articleDate = new Date(article.publishedDate);
      return articleDate >= cutoffDate;
    });
  }
  
  /**
   * 搜索文章
   * @param {Array} articles 文章列表
   * @param {string} query 搜索词
   * @returns {Array} 搜索结果
   */
  searchArticles(articles, query) {
    if (!query.trim()) return articles;
    
    const searchLower = query.toLowerCase();
    
    return articles.filter(article =>
      article.title.toLowerCase().includes(searchLower) ||
      article.description.toLowerCase().includes(searchLower) ||
      article.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  /**
   * 排序文章
   * @param {Array} articles 文章列表
   * @param {string} sort 排序方式
   * @returns {Array} 排序后的文章
   */
  sortArticles(articles, sort) {
    const sorted = [...articles];
    
    switch (sort) {
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.publishedDate) - new Date(a.publishedDate)
        );
        
      case 'popular':
        return sorted.sort((a, b) => 
          (b.views || 0) - (a.views || 0)
        );
        
      case 'trending':
        // 综合评分：浏览量 + 点赞数 * 2 + 近期权重
        return sorted.sort((a, b) => {
          const scoreA = this.calculateTrendingScore(a);
          const scoreB = this.calculateTrendingScore(b);
          return scoreB - scoreA;
        });
        
      default:
        return sorted;
    }
  }
  
  /**
   * 计算趋势评分
   * @param {Object} article 文章
   * @returns {number} 评分
   */
  calculateTrendingScore(article) {
    const views = article.views || 0;
    const likes = article.likes || 0;
    const date = new Date(article.publishedDate);
    const now = new Date();
    const daysAgo = (now - date) / (1000 * 60 * 60 * 24);
    
    // 近期权重：7天内权重更高
    const recencyWeight = daysAgo <= 7 ? 1.5 : 1;
    
    return (views + likes * 2) * recencyWeight;
  }
  
  /**
   * 分页
   * @param {Array} items 项目列表
   * @param {number} page 页码
   * @param {number} limit 每页数量
   * @returns {Object} 分页结果
   */
  paginate(items, page, limit) {
    const start = (page - 1) * limit;
    const end = start + limit;
    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: items.slice(start, end),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }
  
  // ==================== 数据生成方法 ====================
  
  /**
   * 生成示例文章数据
   * @returns {Array} 文章数据
   */
  getSampleArticles() {
    // 实际数据来自原ContentManager，这里生成示例结构
    // 实际实现会从现有ContentManager迁移
    
    return [
      {
        id: '1',
        slug: 'solana-the-modular',
        title: 'Solana: The Modular Future of Blockchain',
        description: 'An in-depth analysis of Solana architecture and its position in the modular blockchain ecosystem.',
        content: 'Full article content here...',
        category: 'Infrastructure',
        publishedDate: '2026-02-20T10:30:00Z',
        author: 'Alex Thompson',
        views: 12500,
        likes: 420,
        readTime: 12,
        tags: ['Solana', 'Blockchain', 'Modular', 'Infrastructure'],
        delphiTag: 'reports',
        isPremium: false
      },
      {
        id: '2',
        slug: 'bitcoin-etf-flows-analysis',
        title: 'Bitcoin ETF Flows Analysis: Institutional Adoption Trends',
        description: 'Weekly analysis of Bitcoin ETF flows and institutional adoption patterns.',
        content: 'Full article content here...',
        category: 'Finance',
        publishedDate: '2026-02-19T14:20:00Z',
        author: 'Maria Chen',
        views: 8900,
        likes: 310,
        readTime: 8,
        tags: ['Bitcoin', 'ETF', 'Institutional', 'Finance'],
        delphiTag: 'alpha',
        isPremium: true
      },
      // 更多文章...
    ];
  }
  
  /**
   * 生成示例项目数据
   * @returns {Array} 项目数据
   */
  getSampleProjects() {
    return [
      {
        id: 'bitcoin',
        slug: 'bitcoin',
        name: 'Bitcoin',
        description: 'The original cryptocurrency and digital gold standard.',
        icon: '₿',
        categories: ['Store of Value', 'Digital Gold'],
        tools: [
          { id: 'etf-flows', name: 'ETF Flows', description: 'Bitcoin ETF flow analysis' },
          { id: 'top-signal', name: 'Top Signal', description: 'Top trading signals' }
        ],
        metrics: {
          marketCap: '$1.2T',
          price: '$62,450',
          change24h: '+2.3%'
        }
      },
      {
        id: 'ethereum',
        slug: 'ethereum',
        name: 'Ethereum',
        description: 'The leading smart contract platform and decentralized application ecosystem.',
        icon: 'Ξ',
        categories: ['Smart Contracts', 'DeFi'],
        tools: [
          { id: 'layer2-analysis', name: 'Layer 2 Analysis', description: 'Ethereum layer 2 ecosystem analysis' }
        ],
        metrics: {
          marketCap: '$420B',
          price: '$3,450',
          change24h: '+1.8%'
        }
      }
    ];
  }
  
  /**
   * 生成示例数据应用数据
   * @returns {Array} 数据应用数据
   */
  getSampleDashboards() {
    return [
      {
        id: 'sector-performance',
        name: 'Sector Performance Dashboard',
        description: 'Real-time performance metrics across crypto sectors',
        type: 'interactive',
        metrics: ['performance', 'volume', 'dominance'],
        timeframe: '24h'
      },
      {
        id: 'btc-game-theory',
        name: 'BTC Game Theory Dashboard',
        description: 'Bitcoin game theory and on-chain analysis',
        type: 'analytical',
        metrics: ['hodl-waves', 'realized-price', 'mvrv'],
        timeframe: '7d'
      }
    ];
  }
  
  /**
   * 生成示例知识库数据
   * @returns {Object} 知识库数据
   */
  getSampleExploreData() {
    return {
      categories: [
        {
          slug: 'finance',
          name: 'Finance',
          description: 'Financial markets, economics, and investment strategies',
          articleCount: 45,
          subcategories: [
            { slug: 'asset-management', name: 'Asset Management', articleCount: 18 },
            { slug: 'trading', name: 'Trading', articleCount: 22 },
            { slug: 'macro', name: 'Macro Economics', articleCount: 5 }
          ]
        },
        {
          slug: 'infrastructure',
          name: 'Infrastructure',
          description: 'Blockchain infrastructure, protocols, and technology',
          articleCount: 38,
          subcategories: [
            { slug: 'layer-1', name: 'Layer 1 Protocols', articleCount: 15 },
            { slug: 'layer-2', name: 'Layer 2 Solutions', articleCount: 12 },
            { slug: 'oracles', name: 'Oracles', articleCount: 8 },
            { slug: 'artificial-intelligence', name: 'Artificial Intelligence', articleCount: 3 }
          ]
        }
      ],
      featuredArticles: [
        { slug: 'solana-the-modular', title: 'Solana: The Modular Future', category: 'infrastructure' },
        { slug: 'defi-summer-2.0', title: 'DeFi Summer 2.0: What to Expect', category: 'finance' }
      ]
    };
  }
  
  /**
   * 生成示例分析师数据
   * @returns {Array} 分析师数据
   */
  getSampleAnalysts() {
    return [
      {
        id: 'alex-thompson',
        name: 'Alex Thompson',
        title: 'Lead Infrastructure Analyst',
        bio: 'Specializing in blockchain infrastructure and protocol analysis.',
        expertise: ['Infrastructure', 'Layer 1', 'Scalability'],
        articlesCount: 24,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
      },
      {
        id: 'maria-chen',
        name: 'Maria Chen',
        title: 'Financial Markets Analyst',
        bio: 'Focus on cryptocurrency markets and institutional adoption.',
        expertise: ['Finance', 'Trading', 'Institutional'],
        articlesCount: 18,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
      }
    ];
  }
  
  /**
   * 生成示例透明度数据
   * @returns {Object} 透明度数据
   */
  getSampleTransparency() {
    return {
      lastUpdated: '2026-02-25',
      methodology: 'Our analysis uses a combination of on-chain data, market data, and proprietary models.',
      dataSources: ['CoinMetrics', 'Glassnode', 'The Block', 'Proprietary Data'],
      disclosure: 'Delphi Digital may hold positions in assets discussed in research.'
    };
  }
  
  /**
   * 生成示例统计数据
   * @returns {Object} 统计数据
   */
  getSampleStats() {
    return {
      totalArticles: 156,
      totalProjects: 24,
      totalDashboards: 8,
      totalAnalysts: 12,
      monthlyVisitors: '125K',
      countries: 89
    };
  }
  
  /**
   * 获取标签映射
   * @returns {Object} 标签映射
   */
  getTagMappings() {
    return {
      all: 'All',
      reports: 'Reports',
      alpha: 'Alpha Insights',
      notes: 'Notes',
      media: 'Media',
      reads: 'Reads'
    };
  }
  
  /**
   * 获取分类数据
   * @returns {Array} 分类数据
   */
  getCategories() {
    return [
      { id: 'finance', name: 'Finance', color: 'blue' },
      { id: 'infrastructure', name: 'Infrastructure', color: 'green' },
      { id: 'metaverse', name: 'Metaverse', color: 'purple' },
      { id: 'defi', name: 'DeFi', color: 'yellow' },
      { id: 'nft', name: 'NFT', color: 'pink' },
      { id: 'gaming', name: 'Gaming', color: 'red' }
    ];
  }
  
  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear();
    this.initCache();
    console.log('静态数据服务缓存已清除');
  }
  
  /**
   * 获取服务状态
   * @returns {Object} 服务状态
   */
  getStatus() {
    return {
      type: 'static',
      articles: this.data.articles.length,
      projects: this.data.projects.length,
      dashboards: this.data.dashboards.length,
      cacheSize: this.cache.size,
      lastUpdated: new Date().toISOString()
    };
  }
}

// 导出单例实例
const staticDataService = new StaticDataService();

// 全局访问 (兼容现有代码)
if (typeof window !== 'undefined') {
  // 兼容现有ContentManager调用
  window.StaticDataService = staticDataService;
  
  // 临时兼容层 - 将在重构中逐步替换
  window.ContentManager = {
    getArticlesByDelphiTag: (tab) => {
      const result = staticDataService.getArticles({ tab });
      return result.data;
    },
    searchArticles: (query) => {
      const result = staticDataService.search(query);
      return result.articles;
    },
    filterByTime: (filter) => {
      const articles = staticDataService.data.articles;
      return staticDataService.filterByTime(articles, filter);
    },
    sortArticles: (articles, sort) => {
      return staticDataService.sortArticles(articles, sort);
    },
    paginate: (articles, page, limit) => {
      return staticDataService.paginate(articles, page, limit);
    },
    getStats: () => {
      return staticDataService.data.stats;
    },
    getDelphiTags: () => {
      return staticDataService.getTagMappings();
    }
  };
}

export default staticDataService;