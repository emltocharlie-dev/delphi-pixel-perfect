/* Delphi Digital风格复刻 - 交互脚本 */
/* 版本: v1.0 - 基础交互实现 */

// 配置
const CONFIG = {
    apiUrl: 'https://jsonplaceholder.typicode.com/posts', // 临时API，用于演示
    itemsPerPage: 6,
    currentPage: 1,
    currentTab: 'all'
};

// 示例数据 - 实际应从API获取
const SAMPLE_DATA = {
    all: [
        { id: 1, category: '研究报告', title: 'OKX手续费结构深度分析', description: '详细分析OKX交易手续费结构，帮助用户优化交易成本。', author: '交易研究员', date: '2026-02-25', views: 1284, likes: 89 },
        { id: 2, category: '新手教程', title: 'OKX注册和KYC认证完整指南', description: '从零开始完成OKX账户注册和身份认证，确保账户安全。', author: '安全专家', date: '2026-02-24', views: 2456, likes: 156 },
        { id: 3, category: '交易策略', title: 'OKX网格交易实战策略', description: '在OKX平台实施网格交易策略，自动化获取市场波动收益。', author: '量化交易员', date: '2026-02-23', views: 1872, likes: 102 },
        { id: 4, category: 'Alpha见解', title: 'OKX新产品功能抢先分析', description: '深入分析OKX最新推出的交易产品和功能特点。', author: '产品分析师', date: '2026-02-22', views: 932, likes: 67 },
        { id: 5, category: '安全指南', title: 'OKX账户安全最佳实践', description: '保护OKX账户安全，防止钓鱼攻击和未授权访问。', author: '安全研究员', date: '2026-02-21', views: 3128, likes: 201 },
        { id: 6, category: '工具使用', title: 'OKX API接入开发教程', description: '使用OKX API构建自定义交易工具和自动化策略。', author: '开发者', date: '2026-02-20', views: 1543, likes: 94 },
        { id: 7, category: '研究报告', title: 'OKX流动性深度报告', description: '分析OKX交易所的流动性状况和交易深度数据。', author: '市场研究员', date: '2026-02-19', views: 876, likes: 45 },
        { id: 8, category: '新手教程', title: 'OKX法币入金完整流程', description: '通过多种方式向OKX账户存入法币，开始交易之旅。', author: '金融顾问', date: '2026-02-18', views: 2897, likes: 178 }
    ],
    reports: [
        { id: 1, category: '研究报告', title: 'OKX手续费结构深度分析', description: '详细分析OKX交易手续费结构，帮助用户优化交易成本。', author: '交易研究员', date: '2026-02-25', views: 1284, likes: 89 },
        { id: 7, category: '研究报告', title: 'OKX流动性深度报告', description: '分析OKX交易所的流动性状况和交易深度数据。', author: '市场研究员', date: '2026-02-19', views: 876, likes: 45 }
    ],
    alpha: [
        { id: 4, category: 'Alpha见解', title: 'OKX新产品功能抢先分析', description: '深入分析OKX最新推出的交易产品和功能特点。', author: '产品分析师', date: '2026-02-22', views: 932, likes: 67 }
    ],
    notes: [
        { id: 3, category: '交易策略', title: 'OKX网格交易实战策略', description: '在OKX平台实施网格交易策略，自动化获取市场波动收益。', author: '量化交易员', date: '2026-02-23', views: 1872, likes: 102 }
    ],
    media: [
        { id: 5, category: '安全指南', title: 'OKX账户安全最佳实践', description: '保护OKX账户安全，防止钓鱼攻击和未授权访问。', author: '安全研究员', date: '2026-02-21', views: 3128, likes: 201 }
    ],
    reads: [
        { id: 6, category: '工具使用', title: 'OKX API接入开发教程', description: '使用OKX API构建自定义交易工具和自动化策略。', author: '开发者', date: '2026-02-20', views: 1543, likes: 94 }
    ]
};

// DOM元素
const dom = {
    navLinks: null,
    contentGrid: null,
    filterBtns: null,
    paginationBtns: null,
    searchInput: null,
    pageTitle: null
};

// 初始化
function init() {
    console.log('Delphi Digital复刻demo初始化...');
    
    // 获取DOM元素
    dom.navLinks = document.querySelectorAll('.nav-link');
    dom.contentGrid = document.getElementById('content-grid');
    dom.filterBtns = document.querySelectorAll('.filter-btn');
    dom.paginationBtns = document.querySelectorAll('.pagination-btn');
    dom.searchInput = document.querySelector('.search-input');
    dom.pageTitle = document.querySelector('.page-title');
    
    // 设置事件监听器
    setupEventListeners();
    
    // 加载初始数据
    loadContent();
    
    // 更新页面统计
    updatePageStats();
}

// 设置事件监听器
function setupEventListeners() {
    // 导航标签切换
    dom.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });
    
    // 筛选按钮
    dom.filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.textContent.trim();
            applyFilter(filter);
        });
    });
    
    // 分页按钮
    dom.paginationBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const direction = e.target.classList.contains('prev') ? 'prev' : 'next';
            navigatePage(direction);
        });
    });
    
    // 搜索输入
    if (dom.searchInput) {
        dom.searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // 页面加载完成
    document.addEventListener('DOMContentLoaded', init);
}

// 切换标签
function switchTab(tab) {
    console.log(`切换到标签: ${tab}`);
    
    // 更新活动状态
    dom.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.tab === tab) {
            link.classList.add('active');
        }
    });
    
    // 更新当前标签
    CONFIG.currentTab = tab;
    CONFIG.currentPage = 1;
    
    // 更新页面标题
    updatePageTitle(tab);
    
    // 重新加载内容
    loadContent();
    
    // 更新页面统计
    updatePageStats();
}

// 更新页面标题
function updatePageTitle(tab) {
    const titles = {
        'all': '全部内容',
        'reports': '研究报告',
        'alpha': 'Alpha见解',
        'notes': '笔记',
        'media': '媒体',
        'reads': '阅读推荐'
    };
    
    if (dom.pageTitle && titles[tab]) {
        dom.pageTitle.textContent = titles[tab];
    }
}

// 应用筛选
function applyFilter(filter) {
    console.log(`应用筛选: ${filter}`);
    
    // 更新筛选按钮状态
    dom.filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.trim() === filter) {
            btn.classList.add('active');
        }
    });
    
    // 这里可以添加实际的筛选逻辑
    // 目前只是演示，所以只更新UI状态
    showNotification(`已应用筛选: ${filter}`);
}

// 导航分页
function navigatePage(direction) {
    if (direction === 'prev' && CONFIG.currentPage > 1) {
        CONFIG.currentPage--;
    } else if (direction === 'next') {
        CONFIG.currentPage++;
    }
    
    console.log(`导航到页面: ${CONFIG.currentPage}`);
    loadContent();
    updatePaginationUI();
}

// 更新分页UI
function updatePaginationUI() {
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    
    if (prevBtn) {
        prevBtn.disabled = CONFIG.currentPage <= 1;
    }
    
    if (nextBtn) {
        // 这里应该根据实际数据量判断是否禁用
        // 目前只是演示，所以总是启用
        nextBtn.disabled = false;
    }
}

// 处理搜索
function handleSearch(e) {
    const query = e.target.value.trim();
    console.log(`搜索查询: ${query}`);
    
    if (query.length === 0) {
        loadContent();
        return;
    }
    
    // 模拟搜索
    const filteredData = SAMPLE_DATA[CONFIG.currentTab].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    
    renderContent(filteredData);
    showNotification(`找到 ${filteredData.length} 个结果`);
}

// 加载内容
function loadContent() {
    console.log(`加载内容: ${CONFIG.currentTab}, 页面: ${CONFIG.currentPage}`);
    
    // 显示加载状态
    showLoading();
    
    // 模拟API延迟
    setTimeout(() => {
        const data = SAMPLE_DATA[CONFIG.currentTab] || [];
        
        // 分页逻辑
        const startIndex = (CONFIG.currentPage - 1) * CONFIG.itemsPerPage;
        const endIndex = startIndex + CONFIG.itemsPerPage;
        const pagedData = data.slice(startIndex, endIndex);
        
        renderContent(pagedData);
        
        // 如果数据为空，显示空状态
        if (pagedData.length === 0) {
            showEmptyState();
        }
    }, 500);
}

// 渲染内容
function renderContent(items) {
    if (!dom.contentGrid) return;
    
    // 清空当前内容
    dom.contentGrid.innerHTML = '';
    
    // 如果没有数据，显示空状态
    if (!items || items.length === 0) {
        showEmptyState();
        return;
    }
    
    // 创建内容卡片
    items.forEach(item => {
        const card = createContentCard(item);
        dom.contentGrid.appendChild(card);
    });
}

// 创建内容卡片
function createContentCard(item) {
    const card = document.createElement('article');
    card.className = 'content-card';
    card.setAttribute('data-id', item.id);
    
    // 卡片内容
    card.innerHTML = `
        <div class="card-header">
            <span class="card-category">${item.category}</span>
            <h3 class="card-title">${item.title}</h3>
            <p class="card-description">${item.description}</p>
        </div>
        <div class="card-body">
            <div class="card-meta">
                <div class="card-author">
                    <span>👤</span>
                    <span>${item.author}</span>
                </div>
                <div class="card-stats">
                    <span class="stat">
                        <span>📅</span>
                        <span>${formatDate(item.date)}</span>
                    </span>
                    <span class="stat">
                        <span>👁️</span>
                        <span>${formatNumber(item.views)}</span>
                    </span>
                    <span class="stat">
                        <span>❤️</span>
                        <span>${formatNumber(item.likes)}</span>
                    </span>
                </div>
            </div>
        </div>
    `;
    
    // 添加点击事件
    card.addEventListener('click', () => {
        console.log(`点击卡片: ${item.id} - ${item.title}`);
        showNotification(`打开: ${item.title}`);
        // 实际应该导航到详情页面
    });
    
    return card;
}

// 显示加载状态
function showLoading() {
    if (!dom.contentGrid) return;
    
    dom.contentGrid.innerHTML = `
        <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <p>加载内容中...</p>
        </div>
    `;
}

// 显示空状态
function showEmptyState() {
    if (!dom.contentGrid) return;
    
    dom.contentGrid.innerHTML = `
        <div class="empty-state">
            <div style="text-align: center; padding: 3rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                <h3 style="margin-bottom: 0.5rem;">没有找到内容</h3>
                <p style="color: var(--text-secondary);">尝试调整筛选条件或搜索关键词</p>
                <button class="filter-btn active" style="margin-top: 1rem;" onclick="location.reload()">
                    重置筛选
                </button>
            </div>
        </div>
    `;
}

// 更新页面统计
function updatePageStats() {
    const statsElement = document.querySelector('.page-stats');
    if (!statsElement) return;
    
    const data = SAMPLE_DATA[CONFIG.currentTab] || [];
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / CONFIG.itemsPerPage);
    
    statsElement.innerHTML = `
        <span class="stat-item">${totalItems} 篇文章</span>
        <span class="stat-divider">•</span>
        <span class="stat-item">第 ${CONFIG.currentPage} 页 / 共 ${totalPages} 页</span>
    `;
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-left: 4px solid var(--okx-red);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// 工具函数：格式化数字
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// 启动应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// 导出到全局作用域（用于演示）
window.DelphiReplicaDemo = {
    init,
    switchTab,
    loadContent,
    showNotification
};

console.log('Delphi Digital复刻demo脚本加载完成');