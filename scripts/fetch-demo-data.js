#!/usr/bin/env node

/**
 * Demo数据获取脚本
 * 从原站抓取样本数据结构和内容
 * 用于开发阶段的demo数据填充
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// 配置
const config = {
  outputDir: path.join(__dirname, '../data'),
  sampleUrls: {
    // 原站页面URL (假设可公开访问)
    home: 'https://members.delphidigital.io/',
    // 可能可访问的示例文章
    sampleArticle: 'https://members.delphidigital.io/reports/solana-the-modular',
    // 搜索页面
    search: 'https://members.delphidigital.io/search',
    // 项目页面示例
    project: 'https://members.delphidigital.io/projects/bitcoin'
  },
  // 样本数据结构
  sampleData: {
    articles: [],
    projects: [],
    explore: {},
    search: {}
  }
};

// 确保输出目录存在
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 简单的HTTP GET请求
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 解析HTML获取页面结构
function parsePageStructure(html, url) {
  console.log(`解析页面结构: ${url}`);
  
  // 简单提取一些信息
  const structure = {
    url,
    timestamp: new Date().toISOString(),
    title: extractTitle(html),
    description: extractDescription(html),
    headings: extractHeadings(html),
    links: extractLinks(html),
    sections: extractSections(html)
  };
  
  return structure;
}

// 提取标题
function extractTitle(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : '未知标题';
}

// 提取描述
function extractDescription(html) {
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  return descMatch ? descMatch[1].trim() : '';
}

// 提取标题
function extractHeadings(html) {
  const headings = [];
  const h1Matches = html.match(/<h1[^>]*>([^<]+)<\/h1>/gi);
  const h2Matches = html.match(/<h2[^>]*>([^<]+)<\/h2>/gi);
  const h3Matches = html.match(/<h3[^>]*>([^<]+)<\/h3>/gi);
  
  if (h1Matches) {
    headings.push(...h1Matches.map(h => h.replace(/<[^>]+>/g, '').trim()));
  }
  if (h2Matches) {
    headings.push(...h2Matches.map(h => h.replace(/<[^>]+>/g, '').trim()));
  }
  if (h3Matches) {
    headings.push(...h3Matches.map(h => h.replace(/<[^>]+>/g, '').trim()));
  }
  
  return headings.slice(0, 10); // 最多10个
}

// 提取链接
function extractLinks(html) {
  const links = [];
  const linkMatches = html.match(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi);
  
  if (linkMatches) {
    linkMatches.forEach(link => {
      const hrefMatch = link.match(/href=["']([^"']+)["']/i);
      const textMatch = link.match(/>([^<]+)</i);
      
      if (hrefMatch && textMatch) {
        const href = hrefMatch[1];
        const text = textMatch[1].trim();
        
        // 只保留内部链接和相关链接
        if (!href.startsWith('javascript:') && !href.startsWith('mailto:')) {
          links.push({
            text: text.substring(0, 50), // 截断长文本
            href: href.substring(0, 200)  // 截断长URL
          });
        }
      }
    });
  }
  
  return links.slice(0, 20); // 最多20个链接
}

// 提取页面部分
function extractSections(html) {
  const sections = [];
  
  // 查找常见的容器类
  const containerClasses = ['container', 'header', 'footer', 'nav', 'main', 'sidebar', 'content'];
  
  containerClasses.forEach(className => {
    const regex = new RegExp(`<[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]*>`, 'gi');
    const matches = html.match(regex);
    
    if (matches && matches.length > 0) {
      sections.push({
        type: className,
        count: matches.length
      });
    }
  });
  
  return sections;
}

// 生成样本文章数据
function generateSampleArticles() {
  console.log('生成样本文章数据...');
  
  return [
    {
      id: '1',
      slug: 'solana-the-modular',
      title: 'Solana: The Modular Future of Blockchain',
      description: 'An in-depth analysis of Solana architecture and its position in the modular blockchain ecosystem.',
      excerpt: 'This report examines Solana technical architecture, scalability solutions, and its competitive positioning in the rapidly evolving modular blockchain landscape.',
      content: 'Full article content would be here...',
      category: 'Infrastructure',
      publishedDate: '2026-02-20T10:30:00Z',
      author: 'Alex Thompson',
      views: 12500,
      likes: 420,
      readTime: 12,
      tags: ['Solana', 'Blockchain', 'Modular', 'Infrastructure', 'Scalability'],
      delphiTag: 'reports',
      isPremium: false,
      featured: true
    },
    {
      id: '2',
      slug: 'bitcoin-etf-flows-analysis',
      title: 'Bitcoin ETF Flows Analysis: Institutional Adoption Trends',
      description: 'Weekly analysis of Bitcoin ETF flows and institutional adoption patterns.',
      excerpt: 'This analysis tracks Bitcoin ETF flows, institutional interest trends, and market implications for the broader cryptocurrency ecosystem.',
      content: 'Full article content would be here...',
      category: 'Finance',
      publishedDate: '2026-02-19T14:20:00Z',
      author: 'Maria Chen',
      views: 8900,
      likes: 310,
      readTime: 8,
      tags: ['Bitcoin', 'ETF', 'Institutional', 'Finance', 'Analysis'],
      delphiTag: 'alpha',
      isPremium: true,
      featured: true
    },
    {
      id: '3',
      slug: 'ethereum-layer2-ecosystem',
      title: 'Ethereum Layer 2 Ecosystem: State of the Union',
      description: 'Comprehensive overview of the Ethereum Layer 2 scaling solutions landscape.',
      excerpt: 'This report provides a detailed analysis of the current state of Ethereum Layer 2 solutions, including Arbitrum, Optimism, zkSync, and StarkNet.',
      content: 'Full article content would be here...',
      category: 'Infrastructure',
      publishedDate: '2026-02-18T09:15:00Z',
      author: 'James Wilson',
      views: 7450,
      likes: 285,
      readTime: 15,
      tags: ['Ethereum', 'Layer 2', 'Scaling', 'Rollups', 'zkSync'],
      delphiTag: 'reports',
      isPremium: false,
      featured: true
    },
    {
      id: '4',
      slug: 'defi-summer-2.0',
      title: 'DeFi Summer 2.0: What to Expect in the Next Cycle',
      description: 'Analysis of emerging trends and opportunities in the DeFi space.',
      excerpt: 'This research explores potential catalysts and innovation areas that could drive the next DeFi growth cycle.',
      content: 'Full article content would be here...',
      category: 'DeFi',
      publishedDate: '2026-02-17T16:45:00Z',
      author: 'Sarah Johnson',
      views: 6200,
      likes: 195,
      readTime: 10,
      tags: ['DeFi', 'Yield', 'Lending', 'DEX', 'Innovation'],
      delphiTag: 'alpha',
      isPremium: false,
      featured: false
    },
    {
      id: '5',
      slug: 'ai-blockchain-convergence',
      title: 'AI and Blockchain Convergence: Use Cases and Opportunities',
      description: 'Exploring the intersection of artificial intelligence and blockchain technology.',
      excerpt: 'This analysis examines how AI and blockchain technologies are converging and the new opportunities this creates.',
      content: 'Full article content would be here...',
      category: 'Innovation',
      publishedDate: '2026-02-16T11:30:00Z',
      author: 'Robert Kim',
      views: 5300,
      likes: 178,
      readTime: 14,
      tags: ['AI', 'Blockchain', 'Convergence', 'Innovation', 'Technology'],
      delphiTag: 'notes',
      isPremium: true,
      featured: false
    }
  ];
}

// 生成样本项目数据
function generateSampleProjects() {
  console.log('生成样本项目数据...');
  
  return [
    {
      id: 'bitcoin',
      slug: 'bitcoin',
      name: 'Bitcoin',
      description: 'The original cryptocurrency and digital gold standard.',
      longDescription: 'Bitcoin is the first decentralized cryptocurrency, created in 2009 by Satoshi Nakamoto. It operates on a peer-to-peer network without central authority, using proof-of-work consensus.',
      icon: '₿',
      categories: ['Store of Value', 'Digital Gold', 'Layer 1'],
      metrics: {
        marketCap: '$1.2T',
        price: '$62,450',
        change24h: '+2.3%',
        dominance: '52.4%',
        hashRate: '650 EH/s'
      },
      tools: [
        { 
          id: 'etf-flows', 
          name: 'ETF Flows', 
          description: 'Bitcoin ETF flow analysis and tracking',
          metrics: ['dailyFlows', 'totalAUM', 'premiumDiscount']
        },
        { 
          id: 'top-signal', 
          name: 'Top Signal', 
          description: 'Top trading signals and market indicators',
          metrics: ['RSI', 'MACD', 'volumeProfile']
        },
        { 
          id: 'on-chain', 
          name: 'On-Chain Analysis', 
          description: 'Bitcoin on-chain metrics and network health',
          metrics: ['hodlWaves', 'mvrv', 'nupl']
        }
      ],
      research: [
        { slug: 'bitcoin-etf-flows-analysis', title: 'Bitcoin ETF Flows Analysis' },
        { slug: 'bitcoin-halving-2024', title: 'Bitcoin Halving 2024 Analysis' }
      ],
      status: 'active',
      lastUpdated: '2026-02-25T10:00:00Z'
    },
    {
      id: 'ethereum',
      slug: 'ethereum',
      name: 'Ethereum',
      description: 'The leading smart contract platform and decentralized application ecosystem.',
      longDescription: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. It is the foundation for the majority of DeFi, NFT, and Web3 applications.',
      icon: 'Ξ',
      categories: ['Smart Contracts', 'DeFi', 'Layer 1'],
      metrics: {
        marketCap: '$420B',
        price: '$3,450',
        change24h: '+1.8%',
        tvl: '$52B',
        dailyTransactions: '1.2M'
      },
      tools: [
        { 
          id: 'layer2-analysis', 
          name: 'Layer 2 Analysis', 
          description: 'Ethereum layer 2 ecosystem analysis',
          metrics: ['l2TVL', 'transactionCount', 'feeComparison']
        },
        { 
          id: 'defi-dashboard', 
          name: 'DeFi Dashboard', 
          description: 'Ethereum DeFi ecosystem metrics',
          metrics: ['totalValueLocked', 'protocolRevenue', 'userGrowth']
        },
        { 
          id: 'staking', 
          name: 'Staking Analytics', 
          description: 'Ethereum staking metrics and validator analysis',
          metrics: ['stakingRatio', 'validatorCount', 'apr']
        }
      ],
      research: [
        { slug: 'ethereum-layer2-ecosystem', title: 'Ethereum Layer 2 Ecosystem' },
        { slug: 'ethereum-upgrade-roadmap', title: 'Ethereum Upgrade Roadmap' }
      ],
      status: 'active',
      lastUpdated: '2026-02-25T09:30:00Z'
    },
    {
      id: 'solana',
      slug: 'solana',
      name: 'Solana',
      description: 'High-performance blockchain supporting decentralized apps and crypto-currencies.',
      longDescription: 'Solana is a high-performance blockchain supporting decentralized applications and cryptocurrencies at scale. It uses a unique proof-of-history consensus combined with proof-of-stake.',
      icon: '◎',
      categories: ['High Performance', 'Layer 1', 'Web3'],
      metrics: {
        marketCap: '$85B',
        price: '$185',
        change24h: '+3.2%',
        tps: '2,500',
        activeAddresses: '950K'
      },
      tools: [
        { 
          id: 'performance', 
          name: 'Performance Metrics', 
          description: 'Solana network performance and health metrics',
          metrics: ['transactionsPerSecond', 'blockTime', 'validatorHealth']
        },
        { 
          id: 'ecosystem', 
          name: 'Ecosystem Tracker', 
          description: 'Solana ecosystem projects and growth',
          metrics: ['projectCount', 'developerActivity', 'funding']
        }
      ],
      research: [
        { slug: 'solana-the-modular', title: 'Solana: The Modular Future' }
      ],
      status: 'active',
      lastUpdated: '2026-02-25T08:45:00Z'
    }
  ];
}

// 生成知识库数据
function generateSampleExplore() {
  console.log('生成知识库数据...');
  
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
          { slug: 'asset-management', name: 'Asset Management', articleCount: 18, description: 'Portfolio management and investment strategies' },
          { slug: 'trading', name: 'Trading', articleCount: 22, description: 'Trading strategies and market analysis' },
          { slug: 'macro', name: 'Macro Economics', articleCount: 5, description: 'Macroeconomic trends and analysis' }
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
          { slug: 'layer-1', name: 'Layer 1 Protocols', articleCount: 15, description: 'Base layer blockchain protocols' },
          { slug: 'layer-2', name: 'Layer 2 Solutions', articleCount: 12, description: 'Scaling solutions and rollups' },
          { slug: 'oracles', name: 'Oracles', articleCount: 8, description: 'Data oracles and external connectivity' },
          { slug: 'artificial-intelligence', name: 'Artificial Intelligence', articleCount: 3, description: 'AI and blockchain convergence' }
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
          { slug: 'lending', name: 'Lending', articleCount: 12, description: 'Decentralized lending protocols' },
          { slug: 'dex', name: 'DEX', articleCount: 10, description: 'Decentralized exchanges' },
          { slug: 'yield', name: 'Yield', articleCount: 8, description: 'Yield farming and strategies' },
          { slug: 'derivatives', name: 'Derivatives', articleCount: 2, description: 'Decentralized derivatives' }
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

// 生成搜索数据
function generateSampleSearch() {
  console.log('生成搜索数据...');
  
  return {
    popularQueries: [
      { query: 'Bitcoin', count: 1250 },
      { query: 'Ethereum', count: 980 },
      { query: 'DeFi', count: 750 },
      { query: 'NFT', count: 620 },
      { query: 'Solana', count: 580 },
      { query: 'Layer 2', count: 450 },
      { query: 'Staking', count: 380 },
      { query: 'Yield', count: 320 }
    ],
    searchSuggestions: {
      'bitcoin': ['bitcoin etf', 'bitcoin price', 'bitcoin mining', 'bitcoin halving'],
      'ethereum': ['ethereum upgrade', 'ethereum staking', 'ethereum gas', 'ethereum layer 2'],
      'defi': ['defi protocols', 'defi yield', 'defi risks', 'defi trends'],
      'solana': ['solana performance', 'solana ecosystem', 'solana validators']
    },
    searchFilters: {
      type: ['all', 'articles', 'projects', 'dashboards', 'analysts'],
      timeframe: ['all', 'today', 'week', 'month', 'year'],
      sort: ['relevance', 'newest', 'popular', 'trending'],
      category: ['all', 'finance', 'infrastructure', 'defi', 'nft', 'gaming']
    }
  };
}

// 保存数据到文件
function saveDataToFile(data, filename) {
  const filePath = path.join(config.outputDir, filename);
  const jsonData = JSON.stringify(data, null, 2);
  
  fs.writeFileSync(filePath, jsonData, 'utf8');
  console.log(`✅ 数据保存到: ${filePath} (${jsonData.length} 字节)`);
  
  return filePath;
}

// 主函数
async function main() {
  console.log('🎯 Delphi Digital Demo数据获取脚本');
  console.log('📅', new Date().toISOString());
  console.log('='.repeat(50));
  
  ensureDir(config.outputDir);
  
  try {
    // 1. 尝试从原站获取页面结构 (如果可访问)
    console.log('🌐 尝试从原站获取页面结构...');
    const fetchedData = {};
    
    // 尝试访问首页
    try {
      // 注释掉实际HTTP请求，避免潜在问题
      // const homeHtml = await fetchUrl(config.sampleUrls.home);
      // fetchedData.home = parsePageStructure(homeHtml, config.sampleUrls.home);
      // console.log('✅ 成功获取首页结构');
    } catch (error) {
      console.log('⚠️ 无法从原站获取数据，使用生成的数据:', error.message);
    }
    
    // 2. 生成样本数据
    console.log('\n📊 生成样本数据...');
    
    // 文章数据
    const articles = generateSampleArticles();
    saveDataToFile(articles, 'sample-articles.json');
    config.sampleData.articles = articles;
    
    // 项目数据
    const projects = generateSampleProjects();
    saveDataToFile(projects, 'sample-projects.json');
    config.sampleData.projects = projects;
    
    // 知识库数据
    const explore = generateSampleExplore();
    saveDataToFile(explore, 'sample-explore.json');
    config.sampleData.explore = explore;
    
    // 搜索数据
    const search = generateSampleSearch();
    saveDataToFile(search, 'sample-search.json');
    config.sampleData.search = search;
    
    // 3. 创建合并的数据文件 (用于静态数据服务)
    console.log('\n🔧 创建合并数据文件...');
    const combinedData = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      description: 'Delphi Digital Demo数据 - 用于开发和测试',
      articles: config.sampleData.articles,
      projects: config.sampleData.projects,
      explore: config.sampleData.explore,
      search: config.sampleData.search,
      stats: {
        totalArticles: config.sampleData.articles.length,
        totalProjects: config.sampleData.projects.length,
        totalCategories: config.sampleData.explore.categories.length,
        totalSearchQueries: config.sampleData.search.popularQueries.length
      }
    };
    
    saveDataToFile(combinedData, 'demo-data.json');
    
    // 4. 输出摘要
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Demo数据生成完成！');
    console.log('\n📋 生成的数据文件:');
    console.log(`  1. 文章数据: ${config.sampleData.articles.length} 篇文章`);
    console.log(`  2. 项目数据: ${config.sampleData.projects.length} 个项目`);
    console.log(`  3. 知识库数据: ${config.sampleData.explore.categories.length} 个分类`);
    console.log(`  4. 搜索数据: ${config.sampleData.search.popularQueries.length} 个热门查询`);
    console.log('\n🚀 数据已准备好用于开发测试！');
    
  } catch (error) {
    console.error('❌ 数据获取过程出错:', error);
    process.exit(1);
  }
}

// 执行主函数
if (require.main === module) {
  main();
}

// 导出函数
module.exports = {
  generateSampleArticles,
  generateSampleProjects,
  generateSampleExplore,
  generateSampleSearch
};