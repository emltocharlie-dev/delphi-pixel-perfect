// 应用初始化脚本 - 扩展性架构启动器
// 版本: 1.0 - 管理数据服务初始化

console.log('🚀 Delphi Digital扩展性架构初始化开始...');

/**
 * 应用初始化管理器
 */
class AppInitializer {
  constructor() {
    this.services = {
      config: null,
      staticData: null,
      api: null,
      adapter: null
    };
    
    this.initialized = false;
    this.initPromise = null;
  }
  
  /**
   * 初始化所有服务
   * @returns {Promise<boolean>} 初始化是否成功
   */
  async initialize() {
    if (this.initPromise) {
      return this.initPromise;
    }
    
    this.initPromise = (async () => {
      try {
        console.group('🔧 服务初始化');
        
        // 1. 加载配置系统
        await this.loadConfig();
        
        // 2. 加载静态数据服务
        await this.loadStaticDataService();
        
        // 3. 加载API服务
        await this.loadApiService();
        
        // 4. 加载适配器
        await this.loadAdapter();
        
        // 5. 验证服务状态
        await this.validateServices();
        
        this.initialized = true;
        
        console.groupEnd();
        console.log('✅ 所有服务初始化完成');
        
        return true;
      } catch (error) {
        console.error('❌ 服务初始化失败:', error);
        console.groupEnd();
        return false;
      }
    })();
    
    return this.initPromise;
  }
  
  /**
   * 加载配置系统
   */
  async loadConfig() {
    try {
      console.log('📋 加载配置系统...');
      
      // 检查是否已通过模块加载
      if (window.AppConfig) {
        this.services.config = window.AppConfig;
        console.log('✅ 配置系统已加载 (全局)');
        return;
      }
      
      // 尝试动态导入
      try {
        const module = await import('./config/config.js');
        this.services.config = module.default;
        console.log('✅ 配置系统已加载 (模块)');
      } catch (moduleError) {
        console.warn('⚠️ 模块加载失败，创建默认配置:', moduleError);
        this.createDefaultConfig();
      }
    } catch (error) {
      console.error('❌ 配置系统加载失败:', error);
      this.createDefaultConfig();
    }
  }
  
  /**
   * 创建默认配置
   */
  createDefaultConfig() {
    this.services.config = {
      environment: 'development',
      dataSource: {
        mode: 'static',
        apiBaseURL: '/api',
        staticDataPath: '/data/',
        cacheTTL: 300000,
        enableLogging: true
      },
      features: {
        enableSearch: true,
        enableExplore: true,
        enableBookmarks: true,
        enableProjects: true,
        enableHelp: true
      }
    };
    
    console.log('📋 使用默认配置');
  }
  
  /**
   * 加载静态数据服务
   */
  async loadStaticDataService() {
    try {
      console.log('📦 加载静态数据服务...');
      
      // 检查是否已全局加载
      if (window.StaticDataService) {
        this.services.staticData = window.StaticDataService;
        console.log('✅ 静态数据服务已加载 (全局)');
        return;
      }
      
      // 尝试动态导入
      try {
        const module = await import('./services/StaticDataService.js');
        this.services.staticData = module.default;
        console.log('✅ 静态数据服务已加载 (模块)');
      } catch (moduleError) {
        console.error('❌ 静态数据服务模块加载失败:', moduleError);
        throw new Error('静态数据服务加载失败');
      }
    } catch (error) {
      console.error('❌ 静态数据服务加载失败:', error);
      throw error;
    }
  }
  
  /**
   * 加载API服务
   */
  async loadApiService() {
    try {
      console.log('🌐 加载API服务...');
      
      // 检查是否已全局加载
      if (window.getApiService) {
        this.services.api = window.getApiService();
        console.log('✅ API服务已加载 (全局)');
        return;
      }
      
      // 尝试动态导入
      try {
        const module = await import('./services/ApiService.js');
        this.services.api = module.default;
        console.log('✅ API服务已加载 (模块)');
      } catch (moduleError) {
        console.error('❌ API服务模块加载失败:', moduleError);
        console.warn('⚠️ 使用静态数据服务作为API服务回退');
        this.services.api = {
          getArticles: (options) => Promise.resolve(
            this.services.staticData.getArticles(options)
          ),
          getProjects: (options) => Promise.resolve(
            this.services.staticData.getProjects(options)
          ),
          search: (query, options) => Promise.resolve(
            this.services.staticData.search(query, options)
          ),
          getStats: () => Promise.resolve(
            this.services.staticData.data.stats
          ),
          config: { mode: 'static' }
        };
      }
    } catch (error) {
      console.error('❌ API服务加载失败:', error);
      throw error;
    }
  }
  
  /**
   * 加载适配器
   */
  async loadAdapter() {
    try {
      console.log('🔌 加载ContentManager适配器...');
      
      // 检查是否已全局加载 (适配器会自动设置window.ContentManager)
      if (window.ContentManager && window.ContentManager.newApi) {
        this.services.adapter = window.ContentManager;
        console.log('✅ ContentManager适配器已加载 (全局)');
        return;
      }
      
      // 尝试动态导入
      try {
        const module = await import('./services/ContentManagerAdapter.js');
        // 适配器会自动注册到window.ContentManager
        await new Promise(resolve => setTimeout(resolve, 100)); // 等待注册
        
        if (window.ContentManager) {
          this.services.adapter = window.ContentManager;
          console.log('✅ ContentManager适配器已加载 (模块)');
        } else {
          throw new Error('适配器未注册到全局');
        }
      } catch (moduleError) {
        console.error('❌ 适配器模块加载失败:', moduleError);
        this.createFallbackAdapter();
      }
    } catch (error) {
      console.error('❌ 适配器加载失败:', error);
      this.createFallbackAdapter();
    }
  }
  
  /**
   * 创建回退适配器
   */
  createFallbackAdapter() {
    console.warn('⚠️ 创建回退适配器');
    
    // 简单回退适配器
    this.services.adapter = {
      getArticlesByDelphiTag: async (tab) => {
        const result = this.services.staticData.getArticles({ tab });
        return result.data || [];
      },
      searchArticles: async (query) => {
        const result = this.services.staticData.search(query);
        return result.articles || [];
      },
      filterByTime: async (filter) => {
        const articles = this.services.staticData.data.articles;
        return this.services.staticData.filterByTime(articles, filter);
      },
      sortArticles: (articles, sort) => {
        return this.services.staticData.sortArticles(articles, sort);
      },
      paginate: (articles, page, limit) => {
        return this.services.staticData.paginate(articles, page, limit);
      },
      getStats: async () => {
        return this.services.staticData.data.stats;
      },
      getDelphiTags: () => {
        return {
          all: 'All',
          reports: 'Reports',
          alpha: 'Alpha Insights',
          notes: 'Notes',
          media: 'Media',
          reads: 'Reads'
        };
      }
    };
    
    // 注册到全局
    window.ContentManager = this.services.adapter;
  }
  
  /**
   * 验证服务状态
   */
  async validateServices() {
    console.log('🔍 验证服务状态...');
    
    const validations = [
      { name: '配置系统', service: this.services.config },
      { name: '静态数据服务', service: this.services.staticData },
      { name: 'API服务', service: this.services.api },
      { name: '适配器', service: this.services.adapter }
    ];
    
    let allValid = true;
    
    for (const validation of validations) {
      if (!validation.service) {
        console.error(`❌ ${validation.name} 未加载`);
        allValid = false;
      } else {
        console.log(`✅ ${validation.name} 状态正常`);
      }
    }
    
    if (!allValid) {
      throw new Error('服务验证失败');
    }
    
    // 输出服务状态
    console.log('📊 服务状态摘要:');
    console.log(`   数据模式: ${this.services.api?.config?.mode || 'static'}`);
    console.log(`   文章数量: ${this.services.staticData?.data?.articles?.length || 0}`);
    console.log(`   缓存大小: ${this.services.api?.cache?.size || 0}`);
  }
  
  /**
   * 获取服务状态
   * @returns {Object} 服务状态
   */
  getStatus() {
    return {
      initialized: this.initialized,
      services: {
        config: !!this.services.config,
        staticData: !!this.services.staticData,
        api: !!this.services.api,
        adapter: !!this.services.adapter
      },
      dataMode: this.services.api?.config?.mode || 'unknown',
      articleCount: this.services.staticData?.data?.articles?.length || 0
    };
  }
  
  /**
   * 等待初始化完成
   * @param {number} timeout 超时时间(毫秒)
   * @returns {Promise<boolean>} 是否初始化成功
   */
  async waitForInitialization(timeout = 10000) {
    if (this.initialized) {
      return true;
    }
    
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const checkInterval = setInterval(() => {
        if (this.initialized) {
          clearInterval(checkInterval);
          resolve(true);
        }
        
        // 检查超时
        if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          console.warn(`⚠️ 初始化等待超时 (${timeout}ms)`);
          resolve(false);
        }
      }, 100);
    });
  }
}

// 创建全局初始化器
const appInitializer = new AppInitializer();

// 立即开始初始化 (非阻塞)
const initPromise = appInitializer.initialize();

// 全局访问
window.AppInitializer = appInitializer;

// 添加就绪事件
window.addEventListener('DOMContentLoaded', async () => {
  console.log('📄 DOM内容加载完成，等待服务初始化...');
  
  const initialized = await initPromise;
  
  if (initialized) {
    console.log('🎉 应用初始化完成，准备启动主应用');
    
    // 触发自定义事件，通知app.js可以启动
    const event = new CustomEvent('app:servicesReady', {
      detail: appInitializer.getStatus()
    });
    window.dispatchEvent(event);
  } else {
    console.error('❌ 应用初始化失败，主应用可能无法正常工作');
    
    // 触发错误事件
    const event = new CustomEvent('app:servicesFailed', {
      detail: { error: '服务初始化失败' }
    });
    window.dispatchEvent(event);
  }
});

// 导出
export default appInitializer;