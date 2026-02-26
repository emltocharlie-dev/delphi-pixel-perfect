/**
 * Data Apps模块页面初始化脚本
 * 版本: 1.0 - 空页面框架 (技术搭建阶段)
 * 用户指令: "p1-p3，内容是图标工具等页面的，暂时只做空页面"
 */

// 页面初始化函数
function initDataAppsPage() {
    console.log('🚀 Data Apps页面初始化 - 空页面框架模式');
    
    // 获取当前页面路径
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').filter(Boolean).pop() || 'data-apps';
    
    console.log(`📊 Data Apps页面: ${pageName}`);
    console.log('📋 用户指令: "暂时只做空页面" - 技术框架优先，内容后续统一填充');
    
    // 更新页面标题和状态
    updatePageInfo(pageName);
    
    // 初始化占位内容
    initPlaceholderContent();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 显示技术框架状态
    showFrameworkStatus();
}

// 更新页面信息
function updatePageInfo(pageName) {
    const pageTitle = document.querySelector('#page-title');
    const pageDescription = document.querySelector('#page-description');
    
    if (pageTitle) {
        const pageNames = {
            'sector-performance': 'Sector Performance Dashboard',
            'btc-game-theory': 'BTC Game Theory Tool'
        };
        
        pageTitle.textContent = pageNames[pageName] || 'Data Apps';
        
        if (pageDescription) {
            pageDescription.textContent = `技术框架阶段 - 空页面 (${pageNames[pageName] || 'Data Apps'})`;
        }
    }
}

// 初始化占位内容
function initPlaceholderContent() {
    console.log('🔄 初始化占位内容...');
    
    // 设置所有占位区域的状态
    const placeholders = document.querySelectorAll('[data-placeholder]');
    placeholders.forEach(element => {
        const placeholderType = element.getAttribute('data-placeholder');
        initPlaceholderByType(element, placeholderType);
    });
    
    // 如果没有标记的占位元素，使用通用初始化
    if (placeholders.length === 0) {
        initGenericPlaceholders();
    }
}

// 根据类型初始化占位符
function initPlaceholderByType(element, type) {
    switch(type) {
        case 'chart':
            element.innerHTML = `
                <div class="placeholder-chart">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-700 flex items-center justify-center">
                        <svg class="w-8 h-8 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <p class="text-tertiary mb-2">图表区域 - 技术框架占位</p>
                    <p class="text-sm text-tertiary">内容后续统一填充</p>
                </div>
            `;
            break;
            
        case 'table':
            element.innerHTML = `
                <div class="placeholder-table">
                    <p class="text-tertiary mb-4">数据表格框架 - 内容后续统一填充</p>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-dark-700">
                                    <th class="text-left py-3 px-4 text-tertiary font-medium">项目</th>
                                    <th class="text-left py-3 px-4 text-tertiary font-medium">数值</th>
                                    <th class="text-left py-3 px-4 text-tertiary font-medium">状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-b border-dark-700">
                                    <td class="py-3 px-4 text-tertiary">数据1</td>
                                    <td class="py-3 px-4 text-tertiary">-</td>
                                    <td class="py-3 px-4 text-tertiary">占位</td>
                                </tr>
                                <tr class="border-b border-dark-700">
                                    <td class="py-3 px-4 text-tertiary">数据2</td>
                                    <td class="py-3 px-4 text-tertiary">-</td>
                                    <td class="py-3 px-4 text-tertiary">占位</td>
                                </tr>
                                <tr>
                                    <td class="py-3 px-4 text-tertiary">数据3</td>
                                    <td class="py-3 px-4 text-tertiary">-</td>
                                    <td class="py-3 px-4 text-tertiary">占位</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            break;
            
        case 'tool':
            element.innerHTML = `
                <div class="placeholder-tool">
                    <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-dark-700 flex items-center justify-center">
                        <svg class="w-6 h-6 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <p class="text-tertiary text-center">工具功能框架</p>
                    <p class="text-sm text-tertiary text-center">内容后续统一填充</p>
                </div>
            `;
            break;
            
        default:
            element.innerHTML = `
                <div class="placeholder-default">
                    <p class="text-tertiary">内容区域 - 技术框架占位</p>
                    <p class="text-sm text-tertiary mt-1">根据用户指令，此区域暂时为空页面框架</p>
                </div>
            `;
    }
}

// 通用占位符初始化
function initGenericPlaceholders() {
    // 查找所有包含"占位"文本的元素
    const placeholderElements = document.querySelectorAll('.bg-dark-900, .bg-dark-800');
    
    placeholderElements.forEach(element => {
        if (element.textContent.includes('占位') || element.textContent.includes('placeholder')) {
            element.classList.add('placeholder-area');
            
            // 添加技术框架标识
            if (!element.querySelector('.framework-badge')) {
                const badge = document.createElement('div');
                badge.className = 'framework-badge absolute top-2 right-2 bg-dark-700 text-xs text-tertiary px-2 py-1 rounded';
                badge.textContent = '技术框架';
                element.style.position = 'relative';
                element.appendChild(badge);
            }
        }
    });
}

// 设置事件监听器
function setupEventListeners() {
    console.log('🔧 设置空页面框架事件监听器...');
    
    // 技术框架说明切换
    const frameworkToggle = document.querySelector('#framework-toggle');
    if (frameworkToggle) {
        frameworkToggle.addEventListener('click', function() {
            const details = document.querySelector('#framework-details');
            if (details) {
                details.classList.toggle('hidden');
                this.querySelector('span').textContent = 
                    details.classList.contains('hidden') ? '显示技术框架详情' : '隐藏技术框架详情';
            }
        });
    }
    
    // 占位按钮交互
    const placeholderButtons = document.querySelectorAll('.placeholder-btn');
    placeholderButtons.forEach(button => {
        button.addEventListener('click', function() {
            showPlaceholderAction(this.dataset.action || 'default');
        });
    });
    
    // 技术框架状态更新
    updateFrameworkStatus();
}

// 显示占位操作反馈
function showPlaceholderAction(action) {
    console.log(`🔄 占位操作: ${action}`);
    
    // 创建临时通知
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-dark-800 text-white px-4 py-3 rounded-lg shadow-lg border-l-4 border-primary-blue-600 z-50';
    notification.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
                <p class="font-medium">技术框架阶段</p>
                <p class="text-sm text-tertiary">此功能将在内容填充阶段实现</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 3秒后移除通知
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 显示技术框架状态
function showFrameworkStatus() {
    const statusContainer = document.querySelector('#framework-status');
    if (!statusContainer) {
        // 如果没有状态容器，创建一个
        const mainContent = document.querySelector('main .container') || document.querySelector('main');
        if (mainContent) {
            const statusDiv = document.createElement('div');
            statusDiv.id = 'framework-status';
            statusDiv.className = 'bg-dark-800 rounded-xl p-4 mb-6 border-l-4 border-primary-blue-600';
            statusDiv.innerHTML = `
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center">
                            <svg class="w-4 h-4 text-primary-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div class="ml-3">
                        <h4 class="text-white font-medium">技术框架模式</h4>
                        <p class="text-sm text-tertiary mt-1">
                            当前处于技术框架搭建阶段。根据用户指令，此页面暂时为空页面框架，内容后续统一填充。
                        </p>
                        <div class="mt-2 text-xs text-tertiary">
                            <p><span class="text-primary">用户指令</span>: "p1-p3，内容是图标工具等页面的，暂时只做空页面"</p>
                            <p><span class="text-primary">实施策略</span>: 技术框架优先，内容填充后续统一处理</p>
                        </div>
                    </div>
                </div>
            `;
            
            // 插入到页面主要内容顶部
            const firstChild = mainContent.firstChild;
            mainContent.insertBefore(statusDiv, firstChild);
        }
    }
}

// 更新技术框架状态
function updateFrameworkStatus() {
    const currentTime = new Date().toLocaleTimeString();
    const statusElements = document.querySelectorAll('.framework-status-time');
    
    statusElements.forEach(element => {
        element.textContent = `状态更新时间: ${currentTime}`;
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否是Data Apps页面
    const currentPath = window.location.pathname;
    const isDataAppsPage = currentPath.includes('sector-performance') || currentPath.includes('btc-game-theory');
    
    if (isDataAppsPage) {
        console.log('📱 Data Apps页面检测到，准备初始化...');
        
        // 等待数据服务就绪
        if (typeof window.appServices !== 'undefined' && window.appServices.ContentManager) {
            initDataAppsPage();
        } else {
            // 监听服务就绪事件
            document.addEventListener('app:servicesReady', initDataAppsPage);
        }
    }
});

// 导出函数供其他模块使用
window.initDataAppsPage = initDataAppsPage;