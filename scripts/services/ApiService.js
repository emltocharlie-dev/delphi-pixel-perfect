// API服务 - 统一数据服务接口
// 版本: 1.0 - 扩展性架构核心服务

/**
 * API服务基类
 * 提供统一的数据服务接口，支持多数据源切换
 */
class ApiService {
  constructor(config = {}) {
    // 合并配置
    this.config = {
      mode: 'static', // static | api | hybrid
      baseURL: '/api',
      timeout: 15000,
      retryAttempts: 3,
      cacheTTL: 300000, // 5分钟
      enableLogging: true,
      enableMock: false,
      ...config
    };
    
    // 服务实例
    this.staticService = null;
    this.cache = new Map();
    this.pendingRequests = new Map();
    
    // 初始化
    this.initialize();
  }
  
  /**
   * 初始化服务
   */
  initialize() {
    console.log(`🚀 API服务初始化 - 模式: ${this.config.mode}`);
    
    // 加载静态数据服务
    if (typeof window !== 'undefined') {
      import('./StaticDataService.js').then(module => {
        this.staticService = module.default;
        console.log('📦 静态数据服务加载完成');
      }).catch(error => {
        console.error('❌ 静态数据服务加载失败:', error);
      });
    }
    
    // 设置缓存清理定时器
    this.setupCacheCleanup();
    
    // 记录初始化完成
    console.log(`✅ API服务初始化完成 - 当前模式: ${this.config.mode}`);
  }
  
  /**
   * 设置缓存清理
   */
  setupCacheCleanup() {
    // 每5分钟清理过期缓存
    setInterval(() => {
      this.cleanExpiredCache();
    }, 5 * 60 * 1000);
  }
  
  /**
   * 清理过期缓存
   */
  cleanExpiredCache() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt && entry.expiresAt < now) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0 && this.config.enableLogging) {
      console.log(`🧹 清理了 ${cleaned} 个过期缓存项`);
    }
  }
  
  // ==================== 核心数据获取方法 ====================
  
  /**
   * 获取文章列表
   * @param {Object} options 选项
   * @returns {Promise<Object>} 文章数据
   */
  async getArticles(options = {}) {
    return this.fetchData('articles', options, async () => {
      if (this.config.mode === 'static' || !this.config.enableMock) {
        return this.staticService?.getArticles(options) || { data: [], pagination: { total: 0 } };
      }
      
      // API模式 - 模拟实现
      return this.mockApiCall('/articles', options);
    });
  }
  
  /**
   * 获取单个文章
   * @param {string} slug 文章slug
   * @returns {Promise<Object|null>} 文章数据
   */
  async getArticle(slug) {
    return this.fetchData(`article_${slug}`, { slug }, async () => {
      if (this.config.mode === 'static' || !this.config.enableMock) {
        return this.staticService?.getArticle(slug) || null;
      }
      
      // API模式 - 模拟实现
      return this.mockApiCall(`/articles/${slug}`);
    });
  }
  
  /**
   * 获取项目列表
   * @param {Object} options 选项
   * @returns {Promise<Object>} 项目数据
   */
  async getProjects(options = {}) {
    return this.fetchData('projects', options, async () => {
      if (this.config.mode === 'static' || !this.config.enableMock) {
        return this.staticService?.getProjects(options) || { data: [], pagination: { total: 0 } };
      }
      
      // API模式 - 模拟实现
      return this.mockApiCall('/projects', options);
    });
  }
  
  /**
   * 获取单个项目
   * @param {string} slug 项目slug
   * @returns {Promise<Object|null>} 项目数据
   */
  async getProject(slug) {
    return this.fetchData(`project_${slug}`, { slug }, async () => {
      if (this.config.mode === 'static' || !this.config.enableMock) {
        return this.staticService?.getProject(slug) || null;
      }
      
      // API模式 - 模拟实现
      return this.mockApiCall(`/projects/${slug}`);
    });
  }
  
  /**
   * 获取项目工具数据
   * @param {string} projectSlug 项目slug
   * @param {string} tool 工具名称
   * @returns {Promise<Object|null>} 工具数据
   */
  async getProjectTool(projectSlug, tool) {
    const cacheKey = `project_tool_${projectSlug}_${tool}`;
    
    return this.fetchData(cacheKey, { projectSlug, tool }, async () => {
      if (this.config.mode === 'static' || !this.config.enableMock) {
        return this.staticService?.getProjectTool(projectSlug, tool) || null;
      }
      
      // API模式 - 模拟实现
      return this.mockApiCall(`/projects/${projectSlug}/tools/${tool}`);
    });
  }
  
  /**
   * 获取数据应用列表
   * @returns {Promise<Array>} 数据应用列表
   */
  async getDashboards() {
    return this.fetchData('dashboards', {}, async () => {
      if (this.config.mode === 'static' || !this.config.enableMock) {
        return this.staticService?.getDashboards() || [];
      }
      
      // API模式 - 模拟实现
      return this.mockApiCall('/dashboards');
    });
  }
  
  /**
   * 获取行业表现仪表板
   * @returns {Promise<Object|null>} 仪表板数据
   */
  async getSectorPerformance() {
    return this.fetchData('dashboard_sector_performance', {}, async () => {
      if (this.config.mode === 'static' || !this.config.enableMock) {
        return this.staticService?.getSectorPerformance() || null;
      }
      
      // API模式 - 模拟实现
      return this.mockApiCall('/dashboards/sector-performance');
    });
  }
  
  /**
   * 获取BTC游戏理论仪表板
   * @returns {Promise<Object|null>} 仪表板数据
   */
  async getBtcGameTheory() {
    return this.fetchData('dashboard_btc_game_theory', {}, async () => {
      if (this.config.mode === 'static' || !this.config.enableMock) {
        return this.staticService?.getBtcGameTheory() || null;
      }
      
      // API模式 - 模拟实现
      return this.mockApiCall('/dashboards/btc-game-theory');
    });
  }
  
  /**
   * 获取知识库数据
   * @param {string} category 分类
   * @param {string} subcategory 子分类
   * @returns {Promise<Object>} 知识库数据
   */
  async getExplore(category = '', subcategory = '') {
    const cacheKey = `explore_${category}_${subcategory}`;
    
    return this.fetchData(cacheKey, { category, subcategory }, async () => {
      if (this.config.mode === 'static' || !this.config.enableMock) {
        return this.staticService?.getExplore(category, subcategory) || { categories: [] };
      }
      
      // API模式 - 模拟实现
      const endpoint = subcategory 
        ? `/explore/${category}/${subcategory}`
        : category
        ? `/explore/${category}`
        : '/explore';
      
      return this.mockApiCall(endpoint);
    });
  }
  
  /**
   * 获取分析师列表
   * @returns {Promise<Array>} 分析师列表
   */
  async getAnalysts() {
    return this.fetchData('analysts', {}, async () => {
      if (this.config.mode === 'static' || !this.config.enableMock) {
        return this.staticService?.getAnalysts() || [];
      }
      
      // API模式 - 模拟实现
      return this.mockApiCall('/analysts');
    });
  }
  
  /**
   * 获取透明度数据
   * @returns {Promise<Object>} 透明度数据
   */
  async getTransparency() {
    return this.fetchData('transparency', {}, async () => {
      if (this.config.mode === 'static' || !this.config.enableMock) {
        return this.staticService?.getTransparency() || {};
      }
      
      // API模式 - 模拟实现
      return this.mockApiCall('/transparency');
    });
  }
  
  /**
   * 搜索内容
   * @param {string} query 搜索词
   * @param {Object} options 选项
   * @returns {Promise<Object>} 搜索结果
   */
  async search(query, options = {}) {
    const cacheKey = `search_${query}_${JSON.stringify(options)}`;
    
    // 搜索不缓存，或缓存时间很短
    return this.fetchData(cacheKey, { query, ...options }, async () => {
      if (this.config.mode === 'static' || !this.config.enableMock) {
        return this.staticService?.search(query, options) || { results: [], total: 0 };
      }
      
      // API模式 - 模拟实现
      return this.mockApiCall('/search', { q: query, ...options });
    }, 60000); // 搜索缓存1分钟
  }
  
  /**
   * 获取统计数据
   * @returns {Promise<Object>} 统计数据
   */
  async getStats() {
    return this.fetchData('stats', {}, async () => {
      if (this.config.mode === 'static' || !this.config.enableMock) {
        return this.staticService?.data.stats || {};
      }
      
      // API模式 - 模拟实现
      return this.mockApiCall('/stats');
    }, 300000); // 统计缓存5分钟
  }
  
  // ==================== 核心工具方法 ====================
  
  /**
   * 统一数据获取方法
   * @param {string} cacheKey 缓存键
   * @param {Object} params 参数
   * @param {Function} fetchFn 数据获取函数
   * @param {number} ttl 缓存时间 (毫秒)
   * @returns {Promise<any>} 数据
   */
  async fetchData(cacheKey, params, fetchFn, ttl = null) {
    // 使用提供的TTL或默认配置
    const cacheTTL = ttl || this.config.cacheTTL;
    
    // 检查缓存
    if (cacheTTL > 0) {
      const cached = this.getFromCache(cacheKey);
      if (cached !== null) {
        if (this.config.enableLogging) {
          console.log(`📦 缓存命中: ${cacheKey}`);
        }
        return cached;
      }
    }
    
    // 检查重复请求
    if (this.pendingRequests.has(cacheKey)) {
      if (this.config.enableLogging) {
        console.log(`⏳ 等待重复请求: ${cacheKey}`);
      }
      return this.pendingRequests.get(cacheKey);
    }
    
    // 创建请求Promise
    const requestPromise = (async () => {
      try {
        if (this.config.enableLogging) {
          console.log(`🚀 获取数据: ${cacheKey}`, params);
        }
        
        // 执行数据获取
        const data = await fetchFn();
        
        // 缓存结果
        if (cacheTTL > 0 && data !== null && data !== undefined) {
          this.setCache(cacheKey, data, cacheTTL);
        }
        
        return data;
      } catch (error) {
        console.error(`❌ 数据获取失败: ${cacheKey}`, error);
        throw error;
      } finally {
        // 清理pending请求
        this.pendingRequests.delete(cacheKey);
      }
    })();
    
    // 存储pending请求
    this.pendingRequests.set(cacheKey, requestPromise);
    
    return requestPromise;
  }
  
  /**
   * 从缓存获取数据
   * @param {string} key 缓存键
   * @returns {any|null} 缓存数据
   */
  getFromCache(key) {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // 检查是否过期
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  /**
   * 设置缓存
   * @param {string} key 缓存键
   * @param {any} data 数据
   * @param {number} ttl 存活时间 (毫秒)
   */
  setCache(key, data, ttl) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { data, expiresAt });
    
    if (this.config.enableLogging) {
      console.log(`💾 缓存设置: ${key}, 过期时间: ${new Date(expiresAt).toLocaleTimeString()}`);
    }
  }
  
  /**
   * 清除指定缓存
   * @param {string} key 缓存键 (支持通配符)
   */
  clearCache(key = null) {
    if (!key) {
      this.cache.clear();
      console.log('🧹 所有缓存已清除');
      return;
    }
    
    // 支持通配符清除
    if (key.includes('*')) {
      const pattern = new RegExp(key.replace(/\*/g, '.*'));
      let cleared = 0;
      
      for (const cacheKey of this.cache.keys()) {
        if (pattern.test(cacheKey)) {
          this.cache.delete(cacheKey);
          cleared++;
        }
      }
      
      console.log(`🧹 清除了 ${cleared} 个匹配 ${key} 的缓存项`);
    } else {
      this.cache.delete(key);
      console.log(`🧹 缓存 ${key} 已清除`);
    }
  }
  
  /**
   * 模拟API调用
   * @param {string} endpoint 端点
   * @param {Object} params 参数
   * @returns {Promise<any>} 模拟数据
   */
  async mockApiCall(endpoint, params = {}) {
    if (this.config.enableLogging) {
      console.log(`🤖 模拟API调用: ${endpoint}`, params);
    }
    
    // 模拟延迟
    await this.delay(this.config.enableMock ? 300 : 0);
    
    // 基于端点和参数返回模拟数据
    switch (endpoint) {
      case '/articles':
        return this.staticService?.getArticles(params) || { data: [], pagination: { total: 0 } };
        
      case '/projects':
        return this.staticService?.getProjects(params) || { data: [], pagination: { total: 0 } };
        
      case '/dashboards':
        return this.staticService?.getDashboards() || [];
        
      case '/dashboards/sector-performance':
        return this.staticService?.getSectorPerformance() || null;
        
      case '/dashboards/btc-game-theory':
        return this.staticService?.getBtcGameTheory() || null;
        
      case '/explore':
        return this.staticService?.getExplore() || { categories: [] };
        
      case '/analysts':
        return this.staticService?.getAnalysts() || [];
        
      case '/transparency':
        return this.staticService?.getTransparency() || {};
        
      case '/search':
        return this.staticService?.search(params.q || '', params) || { results: [], total: 0 };
        
      case '/stats':
        return this.staticService?.data.stats || {};
        
      default:
        // 处理动态端点 (如 /articles/:slug)
        if (endpoint.startsWith('/articles/')) {
          const slug = endpoint.split('/articles/')[1];
          return this.staticService?.getArticle(slug) || null;
        }
        
        if (endpoint.startsWith('/projects/')) {
          const slug = endpoint.split('/projects/')[1];
          return this.staticService?.getProject(slug) || null;
        }
        
        if (endpoint.startsWith('/explore/')) {
          const path = endpoint.split('/explore/')[1];
          const parts = path.split('/');
          const category = parts[0];
          const subcategory = parts[1];
          return this.staticService?.getExplore(category, subcategory) || { categories: [] };
        }
        
        // 默认返回空数据
        return null;
    }
  }
  
  /**
   * 延迟函数
   * @param {number} ms 毫秒
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * 获取服务状态
   * @returns {Object} 服务状态
   */
  getStatus() {
    return {
      mode: this.config.mode,
      baseURL: this.config.baseURL,
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      staticService: this.staticService ? 'loaded' : 'not-loaded',
      lastUpdated: new Date().toISOString()
    };
  }
  
  /**
   * 切换数据模式
   * @param {string} mode 模式 (static | api | hybrid)
   */
  setMode(mode) {
    const validModes = ['static', 'api', 'hybrid'];
    
    if (!validModes.includes(mode)) {
      console.error(`❌ 无效的模式: ${mode}, 有效值: ${validModes.join(', ')}`);
      return;
    }
    
    this.config.mode = mode;
    console.log(`🔄 数据模式切换为: ${mode}`);
    
    // 切换模式时清除缓存
    this.clearCache();
    
    // 触发模式变更事件
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('api:modeChanged', { detail: { mode } });
      window.dispatchEvent(event);
    }
  }
  
  /**
   * 更新配置
   * @param {Object} newConfig 新配置
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ 配置已更新', this.config);
  }
}

// 创建全局单例
let apiServiceInstance = null;

/**
 * 获取API服务实例
 * @param {Object} config 配置
 * @returns {ApiService} API服务实例
 */
function getApiService(config = {}) {
  if (!apiServiceInstance) {
    // 合并默认配置
    const defaultConfig = {
      mode: 'static',
      baseURL: '/api',
      timeout: 15000,
      retryAttempts: 3,
      cacheTTL: 300000,
      enableLogging: true,
      enableMock: true
    };
    
    apiServiceInstance = new ApiService({ ...defaultConfig, ...config });
  }
  
  return apiServiceInstance;
}

// 全局访问
if (typeof window !== 'undefined') {
  window.getApiService = getApiService;
  window.ApiService = ApiService;
}

export { ApiService, getApiService };
export default getApiService();