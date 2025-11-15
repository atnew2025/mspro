# Firebase 认证配置指南

## 📋 概述

本网站使用 Firebase Authentication 实现用户登录和注册功能，支持：
- ✅ 邮箱/密码注册登录
- ✅ Google 账号登录
- ✅ 用户状态管理
- ✅ 自动登录保持

## 🚀 配置步骤

### 1. 创建 Firebase 项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击"添加项目"
3. 输入项目名称（例如：mspaint-auth）
4. 选择是否启用 Google Analytics（可选）
5. 点击"创建项目"

### 2. 启用 Authentication

1. 在 Firebase 控制台左侧菜单中，点击 **Authentication**
2. 点击"开始使用"
3. 在"登录方法"标签页中，启用以下方式：

#### 启用邮箱/密码登录
- 点击"电子邮件地址/密码"
- 启用"电子邮件地址/密码"
- 点击"保存"

#### 启用 Google 登录
- 点击"Google"
- 启用"Google"
- 选择项目支持电子邮件
- 点击"保存"

### 3. 获取 Firebase 配置

1. 在 Firebase 控制台，点击左上角的齿轮图标 ⚙️
2. 选择"项目设置"
3. 滚动到"您的应用"部分
4. 点击"</>"（Web 图标）添加 Web 应用
5. 输入应用昵称（例如：mspaint-web）
6. 勾选"同时为此应用设置 Firebase Hosting"（可选）
7. 点击"注册应用"
8. 复制显示的配置代码

### 4. 配置网站

打开 `auth.js` 文件，找到以下代码：

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

替换为您从 Firebase 控制台复制的配置：

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};
```

### 5. 配置授权域名

1. 在 Firebase 控制台的 Authentication 页面
2. 点击"设置"标签
3. 在"授权域名"部分，添加您的网站域名
4. 对于本地测试，`localhost` 已默认添加

## 🎯 功能说明

### 邮箱注册/登录
- 用户可以使用邮箱和密码注册新账户
- 密码最少 6 个字符
- 注册后自动登录

### Google 登录
- 点击"使用 Google 登录"按钮
- 弹出 Google 登录窗口
- 选择 Google 账号完成登录

### 用户状态
- 登录后显示用户头像和名称
- 点击头像显示下拉菜单
- 可以查看邮箱和退出登录

### 自动登录
- 用户登录状态会自动保存
- 刷新页面后仍保持登录
- 关闭浏览器后重新打开仍保持登录

## 🔒 安全建议

1. **API Key 保护**
   - Firebase API Key 可以公开（它有域名限制）
   - 但建议在 Firebase 控制台配置应用限制

2. **授权域名**
   - 只添加您信任的域名
   - 定期检查授权域名列表

3. **安全规则**
   - 在 Firebase 控制台配置 Firestore 安全规则
   - 限制用户只能访问自己的数据

## 📱 测试

### 本地测试
1. 在浏览器中打开 `index.html`
2. 点击导航栏的"登录"按钮
3. 尝试注册新账户或使用 Google 登录

### 部署测试
1. 将网站部署到服务器
2. 在 Firebase 控制台添加域名到授权域名列表
3. 访问网站测试登录功能

## 🐛 常见问题

### 1. Google 登录失败
**问题**: 点击 Google 登录后弹窗被阻止
**解决**: 允许浏览器弹窗，或检查授权域名配置

### 2. 邮箱已存在
**问题**: 注册时提示"该邮箱已被注册"
**解决**: 使用其他邮箱或直接登录

### 3. 网络错误
**问题**: 提示"网络连接失败"
**解决**: 检查网络连接和 Firebase 配置是否正确

### 4. API Key 无效
**问题**: 提示"API Key 无效"
**解决**: 检查 `auth.js` 中的 Firebase 配置是否正确

## 📊 用户管理

在 Firebase 控制台的 Authentication 页面，您可以：
- 查看所有注册用户
- 手动添加/删除用户
- 重置用户密码
- 查看登录活动

## 🎨 自定义

### 修改登录界面
编辑 `styles.css` 中的 `.auth-modal` 相关样式

### 添加更多登录方式
在 Firebase 控制台启用其他登录方式（Facebook、Twitter 等）
然后在 `auth.js` 中添加相应的登录函数

### 修改用户信息
登录后可以使用 Firebase API 更新用户信息：
```javascript
firebase.auth().currentUser.updateProfile({
    displayName: "新名称",
    photoURL: "头像URL"
});
```

## 📚 相关文档

- [Firebase Authentication 文档](https://firebase.google.com/docs/auth)
- [Firebase Web SDK 参考](https://firebase.google.com/docs/reference/js)
- [Firebase 控制台](https://console.firebase.google.com/)

## ✅ 完成

配置完成后，您的网站就拥有了完整的用户认证系统！

用户可以：
- 📧 使用邮箱注册和登录
- 🔐 使用 Google 账号快速登录
- 👤 查看个人信息
- 🚪 安全退出登录
