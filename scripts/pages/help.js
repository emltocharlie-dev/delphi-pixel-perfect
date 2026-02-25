// Help页面脚本 - 帮助中心和支持
// 版本: 1.0 - 演示帮助中心功能

// Help页面状态
const HelpState = {
  currentSection: '',
  searchQuery: '',
  faqItems: [],
  isLoading: false
};

// DOM元素缓存
const HelpDOM = {
  // 搜索
  searchInput: null,
  searchBtn: null,
  
  // 反馈
  feedbackTextarea: null,
  
  // 部分
  conentusSection: null,
  faqSection: null,
  feedbackSection: null
};

// 初始化Help页面
function initHelpPage() {
  console.log('🚀 Help页面初始化');
  
  // 缓存DOM元素
  cacheHelpDOMElements();
  
  // 设置事件监听器
  setupHelpEventListeners();
  
  // 加载帮助数据
  loadHelpData();
  
  console.log('✅ Help页面初始化完成');
}

// 缓存DOM元素
function cacheHelpDOMElements() {
  // 搜索
  HelpDOM.searchInput = document.getElementById('help-search-input');
  HelpDOM.searchBtn = document.getElementById('help-search-btn');
  
  // 反馈
  HelpDOM.feedbackTextarea = document.getElementById('feedback-textarea');
  
  // 部分
  HelpDOM.conentusSection = document.getElementById('conentus-section');
  HelpDOM.faqSection = document.getElementById('faq-section');
  HelpDOM.feedbackSection = document.getElementById('feedback-section');
  
  console.log('🔍 缓存了', Object.keys(HelpDOM).length, '个DOM元素');
}

// 设置事件监听器
function setupHelpEventListeners() {
  // 搜索按钮点击
  if (HelpDOM.searchBtn) {
    HelpDOM.searchBtn.addEventListener('click', performHelpSearch);
  }
  
  // 搜索输入回车键
  if (HelpDOM.searchInput) {
    HelpDOM.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performHelpSearch();
      }
    });
  }
  
  console.log('🔌 设置了Help页面事件监听器');
}

// 加载帮助数据
async function loadHelpData() {
  try {
    console.log('📚 加载帮助数据...');
    
    // 设置加载状态
    setLoadingState(true);
    
    // 生成示例帮助数据
    HelpState.faqItems = generateSampleFAQ();
    
    console.log('✅ 帮助数据加载完成:', {
      faqItems: HelpState.faqItems.length
    });
    
  } catch (error) {
    console.error('❌ 加载帮助数据失败:', error);
    showErrorMessage('加载帮助数据失败，请刷新页面重试');
  } finally {
    // 清除加载状态
    setLoadingState(false);
  }
}

// 生成示例FAQ数据
function generateSampleFAQ() {
  return [
    {
      id: 'faq-1',
      question: '如何搜索特定的研究内容？',
      answer: '使用Research页面的高级搜索功能，可以按类型、时间范围和排序方式进行筛选。输入关键词后，系统会实时显示相关结果。',
      category: 'search',
      tags: ['搜索', '研究', '筛选']
    },
    {
      id: 'faq-2',
      question: '如何收藏感兴趣的内容？',
      answer: '在文章、项目或工具页面点击"收藏"按钮，内容将自动添加到Saved页面。您可以在Saved页面管理和组织收藏内容。',
      category: 'saved',
      tags: ['收藏', '管理', '组织']
    },
    {
      id: 'faq-3',
      question: '数据应用需要付费吗？',
      answer: '目前所有数据应用都是免费的。我们提供Sector Performance Dashboard和BTC Game Theory Tool等工具，供用户免费使用。',
      category: 'data-apps',
      tags: ['数据应用', '免费', '工具']
    },
    {
      id: 'faq-4',
      question: '如何重置我的搜索筛选？',
      answer: '在Research页面，点击筛选栏旁边的"重置"按钮或选择"全部"选项来清除所有筛选条件。',
      category: 'search',
      tags: ['重置', '筛选', '清除']
    },
    {
      id: 'faq-5',
      question: '我可以导出我的收藏数据吗？',
      answer: '是的，在Saved页面，您可以使用"导出JSON"或"导出CSV"按钮将收藏内容导出为文件格式。',
      category: 'saved',
      tags: ['导出', '数据', '备份']
    },
    {
      id: 'faq-6',
      question: '项目库中的工具如何访问？',
      answer: '在Tools页面，点击项目卡片中的"查看详情"按钮，然后在项目详情页中找到工具链接。',
      category: 'projects',
      tags: ['工具', '访问', '项目']
    },
    {
      id: 'faq-7',
      question: '网站支持哪些浏览器？',
      answer: '我们支持最新版本的Chrome、Firefox、Safari和Edge浏览器。建议保持浏览器更新以获得最佳体验。',
      category: 'general',
      tags: ['浏览器', '兼容性', '支持']
    },
    {
      id: 'faq-8',
      question: '如何报告网站错误或问题？',
      answer: '请在Help页面的Feedback部分报告问题，提供详细的步骤描述和截图，我们会尽快处理。',
      category: 'feedback',
      tags: ['报告', '错误', '问题']
    }
  ];
}

// 导航到特定部分
function navigateToSection(sectionId) {
  console.log('📍 导航到部分:', sectionId);
  
  HelpState.currentSection = sectionId;
  
  // 滚动到对应部分
  const sectionElement = document.getElementById(`${sectionId}-section`);
  if (sectionElement) {
    sectionElement.scrollIntoView({ behavior: 'smooth' });
    
    // 高亮显示（可选）
    highlightSection(sectionId);
  }
  
  // 更新URL hash
  window.location.hash = sectionId;
}

// 高亮显示部分
function highlightSection(sectionId) {
  // 移除所有高亮
  const sections = ['conentus', 'faq', 'feedback'];
  sections.forEach(id => {
    const element = document.getElementById(`${id}-section`);
    if (element) {
      element.classList.remove('border-2', 'border-primary/50');
    }
  });
  
  // 添加高亮
  const targetElement = document.getElementById(`${sectionId}-section`);
  if (targetElement) {
    targetElement.classList.add('border-2', 'border-primary/50');
    
    // 3秒后移除高亮
    setTimeout(() => {
      targetElement.classList.remove('border-2', 'border-primary/50');
    }, 3000);
  }
}

// 执行帮助搜索
function performHelpSearch() {
  if (!HelpDOM.searchInput) return;
  
  const query = HelpDOM.searchInput.value.trim();
  
  if (!query) {
    showMessage('请输入搜索关键词');
    return;
  }
  
  console.log('🔍 在帮助中搜索:', query);
  
  // 在实际应用中，这里会搜索FAQ和帮助文档
  // 这里只是演示
  
  // 查找匹配的FAQ
  const matchingFAQs = HelpState.faqItems.filter(item => 
    item.question.toLowerCase().includes(query.toLowerCase()) ||
    item.answer.toLowerCase().includes(query.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
  
  if (matchingFAQs.length > 0) {
    showMessage(`找到 ${matchingFAQs.length} 个相关结果`);
    
    // 导航到FAQ部分并显示结果
    navigateToSection('faq');
    
    // 在实际应用中，可以高亮显示匹配结果
    // 这里只是控制台日志
    console.log('匹配的FAQ:', matchingFAQs.map(f => f.question));
  } else {
    showMessage(`没有找到关于"${query}"的帮助内容`);
  }
}

// 报告问题
function reportIssue() {
  console.log('🐛 报告问题');
  
  // 在实际应用中，这里会打开问题报告表单
  // 这里只是演示
  
  showMessage('问题报告功能需要用户登录');
  
  // 导航到反馈部分
  navigateToSection('feedback');
  
  // 预填文本
  if (HelpDOM.feedbackTextarea) {
    HelpDOM.feedbackTextarea.value = '问题描述：\n\n重现步骤：\n1. \n2. \n3. \n\n期望结果：\n\n实际结果：\n\n浏览器/设备信息：';
    HelpDOM.feedbackTextarea.focus();
  }
}

// 请求功能
function requestFeature() {
  console.log('✨ 请求功能');
  
  // 在实际应用中，这里会打开功能请求表单
  // 这里只是演示
  
  showMessage('功能请求功能需要用户登录');
  
  // 导航到反馈部分
  navigateToSection('feedback');
  
  // 预填文本
  if (HelpDOM.feedbackTextarea) {
    HelpDOM.feedbackTextarea.value = '功能请求：\n\n功能描述：\n\n使用场景：\n\n期望效果：\n\n优先级：高/中/低';
    HelpDOM.feedbackTextarea.focus();
  }
}

// 提交反馈
function submitFeedback() {
  if (!HelpDOM.feedbackTextarea) return;
  
  const feedback = HelpDOM.feedbackTextarea.value.trim();
  
  if (!feedback) {
    showMessage('请输入反馈内容');
    return;
  }
  
  console.log('📤 提交反馈:', feedback.substring(0, 50) + '...');
  
  // 在实际应用中，这里会发送到服务器
  // 这里只是演示
  
  // 显示成功消息
  showMessage('感谢您的反馈！我们已收到您的提交。');
  
  // 清空文本域
  HelpDOM.feedbackTextarea.value = '';
  
  // 显示确认
  const confirmation = document.createElement('div');
  confirmation.className = 'mt-4 p-4 bg-green-600/10 border border-green-600/20 rounded-lg';
  confirmation.innerHTML = `
    <div class="flex items-center">
      <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <div>
        <div class="text-white font-medium">反馈提交成功</div>
        <div class="text-green-600 text-sm">我们将在24小时内查看您的反馈</div>
      </div>
    </div>
  `;
  
  const feedbackSection = document.getElementById('feedback-section');
  if (feedbackSection) {
    const form = feedbackSection.querySelector('form') || feedbackSection.querySelector('.mt-6');
    if (form) {
      form.parentNode.insertBefore(confirmation, form.nextSibling);
      
      // 5秒后移除确认
      setTimeout(() => {
        if (confirmation.parentNode) {
          confirmation.parentNode.removeChild(confirmation);
        }
      }, 5000);
    }
  }
}

// 设置加载状态
function setLoadingState(isLoading) {
  HelpState.isLoading = isLoading;
  
  if (isLoading) {
    console.log('⏳ 帮助数据加载中...');
  } else {
    console.log('✅ 帮助数据加载完成');
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

// 处理URL hash变化
function handleHashChange() {
  const hash = window.location.hash.substring(1); // 移除#号
  if (hash && ['conentus', 'faq', 'feedback'].includes(hash)) {
    navigateToSection(hash);
  }
}

// 页面加载完成后处理hash
window.addEventListener('DOMContentLoaded', () => {
  // 延迟处理，确保页面完全加载
  setTimeout(() => {
    handleHashChange();
  }, 100);
});

// 监听hash变化
window.addEventListener('hashchange', handleHashChange);

// 全局访问
window.initHelpPage = initHelpPage;
window.navigateToSection = navigateToSection;
window.reportIssue = reportIssue;
window.requestFeature = requestFeature;
window.submitFeedback = submitFeedback;