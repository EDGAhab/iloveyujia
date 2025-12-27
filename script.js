/* ========================================
   浪漫纪念网站 - JavaScript
   800天纪念
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initEnvelopeAnimation();
    initParticles();
    initHearts();
    // initNavigation(); // 导航栏已删除
    initCountdown();
    initComics();  // 动态加载漫画
    initComicViewer();
    initPhotoSlideshow();  // 新的动态相册
    initSecretMessage();
    // initMusicPlayer(); // 音乐按钮已随导航栏删除
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
    
    const letter = document.querySelector('.letter');
    
    // 确保信件不覆盖信封：动态调整信件位置
    function adjustLetterPosition() {
        if (letter && letter.classList.contains('show')) {
            const envelopeRect = envelopeContainer.getBoundingClientRect();
            const envelopeTop = envelopeRect.top;
            const viewportHeight = window.innerHeight;
            
            // 计算信件实际高度
            const letterRect = letter.getBoundingClientRect();
            const letterHeight = letterRect.height;
            
            // 计算信件中心到信封顶部的距离（留出30px边距）
            const availableSpace = envelopeTop - 30;
            
            // 如果信件高度超过可用空间，向上调整位置
            if (letterHeight > availableSpace && availableSpace > 0) {
                // 计算需要向上偏移的距离
                const offset = (letterHeight - availableSpace) / 2;
                // 调整top位置，使信件向上移动
                letter.style.top = `calc(50% - ${offset}px)`;
            } else {
                // 如果空间足够，保持居中
                letter.style.top = '50%';
            }
        }
    }
    
    // 窗口大小改变时重新调整
    window.addEventListener('resize', adjustLetterPosition);
    
    envelopeContainer.addEventListener('click', function() {
        if (!isOpen) {
            // 第一次点击：打开信封
            envelope.classList.add('open');
            isOpen = true;
            
            // 显示信件（居中显示）
            if (letter) {
                letter.classList.add('show');
                // 延迟调整位置，等待信件内容加载
                setTimeout(adjustLetterPosition, 100);
            }
            
            // 更新提示文字
            document.querySelector('.click-hint').textContent = '再次点击进入网站！ 💕';
            
            // 在打开信的一瞬间开始播放音乐
            tryPlayMusic();
        } else {
            // 第二次点击：进入主页面
            overlay.classList.add('fade-out');
            
            setTimeout(function() {
                overlay.style.display = 'none';
                mainContent.classList.remove('hidden');
                
                // 触发入场动画
                triggerEntryAnimations();
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
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // 移动端菜单切换
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // 点击导航链接后关闭移动菜单
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
        
        // 点击外部关闭菜单
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
    
    // 平滑滚动
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // 考虑导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
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
   动态加载漫画
   ======================================== */
// 漫画文件列表 - 根据comics文件夹中的实际文件更新
const COMIC_FILES = [
    'Weixin Image_20251226161036.jpg',
    'Weixin Image_20251226161052.jpg',
    'Weixin Image_20251226161057.jpg',
    'Weixin Image_20251226161100.jpg',
    'Weixin Image_20251226161103.jpg',
    'Weixin Image_20251226161106.jpg',
    'Weixin Image_20251226161110.jpg',
    'Weixin Image_20251226161123.jpg',  // 漫画九移到第八位
    'Weixin Image_20251226161114.jpg'  // 漫画八移到第九位
];

// 每个漫画对应的照片文件夹
// 照片会自动从 comics/comic-X-photos/ 文件夹中加载
// 配置每个comic文件夹中的实际照片文件名
const COMIC_PHOTOS = {
    1: ['0108_4.jpg', '0116.jpg', '0118_2.jpg', '0131_3.jpg'], // comic-1-photos 文件夹中的照片
    2: ['0202_2.jpg', '1226_15.jpg'], // comic-2-photos 文件夹中的照片
    3: ['0113.jpg', '0114.jpg', '0127.jpg', '0129_1.jpg'], // comic-3-photos 文件夹中的照片
    4: ['0519_1.jpg', '1226_35.jpg', '1226_49.jpg', 'IMG_2358_1.jpg'], // comic-4-photos 文件夹中的照片
    5: ['0331_2.jpg', '0401_2.jpg', '0401_4.jpg', '1226_4.jpg'], // comic-5-photos 文件夹中的照片
    6: ['0405_4.jpg', '0405_5.jpg', 'IMG_1629.jpg', 'originalImage_1918065264_livephoto.jpg'], // comic-6-photos 文件夹中的照片
    7: ['0704_3.jpg', '0704_5.jpg', '0704_7.jpg', '0704_8.jpg'], // comic-7-photos 文件夹中的照片
    8: ['1108_4.jpg', '1108_7.jpg', '1108_8.jpg', 'IMG_5470.jpg'], // comic-8-photos 文件夹中的照片
    9: ['1213.jpg', '1214_1.jpg', '1214_2.jpg', '1214_3.jpg']  // comic-9-photos 文件夹中的照片
};

function initComics() {
    const gallery = document.getElementById('comics-gallery');
    if (!gallery) return;
    
    // 清空现有内容
    gallery.innerHTML = '';
    
    // 为每个漫画文件创建卡片
    COMIC_FILES.forEach((filename, index) => {
        const comicCard = document.createElement('div');
        comicCard.className = 'comic-card';
        comicCard.setAttribute('data-index', index);
        
        comicCard.innerHTML = `
            <div class="comic-frame">
                <img src="comics/${filename}" alt="漫画 ${index + 1}" loading="lazy" decoding="async" onerror="this.src='https://via.placeholder.com/400x500/FFE4E1/FF69B4?text=漫画${index + 1}'">
            </div>
        `;
        
        gallery.appendChild(comicCard);
    });
}

/* ========================================
   漫画查看器
   ======================================== */
function initComicViewer() {
    // 延迟初始化，确保漫画已加载
    setTimeout(() => {
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
            if (img) {
                comicImages.push(img.src);
                
                card.addEventListener('click', function() {
                    currentIndex = index;
                    showComic(currentIndex);
                    viewer.classList.add('active');
                });
            }
        });
        
        function showComic(index) {
            if (comicImages[index]) {
                // 显示漫画
                viewerImage.src = comicImages[index];
                
                // 显示对应的照片
                displayComicPhotos(index);
            }
        }
        
        function displayComicPhotos(comicIndex) {
            const photosGrid = document.getElementById('comic-photos-grid');
            if (!photosGrid) return;
            
            // 清空现有照片
            photosGrid.innerHTML = '';
            
            // 漫画索引从0开始，但文件夹编号从1开始
            const comicNumber = comicIndex + 1;
            const photoFolder = `comics/comic-${comicNumber}-photos/`;
            
            // 获取该comic文件夹中配置的照片列表
            const photoFiles = COMIC_PHOTOS[comicNumber] || [];
            
            // 如果没有配置，尝试加载默认的 1.jpg, 2.jpg, 3.jpg, 4.jpg
            let filesToLoad = [];
            if (photoFiles.length > 0) {
                filesToLoad = photoFiles;
            } else {
                // 尝试默认文件名
                for (let i = 1; i <= 4; i++) {
                    filesToLoad.push(`${i}.jpg`);
                }
            }
            
            let loadedCount = 0;
            let hasPhotos = false;
            
            // 加载所有配置的照片
            filesToLoad.forEach((filename, index) => {
                const photoPath = `${photoFolder}${filename}`;
                const photoItem = document.createElement('div');
                photoItem.className = 'comic-photo-item';
                
                const img = document.createElement('img');
                img.src = photoPath;
                img.alt = `照片 ${index + 1}`;
                img.onclick = () => openPhotoInViewer(photoPath);
                
                // 检测图片是否加载成功
                img.onload = function() {
                    hasPhotos = true;
                    loadedCount++;
                    photoItem.style.display = ''; // 确保显示
                };
                
                img.onerror = function() {
                    // 如果图片不存在，隐藏这个位置
                    photoItem.style.display = 'none';
                };
                
                photoItem.appendChild(img);
                photosGrid.appendChild(photoItem);
            });
            
            // 如果所有照片都加载失败，显示提示
            setTimeout(() => {
                if (!hasPhotos) {
                    photosGrid.innerHTML = '<p class="no-photos-hint">照片待添加 💕<br>请将照片放在 ' + photoFolder + ' 文件夹中</p>';
                }
            }, 1000);
        }
        
        // 在照片查看器中打开照片
        window.openPhotoInViewer = function(photoPath) {
            const photoViewer = document.getElementById('photo-viewer');
            const photoViewerImage = document.getElementById('photo-viewer-image');
            const closeBtn = photoViewer?.querySelector('.close-btn');
            
            if (photoViewer && photoViewerImage) {
                photoViewerImage.src = photoPath;
                photoViewerImage.onerror = function() {
                    this.src = 'https://via.placeholder.com/1200x800/FFB6C1/FFF?text=照片';
                };
                photoViewer.classList.add('active');
                
                // 添加关闭功能
                const closeViewer = () => {
                    photoViewer.classList.remove('active');
                };
                
                if (closeBtn) {
                    closeBtn.onclick = closeViewer;
                }
                
                photoViewer.onclick = (e) => {
                    if (e.target === photoViewer) closeViewer();
                };
                
                // ESC键关闭
                const escHandler = (e) => {
                    if (e.key === 'Escape' && photoViewer.classList.contains('active')) {
                        closeViewer();
                        document.removeEventListener('keydown', escHandler);
                    }
                };
                document.addEventListener('keydown', escHandler);
            }
        };
        
        // 导航按钮
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                currentIndex = (currentIndex - 1 + comicImages.length) % comicImages.length;
                showComic(currentIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                currentIndex = (currentIndex + 1) % comicImages.length;
                showComic(currentIndex);
            });
        }
        
        // 触摸滑动支持（移动端漫画查看器）
        let comicTouchStartX = 0;
        let comicTouchEndX = 0;
        
        if (viewerImage) {
            viewerImage.addEventListener('touchstart', (e) => {
                comicTouchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            viewerImage.addEventListener('touchend', (e) => {
                comicTouchEndX = e.changedTouches[0].screenX;
                const swipeDiff = comicTouchStartX - comicTouchEndX;
                const swipeThreshold = 50;
                
                if (Math.abs(swipeDiff) > swipeThreshold) {
                    if (swipeDiff > 0) {
                        // 向左滑动，下一张
                        currentIndex = (currentIndex + 1) % comicImages.length;
                        showComic(currentIndex);
                    } else {
                        // 向右滑动，上一张
                        currentIndex = (currentIndex - 1 + comicImages.length) % comicImages.length;
                        showComic(currentIndex);
                    }
                }
            }, { passive: true });
        }
        
        // 关闭按钮
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                viewer.classList.remove('active');
            });
        }
        
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
    }, 100);
}

/* ========================================
   动态照片幻灯片 (支持200+照片)
   ======================================== */
// 照片文件列表 - 按文件名排序（从实际文件夹中获取的所有照片）
const PHOTO_FILES = [
    '0108_2.jpg', '0108_4.jpg', '0110_2.jpg', '0113.jpg', '0114.jpg', '0116.jpg', '0118_2.jpg', '0118_3.jpg',
    '0120.jpg', '0121.jpg', '0122_4.jpg', '0123.jpg', '0124.jpg', '0125_1.jpg', '0125_2.jpg', '0127.jpg', '0129_1.jpg',
    '0129_4.jpg', '0129_6.jpg', '0129_7.jpg', '0129_9.jpg', '0131_3.jpg', '0201.jpg', '0202_2.jpg', '0205_1.jpg',
    '0208_2.jpg', '0211_1.jpg', '0212_3.jpg', '0212_4.jpg', '0212_6.jpg', '0214.jpg', '0215_2.jpg', '0222_1.jpg',
    '0222_2.jpg', '0228.jpg', '0302.jpg', '0309_1.jpg', '0309_2.jpg', '0309_3.jpg', '0309_4.jpg', '0309_5.jpg',
    '0309_51.jpg', '0309_6.jpg', '0309_7.jpg', '0309_71.jpg', '0309_8.jpg', '0309_9.jpg', '0311_2.jpg', '0314_3.jpg',
    '0318_1.jpg', '0319.jpg', '0320_4.jpg', '0321.jpg', '0324_1.jpg', '0325.jpg', '0328_2.jpg', '0328_8.jpg',
    '0328_9.jpg', '0329_2.jpg', '0331_1743471649.jpg', '0405_1.jpg', '0405_4.jpg', '0405_5.jpg', '0405_7.jpg',
    '0405_8.jpg', '0405_9.jpg', '0406.jpg', '0407_1.jpg', '0407_2.jpg', '0412.jpg', '0414_1.jpg', '0426_1.jpg',
    '0426_4.jpg', '0512.jpg', '0516_2.jpg', '0517_4.jpg', '0519_1.jpg', '0519_2.jpg', '0519_4.jpg', '0519_5.jpg',
    '0519_6.jpg', '0521.jpg', '0602_1.jpg', '0603_1.jpg', '0607.jpg', '0608_6.jpg', '0614_1.jpg', '0615_2.jpg',
    '0616.jpg', '0620.jpg', '0621_1.jpg', '0621_2.jpg', '0629.jpg', '0629_05.jpg', '0629_10.jpg',
    '0629_2.jpg', '0629_3.jpg', '0629_7.jpg', '0704_3.jpg', '0704_5.jpg', '0704_8 (2).jpg',
    '0706_1.jpg', '0708.jpg', '0714_1.jpg', '0725_2.jpg', '0727_2.jpg', '0802_1.jpg', '0807.jpg', '0808.jpg',
    '0810_1.jpg', '0810_2.jpg', '0814_2.jpg', '0816.jpg', '0817_1.jpg', '0817_3.jpg', '0820.jpg', '0825_2.jpg', '0827_1.jpg',
    '0831_4.jpg', '0904.jpg', '0907_3.jpg', '0907_4.jpg', '0908_3.jpg', '0915_2.jpg', '0918_1.jpg', '0919.jpg',
    '0921_2.jpg', '0922_1.jpg', '0929_2.jpg', '1003_2.jpg', '1019_5.jpg', '1019_7.jpg', '1019_8.jpg', '1019_9.jpg', '1031_1.jpg',
    '1107.jpg', '1108_2.jpg', '1108_3.jpg', '1108_4.jpg', '1108_7.jpg', '1108_8.jpg', '1108_9.jpg', '1110.jpg',
    '1126_1.jpg', '1128_1.jpg', '1202_2.jpg', '1202_3.jpg', '1213.jpg', '1214_1.jpg', '1214_2.jpg', '1214_3.jpg', '1222_2.jpg',
    '1225_1.jpg'
];

// 配置：照片数量自动从文件列表获取
const TOTAL_PHOTOS = PHOTO_FILES.length;
const AUTOPLAY_INTERVAL = 3000; // 自动播放间隔（毫秒）

// 开始日期：2023年10月19日
const START_DATE = new Date('2023-10-19T00:00:00');

// 照片字幕配置 - 为每张照片设置字幕（placeholder，待填写）
const PHOTO_CAPTIONS = {
    // 使用照片编号作为key，对应时间顺序的第几张照片
    // 格式：数字: '字幕内容'
    1: '到加州啦，大包小包的下飞机了',
    2: '一切开始的地方',
    3: '当时还是在睡气垫床呢',
    4: '第一次逛旁边的Safeway',
    5: '你教我学车，带我去各种地方',
    6: '办了costco的卡！当时超级开心的！',
    7: '看到了这个机器，然后我们就开始收集瓶子啦',
    8: '陈佳阿姨家旁边的猫',
    9: '你做的卤鸭脖超好吃！',
    10: '当时心心念念的杨国福麻辣烫',
    11: '大屏幕！！这张像小偷嘿嘿',
    12: 'OvO',
    13: 'Zzzzzz',
    14: 'Costco逛逛逛！',
    15: 'Mua！',
    16: '第一次买costco食堂的东西，便宜又好吃',
    17: '猜猜这时候我们开车去哪里',
    18: 'In-N-Out！还有一个地方',
    19: '多乐来啦！',
    20: '一来就在车上尿了，狗多乐初见端倪',
    21: '我俩和多乐的拍立得，当时超兴奋的',
    22: '拉肚子的老刘家烧烤',
    23: '你偷拍我',
    24: '生日快乐！好美好美',
    25: '潦草小狗',
    26: '好惬意，有阳光有狗有我',
    27: '这时候还是能在笼子里的',
    28: '一起去看赵本山啦',
    29: '现场超多东北老乡',
    30: '大美女',
    31: '全世界最好最好最好的老婆',
    32: '气到模糊，忘了什么事情了，可爱捏',
    33: '超好吃的广东早茶',
    34: '在Costco试坐沙发',
    35: '美女和柠檬树',
    36: '打理好自己嘿嘿，准备拍婚纱照啦',
    37: '太美了',
    38: '天文台的你像个大明星',
    39: '后面的那个人羡慕死了',
    40: '人生照片',
    41: '我们像是电影里的男女主角',
    42: '最帅的夫妻',
    43: '超喜欢你这套红色的',
    44: '墨镜真酷',
    45: '被冻得好惨，当时辛苦你啦',
    46: '嘿嘿',
    47: '太美了吧',
    48: '最好的老婆送我的巨大螺狮粉！',
    49: '可爱捏',
    50: '噩梦来了，当时看到这么多家具都窒息了',
    51: '选照片！还有海胆',
    52: '多乐长大一点了',
    53: '翻箱倒柜找你妈妈给我们寄的东西',
    54: '可爱捏',
    55: '背影可爱捏',
    56: '越南城的夜市',
    57: '可爱捏',
    58: '多乐大战净净',
    59: '多乐的小辫子',
    60: '一起去petco',
    61: '亚利桑那！',
    62: '比心！',
    63: '攻击波！',
    64: '可爱捏，亚利桑那的和加州感觉是两个世界',
    65: '牌子合照，可爱捏',
    66: '我俩穿的衣服鲜明对比',
    67: '阿甘正传的长公路',
    68: '车上美美地睡着了',
    69: 'delicate arch打卡',
    70: '认真清点我们还有多少家具没安装',
    71: '被多乐捆住了',
    72: '当时去santa cruz一家卖水晶的店里',
    73: '和多乐一起奔向海边',
    74: '蒙娜丽莎和小狗',
    75: '开心捏，和瀚文',
    76: '僵尸姐姐',
    77: '毕业啦毕业啦',
    78: '开心合照',
    79: '还有花花',
    80: 'cheers！',
    81: '这张好好看',
    82: '回来啦，你俩排排睡',
    83: '旧金山小狗',
    84: '你妈妈买了大电视！',
    85: '可爱捏',
    86: '粉色的海',
    87: '你妈妈要走啦，好舍不得',
    88: '带你去吃cajun散散心',
    89: 'cajun买太多了第二天回家继续吃',
    90: '绝美侧颜，真的是大明星，随便拍都好看',
    91: '弄了好多种子准备大干一场！',
    92: '你做的超好吃的饮料',
    93: 'rua！！！',
    94: '懵懂小白狗',
    95: '优胜美地！',
    96: '多乐长大了这时候',
    97: '一家三口合照！',
    98: '可爱捏',
    99: '这个地方照了好多好照片',
    100: '独立日烟花！',
    101: 'big sur！',
    102: '在外面种菜，超开心的',
    103: '车子被撞了。。。',
    104: '嬛嬛',
    105: '生日！',
    106: '开心的多乐和认真的妈妈',
    107: '卤味！',
    108: '那天累倒了',
    109: '送我上班，多乐的小头',
    110: '被多乐缠住了',
    111: '送我上班，你最好啦！',
    112: '可爱多乐',
    113: '可爱多乐和家里的皇帝',
    114: '寿喜烧！你超级会做',
    115: '嘿嘿',
    116: '傻笑',
    117: '多乐睡着了',
    118: '看什么看！',
    119: '九宫格漂亮饭',
    120: '可爱捏',
    121: '蹦床！',
    122: '小狗都喜欢你',
    123: '表情包素材+1',
    124: '可爱捏',
    125: '妈妈睡着了',
    126: '傻笑*2',
    127: '被小狗包围',
    128: '那天去拿新电脑，直接进Audrey家里',
    129: '修毛大师',
    130: '这时候多乐已经很大了',
    131: '两周年快乐！！',
    132: '这家店超好吃',
    133: '嘿嘿',
    134: '被小狗团团围住',
    135: '万圣节！',
    136: '可爱捏',
    137: '表情包出处',
    138: '水灯节！',
    139: '好美的仙女',
    140: '亲亲！',
    141: '希望所有的愿望都能成真',
    142: '好美',
    143: '多乐一岁啦！',
    144: '黑五逛街',
    145: '可爱',
    146: '粉色的天空！',
    147: '可爱',
    148: '一起来看流星雨！',
    149: '狗多乐',
    150: '你怎么把脸蒙上了',
    151: '多乐和星星',
    152: '在韩国转机13个小时，太累了',
    153: '可爱捏，圣诞快乐！'
    
    // 为所有照片初始化placeholder
};
// 初始化所有照片的placeholder字幕（使用照片编号作为key）
PHOTO_FILES.forEach((filename, index) => {
    const photoNum = index + 1;
    if (!PHOTO_CAPTIONS[photoNum]) {
        PHOTO_CAPTIONS[photoNum] = `[字幕 ${photoNum}] 待填写照片字幕... 💕`;
    }
});

let currentPhotoIndex = 0;
let isAutoPlaying = true;
let autoPlayTimer = null;

// 照片日期缓存（避免重复解析）
const photoDateCache = {};

// 图片预加载缓存
const imagePreloadCache = new Map();

/**
 * 获取图片路径（优先 JPG，回退到 PNG）
 */
function getPhotoPath(filename) {
    const baseName = filename.replace(/\.(png|jpg|jpeg)$/i, '');
    return `photos/${baseName}.jpg`; // 优化后的格式是 JPG
}

/**
 * 获取图片路径（带回退）
 */
function getPhotoPathWithFallback(filename) {
    const baseName = filename.replace(/\.(png|jpg|jpeg)$/i, '');
    return {
        jpg: `photos/${baseName}.jpg`,
        png: `photos/${baseName}.png`
    };
}

/**
 * 预加载图片
 */
function preloadImage(src) {
    if (imagePreloadCache.has(src)) {
        return imagePreloadCache.get(src);
    }
    
    const img = new Image();
    const promise = new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
    
    imagePreloadCache.set(src, promise);
    return promise;
}

/**
 * 预加载相邻图片（当前图片的前一张和后一张）
 */
function preloadAdjacentPhotos(currentIndex) {
    const preloadIndices = [
        (currentIndex - 1 + TOTAL_PHOTOS) % TOTAL_PHOTOS,
        (currentIndex + 1) % TOTAL_PHOTOS
    ];
    
    preloadIndices.forEach(index => {
        const photoFilename = PHOTO_FILES[index];
        if (photoFilename) {
            const photoPath = getPhotoPath(photoFilename);
            preloadImage(photoPath).catch(() => {
                // 预加载失败不影响主流程
            });
        }
    });
}

/**
 * 从文件名解析日期
 * 文件名格式：MMDD_后缀.jpg 或 MMDD.jpg
 * 例如：0108_1.jpg -> 1月8日, 1226_1.jpg -> 12月26日
 */
function parseDateFromFilename(filename) {
    // 如果已缓存，直接返回
    if (photoDateCache[filename]) {
        return photoDateCache[filename];
    }
    
    let month, day;
    
    // 处理特殊文件名（IMG_开头的等）
    if (filename.startsWith('IMG_')) {
        // 无法解析，返回null
        photoDateCache[filename] = null;
        return null;
    }
    
    // 提取前4位数字（月日）
    const match = filename.match(/^(\d{2})(\d{2})/);
    if (match) {
        month = parseInt(match[1], 10);
        day = parseInt(match[2], 10);
        
        // 验证月日有效性
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            // 所有照片都是2025年的
            const year = 2025;
            const date = new Date(year, month - 1, day);
            // 计算这是在一起的哪一天（从2023-10-19开始）
            const daysSinceStart = Math.floor((date - START_DATE) / (1000 * 60 * 60 * 24));
            
            const result = {
                date: date,
                month: month,
                day: day,
                year: year,
                // 计算这是在一起的哪一天
                daysSinceStart: daysSinceStart
            };
            
            photoDateCache[filename] = result;
            return result;
        }
    }
    
    // 无法解析
    photoDateCache[filename] = null;
    return null;
}

function initPhotoSlideshow() {
    const mainPhoto = document.getElementById('main-photo');
    const photoCounter = document.getElementById('photo-counter');
    const currentDay = document.getElementById('current-day');
    const photoMessage = document.getElementById('photo-message');
    const prevBtn = document.getElementById('prev-photo');
    const nextBtn = document.getElementById('next-photo');
    const autoplayBtn = document.getElementById('toggle-autoplay');
    const thumbnailContainer = document.getElementById('thumbnails');
    const photoFrame = mainPhoto.parentElement;
    
    // 生成缩略图（只显示部分，循环滚动）
    generateThumbnails(thumbnailContainer);
    
    // 预加载第一张照片和相邻照片
    const firstPhotoFilename = PHOTO_FILES[0];
    if (firstPhotoFilename) {
        const firstPhotoPath = getPhotoPath(firstPhotoFilename);
        preloadImage(firstPhotoPath).then(() => {
            // 第一张照片加载完成后显示
            updatePhoto(0);
        }).catch(() => {
            // 即使预加载失败也显示
            updatePhoto(0);
        });
        // 预加载相邻照片
        preloadAdjacentPhotos(0);
    } else {
        // 显示第一张照片
        updatePhoto(0);
    }
    
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
            // 检查照片画廊是否可见，如果可见则立即开始播放
            const memoriesSection = document.getElementById('memories');
            if (memoriesSection) {
                const rect = memoriesSection.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                if (isVisible) {
                    startAutoPlay();
                }
                // 如果不可见，Intersection Observer 会在可见时自动开始
            } else {
                startAutoPlay();
            }
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
    
    // 触摸滑动支持（移动端）
    let touchStartX = 0;
    let touchEndX = 0;
    
    photoFrame.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    photoFrame.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50; // 最小滑动距离
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 向左滑动，下一张
                currentPhotoIndex = (currentPhotoIndex + 1) % TOTAL_PHOTOS;
                updatePhoto(currentPhotoIndex);
                resetAutoPlay();
            } else {
                // 向右滑动，上一张
                currentPhotoIndex = (currentPhotoIndex - 1 + TOTAL_PHOTOS) % TOTAL_PHOTOS;
                updatePhoto(currentPhotoIndex);
                resetAutoPlay();
            }
        }
    }
    
    // 使用 Intersection Observer 检测照片画廊区域是否可见
    // 只有当用户滚动到照片画廊时才开始自动播放
    const memoriesSection = document.getElementById('memories');
    if (memoriesSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 照片画廊可见时，如果用户已启用自动播放，则开始播放
                    if (isAutoPlaying) {
                        startAutoPlay();
                    }
                } else {
                    // 照片画廊不可见时，停止自动播放
                    stopAutoPlay();
                }
            });
        }, {
            threshold: 0.3 // 当30%的区域可见时触发
        });
        
        observer.observe(memoriesSection);
    }
    
    // 不立即开始自动播放，等待用户滚动到照片画廊
    // 初始状态：自动播放按钮显示为"点击播放"，但不会自动开始
    isAutoPlaying = false;
    autoplayBtn.textContent = '▶️ 点击播放';
    autoplayBtn.classList.remove('playing');
    
    // 点击主照片打开大图
    photoFrame.addEventListener('click', () => {
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
        const photoFilename = PHOTO_FILES[index] || PHOTO_FILES[0];
        const photoPaths = getPhotoPathWithFallback(photoFilename);
        
        // 使用预加载的图片（如果已加载）
        const photoPath = photoPaths.jpg;
        if (imagePreloadCache.has(photoPath)) {
            imagePreloadCache.get(photoPath).then(img => {
                mainPhoto.src = img.src;
            }).catch(() => {
                // 尝试 PNG 作为回退
                mainPhoto.src = photoPaths.png;
            });
        } else {
            mainPhoto.src = photoPath;
        }
        
        mainPhoto.onerror = function() {
            // 如果 JPG 加载失败，尝试 PNG
            if (this.src.includes('.jpg')) {
                this.src = photoPaths.png;
            } else {
                this.src = `https://via.placeholder.com/800x600/FFB6C1/FFF?text=照片${photoNum}`;
            }
        };
        
        // 预加载相邻图片
        preloadAdjacentPhotos(index);
        
        // 更新计数器
        photoCounter.textContent = `${photoNum} / ${TOTAL_PHOTOS}`;
        
        // 从文件名解析日期
        const dateInfo = parseDateFromFilename(photoFilename);
        
        // 获取照片字幕（优先使用配置的字幕，使用照片编号作为key）
        const photoCaption = PHOTO_CAPTIONS[photoNum] || `[字幕 ${photoNum}] 待填写照片字幕... 💕`;
        
        // 更新照片上的字幕覆盖层
        const photoCaptionOverlay = document.getElementById('photo-caption-overlay');
        if (photoCaptionOverlay) {
            photoCaptionOverlay.textContent = photoCaption;
        }
        
        if (dateInfo) {
            // 显示具体月日
            currentDay.textContent = `${dateInfo.month}月${dateInfo.day}日`;
            
            // 检查是否是特殊里程碑日期
            const daysSinceStart = dateInfo.daysSinceStart;
            
            // 普通日期样式
            currentDay.style.background = 'linear-gradient(135deg, var(--star-yellow), var(--moon-cream))';
            currentDay.style.color = 'var(--text-dark)';
            
            // 显示在一起多少天（恢复原来的逻辑）
            if (daysSinceStart > 0 && daysSinceStart <= 1000) {
                photoMessage.textContent = `在一起的第 ${daysSinceStart} 天 💕`;
            } else if (daysSinceStart <= 0) {
                // 日期在开始日期之前，只显示日期
                photoMessage.textContent = getRandomMessage();
            } else {
                // 天数过大，可能年份判断有误，只显示日期
                photoMessage.textContent = getRandomMessage();
            }
        } else {
            // 无法解析日期，使用默认显示
            currentDay.textContent = `照片 ${photoNum}`;
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
            
            const thumbFilename = PHOTO_FILES[photoIndex] || PHOTO_FILES[0];
            const thumbPath = getPhotoPath(thumbFilename);
            thumb.innerHTML = `<img src="${thumbPath}" alt="照片${photoIndex + 1}" loading="lazy" decoding="async" onerror="this.src='https://via.placeholder.com/100x100/FFB6C1/FFF?text=${photoIndex + 1}'">`;
            
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

// 里程碑按钮功能已删除，改为滚动箭头

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
    
    const photoFilename = PHOTO_FILES[index] || PHOTO_FILES[0];
    const photoPaths = getPhotoPathWithFallback(photoFilename);
    viewerImage.src = photoPaths.jpg;
    viewerImage.onerror = function() {
        // 如果 JPG 加载失败，尝试 PNG
        if (this.src.includes('.jpg')) {
            this.src = photoPaths.png;
        } else {
            this.src = `https://via.placeholder.com/1200x800/FFB6C1/FFF?text=照片${index + 1}`;
        }
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
    
    const randomPhotoIndex = Math.floor(Math.random() * TOTAL_PHOTOS);
    const randomPhotoFilename = PHOTO_FILES[randomPhotoIndex] || PHOTO_FILES[0];
    const randomPhotoPath = getPhotoPath(randomPhotoFilename);
    
    photo.innerHTML = `<img src="${randomPhotoPath}" alt="" loading="lazy" decoding="async" onerror="this.parentElement.style.display='none'">`;
    
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
        const newPhotoIndex = Math.floor(Math.random() * TOTAL_PHOTOS);
        const newPhotoFilename = PHOTO_FILES[newPhotoIndex] || PHOTO_FILES[0];
        const newPhotoPath = getPhotoPath(newPhotoFilename);
        
        photo.querySelector('img').src = newPhotoPath;
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
    
    // 确保音乐循环播放
    bgMusic.loop = true;
    // 设置音量（0.0 到 1.0）
    bgMusic.volume = 0.5;
    
    // 尝试播放音乐
    const playPromise = bgMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(function() {
            // 播放成功
            isPlaying = true;
            if (musicBtn) {
                musicBtn.textContent = '🔊';
                musicBtn.classList.add('playing');
            }
            console.log('音乐开始播放');
        }).catch(function(error) {
            // 播放失败（可能是浏览器阻止自动播放）
            console.log('自动播放被阻止，请点击音乐按钮播放', error);
            // 如果自动播放失败，至少确保音乐按钮状态正确
            if (musicBtn) {
                musicBtn.textContent = '🎵';
            }
        });
    }
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

