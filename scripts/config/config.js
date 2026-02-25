// 配置文件 - 环境感知配置系统
// 版本: 1.0 - 扩展性架构基础

/**
 * 配置系统 - 环境感知配置管理
 * 支持多环境: development, staging, production
 * 支持数据源模式: static, hybrid, api
 */
const Config = {
  // 当前版本
  version: '1.0.0',
  
  // 环境检测
  getEnvironment() {
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // 本地开发环境
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }
    
    // Cloudflare Pages 环境
    if (hostname.includes('.pages.dev')) {
      return 'staging';
    }
    
    // 生产环境 (假设自定义域名)
    return 'production';
  },
  
  // 数据源配置
  getDataSourceConfig() {
    const env = this.getEnvironment();
    
    const configs = {
      development: {
        mode: 'static', // 开发期用静态数据，快速开发
        apiBaseURL: 'http://localhost:3000/api',
        staticDataPath: '/data/',
        cacheTTL: 300000, // 5分钟缓存
        retryAttempts: 3,
        timeout: 10000, // 10秒超时
        enableLogging: true,
        enableMockApi: true // 启用API模拟
      },
      staging: {
        mode: 'hybrid', // 混合模式：API优先，静态回退
        apiBaseURL: 'https://staging-api.delphidigital.io/api',
        staticDataPath: '/data/',
        cacheTTL: 600000, // 10分钟缓存
        retryAttempts: 2,
        timeout: 15000,
        enableLogging: true,
        enableMockApi: false
      },
      production: {
        mode: 'api', // 生产环境全API
        apiBaseURL: 'https://api.delphidigital.io/api',
        staticDataPath: '/data/fallback/', // 仅用于紧急回退
        cacheTTL: 900000, // 15分钟缓存
        retryAttempts: 1,
        timeout: 20000,
        enableLogging: false,
        enableMockApi: false
      }
    };
    
    return configs[env] || configs.development;
  },
  
  // 功能开关配置
  getFeatureFlags() {
    const env = this.getEnvironment();
    
    const flags = {
      development: {
        // 侧边导航页面功能
        enableSearch: true,
        enableExplore: true,
        enableBookmarks: true,
        enableProjects: true,
        enableHelp: true,
        
        // 其他模块功能
        enableDataApps: true,
        enableAnalysts: true,
        enableTransparency: true,
        enableLegal: true,
        
        // 高级功能
        enableApiFallback: true,
        enableOfflineMode: false,
        enableAnalytics: false,
        enablePerformanceMonitoring: true
      },
      staging: {
        enableSearch: true,
        enableExplore: true,
        enableBookmarks: true,
        enableProjects: true,
        enableHelp: true,
        enableDataApps: true,
        enableAnalysts: true,
        enableTransparency: true,
        enableLegal: true,
        enableApiFallback: true,
        enableOfflineMode: false,
        enableAnalytics: true,
        enablePerformanceMonitoring: true
      },
      production: {
        enableSearch: true,
        enableExplore: true,
        enableBookmarks: true,
        enableProjects: true,
        enableHelp: true,
        enableDataApps: true,
        enableAnalysts: true,
        enableTransparency: true,
        enableLegal: true,
        enableApiFallback: false, // 生产环境依赖API
        enableOfflineMode: false,
        enableAnalytics: true,
        enablePerformanceMonitoring: true
      }
    };
    
    return flags[env] || flags.development;
  },
  
  // 侧边导航配置
  getSideNavConfig() {
    return {
      // 导航项顺序 (按用户要求)
      items: [
        { id: 'home', label: 'home', path: '/', icon: 'home', enabled: true },
        { id: 'research', label: 'Research', path: '/search', icon: 'search', enabled: true },
        { id: 'library', label: 'Library', path: '/explore', icon: 'book', enabled: true },
        { id: 'saved', label: 'Saved', path: '/bookmarks', icon: 'bookmark', enabled: true },
        { id: 'tools', label: 'Tools', path: '/projects', icon: 'tool', enabled: true },
        { 
          id: 'help', 
          label: 'help', 
          path: '#', 
          icon: 'help-circle',
          enabled: true,
          subItems: [
            { id: 'conentus', label: 'Conentus', path: '#', enabled: true },
            { id: 'faq', label: 'FAQ', path: '#', enabled: true },
            { id: 'feedback', label: 'Feedback', path: '#', enabled: true }
          ]
        }
      ],
      
      // 响应式配置
      responsive: {
        mobileBreakpoint: 768, // px
        tabletBreakpoint: 1024, // px
        desktopBreakpoint: 1280, // px
        mobileMenuMaxHeight: 'calc(100vh - 64px)' // 减去顶栏高度
      }
    };
  },
  
  // API端点配置
  getApiEndpoints() {
    const baseURL = this.getDataSourceConfig().apiBaseURL;
    
    return {
      // 文章/内容相关
      articles: `${baseURL}/articles`,
      article: (slug) => `${baseURL}/articles/${slug}`,
      articlesByTag: (tag) => `${baseURL}/articles?tag=${tag}`,
      articlesSearch: `${baseURL}/articles/search`,
      
      // 项目相关
      projects: `${baseURL}/projects`,
      project: (slug) => `${baseURL}/projects/${slug}`,
      projectTool: (slug, tool) => `${baseURL}/projects/${slug}/tools/${tool}`,
      
      // 数据应用相关
      dashboards: `${baseURL}/dashboards`,
      dashboard: (id) => `${baseURL}/dashboards/${id}`,
      sectorPerformance: `${baseURL}/dashboards/sector-performance`,
      btcGameTheory: `${baseURL}/dashboards/btc-game-theory`,
      
      // 知识库相关
      explore: `${baseURL}/explore`,
      exploreCategory: (category) => `${baseURL}/explore/${category}`,
      exploreSubcategory: (category, subcategory) => `${baseURL}/explore/${category}/${subcategory}`,
      
      // 分析师相关
      analysts: `${baseURL}/analysts`,
      analyst: (id) => `${baseURL}/analysts/${id}`,
      transparency: `${baseURL}/transparency`,
      
      // 用户相关 (未来扩展)
      bookmarks: `${baseURL}/bookmarks`,
      preferences: `${baseURL}/preferences`,
      
      // 搜索相关
      search: `${baseURL}/search`,
      searchSuggestions: `${baseURL}/search/suggestions`,
      
      // 统计相关
      stats: `${baseURL}/stats`,
      analytics: `${baseURL}/analytics`
    };
  },
  
  // 缓存配置
  getCacheConfig() {
    return {
      // 存储键前缀
      prefix: 'delphi_',
      
      // 各数据类型缓存时间 (毫秒)
      ttl: {
        articles: 300000, // 5分钟
        projects: 600000, // 10分钟
        dashboards: 900000, // 15分钟
        explore: 1800000, // 30分钟
        analysts: 3600000, // 1小时
        config: 86400000, // 24小时
        assets: 604800000 // 7天
      },
      
      // 存储策略
      storage: {
        useLocalStorage: true,
        useSessionStorage: false,
        useIndexedDB: false, // 未来可启用
        quota: 50 * 1024 * 1024 // 50MB 限制
      }
    };
  },
  
  // UI配置
  getUIConfig() {
    return {
      // 主题配置
      theme: {
        default: 'dark',
        available: ['dark', 'light', 'auto'],
        persist: true
      },
      
      // 布局配置
      layout: {
        sidebarWidth: '16rem', // 64 * 0.25rem
        headerHeight: '4rem', // 16 * 0.25rem
        contentMaxWidth: '90rem',
        gutter: '1rem',
        borderRadius: '0.375rem'
      },
      
      // 动画配置
      animation: {
        duration: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms'
        },
        easing: {
          default: 'cubic-bezier(0.4, 0, 0.2, 1)',
          bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }
      },
      
      // 响应式断点
      breakpoints: {
        xs: '0px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      }
    };
  },
  
  // 错误处理配置
  getErrorConfig() {
    return {
      // 重试策略
      retry: {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 10000,
        backoffFactor: 2
      },
      
      // 错误类型
      types: {
        network: {
          message: '网络连接失败，请检查网络设置',
          action: 'retry',
          severity: 'error'
        },
        timeout: {
          message: '请求超时，请稍后重试',
          action: 'retry',
          severity: 'warning'
        },
        server: {
          message: '服务器错误，请稍后重试',
          action: 'retry',
          severity: 'error'
        },
        notFound: {
          message: '请求的资源不存在',
          action: 'goHome',
          severity: 'info'
        },
        unauthorized: {
          message: '访问未授权',
          action: 'login',
          severity: 'warning'
        },
        validation: {
          message: '数据验证失败',
          action: 'refresh',
          severity: 'warning'
        }
      },
      
      // 回退策略
      fallback: {
        enableStaticFallback: true,
        showFallbackMessage: true,
        fallbackMessage: '使用缓存数据展示'
      }
    };
  },
  
  // 调试配置
  getDebugConfig() {
    const env = this.getEnvironment();
    
    return {
      enable: env === 'development',
      logLevel: env === 'development' ? 'debug' : 'error',
      logComponents: {
        api: true,
        cache: true,
        state: true,
        render: false,
        performance: true
      },
      mockDelay: env === 'development' ? 500 : 0 // API模拟延迟
    };
  },
  
  // 性能监控配置
  getPerformanceConfig() {
    return {
      enable: true,
      metrics: {
        fcp: true, // First Contentful Paint
        lcp: true, // Largest Contentful Paint
        fid: true, // First Input Delay
        cls: true, // Cumulative Layout Shift
        ttfb: true // Time to First Byte
      },
      thresholds: {
        fcp: 1800, // 1.8秒
        lcp: 2500, // 2.5秒
        fid: 100, // 100毫秒
        cls: 0.1,
        ttfb: 800 // 800毫秒
      }
    };
  },
  
  // 获取完整配置
  getAllConfig() {
    return {
      environment: this.getEnvironment(),
      dataSource: this.getDataSourceConfig(),
      features: this.getFeatureFlags(),
      sideNav: this.getSideNavConfig(),
      api: this.getApiEndpoints(),
      cache: this.getCacheConfig(),
      ui: this.getUIConfig(),
      error: this.getErrorConfig(),
      debug: this.getDebugConfig(),
      performance: this.getPerformanceConfig()
    };
  },
  
  // 初始化配置
  initialize() {
    console.log(`📊 配置系统初始化 - 环境: ${this.getEnvironment()}`);
    
    const config = this.getAllConfig();
    
    // 输出调试信息
    if (config.debug.enable) {
      console.group('🔧 配置详情');
      console.log('环境:', config.environment);
      console.log('数据源模式:', config.dataSource.mode);
      console.log('功能开关:', config.features);
      console.log('API基础URL:', config.dataSource.apiBaseURL);
      console.groupEnd();
    }
    
    // 全局访问
    window.AppConfig = config;
    
    return config;
  }
};

// 立即初始化
const appConfig = Config.initialize();

// 导出配置
export default Config;