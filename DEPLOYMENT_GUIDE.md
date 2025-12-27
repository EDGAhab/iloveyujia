# 网站部署指南 - loveliuyujia.com

## 📋 部署选项

你有几个选择来部署这个静态网站。我推荐 **Vercel**（最简单快速）或 **GitHub Pages**（免费且稳定）。

---

## 🚀 方案一：使用 Vercel 部署（推荐）

### 步骤 1: 准备 GitHub 仓库
1. 确保你的代码已经推送到 GitHub
2. 如果没有，执行以下命令：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/iloveyujia.git
   git push -u origin main
   ```

### 步骤 2: 在 Vercel 部署
1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"
4. 导入你的 `iloveyujia` 仓库
5. 保持默认设置，点击 "Deploy"
6. 等待部署完成（通常 1-2 分钟）

### 步骤 3: 配置自定义域名
1. 在 Vercel 项目页面，点击 "Settings" → "Domains"
2. 输入你的域名：`loveliuyujia.com`
3. 点击 "Add"
4. Vercel 会显示需要配置的 DNS 记录

### 步骤 4: 在 GoDaddy 配置 DNS
1. 登录 [GoDaddy](https://www.godaddy.com)
2. 进入 "我的产品" → 找到 `loveliuyujia.com` → 点击 "DNS"
3. 添加以下 DNS 记录：

   **选项 A：使用 CNAME（推荐）**
   - 类型：`CNAME`
   - 名称：`@` 或留空（表示根域名）
   - 值：Vercel 提供的 CNAME 值（通常是类似 `cname.vercel-dns.com`）
   - TTL：600（或默认）

   **选项 B：使用 A 记录**
   - 类型：`A`
   - 名称：`@` 或留空
   - 值：Vercel 提供的 IP 地址（通常是 `76.76.21.21`）
   - TTL：600

   **同时添加 www 子域名：**
   - 类型：`CNAME`
   - 名称：`www`
   - 值：`cname.vercel-dns.com`（或 Vercel 提供的值）
   - TTL：600

4. 保存 DNS 设置
5. 等待 DNS 传播（通常 5-30 分钟，最多 48 小时）

### 步骤 5: 验证部署
- 访问 `https://loveliuyujia.com` 查看网站
- Vercel 会自动提供 SSL 证书（HTTPS）

---

## 🌐 方案二：使用 GitHub Pages 部署

### 步骤 1: 启用 GitHub Pages
1. 在 GitHub 仓库页面，点击 "Settings"
2. 左侧菜单选择 "Pages"
3. 在 "Source" 下选择 "Deploy from a branch"
4. 选择 `main` 分支和 `/ (root)` 文件夹
5. 点击 "Save"

### 步骤 2: 配置自定义域名
1. 在 GitHub Pages 设置页面的 "Custom domain" 输入框
2. 输入：`loveliuyujia.com`
3. 勾选 "Enforce HTTPS"
4. GitHub 会自动创建 `.github/workflows` 配置

### 步骤 3: 在 GoDaddy 配置 DNS
1. 登录 GoDaddy，进入域名 DNS 设置
2. 添加以下记录：

   **A 记录（IPv4）：**
   - 类型：`A`
   - 名称：`@`
   - 值：`185.199.108.153`
   - TTL：600

   - 类型：`A`
   - 名称：`@`
   - 值：`185.199.109.153`
   - TTL：600

   - 类型：`A`
   - 名称：`@`
   - 值：`185.199.110.153`
   - TTL：600

   - 类型：`A`
   - 名称：`@`
   - 值：`185.199.111.153`
   - TTL：600

   **CNAME 记录（www）：**
   - 类型：`CNAME`
   - 名称：`www`
   - 值：`你的用户名.github.io`
   - TTL：600

3. 删除或修改任何冲突的记录
4. 保存设置

### 步骤 4: 等待生效
- DNS 传播通常需要 5-30 分钟
- 访问 `https://loveliuyujia.com` 验证

---

## 🔧 方案三：使用 Netlify 部署

### 步骤 1: 部署到 Netlify
1. 访问 [netlify.com](https://www.netlify.com)
2. 使用 GitHub 登录
3. 点击 "Add new site" → "Import an existing project"
4. 选择你的仓库
5. 构建设置：
   - Build command: 留空（静态网站不需要构建）
   - Publish directory: `/` 或留空
6. 点击 "Deploy site"

### 步骤 2: 配置域名
1. 在 Netlify 项目页面，点击 "Domain settings"
2. 点击 "Add custom domain"
3. 输入 `loveliuyujia.com`
4. 按照 Netlify 的指示配置 DNS

### 步骤 3: GoDaddy DNS 配置
- 添加 CNAME 记录指向 Netlify 提供的地址

---

## ✅ 部署后检查清单

- [ ] 网站可以正常访问
- [ ] HTTPS 证书已自动配置（URL 显示 🔒）
- [ ] 所有图片和资源正常加载
- [ ] 音乐文件可以播放
- [ ] 移动端显示正常
- [ ] 域名 `www.loveliuyujia.com` 也能访问（如果配置了）

---

## 🆘 常见问题

### DNS 不生效？
- 等待更长时间（最多 48 小时）
- 清除浏览器缓存
- 使用 [dnschecker.org](https://dnschecker.org) 检查全球 DNS 传播状态

### HTTPS 证书问题？
- Vercel 和 Netlify 会自动配置
- GitHub Pages 需要在设置中启用 "Enforce HTTPS"

### 网站显示 404？
- 确保 `index.html` 在根目录
- 检查部署平台的构建设置

---

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看各平台的官方文档
2. 检查浏览器控制台的错误信息
3. 确认所有文件都已正确上传

---

**推荐使用 Vercel**，因为它最简单、快速，并且自动处理 SSL 证书。

