// 滚动显现动画
document.addEventListener('DOMContentLoaded', function() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.8;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < triggerBottom) {
        element.classList.add('revealed');
      }
    });
  };
  
  // 初始检查
  revealOnScroll();
  
  // 滚动监听
  window.addEventListener('scroll', revealOnScroll, { passive: true });
});

// 页面加载动画
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
});
