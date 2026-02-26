// FAQs 组件交互脚本
document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');
    
    question.addEventListener('click', function() {
      const isOpen = answer.classList.contains('hidden');
      
      // 关闭所有其他 FAQ
      faqItems.forEach(otherItem => {
        const otherAnswer = otherItem.querySelector('.faq-answer');
        const otherIcon = otherItem.querySelector('.faq-icon');
        if (otherAnswer !== answer) {
          otherAnswer.classList.add('hidden');
          otherIcon.classList.remove('rotate-180');
        }
      });
      
      // 切换当前 FAQ
      if (isOpen) {
        answer.classList.remove('hidden');
        icon.classList.add('rotate-180');
      } else {
        answer.classList.add('hidden');
        icon.classList.remove('rotate-180');
      }
    });
  });
});
