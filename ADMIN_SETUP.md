# 管理后台配置指南

## 🎉 恭喜！管理后台已创建完成

您现在拥有一个功能完整的管理后台系统！

## 📋 功能列表

### ✅ 已实现功能

1. **管理员认证系统**
   - 邮箱密码登录
   - 管理员权限验证
   - 安全退出登录

2. **数据统计仪表板**
   - 总用户数统计
   - 脚本数量统计
   - 下载量统计
   - 访问量统计
   - 最近活动记录

3. **用户管理**
   - 用户列表查看
   - 用户搜索功能
   - 用户角色管理（普通用户/VIP/管理员）
   - 用户数据导出
   - 用户编辑/删除

4. **脚本管理**
   - 脚本列表查看
   - 脚本上传（待完善）
   - 脚本编辑/删除
   - 版本管理
   - 下载量统计

5. **公告管理**
   - 公告发布
   - 公告编辑/删除
   - 公告列表查看

6. **系统设置**
   - 网站标题设置
   - 网站描述设置
   - 维护模式开关

## 🔧 配置步骤

### 步骤 1：启用 Firestore 数据库

1. **访问 Firebase 控制台**
   ```
   https://console.firebase.google.com/project/akinktogo/firestore
   ```

2. **创建 Firestore 数据库**
   - 点击 "创建数据库"
   - 选择 "生产模式" 或 "测试模式"
   - 选择数据库位置（推荐：asia-east1）

3. **配置安全规则**
   
   在 Firestore 规则中添加：
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // 用户数据
       match /users/{userId} {
         allow read: if request.auth != null;
         allow write: if request.auth.uid == userId || isAdmin();
       }
       
       // 脚本数据
       match /scripts/{scriptId} {
         allow read: if true;
         allow write: if isAdmin();
       }
       
       // 公告数据
       match /announcements/{announcementId} {
         allow read: if true;
         allow write: if isAdmin();
       }
       
       // 活动记录
       match /activities/{activityId} {
         allow read: if isAdmin();
         allow write: if request.auth != null;
       }
       
       // 系统设置
       match /settings/{settingId} {
         allow read: if true;
         allow write: if isAdmin();
       }
       
       // 检查是否是管理员
       function isAdmin() {
         return request.auth != null && 
                request.auth.token.email in [
                  'admin@example.com'
                  // 在这里添加更多管理员邮箱
                ];
       }
     }
   }
   ```

### 步骤 2：设置管理员账号

1. **方法 A：修改代码中的管理员列表**
   
   编辑 `admin.js` 第 17 行：
   ```javascript
   const ADMIN_EMAILS = [
       'admin@example.com',  // 替换为您的邮箱
       'your-email@gmail.com',  // 添加更多管理员
   ];
   ```

2. **方法 B：在 Firestore 中配置**
   
   创建集合 `admins`，添加文档：
   ```json
   {
     "email": "your-email@example.com",
     "role": "admin",
     "createdAt": "2024-01-01"
   }
   ```

### 步骤 3：创建管理员账号

1. **注册管理员账号**
   - 访问主页 http://localhost:8000
   - 使用您设置的管理员邮箱注册

2. **登录管理后台**
   - 访问 http://localhost:8000/admin.html
   - 使用管理员邮箱和密码登录

## 🎯 使用指南

### 访问管理后台

```
http://localhost:8000/admin.html
```

### 默认管理员账号

**重要：** 首次使用需要先注册账号，然后在代码中添加该邮箱为管理员。

### 功能使用

#### 1. 仪表板
- 查看网站统计数据
- 查看最近活动记录
- 快速了解网站运营状况

#### 2. 用户管理
- 查看所有注册用户
- 搜索特定用户
- 修改用户角色
- 导出用户数据（CSV 格式）
- 删除用户账号

#### 3. 脚本管理
- 查看所有脚本
- 上传新脚本
- 更新脚本版本
- 查看下载统计
- 删除脚本

#### 4. 公告管理
- 发布新公告
- 编辑现有公告
- 删除公告
- 公告会显示在主页

#### 5. 系统设置
- 修改网站标题
- 修改网站描述
- 开启/关闭维护模式

## 📊 数据库结构

### users 集合
```javascript
{
  "uid": "用户ID",
  "email": "user@example.com",
  "displayName": "用户名",
  "photoURL": "头像URL",
  "role": "user|vip|admin",
  "createdAt": "注册时间",
  "lastLogin": "最后登录时间"
}
```

### scripts 集合
```javascript
{
  "name": "脚本名称",
  "description": "脚本描述",
  "version": "1.0.0",
  "downloads": 0,
  "views": 0,
  "fileURL": "文件URL",
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

### announcements 集合
```javascript
{
  "title": "公告标题",
  "content": "公告内容",
  "author": "发布者邮箱",
  "createdAt": "发布时间"
}
```

### activities 集合
```javascript
{
  "action": "操作描述",
  "user": "用户邮箱",
  "timestamp": "时间戳",
  "details": "详细信息"
}
```

### settings 集合
```javascript
{
  "title": "网站标题",
  "description": "网站描述",
  "maintenanceMode": false,
  "updatedAt": "更新时间"
}
```

## 🔒 安全建议

### 1. 管理员权限
- ✅ 只添加信任的邮箱为管理员
- ✅ 定期检查管理员列表
- ✅ 使用强密码

### 2. Firestore 安全规则
- ✅ 使用生产模式规则
- ✅ 限制写入权限
- ✅ 验证用户身份

### 3. 数据备份
- ✅ 定期导出用户数据
- ✅ 备份重要脚本文件
- ✅ 保存配置信息

## 🚀 扩展功能

### 即将实现的功能

1. **高级用户管理**
   - 批量操作
   - 用户分组
   - 权限细化

2. **脚本上传系统**
   - 文件上传到 Firebase Storage
   - 版本控制
   - 自动更新检测

3. **数据分析**
   - 图表展示
   - 趋势分析
   - 导出报表

4. **评论系统**
   - 用户反馈
   - 评论审核
   - 回复管理

5. **VIP 系统**
   - 会员等级
   - 权限管理
   - 付费功能

## 💡 常见问题

### Q: 无法登录管理后台？
A: 确保：
1. 您的邮箱在管理员列表中
2. 已经在主页注册过账号
3. 密码输入正确

### Q: 看不到用户数据？
A: 确保：
1. Firestore 已启用
2. 安全规则已配置
3. 有用户注册过

### Q: 如何添加更多管理员？
A: 编辑 `admin.js` 中的 `ADMIN_EMAILS` 数组，添加新的邮箱地址。

### Q: 数据存储在哪里？
A: 所有数据存储在 Firebase Firestore 云数据库中，自动备份和同步。

## 📞 技术支持

如果遇到问题：
1. 检查浏览器控制台（F12）的错误信息
2. 查看 Firebase 控制台的日志
3. 确认 Firestore 规则配置正确

## 🎨 界面预览

### 登录页面
- 简洁的登录表单
- 管理员权限验证
- 友好的错误提示

### 仪表板
- 4 个统计卡片
- 最近活动列表
- 实时数据更新

### 管理面板
- 侧边栏导航
- 数据表格展示
- 搜索和筛选功能

## 🔄 下一步

1. **配置 Firestore**
   - 启用数据库
   - 设置安全规则

2. **设置管理员**
   - 修改管理员列表
   - 注册管理员账号

3. **测试功能**
   - 登录管理后台
   - 测试各项功能

4. **开始使用**
   - 管理用户
   - 发布公告
   - 上传脚本

现在您可以开始使用强大的管理后台了！🎉
