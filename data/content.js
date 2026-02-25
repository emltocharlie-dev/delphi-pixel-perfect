// Delphi Digital像素级复刻 - 内容数据管理系统
// 版本: v1.0 - 基于深度技术分析

// 内容数据
const CONTENT_DATA = {
  version: "1.0",
  lastUpdated: "2026-02-25T13:20:00Z",
  totalArticles: 11,
  
  // 文章数据
  articles: [
    {
      id: 1,
      title: "OKX注册和KYC认证完整指南",
      slug: "okx-registration-kyc-guide",
      description: "从零开始完成OKX账户注册和身份认证，确保账户安全。详细步骤和注意事项。",
      excerpt: "本文详细介绍OKX账户注册流程、KYC认证要求、安全设置等内容，帮助新手快速安全地开始交易。",
      content: "完整的文章内容...",
      category: "新手教程",
      // Delphi Digital标签映射
      delphiTags: ["all", "notes"], // 映射到All和Notes
      tags: ["注册", "KYC", "安全", "入门", "新手"],
      author: "安全专家",
      authorAvatar: "👤",
      publishedDate: "2026-02-25",
      updatedDate: "2026-02-25",
      readTime: "8分钟",
      difficulty: "初级",
      views: 2456,
      likes: 156,
      featured: true,
      status: "published"
    },
    {
      id: 2,
      title: "OKX手续费结构深度分析",
      slug: "okx-fee-structure-analysis",
      description: "详细分析OKX交易手续费结构，帮助用户优化交易成本，理解Maker/Taker费率。",
      excerpt: "OKX采用阶梯费率制度，根据交易量和持仓量提供不同费率，本文深入解析费用结构和优化策略。",
      content: "完整的文章内容...",
      category: "研究报告",
      delphiTags: ["all", "reports"], // 映射到All和Reports
      tags: ["手续费", "交易成本", "费率优化", "Maker", "Taker", "分析"],
      author: "交易研究员",
      authorAvatar: "📊",
      publishedDate: "2026-02-25",
      updatedDate: "2026-02-25",
      readTime: "12分钟",
      difficulty: "中级",
      views: 1284,
      likes: 89,
      featured: true,
      status: "published"
    },
    {
      id: 3,
      title: "OKX网格交易实战策略",
      slug: "okx-grid-trading-strategy",
      description: "在OKX平台实施网格交易策略，自动化获取市场波动收益，降低交易风险。",
      excerpt: "网格交易是一种在特定价格区间内设置多个买入卖出订单的策略，实现自动化交易和风险控制。",
      content: "完整的文章内容...",
      category: "交易策略",
      delphiTags: ["all", "alpha"], // 映射到All和Alpha Insights
      tags: ["网格交易", "自动化", "策略", "风险管理", "量化"],
      author: "量化交易员",
      authorAvatar: "🎯",
      publishedDate: "2026-02-23",
      updatedDate: "2026-02-23",
      readTime: "15分钟",
      difficulty: "高级",
      views: 1872,
      likes: 102,
      featured: true,
      status: "published"
    },
    {
      id: 4,
      title: "OKX新产品功能抢先分析",
      slug: "okx-new-product-analysis",
      description: "深入分析OKX最新推出的交易产品和功能特点，包括跟单交易、期权等。",
      excerpt: "OKX定期推出新产品功能，如跟单交易、期权交易、结构化产品等，本文提供最新分析。",
      content: "完整的文章内容...",
      category: "Alpha见解",
      delphiTags: ["all", "alpha"], // 映射到All和Alpha Insights
      tags: ["新产品", "功能分析", "跟单交易", "期权", "创新"],
      author: "产品分析师",
      authorAvatar: "🚀",
      publishedDate: "2026-02-22",
      updatedDate: "2026-02-22",
      readTime: "10分钟",
      difficulty: "中级",
      views: 932,
      likes: 67,
      featured: false,
      status: "published"
    },
    {
      id: 5,
      title: "OKX账户安全最佳实践",
      slug: "okx-account-security-best-practices",
      description: "保护OKX账户安全，防止钓鱼攻击和未授权访问，设置双重验证等安全措施。",
      excerpt: "加密货币账户安全至关重要，本文介绍OKX账户安全设置、双重验证和防钓鱼策略。",
      content: "完整的文章内容...",
      category: "安全指南",
      delphiTags: ["all", "notes"], // 映射到All和Notes
      tags: ["安全", "双重验证", "防钓鱼", "账户保护", "最佳实践"],
      author: "安全研究员",
      authorAvatar: "🛡️",
      publishedDate: "2026-02-21",
      updatedDate: "2026-02-21",
      readTime: "12分钟",
      difficulty: "初级",
      views: 3128,
      likes: 201,
      featured: true,
      status: "published"
    },
    {
      id: 6,
      title: "OKX API接入开发教程",
      slug: "okx-api-integration-tutorial",
      description: "使用OKX API构建自定义交易工具和自动化策略，包括WebSocket实时数据。",
      excerpt: "OKX提供完善的API接口，支持REST和WebSocket协议，本文详细讲解接入方法和最佳实践。",
      content: "完整的文章内容...",
      category: "工具使用",
      delphiTags: ["all", "reads"], // 映射到All和Reads
      tags: ["API", "开发", "自动化", "WebSocket", "REST", "编程"],
      author: "开发者",
      authorAvatar: "💻",
      publishedDate: "2026-02-20",
      updatedDate: "2026-02-20",
      readTime: "20分钟",
      difficulty: "高级",
      views: 1543,
      likes: 94,
      featured: false,
      status: "published"
    },
    {
      id: 7,
      title: "OKX流动性深度报告",
      slug: "okx-liquidity-depth-report",
      description: "分析OKX交易所的流动性状况和交易深度数据，对比主要交易对。",
      excerpt: "流动性是交易所的重要指标，影响交易执行价格和滑点，本文提供深度分析和数据对比。",
      content: "完整的文章内容...",
      category: "研究报告",
      delphiTags: ["all", "reports"], // 映射到All和Reports
      tags: ["流动性", "交易深度", "市场分析", "数据", "研究报告"],
      author: "市场研究员",
      authorAvatar: "📈",
      publishedDate: "2026-02-19",
      updatedDate: "2026-02-19",
      readTime: "14分钟",
      difficulty: "中级",
      views: 876,
      likes: 45,
      featured: false,
      status: "published"
    },
    {
      id: 8,
      title: "OKX法币入金完整流程",
      slug: "okx-fiat-deposit-guide",
      description: "通过多种方式向OKX账户存入法币，包括银行卡、第三方支付等。",
      excerpt: "OKX支持多种法币入金方式，方便用户快速开始交易，本文详细介绍各种入金渠道和注意事项。",
      content: "完整的文章内容...",
      category: "新手教程",
      delphiTags: ["all", "notes"], // 映射到All和Notes
      tags: ["法币", "入金", "银行卡", "支付", "资金管理"],
      author: "金融顾问",
      authorAvatar: "💰",
      publishedDate: "2026-02-18",
      updatedDate: "2026-02-18",
      readTime: "10分钟",
      difficulty: "初级",
      views: 2897,
      likes: 178,
      featured: true,
      status: "published"
    },
    {
      id: 9,
      title: "OKX跟单交易完全指南",
      slug: "okx-copy-trading-complete-guide",
      description: "掌握OKX跟单交易功能，跟随成功交易员自动复制交易策略。",
      excerpt: "跟单交易让新手可以跟随经验丰富的交易员自动执行交易，降低学习曲线，提高成功率。",
      content: "完整的文章内容...",
      category: "交易策略",
      delphiTags: ["all", "alpha"], // 映射到All和Alpha Insights
      tags: ["跟单交易", "复制交易", "社交交易", "策略跟随", "自动化"],
      author: "交易导师",
      authorAvatar: "👥",
      publishedDate: "2026-02-17",
      updatedDate: "2026-02-17",
      readTime: "12分钟",
      difficulty: "中级",
      views: 2105,
      likes: 123,
      featured: true,
      status: "published"
    },
    {
      id: 10,
      title: "OKX DeFi挖矿收益策略",
      slug: "okx-defi-mining-yield-strategy",
      description: "利用OKX平台参与DeFi挖矿，获取稳定收益，理解流动性挖矿原理。",
      excerpt: "DeFi挖矿通过提供流动性获得收益，OKX提供便捷的参与渠道，本文详解策略和风险控制。",
      content: "完整的文章内容...",
      category: "Alpha见解",
      delphiTags: ["all", "alpha"], // 映射到All和Alpha Insights
      tags: ["DeFi", "挖矿", "收益", "流动性挖矿", "Yield", "策略"],
      author: "DeFi研究员",
      authorAvatar: "🌾",
      publishedDate: "2026-02-16",
      updatedDate: "2026-02-16",
      readTime: "18分钟",
      difficulty: "高级",
      views: 1320,
      likes: 87,
      featured: false,
      status: "published"
    },
    {
      id: 11,
      title: "OKX期权交易入门教程",
      slug: "okx-options-trading-tutorial",
      description: "从零开始学习OKX期权交易，理解看涨/看跌期权基本概念和策略。",
      excerpt: "期权交易提供杠杆和风险对冲功能，是高级交易工具，本文从基础概念到实战策略全面讲解。",
      content: "完整的文章内容...",
      category: "新手教程",
      delphiTags: ["all", "notes"], // 映射到All和Notes
      tags: ["期权", "衍生品", "交易策略", "入门", "风险管理"],
      author: "衍生品专家",
      authorAvatar: "📊",
      publishedDate: "2026-02-15",
      updatedDate: "2026-02-15",
      readTime: "16分钟",
      difficulty: "中级",
      views: 1789,
      likes: 95,
      featured: true,
      status: "published"
    }
  ]
};

// Delphi Digital标签系统
const DELPHI_TAGS = {
  all: "全部内容",
  reports: "研究报告",
  alpha: "Alpha见解",
  notes: "笔记",
  media: "媒体",
  reads: "阅读推荐"
};

// 内容管理系统API
const ContentManager = {
  // 获取所有文章
  getAllArticles() {
    return CONTENT_DATA.articles;
  },
  
  // 按Delphi标签获取文章
  getArticlesByDelphiTag(tag) {
    if (tag === 'all') {
      return CONTENT_DATA.articles;
    }
    return CONTENT_DATA.articles.filter(article => 
      article.delphiTags && article.delphiTags.includes(tag)
    );
  },
  
  // 搜索文章
  searchArticles(query) {
    const searchQuery = query.toLowerCase().trim();
    if (!searchQuery) return [];
    
    return CONTENT_DATA.articles.filter(article => {
      return (
        article.title.toLowerCase().includes(searchQuery) ||
        article.description.toLowerCase().includes(searchQuery) ||
        article.excerpt.toLowerCase().includes(searchQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
        article.category.toLowerCase().includes(searchQuery)
      );
    });
  },
  
  // 按分类筛选
  filterByCategory(category) {
    return CONTENT_DATA.articles.filter(article => 
      article.category === category
    );
  },
  
  // 按难度筛选
  filterByDifficulty(difficulty) {
    return CONTENT_DATA.articles.filter(article => 
      article.difficulty === difficulty
    );
  },
  
  // 按特色文章筛选
  getFeaturedArticles() {
    return CONTENT_DATA.articles.filter(article => article.featured);
  },
  
  // 按时间筛选
  filterByTime(timeFilter) {
    const now = new Date();
    const articles = [...CONTENT_DATA.articles];
    
    switch(timeFilter) {
      case 'today':
        return articles.filter(article => {
          const articleDate = new Date(article.publishedDate);
          return articleDate.toDateString() === now.toDateString();
        });
        
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return articles.filter(article => {
          const articleDate = new Date(article.publishedDate);
          return articleDate >= weekAgo;
        });
        
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return articles.filter(article => {
          const articleDate = new Date(article.publishedDate);
          return articleDate >= monthAgo;
        });
        
      default:
        return articles;
    }
  },
  
  // 排序文章
  sortArticles(articles, sortBy) {
    const sorted = [...articles];
    
    switch(sortBy) {
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.publishedDate) - new Date(a.publishedDate)
        );
        
      case 'popular':
        return sorted.sort((a, b) => b.views - a.views);
        
      case 'likes':
        return sorted.sort((a, b) => b.likes - a.likes);
        
      default:
        return sorted;
    }
  },
  
  // 分页
  paginate(articles, page = 1, perPage = 6) {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    
    return {
      data: articles.slice(startIndex, endIndex),
      page,
      perPage,
      total: articles.length,
      totalPages: Math.ceil(articles.length / perPage),
      hasNext: endIndex < articles.length,
      hasPrev: page > 1
    };
  },
  
  // 获取统计数据
  getStats() {
    const totalArticles = CONTENT_DATA.totalArticles;
    const featuredCount = CONTENT_DATA.articles.filter(a => a.featured).length;
    const totalViews = CONTENT_DATA.articles.reduce((sum, a) => sum + a.views, 0);
    const totalLikes = CONTENT_DATA.articles.reduce((sum, a) => sum + a.likes, 0);
    
    return {
      totalArticles,
      featuredCount,
      totalViews,
      totalLikes,
      lastUpdated: CONTENT_DATA.lastUpdated
    };
  },
  
  // 获取标签映射
  getDelphiTags() {
    return DELPHI_TAGS;
  },
  
  // 获取标签显示名称
  getTagDisplayName(tag) {
    return DELPHI_TAGS[tag] || tag;
  }
};

// 导出到全局作用域
window.ContentManager = ContentManager;
window.CONTENT_DATA = CONTENT_DATA;