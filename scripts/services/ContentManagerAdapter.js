// ContentManager适配器 - 向后兼容层
// 版本: 1.0 - 将现有ContentManager调用适配到新API服务

/**
 * ContentManager适配器
 * 提供与现有ContentManager API兼容的接口
 * 逐步迁移到新的API服务架构
 */
class ContentManagerAdapter {
  constructor() {
    this.apiService = null;
    this.initialized = false;
    this.init();
  }
  
  /**
   * 初始化适配器
   */
  async init() {
    try {
      // 动态导入API服务
      const { getApiService } = await import('./ApiService.js');
      this.apiService = getApiService();
      this.initialized = true;
      
      console.log('✅ ContentManager适配器初始化完成');
    } catch (error) {
      console.error('❌ ContentManager适配器初始化失败:', error);
      
      // 回退到静态数据服务
      await this.fallbackToStaticService();
    }
  }
  
  /**
   * 回退到静态数据服务
   */
  async fallbackToStaticService() {
    try {
      const module = await import('./StaticDataService.js');
      this.apiService = {
        getArticles: (options) => Promise.resolve(module.default.getArticles(options)),
        search: (query) => Promise.resolve(module.default.search(query)),
        getStats: () => Promise.resolve(module.default.data.stats)
      };
      this.initialized = true;
      console.log('🔄 回退到静态数据服务');
    } catch (error) {
      console.error('❌ 静态数据服务回退失败:', error);
    }
  }
  
  /**
   * 等待初始化完成
   */
  async waitForInit() {
    if (this.initialized) return true;
    
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.initialized) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 100);
      
      // 5秒超时
      setTimeout(() => {
        clearInterval(checkInterval);
        console.warn('⚠️ ContentManager适配器初始化超时');
        resolve(false);
      }, 5000);
    });
  }
  
  // ==================== 兼容现有API ====================
  
  /**
   * 获取文章列表 (兼容现有调用)
   * @param {string} tab 标签
   * @returns {Array} 文章列表
   */
  async getArticlesByDelphiTag(tab) {
    await this.waitForInit();
    
    if (!this.apiService) {
      console.warn('⚠️ API服务未初始化，返回空数组');
      return [];
    }
    
    try {
      const result = await this.apiService.getArticles({ tab });
      return result.data || [];
    } catch (error) {
      console.error('❌ getArticlesByDelphiTag失败:', error);
      return [];
    }
  }
  
  /**
   * 搜索文章 (兼容现有调用)
   * @param {string} query 搜索词
   * @returns {Array} 搜索结果
   */
  async searchArticles(query) {
    await this.waitForInit();
    
    if (!this.apiService) {
      console.warn('⚠️ API服务未初始化，返回空数组');
      return [];
    }
    
    try {
      const result = await this.apiService.search(query, { type: 'articles' });
      return result.articles || [];
    } catch (error) {
      console.error('❌ searchArticles失败:', error);
      return [];
    }
  }
  
  /**
   * 按时间筛选 (兼容现有调用)
   * @param {string} filter 时间筛选器
   * @returns {Array} 筛选后的文章
   */
  async filterByTime(filter) {
    await this.waitForInit();
    
    if (!this.apiService) {
      console.warn('⚠️ API服务未初始化，返回空数组');
      return [];
    }
    
    try {
      // 注意：现有API期望返回完整数组，但新API需要原始数据
      // 这里获取所有文章然后筛选
      const result = await this.apiService.getArticles({ filter });
      return result.data || [];
    } catch (error) {
      console.error('❌ filterByTime失败:', error);
      return [];
    }
  }
  
  /**
   * 排序文章 (兼容现有调用)
   * @param {Array} articles 文章列表
   * @param {string} sort 排序方式
   * @returns {Array} 排序后的文章
   */
  sortArticles(articles, sort) {
    // 使用静态数据服务的排序逻辑
    try {
      // 动态导入静态服务工具方法
      if (typeof window !== 'undefined' && window.StaticDataService) {
        return window.StaticDataService.sortArticles(articles, sort);
      }
      
      // 简单降级排序
      return this.fallbackSort(articles, sort);
    } catch (error) {
      console.error('❌ sortArticles失败，使用降级排序:', error);
      return this.fallbackSort(articles, sort);
    }
  }
  
  /**
   * 降级排序
   */
  fallbackSort(articles, sort) {
    const sorted = [...articles];
    
    switch (sort) {
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.publishedDate || 0) - new Date(a.publishedDate || 0)
        );
        
      case 'popular':
        return sorted.sort((a, b) => 
          (b.views || 0) - (a.views || 0)
        );
        
      default:
        return sorted;
    }
  }
  
  /**
   * 分页 (兼容现有调用)
   * @param {Array} articles 文章列表
   * @param {number} page 页码
   * @param {number} limit 每页数量
   * @returns {Object} 分页结果
   */
  paginate(articles, page, limit) {
    try {
      // 使用静态数据服务的分页逻辑
      if (typeof window !== 'undefined' && window.StaticDataService) {
        return window.StaticDataService.paginate(articles, page, limit);
      }
      
      // 简单降级分页
      return this.fallbackPaginate(articles, page, limit);
    } catch (error) {
      console.error('❌ paginate失败，使用降级分页:', error);
      return this.fallbackPaginate(articles, page, limit);
    }
  }
  
  /**
   * 降级分页
   */
  fallbackPaginate(articles, page, limit) {
    const start = (page - 1) * limit;
    const end = start + limit;
    const total = articles.length;
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: articles.slice(start, end),
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
  
  /**
   * 获取统计数据 (兼容现有调用)
   * @returns {Object} 统计数据
   */
  async getStats() {
    await this.waitForInit();
    
    if (!this.apiService) {
      console.warn('⚠️ API服务未初始化，返回空对象');
      return {};
    }
    
    try {
      return await this.apiService.getStats();
    } catch (error) {
      console.error('❌ getStats失败:', error);
      return {};
    }
  }
  
  /**
   * 获取标签映射 (兼容现有调用)
   * @returns {Object} 标签映射
   */
  getDelphiTags() {
    // 硬编码标签映射，与现有代码匹配
    return {
      all: 'All',
      reports: 'Reports',
      alpha: 'Alpha Insights',
      notes: 'Notes',
      media: 'Media',
      reads: 'Reads'
    };
  }
  
  // ==================== 新API方法 (逐步迁移) ====================
  
  /**
   * 获取文章数据 (新API)
   * @param {Object} options 选项
   * @returns {Promise<Object>} 文章数据
   */
  async getArticles(options = {}) {
    await this.waitForInit();
    
    if (!this.apiService) {
      console.warn('⚠️ API服务未初始化，返回空数据');
      return { data: [], pagination: { total: 0 } };
    }
    
    try {
      return await this.apiService.getArticles(options);
    } catch (error) {
      console.error('❌ getArticles失败:', error);
      return { data: [], pagination: { total: 0 } };
    }
  }
  
  /**
   * 获取项目数据 (新API)
   * @param {Object} options 选项
   * @returns {Promise<Object>} 项目数据
   */
  async getProjects(options = {}) {
    await this.waitForInit();
    
    if (!this.apiService) {
      console.warn('⚠️ API服务未初始化，返回空数据');
      return { data: [], pagination: { total: 0 } };
    }
    
    try {
      return await this.apiService.getProjects(options);
    } catch (error) {
      console.error('❌ getProjects失败:', error);
      return { data: [], pagination: { total: 0 } };
    }
  }
  
  /**
   * 获取搜索数据 (新API)
   * @param {string} query 搜索词
   * @param {Object} options 选项
   * @returns {Promise<Object>} 搜索数据
   */
  async search(query, options = {}) {
    await this.waitForInit();
    
    if (!this.apiService) {
      console.warn('⚠️ API服务未初始化，返回空数据');
      return { results: [], total: 0 };
    }
    
    try {
      return await this.apiService.search(query, options);
    } catch (error) {
      console.error('❌ search失败:', error);
      return { results: [], total: 0 };
    }
  }
  
  /**
   * 获取服务状态
   * @returns {Object} 服务状态
   */
  getStatus() {
    return {
      initialized: this.initialized,
      apiService: this.apiService ? 'available' : 'unavailable',
      mode: this.apiService?.config?.mode || 'unknown'
    };
  }
}

// 创建全局单例
let contentManagerAdapterInstance = null;

/**
 * 获取ContentManager适配器实例
 * @returns {ContentManagerAdapter} 适配器实例
 */
function getContentManagerAdapter() {
  if (!contentManagerAdapterInstance) {
    contentManagerAdapterInstance = new ContentManagerAdapter();
  }
  
  return contentManagerAdapterInstance;
}

// 全局兼容层
if (typeof window !== 'undefined') {
  // 创建代理对象，保持与现有ContentManager相同的API
  const contentManagerProxy = {
    // 现有API
    getArticlesByDelphiTag: function(tab) {
      const adapter = getContentManagerAdapter();
      return adapter.getArticlesByDelphiTag(tab);
    },
    
    searchArticles: function(query) {
      const adapter = getContentManagerAdapter();
      return adapter.searchArticles(query);
    },
    
    filterByTime: function(filter) {
      const adapter = getContentManagerAdapter();
      return adapter.filterByTime(filter);
    },
    
    sortArticles: function(articles, sort) {
      const adapter = getContentManagerAdapter();
      return adapter.sortArticles(articles, sort);
    },
    
    paginate: function(articles, page, limit) {
      const adapter = getContentManagerAdapter();
      return adapter.paginate(articles, page, limit);
    },
    
    getStats: function() {
      const adapter = getContentManagerAdapter();
      return adapter.getStats();
    },
    
    getDelphiTags: function() {
      const adapter = getContentManagerAdapter();
      return adapter.getDelphiTags();
    },
    
    // 新API (可通过ContentManager.newApi访问)
    newApi: {
      getArticles: function(options) {
        const adapter = getContentManagerAdapter();
        return adapter.getArticles(options);
      },
      
      getProjects: function(options) {
        const adapter = getContentManagerAdapter();
        return adapter.getProjects(options);
      },
      
      search: function(query, options) {
        const adapter = getContentManagerAdapter();
        return adapter.search(query, options);
      },
      
      getStatus: function() {
        const adapter = getContentManagerAdapter();
        return adapter.getStatus();
      }
    }
  };
  
  // 设置全局ContentManager
  window.ContentManager = contentManagerProxy;
  
  console.log('🔌 ContentManager兼容层已安装');
}

export { ContentManagerAdapter, getContentManagerAdapter };
export default getContentManagerAdapter();