// 用户评价轮播交互脚本
document.addEventListener('DOMContentLoaded', function() {
  const track = document.getElementById('testimonial-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const indicators = document.querySelectorAll('.carousel-indicator');
  
  let currentSlide = 0;
  const totalSlides = 3;
  let autoplayInterval;
  
  // 更新轮播位置
  function updateCarousel() {
    const slideWidth = track.querySelector('.carousel-slide').offsetWidth;
    track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    
    // 更新指示器
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSlide);
    });
    
    // 更新按钮状态
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
  }
  
  // 下一张
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }
  
  // 上一张
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }
  
  // 跳转到指定幻灯片
  function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    resetAutoplay();
  }
  
  // 自动播放
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }
  
  // 重置自动播放
  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }
  
  // 事件监听
  nextBtn.addEventListener('click', function() {
    nextSlide();
    resetAutoplay();
  });
  
  prevBtn.addEventListener('click', function() {
    prevSlide();
    resetAutoplay();
  });
  
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function() {
      goToSlide(index);
    });
  });
  
  // 触摸支持
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  track.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoplay();
    }
  }
  
  // 悬停暂停
  const carousel = document.querySelector('.testimonials-carousel');
  carousel.addEventListener('mouseenter', function() {
    clearInterval(autoplayInterval);
  });
  
  carousel.addEventListener('mouseleave', function() {
    startAutoplay();
  });
  
  // 初始化
  updateCarousel();
  startAutoplay();
  
  // 窗口大小改变时重新计算
  window.addEventListener('resize', function() {
    updateCarousel();
  });
});
