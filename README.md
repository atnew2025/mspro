# mspaint - The best BABFT script

一个功能强大的 Roblox Build A Boat For Treasure (BABFT) 游戏脚本展示网站和完整的 Lua 脚本。

## 📋 项目结构

```
麦克/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # JavaScript 交互
├── mspaint-script.lua  # Roblox Lua 脚本
└── README.md           # 说明文档
```

## 🌟 网站功能

### 前端特性
- ✨ 现代化深色主题设计
- 🎨 流畅的动画效果
- 📱 完全响应式布局
- 🖱️ 交互式 UI 组件
- 📋 一键复制脚本功能
- 🔔 优雅的通知系统
- ⚡ 粒子背景效果

### 页面组件
1. **导航栏** - 固定顶部导航，包含品牌标识和链接
2. **主标题区** - 大标题展示和脚本加载器
3. **功能展示** - 4个功能卡片介绍
4. **使用说明** - 详细的使用步骤
5. **页脚** - 版权信息和链接

## 🎮 Roblox Lua 脚本功能

### 核心功能
- 🏗️ **自动建造系统** - 智能化建造辅助
- ⚡ **快速建造模式** - 提高建造效率
- 📐 **网格对齐功能** - 精准放置方块
- 🎯 **位置控制** - 精确的坐标控制
- 💾 **保存/加载** - 保存和加载建造方案
- 🎨 **GUI 界面** - 美观的图形用户界面

### GUI 组件
- **Toggle 开关** - 功能开关控制
- **Slider 滑块** - 参数调节
- **Button 按钮** - 功能触发
- **拖动窗口** - 可自由移动的界面

### 快捷键
- `F` - 切换 GUI 显示/隐藏
- `G` - 快速切换自动建造
- `Ctrl/Cmd + K` - 复制脚本（网页端）

## 🚀 使用方法

### 网站部署

1. **本地预览**
   ```bash
   # 直接在浏览器中打开 index.html
   # 或使用本地服务器
   python -m http.server 8000
   # 然后访问 http://localhost:8000
   ```

2. **在线部署**
   - 可以部署到 GitHub Pages
   - 或使用 Netlify、Vercel 等平台
   - 上传所有文件到服务器即可

### Roblox 脚本使用

1. **准备工作**
   - 安装 Roblox 脚本执行器（如 Synapse X, KRNL, Fluxus 等）
   - 进入 Build A Boat For Treasure 游戏

2. **执行脚本**
   ```lua
   -- 方法 1: 使用 loadstring（需要将脚本托管到网络）
   loadstring(game:HttpGet("https://your-domain.com/mspaint-script.lua"))()
   
   -- 方法 2: 直接复制粘贴 mspaint-script.lua 的内容到执行器
   ```

3. **开始使用**
   - 脚本加载后会自动显示 GUI
   - 使用界面中的开关和按钮控制功能
   - 按 F 键可以隐藏/显示界面

## 🎨 自定义配置

### 修改网站主题

在 `styles.css` 中修改 CSS 变量：

```css
:root {
    --primary-bg: #0a0a0f;      /* 主背景色 */
    --secondary-bg: #1a1a2e;    /* 次要背景色 */
    --accent-color: #6366f1;    /* 强调色 */
    --text-primary: #ffffff;    /* 主文本色 */
    --text-secondary: #a0a0b0;  /* 次要文本色 */
    --border-color: #2a2a3e;    /* 边框色 */
}
```

### 修改脚本配置

在 `mspaint-script.lua` 中修改配置：

```lua
local Config = {
    AutoBuild = false,      -- 自动建造开关
    BuildSpeed = 0.1,       -- 建造速度
    SnapToGrid = true,      -- 网格对齐
    GridSize = 2,           -- 网格大小
    ShowESP = false,        -- ESP 显示
    AutoSave = true,        -- 自动保存
    Theme = "Dark"          -- 主题
}
```

## 📦 技术栈

### 前端
- **HTML5** - 页面结构
- **CSS3** - 样式和动画
- **JavaScript (ES6+)** - 交互逻辑
- **Google Fonts** - Inter 字体

### Roblox 脚本
- **Lua 5.1** - Roblox Luau
- **Roblox API** - 游戏服务和功能
- **TweenService** - 动画效果
- **UserInputService** - 用户输入处理

## 🔧 开发说明

### 添加新功能

1. **网站新功能**
   - 在 `index.html` 中添加 HTML 结构
   - 在 `styles.css` 中添加样式
   - 在 `script.js` 中添加交互逻辑

2. **脚本新功能**
   - 在 `mspaint-script.lua` 中添加功能函数
   - 使用 `Library:CreateToggle/Button/Slider` 添加 GUI 控件
   - 在主循环中调用新功能

### 调试技巧

**网站调试：**
- 使用浏览器开发者工具（F12）
- 查看控制台输出
- 使用断点调试 JavaScript

**脚本调试：**
- 使用 `print()` 输出调试信息
- 使用 `warn()` 输出警告
- 检查 Roblox 开发者控制台

## ⚠️ 注意事项

1. **安全警告**
   - 仅在私人服务器或允许使用脚本的环境中使用
   - 使用脚本可能违反 Roblox 服务条款
   - 使用脚本可能导致账号被封禁

2. **兼容性**
   - 脚本可能随游戏更新而失效
   - 需要定期更新以保持兼容性
   - 不同执行器可能有不同的兼容性

3. **性能**
   - 过度使用自动功能可能影响游戏性能
   - 建议根据设备性能调整参数
   - 避免在低配置设备上开启所有功能

## 📝 更新日志

### Version 2.0.0 (2024-11-15)
- ✨ 全新的 GUI 界面设计
- 🎨 添加现代化网站展示
- ⚡ 优化脚本性能
- 🔧 添加更多自定义选项
- 📱 改进响应式设计
- 🐛 修复已知问题

## 📄 许可证

本项目仅供学习和研究使用。请勿用于商业用途。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

- Discord: 即将开放
- GitHub: 即将开放

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

---

**免责声明：** 本脚本仅供教育和学习目的。使用本脚本所产生的任何后果由使用者自行承担。作者不对因使用本脚本而导致的任何损失或问题负责。
