/* ========================================
   浪漫纪念网站 - JavaScript
   800天纪念
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initEnvelopeAnimation();
    initParticles();
    initHearts();
    initNavigation();
    initCountdown();
    initComicViewer();
    initPhotoSlideshow();  // 新的动态相册
    initSecretMessage();
    initMusicPlayer();
    initScrollAnimations();
    initFloatingPhotos();  // 浮动照片效果
});

/* ========================================
   信封开场动画
   ======================================== */
function initEnvelopeAnimation() {
    const overlay = document.getElementById('opening-overlay');
    const envelope = document.querySelector('.envelope');
    const mainContent = document.getElementById('main-content');
    const envelopeContainer = document.querySelector('.envelope-container');
    
    let isOpen = false;
    
    envelopeContainer.addEventListener('click', function() {
        if (!isOpen) {
            // 第一次点击：打开信封
            envelope.classList.add('open');
            isOpen = true;
            
            // 更新提示文字
            document.querySelector('.click-hint').textContent = '再次点击进入我的世界 💕';
        } else {
            // 第二次点击：进入主页面
            overlay.classList.add('fade-out');
            
            setTimeout(function() {
                overlay.style.display = 'none';
                mainContent.classList.remove('hidden');
                
                // 触发入场动画
                triggerEntryAnimations();
                
                // 尝试播放音乐
                tryPlayMusic();
            }, 1000);
        }
    });
}

/* ========================================
   可爱星星粒子效果
   ======================================== */
function initParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // 可爱的符号
    const symbols = ['⭐', '✨', '💫', '🌟', '⚡', '🎀'];
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    
    // 随机属性
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 10;
    const size = Math.random() * 10 + 12;
    
    particle.style.cssText = `
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        font-size: ${size}px;
    `;
    
    container.appendChild(particle);
}

/* ========================================
   漂浮爱心效果
   ======================================== */
function initHearts() {
    // 随机漂浮爱心
    setInterval(createRandomHeart, 3000);
    
    // 点击产生爱心
    document.addEventListener('click', function(e) {
        createHeartAtPosition(e.clientX, e.clientY);
    });
}

function createRandomHeart() {
    const container = document.getElementById('hearts-container');
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    
    // 可爱的符号混合
    const symbols = ['💕', '💗', '💖', '🐕', '🐶', '🌸', '🎀', '💝', '✨', '🌟'];
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    
    heart.style.cssText = `
        left: ${Math.random() * 100}%;
        bottom: -50px;
        font-size: ${Math.random() * 20 + 18}px;
        animation-duration: ${Math.random() * 3 + 4}s;
    `;
    
    container.appendChild(heart);
    
    setTimeout(() => heart.remove(), 7000);
}

function createHeartAtPosition(x, y) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = '💕';
    
    heart.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        font-size: 25px;
        animation-duration: 2s;
        position: fixed;
    `;
    
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 2000);
}

/* ========================================
   导航功能
   ======================================== */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // 平滑滚动
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // 滚动时高亮当前区域
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

/* ========================================
   相爱计时器
   ======================================== */
function initCountdown() {
    // 设置开始日期 (800天前是2023年10月19日左右)
    // 2025年12月27日是第800天
    const startDate = new Date('2023-10-19T00:00:00');
    
    function updateCounter() {
        const now = new Date();
        const diff = now - startDate;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days-count').textContent = days;
        document.getElementById('hours-count').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes-count').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds-count').textContent = String(seconds).padStart(2, '0');
    }
    
    updateCounter();
    setInterval(updateCounter, 1000);
}

/* ========================================
   漫画查看器
   ======================================== */
function initComicViewer() {
    const comicCards = document.querySelectorAll('.comic-card');
    const viewer = document.getElementById('comic-viewer');
    const viewerImage = document.getElementById('viewer-image');
    const closeBtn = viewer.querySelector('.close-btn');
    const prevBtn = document.getElementById('prev-comic');
    const nextBtn = document.getElementById('next-comic');
    
    let currentIndex = 0;
    const comicImages = [];
    
    // 收集所有漫画图片
    comicCards.forEach((card, index) => {
        const img = card.querySelector('img');
        comicImages.push(img.src);
        
        card.addEventListener('click', function() {
            currentIndex = index;
            showComic(currentIndex);
            viewer.classList.add('active');
        });
    });
    
    function showComic(index) {
        viewerImage.src = comicImages[index];
    }
    
    // 导航按钮
    prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + comicImages.length) % comicImages.length;
        showComic(currentIndex);
    });
    
    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % comicImages.length;
        showComic(currentIndex);
    });
    
    // 关闭按钮
    closeBtn.addEventListener('click', function() {
        viewer.classList.remove('active');
    });
    
    // 点击背景关闭
    viewer.addEventListener('click', function(e) {
        if (e.target === viewer) {
            viewer.classList.remove('active');
        }
    });
    
    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (!viewer.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + comicImages.length) % comicImages.length;
            showComic(currentIndex);
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % comicImages.length;
            showComic(currentIndex);
        } else if (e.key === 'Escape') {
            viewer.classList.remove('active');
        }
    });
}

/* ========================================
   动态照片幻灯片 (支持200+照片)
   ======================================== */
// 配置：设置你的照片数量
const TOTAL_PHOTOS = 200; // 修改这个数字为你实际的照片数量
const AUTOPLAY_INTERVAL = 3000; // 自动播放间隔（毫秒）

let currentPhotoIndex = 0;
let isAutoPlaying = true;
let autoPlayTimer = null;

// 照片特殊日期和消息配置
const photoMilestones = {
    1: { day: '第 1 天', message: '我们相遇的那一天 🌸' },
    50: { day: '第 50 天', message: '越来越喜欢你 💕' },
    100: { day: '第 100 天', message: '确认心意，你就是我要找的人 💗' },
    150: { day: '第 150 天', message: '每一天都想见到你 🐕' },
    200: { day: '第 200 天', message: '第一次一起旅行 ✈️' },
    250: { day: '第 250 天', message: '有你的日子都是晴天 ☀️' },
    300: { day: '第 300 天', message: '习惯了有你的每一天 🌈' },
    365: { day: '第 365 天', message: '一周年纪念！感谢有你 🎂' },
    400: { day: '第 400 天', message: '爱你的心从未改变 💖' },
    500: { day: '第 500 天', message: '约定未来，一起走下去 💍' },
    600: { day: '第 600 天', message: '感谢每一个有你的日子 🌟' },
    700: { day: '第 700 天', message: '圣诞快乐！我最爱的你 🎄' },
    750: { day: '第 750 天', message: '新年快乐！2026我们继续 🎆' },
    800: { day: '第 800 天', message: '800天纪念！我爱你！💕🐕💕' }
};

function initPhotoSlideshow() {
    const mainPhoto = document.getElementById('main-photo');
    const photoCounter = document.getElementById('photo-counter');
    const currentDay = document.getElementById('current-day');
    const photoMessage = document.getElementById('photo-message');
    const prevBtn = document.getElementById('prev-photo');
    const nextBtn = document.getElementById('next-photo');
    const autoplayBtn = document.getElementById('toggle-autoplay');
    const thumbnailContainer = document.getElementById('thumbnails');
    
    // 生成缩略图（只显示部分，循环滚动）
    generateThumbnails(thumbnailContainer);
    
    // 初始化里程碑按钮
    initMilestoneButtons();
    
    // 显示第一张照片
    updatePhoto(0);
    
    // 上一张/下一张按钮
    prevBtn.addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex - 1 + TOTAL_PHOTOS) % TOTAL_PHOTOS;
        updatePhoto(currentPhotoIndex);
        resetAutoPlay();
    });
    
    nextBtn.addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex + 1) % TOTAL_PHOTOS;
        updatePhoto(currentPhotoIndex);
        resetAutoPlay();
    });
    
    // 自动播放切换
    autoplayBtn.addEventListener('click', () => {
        isAutoPlaying = !isAutoPlaying;
        if (isAutoPlaying) {
            autoplayBtn.textContent = '⏸️ 自动播放中';
            autoplayBtn.classList.add('playing');
            startAutoPlay();
        } else {
            autoplayBtn.textContent = '▶️ 点击播放';
            autoplayBtn.classList.remove('playing');
            stopAutoPlay();
        }
    });
    
    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            currentPhotoIndex = (currentPhotoIndex - 1 + TOTAL_PHOTOS) % TOTAL_PHOTOS;
            updatePhoto(currentPhotoIndex);
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            currentPhotoIndex = (currentPhotoIndex + 1) % TOTAL_PHOTOS;
            updatePhoto(currentPhotoIndex);
            resetAutoPlay();
        }
    });
    
    // 开始自动播放
    startAutoPlay();
    
    // 点击主照片打开大图
    mainPhoto.parentElement.addEventListener('click', () => {
        openPhotoViewer(currentPhotoIndex);
    });
}

function updatePhoto(index) {
    const mainPhoto = document.getElementById('main-photo');
    const photoCounter = document.getElementById('photo-counter');
    const currentDay = document.getElementById('current-day');
    const photoMessage = document.getElementById('photo-message');
    
    // 照片编号从1开始
    const photoNum = index + 1;
    
    // 添加过渡动画
    mainPhoto.style.opacity = '0';
    mainPhoto.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        // 更新照片源
        mainPhoto.src = `photos/${photoNum}.jpg`;
        mainPhoto.onerror = function() {
            this.src = `https://via.placeholder.com/800x600/FFB6C1/FFF?text=照片${photoNum}`;
        };
        
        // 更新计数器
        photoCounter.textContent = `${photoNum} / ${TOTAL_PHOTOS}`;
        
        // 更新日期和消息
        const milestone = photoMilestones[photoNum];
        if (milestone) {
            currentDay.textContent = milestone.day;
            currentDay.style.background = 'linear-gradient(135deg, var(--pink-heart), var(--pink-main))';
            currentDay.style.color = 'white';
            photoMessage.textContent = milestone.message;
        } else {
            currentDay.textContent = `第 ${photoNum} 天`;
            currentDay.style.background = 'linear-gradient(135deg, var(--star-yellow), var(--moon-cream))';
            currentDay.style.color = 'var(--text-dark)';
            photoMessage.textContent = getRandomMessage();
        }
        
        // 恢复显示
        mainPhoto.style.opacity = '1';
        mainPhoto.style.transform = 'scale(1)';
        
        // 更新缩略图高亮
        updateThumbnailHighlight(index);
        
        // 创建爱心效果
        if (Math.random() > 0.7) {
            createHeartAtPosition(
                Math.random() * window.innerWidth,
                Math.random() * 300 + 200
            );
        }
    }, 200);
}

function getRandomMessage() {
    const messages = [
        '每一天都因你而美好 💕',
        '有你真好 🐕',
        '幸福的每一刻 ✨',
        '爱你的日常 💗',
        '甜蜜的回忆 🌸',
        '和你在一起的时光 🌟',
        '我们的小确幸 💖',
        '想你的每一天 🐶',
        '爱在每个瞬间 💝',
        '这就是幸福 ⭐'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function generateThumbnails(container) {
    // 生成两倍的缩略图用于无缝滚动
    const thumbCount = Math.min(TOTAL_PHOTOS, 30); // 显示30张缩略图
    
    for (let round = 0; round < 2; round++) {
        for (let i = 0; i < thumbCount; i++) {
            const photoIndex = Math.floor(i * (TOTAL_PHOTOS / thumbCount));
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail';
            thumb.dataset.index = photoIndex;
            thumb.innerHTML = `<img src="photos/${photoIndex + 1}.jpg" alt="照片${photoIndex + 1}" onerror="this.src='https://via.placeholder.com/100x100/FFB6C1/FFF?text=${photoIndex + 1}'">`;
            
            thumb.addEventListener('click', () => {
                currentPhotoIndex = photoIndex;
                updatePhoto(photoIndex);
                resetAutoPlay();
            });
            
            container.appendChild(thumb);
        }
    }
}

function updateThumbnailHighlight(index) {
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        if (parseInt(thumb.dataset.index) === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

function initMilestoneButtons() {
    const buttons = document.querySelectorAll('.milestone-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const day = parseInt(btn.dataset.day);
            if (day <= TOTAL_PHOTOS) {
                currentPhotoIndex = day - 1;
                updatePhoto(currentPhotoIndex);
                resetAutoPlay();
                
                // 滚动到照片区域
                document.getElementById('memories').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
}

function startAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
        if (isAutoPlaying) {
            currentPhotoIndex = (currentPhotoIndex + 1) % TOTAL_PHOTOS;
            updatePhoto(currentPhotoIndex);
        }
    }, AUTOPLAY_INTERVAL);
}

function stopAutoPlay() {
    if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
    }
}

function resetAutoPlay() {
    if (isAutoPlaying) {
        stopAutoPlay();
        startAutoPlay();
    }
}

function openPhotoViewer(index) {
    const viewer = document.getElementById('photo-viewer');
    const viewerImage = document.getElementById('photo-viewer-image');
    const closeBtn = viewer.querySelector('.close-btn');
    
    viewerImage.src = `photos/${index + 1}.jpg`;
    viewerImage.onerror = function() {
        this.src = `https://via.placeholder.com/1200x800/FFB6C1/FFF?text=照片${index + 1}`;
    };
    viewer.classList.add('active');
    
    // 暂停自动播放
    const wasPlaying = isAutoPlaying;
    isAutoPlaying = false;
    stopAutoPlay();
    
    const closeViewer = () => {
        viewer.classList.remove('active');
        // 恢复自动播放
        if (wasPlaying) {
            isAutoPlaying = true;
            startAutoPlay();
            document.getElementById('toggle-autoplay').textContent = '⏸️ 自动播放中';
            document.getElementById('toggle-autoplay').classList.add('playing');
        }
    };
    
    closeBtn.onclick = closeViewer;
    viewer.onclick = (e) => {
        if (e.target === viewer) closeViewer();
    };
}

/* ========================================
   浮动照片效果
   ======================================== */
function initFloatingPhotos() {
    const container = document.getElementById('floating-photos');
    if (!container) return;
    
    // 创建几张浮动的小照片
    const floatingCount = 6;
    
    for (let i = 0; i < floatingCount; i++) {
        createFloatingPhoto(container, i);
    }
}

function createFloatingPhoto(container, index) {
    const photo = document.createElement('div');
    photo.className = 'floating-photo';
    
    const randomPhotoNum = Math.floor(Math.random() * TOTAL_PHOTOS) + 1;
    photo.innerHTML = `<img src="photos/${randomPhotoNum}.jpg" alt="" onerror="this.parentElement.style.display='none'">`;
    
    // 随机位置
    const positions = [
        { left: '5%', top: '20%' },
        { right: '5%', top: '30%' },
        { left: '8%', bottom: '25%' },
        { right: '8%', bottom: '20%' },
        { left: '3%', top: '60%' },
        { right: '3%', top: '50%' }
    ];
    
    const pos = positions[index % positions.length];
    Object.assign(photo.style, pos);
    photo.style.animationDelay = `${index * 2}s`;
    
    container.appendChild(photo);
    
    // 定期更换浮动照片
    setInterval(() => {
        const newPhotoNum = Math.floor(Math.random() * TOTAL_PHOTOS) + 1;
        photo.querySelector('img').src = `photos/${newPhotoNum}.jpg`;
    }, 10000 + index * 2000);
}

/* ========================================
   秘密惊喜
   ======================================== */
function initSecretMessage() {
    const secretTrigger = document.getElementById('secret');
    const secretPopup = document.getElementById('secret-popup');
    const closeBtn = secretPopup.querySelector('.close-btn');
    const closeSecretBtn = secretPopup.querySelector('.close-secret-btn');
    
    secretTrigger.addEventListener('click', function() {
        secretPopup.classList.add('active');
        createFireworks();
    });
    
    function closePopup() {
        secretPopup.classList.remove('active');
        // 关闭时创建更多爱心
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createHeartAtPosition(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight
                );
            }, i * 100);
        }
    }
    
    closeBtn.addEventListener('click', closePopup);
    closeSecretBtn.addEventListener('click', closePopup);
    
    secretPopup.addEventListener('click', function(e) {
        if (e.target === secretPopup) {
            closePopup();
        }
    });
}

function createFireworks() {
    const fireworksContainer = document.querySelector('.fireworks');
    
    // 可爱的符号烟花
    const cuteEmojis = ['⭐', '🌟', '✨', '💫', '🎀', '💕', '🐕', '🐶', '🌸', '💖'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.textContent = cuteEmojis[Math.floor(Math.random() * cuteEmojis.length)];
            firework.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 20 + 15}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: fireworkBurst 1s ease-out forwards;
            `;
            
            fireworksContainer.appendChild(firework);
            
            setTimeout(() => firework.remove(), 1000);
        }, i * 50);
    }
}

// 添加烟花动画样式
const fireworkStyle = document.createElement('style');
fireworkStyle.textContent = `
    @keyframes fireworkBurst {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        50% {
            transform: scale(1.5);
            opacity: 0.8;
        }
        100% {
            transform: scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(fireworkStyle);

/* ========================================
   音乐播放器
   ======================================== */
let isPlaying = false;

function initMusicPlayer() {
    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bgMusic');
    
    musicBtn.addEventListener('click', function() {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.textContent = '🎵';
            musicBtn.classList.remove('playing');
        } else {
            bgMusic.play().catch(function(error) {
                console.log('音乐播放失败，需要用户交互');
            });
            musicBtn.textContent = '🔊';
            musicBtn.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
}

function tryPlayMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('music-toggle');
    
    bgMusic.play().then(function() {
        isPlaying = true;
        musicBtn.textContent = '🔊';
        musicBtn.classList.add('playing');
    }).catch(function(error) {
        console.log('自动播放被阻止，请点击音乐按钮播放');
    });
}

/* ========================================
   滚动动画
   ======================================== */
function initScrollAnimations() {
    // 使用Intersection Observer监测元素进入视口
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // 监测时间线项目
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });
    
    // 监测漫画卡片
    document.querySelectorAll('.comic-card').forEach(card => {
        observer.observe(card);
    });
    
    // 监测相册项目
    document.querySelectorAll('.gallery-item').forEach(item => {
        observer.observe(item);
    });
    
    // 监测承诺项目
    document.querySelectorAll('.promise-item').forEach(item => {
        observer.observe(item);
    });
}

/* ========================================
   入场动画
   ======================================== */
function triggerEntryAnimations() {
    // 为主要元素添加延迟动画
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.animation = 'fadeInUp 1s ease forwards';
    
    // 添加入场动画样式
    const entryStyle = document.createElement('style');
    entryStyle.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-in {
            animation: fadeInUp 0.8s ease forwards;
        }
    `;
    document.head.appendChild(entryStyle);
}

/* ========================================
   特殊日期检测
   ======================================== */
function checkSpecialDates() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // 圣诞节
    if (month === 12 && day === 25) {
        showSpecialBanner('🎄 圣诞节快乐！愿这个特别的日子充满爱与温暖 🎄');
    }
    
    // 800天纪念日
    if (month === 12 && day === 27) {
        showSpecialBanner('💕 今天是我们在一起的第800天！这是属于我们的特别日子 💕');
    }
    
    // 新年
    if (month === 1 && day === 1) {
        showSpecialBanner('🎆 新年快乐！愿新的一年我们更加幸福 🎆');
    }
}

function showSpecialBanner(message) {
    const banner = document.createElement('div');
    banner.className = 'special-date-banner';
    banner.innerHTML = `<p>${message}</p>`;
    banner.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        width: 100%;
        padding: 15px;
        background: linear-gradient(135deg, #C41E3A, #D4AF37);
        color: white;
        text-align: center;
        font-family: var(--font-elegant);
        font-size: 18px;
        z-index: 999;
        animation: slideDown 0.5s ease forwards;
    `;
    
    document.body.appendChild(banner);
}

// 页面加载完成后检测特殊日期
setTimeout(checkSpecialDates, 2000);

/* ========================================
   彩蛋：连续点击logo触发
   ======================================== */
let clickCount = 0;
let clickTimer = null;

document.addEventListener('DOMContentLoaded', function() {
    const badge = document.querySelector('.anniversary-badge');
    
    if (badge) {
        badge.addEventListener('click', function() {
            clickCount++;
            
            if (clickTimer) clearTimeout(clickTimer);
            
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 3000);
            
            if (clickCount >= 8) {
                showEasterEgg();
                clickCount = 0;
            }
        });
    }
});

function showEasterEgg() {
    // 创建满屏可爱符号雨
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const item = document.createElement('div');
            item.className = 'floating-heart';
            // 可爱符号混合 - 线条小狗风格
            const cuteSymbols = ['🐕', '🐶', '💕', '💗', '🌸', '⭐', '✨', '🎀', '💖', '🌟', '🐾', '💝'];
            item.textContent = cuteSymbols[Math.floor(Math.random() * cuteSymbols.length)];
            item.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}vw;
                top: -50px;
                font-size: ${Math.random() * 30 + 20}px;
                animation: cuteRain ${Math.random() * 3 + 2}s linear forwards;
                z-index: 9999;
            `;
            document.body.appendChild(item);
            
            setTimeout(() => item.remove(), 5000);
        }, i * 30);
    }
    
    // 添加可爱雨动画
    const cuteRainStyle = document.createElement('style');
    cuteRainStyle.textContent = `
        @keyframes cuteRain {
            0% {
                transform: translateY(0) rotate(0deg) scale(0.5);
                opacity: 1;
            }
            50% {
                transform: translateY(50vh) rotate(180deg) scale(1.2);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg) scale(0.8);
                opacity: 0.3;
            }
        }
    `;
    document.head.appendChild(cuteRainStyle);
}

/* ========================================
   性能优化：页面不可见时暂停动画
   ======================================== */
document.addEventListener('visibilitychange', function() {
    const particles = document.querySelectorAll('.particle');
    const hearts = document.querySelectorAll('.floating-heart');
    
    if (document.hidden) {
        particles.forEach(p => p.style.animationPlayState = 'paused');
        hearts.forEach(h => h.style.animationPlayState = 'paused');
    } else {
        particles.forEach(p => p.style.animationPlayState = 'running');
        hearts.forEach(h => h.style.animationPlayState = 'running');
    }
});

console.log('%c🐕💕 汪~ 这是一个充满爱的网站 💕🐶', 'font-size: 20px; color: #FF6B8A;');
console.log('%c献给我最爱的你 - 800天纪念 🐾', 'font-size: 14px; color: #5BB5C5;');

