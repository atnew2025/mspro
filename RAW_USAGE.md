# Raw 文件功能说明

## 📋 概述

类似于 GitHub 的 raw 功能，您现在可以直接通过 URL 访问和加载 Lua 脚本文件。

## 🌐 文件结构

```
麦克/
├── index.html              # 主页
├── raw.html                # Raw 文件列表页面
├── raw/                    # Raw 文件目录
│   └── mspaint-script.lua  # Roblox Lua 脚本
├── styles.css
├── script.js
└── README.md
```

## 🚀 使用方法

### 1. 在 Roblox 中直接加载

```lua
loadstring(game:HttpGet("https://your-domain.com/raw/mspaint-script.lua"))()
```

### 2. 通过网页访问

访问 `raw.html` 页面：
- 查看所有可用的 raw 文件
- 复制文件链接
- 下载文件到本地
- 在线查看文件内容

### 3. 直接访问文件

```
https://your-domain.com/raw/mspaint-script.lua
```

## 📁 添加新的 Raw 文件

1. 将文件放入 `raw/` 目录
2. 在 `raw.html` 中添加文件列表项：

```html
<div class="file-item">
    <div class="file-name">📄 your-script.lua</div>
    <div class="file-actions">
        <a href="raw/your-script.lua" class="btn btn-view" target="_blank">查看</a>
        <button class="btn btn-copy" onclick="copyUrl('raw/your-script.lua')">复制链接</button>
        <a href="raw/your-script.lua" class="btn btn-download" download>下载</a>
    </div>
</div>
```

## 🔧 部署说明

### 本地测试

1. 直接在浏览器中打开 `index.html`
2. 点击导航栏的 "Raw" 链接
3. 测试文件访问功能

### 在线部署

#### GitHub Pages
```bash
# 1. 创建 GitHub 仓库
# 2. 上传所有文件
# 3. 启用 GitHub Pages
# 4. 访问 https://username.github.io/repo-name/raw/mspaint-script.lua
```

#### Netlify
```bash
# 1. 拖放文件夹到 Netlify
# 2. 自动部署
# 3. 访问 https://your-site.netlify.app/raw/mspaint-script.lua
```

#### Vercel
```bash
# 1. 导入 GitHub 仓库
# 2. 自动部署
# 3. 访问 https://your-site.vercel.app/raw/mspaint-script.lua
```

### 自定义域名

部署后，将 URL 中的 `https://your-domain.com` 替换为您的实际域名：

1. 在 `index.html` 中更新：
```html
<code id="script-code">loadstring(game:HttpGet("https://your-actual-domain.com/raw/mspaint-script.lua"))()</code>
```

2. 在 `raw.html` 中更新示例 URL

## 🎯 功能特点

### ✅ 优势

1. **直接访问**：无需下载，直接在 Roblox 中加载
2. **版本控制**：可以轻松更新脚本内容
3. **易于分享**：一个链接即可分享脚本
4. **在线查看**：支持在浏览器中查看代码
5. **快速复制**：一键复制加载命令

### 🔒 安全提示

1. **HTTPS**：确保使用 HTTPS 协议
2. **CORS**：某些托管平台可能需要配置 CORS
3. **内容验证**：定期检查文件内容，防止被篡改
4. **访问控制**：考虑添加访问限制（如果需要）

## 📊 与 GitHub Raw 的对比

| 特性 | GitHub Raw | 本实现 |
|------|-----------|--------|
| 直接访问 | ✅ | ✅ |
| 版本控制 | ✅ | ❌ (需要 Git) |
| 自定义域名 | ❌ | ✅ |
| 界面美化 | ❌ | ✅ |
| 一键复制 | ❌ | ✅ |
| 文件列表 | ❌ | ✅ |

## 🛠️ 高级配置

### 添加 MIME 类型

如果服务器不识别 `.lua` 文件，可以添加 `.htaccess`（Apache）：

```apache
AddType text/plain .lua
```

或 `web.config`（IIS）：

```xml
<staticContent>
    <mimeMap fileExtension=".lua" mimeType="text/plain" />
</staticContent>
```

### 启用 CORS

在服务器配置中添加：

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

## 📝 示例用法

### Roblox 脚本执行器

```lua
-- 方法 1: 直接加载
loadstring(game:HttpGet("https://your-domain.com/raw/mspaint-script.lua"))()

-- 方法 2: 带错误处理
local success, result = pcall(function()
    return loadstring(game:HttpGet("https://your-domain.com/raw/mspaint-script.lua"))()
end)

if not success then
    warn("脚本加载失败:", result)
end

-- 方法 3: 缓存加载
local scriptUrl = "https://your-domain.com/raw/mspaint-script.lua"
local scriptContent = game:HttpGet(scriptUrl)
local scriptFunc = loadstring(scriptContent)
scriptFunc()
```

## 🔄 更新脚本

1. 编辑 `raw/mspaint-script.lua` 文件
2. 保存更改
3. 重新部署（如果使用托管服务）
4. 用户下次加载时会自动获取最新版本

## 💡 最佳实践

1. **版本号**：在脚本中包含版本号
2. **更新日志**：维护更新日志
3. **备份**：定期备份脚本文件
4. **测试**：更新前先在本地测试
5. **通知**：重大更新时通知用户

## 🆘 常见问题

### Q: 为什么 Roblox 无法加载脚本？
A: 检查：
- URL 是否正确
- 服务器是否支持 HTTPS
- CORS 是否配置正确
- 文件是否存在

### Q: 如何添加多个脚本？
A: 在 `raw/` 目录中添加更多 `.lua` 文件，并在 `raw.html` 中添加对应的列表项。

### Q: 可以添加其他类型的文件吗？
A: 可以，但建议只添加文本文件（如 .lua, .txt, .json 等）。

## 📞 支持

如有问题，请查看：
- README.md - 项目总体说明
- CHAT_FEATURES.md - AI 聊天功能说明
- 或在项目中提交 Issue
