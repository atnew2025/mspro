# GitHub 登录配置指南

## 🐙 问题诊断

如果 GitHub 登录授权后显示错误，可能是以下原因：

### 常见错误原因

1. **GitHub OAuth App 未配置**
   - Firebase 需要 GitHub OAuth App 的凭证

2. **授权回调 URL 不匹配**
   - GitHub OAuth App 的回调 URL 必须正确

3. **Firebase 中未启用 GitHub 登录**
   - 需要在 Firebase 控制台启用

4. **邮箱冲突**
   - 该邮箱已使用其他方式注册

## 🔧 完整配置步骤

### 步骤 1：创建 GitHub OAuth App

1. **访问 GitHub 开发者设置**
   ```
   https://github.com/settings/developers
   ```

2. **点击 "New OAuth App"**

3. **填写应用信息**
   ```
   Application name: 雷电汉化站
   Homepage URL: http://localhost:8000
   Application description: 雷电汉化站用户登录
   Authorization callback URL: https://akinktogo.firebaseapp.com/__/auth/handler
   ```
   
   ⚠️ **重要**: Authorization callback URL 必须是：
   ```
   https://akinktogo.firebaseapp.com/__/auth/handler
   ```

4. **点击 "Register application"**

5. **获取凭证**
   - 复制 **Client ID**
   - 点击 "Generate a new client secret"
   - 复制 **Client Secret**（只显示一次，请保存好）

### 步骤 2：在 Firebase 中配置 GitHub 登录

1. **访问 Firebase 控制台**
   ```
   https://console.firebase.google.com/project/akinktogo/authentication/providers
   ```

2. **启用 GitHub 登录**
   - 找到 "GitHub" 选项
   - 点击进入配置

3. **填入 GitHub OAuth 凭证**
   ```
   Client ID: [从 GitHub 复制的 Client ID]
   Client Secret: [从 GitHub 复制的 Client Secret]
   ```

4. **复制授权回调 URL**
   - Firebase 会显示一个回调 URL
   - 格式：`https://akinktogo.firebaseapp.com/__/auth/handler`
   - 确保这个 URL 与 GitHub OAuth App 中的一致

5. **点击 "保存"**

### 步骤 3：添加授权域名

1. **在 Firebase 控制台**
   ```
   https://console.firebase.google.com/project/akinktogo/authentication/settings
   ```

2. **在 "Authorized domains" 部分**
   - 确保已添加：`localhost`
   - 如果部署到服务器，添加您的域名

### 步骤 4：测试登录

1. **打开测试页面**
   ```
   http://localhost:8000/check-auth.html
   ```

2. **点击 "测试 GitHub 登录"**

3. **查看结果**
   - 成功：显示用户信息
   - 失败：显示详细错误信息

## 🔍 常见错误及解决方案

### 错误 1: "邮箱或密码错误"

**原因**: 这是错误提示的误判

**解决方案**:
1. 打开浏览器控制台（F12）
2. 查看实际错误代码
3. 根据错误代码处理

### 错误 2: "auth/operation-not-allowed"

**原因**: GitHub 登录未在 Firebase 中启用

**解决方案**:
1. 访问 Firebase 控制台
2. Authentication → Sign-in method
3. 启用 GitHub 登录
4. 填入 Client ID 和 Client Secret

### 错误 3: "auth/unauthorized-domain"

**原因**: 当前域名未授权

**解决方案**:
1. 访问 Firebase 控制台
2. Authentication → Settings
3. 添加 `localhost` 到授权域名

### 错误 4: "auth/account-exists-with-different-credential"

**原因**: 该邮箱已使用其他方式注册

**解决方案**:
- 使用原来的登录方式（邮箱/Google）
- 或者使用不同的 GitHub 账号

### 错误 5: GitHub 回调 URL 不匹配

**原因**: GitHub OAuth App 的回调 URL 设置错误

**解决方案**:
1. 访问 https://github.com/settings/developers
2. 编辑您的 OAuth App
3. 确保 Authorization callback URL 是：
   ```
   https://akinktogo.firebaseapp.com/__/auth/handler
   ```

## 📋 配置检查清单

使用此清单确保所有步骤都已完成：

- [ ] 在 GitHub 创建了 OAuth App
- [ ] 获取了 Client ID 和 Client Secret
- [ ] 在 Firebase 启用了 GitHub 登录
- [ ] 在 Firebase 填入了 GitHub 凭证
- [ ] GitHub OAuth App 的回调 URL 正确
- [ ] Firebase 授权域名包含 localhost
- [ ] 使用 http://localhost:8000 访问网站（不是 file://）
- [ ] 测试 GitHub 登录功能

## 🧪 调试技巧

### 1. 查看控制台日志

打开浏览器控制台（F12），查看详细错误：

```javascript
// 会显示：
开始 GitHub 登录...
GitHub 登录失败 - 错误代码: auth/xxx
GitHub 登录失败 - 错误信息: xxx
```

### 2. 使用诊断工具

访问：`http://localhost:8000/check-auth.html`

点击 "测试 GitHub 登录" 查看详细信息

### 3. 检查网络请求

1. 打开开发者工具
2. 切换到 Network 标签
3. 尝试 GitHub 登录
4. 查看失败的请求

## 📱 生产环境配置

部署到生产环境时：

1. **更新 GitHub OAuth App**
   - Homepage URL: `https://yourdomain.com`
   - 添加生产环境的回调 URL

2. **更新 Firebase 授权域名**
   - 添加您的生产域名

3. **测试**
   - 在生产环境测试 GitHub 登录

## 💡 提示

- GitHub OAuth App 可以有多个回调 URL
- 开发和生产环境可以使用同一个 OAuth App
- Client Secret 只显示一次，请妥善保存
- 如果忘记 Client Secret，需要重新生成

## 🆘 仍然无法解决？

1. 访问诊断页面：`http://localhost:8000/check-auth.html`
2. 点击 "测试 GitHub 登录"
3. 复制完整的错误信息
4. 检查 Firebase 控制台的 Authentication 日志

## 📚 相关文档

- [Firebase GitHub 登录文档](https://firebase.google.com/docs/auth/web/github-auth)
- [GitHub OAuth Apps 文档](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Firebase 授权域名文档](https://firebase.google.com/docs/auth/web/redirect-best-practices)
