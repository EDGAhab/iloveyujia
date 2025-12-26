# 🐕💕 800天浪漫纪念网站 💕🐶

**线条小狗风格** - 献给你最爱的她，庆祝你们在一起800天的特别日子！

## 🎄 特别时刻
- **日期**: 2025年12月27日
- **纪念日**: 相爱800天
- **节日**: 圣诞节 & 新年
- **风格**: 线条小狗 (可爱柔和风)

## 📁 文件结构

```
romantic-website/
├── index.html          # 主页面
├── styles.css          # 可爱风格样式
├── script.js           # 交互脚本
├── package.json        # 项目配置
├── vercel.json         # Vercel部署配置
├── music/              # 背景音乐文件夹
│   └── romantic-music.mp3
├── comics/             # 漫画图片文件夹
│   ├── comic-1.jpg
│   ├── comic-2.jpg
│   ├── comic-3.jpg
│   └── comic-4.jpg
└── photos/             # 照片文件夹 (支持200+张!)
    ├── 1.jpg           # 第1天的照片
    ├── 2.jpg           # 第2天的照片
    ├── 3.jpg           # ...
    ├── ...
    └── 200.jpg         # 第200天的照片
```

## 📸 添加200+张照片

### 照片命名规则
照片必须按数字命名：`1.jpg`, `2.jpg`, `3.jpg` ... `200.jpg`

### 设置照片数量
在 `script.js` 文件开头修改：
```javascript
const TOTAL_PHOTOS = 200; // 修改为你实际的照片数量
```

### 自定义里程碑消息
在 `script.js` 中找到 `photoMilestones` 对象，添加特殊日期的消息：
```javascript
const photoMilestones = {
    1: { day: '第 1 天', message: '我们相遇的那一天 🌸' },
    100: { day: '第 100 天', message: '确认心意 💗' },
    // 添加更多...
};
```

## 🚀 本地运行

```bash
# 安装依赖并启动
npm start

# 或者直接使用 npx
npx serve
```

然后访问 `http://localhost:3000`

---

# 🌐 发布到 iloveyujia.com

## 方法一：使用 Vercel（推荐，免费）

### 第一步：注册 Vercel
1. 访问 https://vercel.com
2. 使用 GitHub 账号注册登录

### 第二步：上传代码到 GitHub
```bash
# 初始化 Git 仓库
git init
git add .
git commit -m "800天浪漫纪念网站"

# 创建 GitHub 仓库后
git remote add origin https://github.com/你的用户名/iloveyujia.git
git branch -M main
git push -u origin main
```

### 第三步：在 Vercel 部署
1. 登录 Vercel Dashboard
2. 点击 "Add New" → "Project"
3. 导入你的 GitHub 仓库
4. 点击 "Deploy"
5. 等待部署完成，你会得到一个类似 `iloveyujia.vercel.app` 的地址

### 第四步：购买域名 iloveyujia.com
1. 访问域名注册商（推荐）：
   - **Namesilo**: https://www.namesilo.com （便宜，约 $9/年）
   - **Namecheap**: https://www.namecheap.com
   - **GoDaddy**: https://www.godaddy.com
   - **阿里云万网**: https://wanwang.aliyun.com （国内）
   - **腾讯云**: https://dnspod.cloud.tencent.com （国内）

2. 搜索 `iloveyujia.com`
3. 如果可用，购买该域名（通常 .com 约 60-100 元/年）

### 第五步：连接域名到 Vercel
1. 在 Vercel 项目设置中，找到 "Domains"
2. 添加 `iloveyujia.com`
3. Vercel 会显示 DNS 配置信息

4. 在域名注册商后台，添加 DNS 记录：
   - **类型**: A
   - **名称**: @
   - **值**: 76.76.19.19

   或者使用 CNAME：
   - **类型**: CNAME
   - **名称**: @
   - **值**: cname.vercel-dns.com

5. 等待 DNS 生效（通常 5-30 分钟，最长 48 小时）

6. 完成！访问 https://iloveyujia.com 即可看到你的网站！

---

## 方法二：使用 Netlify（免费）

### 第一步：注册 Netlify
1. 访问 https://netlify.com
2. 注册账号

### 第二步：拖拽部署
1. 把整个项目文件夹拖到 Netlify 的部署区域
2. 等待部署完成

### 第三步：添加自定义域名
1. 在 Site settings → Domain management
2. 添加 `iloveyujia.com`
3. 按照提示配置 DNS

---

## 方法三：使用 GitHub Pages（免费）

### 第一步：上传到 GitHub
```bash
git init
git add .
git commit -m "800天浪漫纪念网站"
git remote add origin https://github.com/你的用户名/iloveyujia.github.io.git
git push -u origin main
```

### 第二步：启用 GitHub Pages
1. 在 GitHub 仓库设置中找到 "Pages"
2. Source 选择 "main" 分支
3. 保存

### 第三步：添加自定义域名
1. 在仓库根目录创建 `CNAME` 文件，内容为：
   ```
   iloveyujia.com
   ```
2. 在域名注册商添加 DNS 记录指向 GitHub

---

## 🇨🇳 中国大陆访问优化

如果你的妻子在中国大陆，建议：

### 选项 1：使用国内服务（需要备案）
- **阿里云**: https://www.aliyun.com
- **腾讯云**: https://cloud.tencent.com
- 注意：国内服务器需要 ICP 备案，约需 1-2 周

### 选项 2：使用 Vercel（推荐）
- Vercel 有亚洲节点，中国访问速度还可以
- 不需要备案
- 免费 HTTPS

### 选项 3：使用 Cloudflare Pages
- 访问 https://pages.cloudflare.com
- 全球 CDN，中国访问优化较好
- 免费

---

## ✨ 网站功能

1. 🐕 **线条小狗风格** - 可爱柔和的配色和动画
2. 💌 **信封开场动画** - 点击打开信封，展示情书
3. ⭐ **星星飘落效果** - 可爱的星星和符号飘落
4. ⏱️ **实时计时器** - 显示在一起的精确时间
5. 🎠 **动态照片轮播** - 自动播放200+张照片，无需手动翻页！
6. 📸 **缩略图滚动条** - 照片缩略图自动滚动展示
7. 🎯 **快速跳转** - 一键跳转到重要里程碑
8. ✨ **浮动照片效果** - 小照片在背景中飘浮
9. 📖 **简化时间线** - 重要时刻一目了然
10. 🎨 **漫画展示** - 展示你画给她的漫画
11. 🎄 **节日祝福** - 圣诞节和新年特别祝福
12. 🎁 **秘密惊喜** - 点击触发惊喜弹窗
13. 🎵 **背景音乐** - 浪漫BGM
14. ⌨️ **键盘控制** - 左右箭头切换照片

## 🎀 隐藏彩蛋

- 🐾 点击任意位置会产生可爱符号
- 🐕 连续快速点击"800天"徽章8次会触发超萌特效！

---

## 📝 个性化定制

### 修改情书内容
编辑 `index.html`，找到 `<div class="letter-content">` 部分

### 修改时间线
找到 `<section id="timeline">` 部分

### 修改计时起始日期
编辑 `script.js`，找到 `const startDate = new Date('2023-10-19T00:00:00');`
改成你们在一起的日期

### 添加更多漫画/照片
1. 把图片放到对应文件夹
2. 在 HTML 中添加对应的卡片

---

## 💡 小贴士

1. 🎵 音乐选一首你们有特殊意义的歌
2. 🖼️ 照片选最甜蜜的时刻
3. ✍️ 情书用心写，表达真实感受
4. 📱 建议在她面前亲自打开这个网站
5. 🧻 准备好纸巾，她可能会感动到哭！

---

💕 **祝你们永远幸福！汪~** 🐕

*用爱制作，献给所有相爱的人*
