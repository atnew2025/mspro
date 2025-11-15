// ==================== Firebase 配置 ====================

// 使用与 auth.js 相同的配置
const firebaseConfig = {
    apiKey: "AIzaSyCOS1e_2xFyE8YaoXtTOHaTTHsMja2uqgs",
    authDomain: "akinktogo.firebaseapp.com",
    projectId: "akinktogo",
    storageBucket: "akinktogo.firebasestorage.app",
    messagingSenderId: "333801806014",
    appId: "1:333801806014:web:59c6f92be7f8f06189a6ef",
    measurementId: "G-4F4GST4D0P"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 管理员邮箱列表（可以在 Firestore 中配置）
const ADMIN_EMAILS = [
    'admin@example.com',
    // 在这里添加更多管理员邮箱
];

// ==================== 认证管理 ====================

// 检查管理员权限
function checkAdminAccess(user) {
    if (!user) return false;
    
    // 检查是否在管理员列表中
    if (ADMIN_EMAILS.includes(user.email)) {
        return true;
    }
    
    // 也可以从 Firestore 检查用户角色
    return false;
}

// 监听认证状态
auth.onAuthStateChanged(async (user) => {
    if (user && checkAdminAccess(user)) {
        // 用户已登录且是管理员
        console.log('管理员已登录:', user.email);
        showDashboard(user);
        loadDashboardData();
    } else {
        // 未登录或不是管理员
        showLoginPage();
    }
});

// 显示登录页面
function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

// 显示管理后台
function showDashboard(user) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
    
    // 更新管理员信息
    document.getElementById('adminName').textContent = user.displayName || '管理员';
    document.getElementById('adminEmail2').textContent = user.email;
    document.getElementById('adminAvatar').src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'Admin')}&background=6366f1&color=fff`;
}

// 管理员登录
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    try {
        // 登录
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        // 检查是否是管理员
        if (!checkAdminAccess(userCredential.user)) {
            await auth.signOut();
            errorDiv.textContent = '您没有管理员权限';
            errorDiv.classList.add('show');
            return;
        }
        
        console.log('管理员登录成功');
        
    } catch (error) {
        console.error('登录失败:', error);
        
        let message = '登录失败，请重试';
        if (error.code === 'auth/user-not-found') {
            message = '用户不存在';
        } else if (error.code === 'auth/wrong-password') {
            message = '密码错误';
        } else if (error.code === 'auth/invalid-email') {
            message = '邮箱格式不正确';
        } else if (error.code === 'auth/invalid-credential') {
            message = '邮箱或密码错误';
        }
        
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
    }
});

// 管理员退出
function adminLogout() {
    if (confirm('确定要退出管理后台吗？')) {
        auth.signOut();
    }
}

// ==================== 导航管理 ====================

// 面板切换
document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const panelName = item.dataset.panel;
        
        // 更新导航状态
        document.querySelectorAll('.admin-nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        item.classList.add('active');
        
        // 更新面板显示
        document.querySelectorAll('.admin-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(panelName + 'Panel').classList.add('active');
        
        // 更新标题
        const titles = {
            'dashboard': '仪表板',
            'users': '用户管理',
            'scripts': '脚本管理',
            'announcements': '公告管理',
            'settings': '系统设置'
        };
        document.getElementById('pageTitle').textContent = titles[panelName];
        
        // 加载对应数据
        loadPanelData(panelName);
    });
});

// 加载面板数据
function loadPanelData(panelName) {
    switch(panelName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'users':
            loadUsersData();
            break;
        case 'scripts':
            loadScriptsData();
            break;
        case 'announcements':
            loadAnnouncementsData();
            break;
    }
}

// ==================== 仪表板数据 ====================

async function loadDashboardData() {
    try {
        // 加载统计数据
        const stats = await loadStatistics();
        
        // 更新统计卡片
        document.getElementById('totalUsers').textContent = stats.users || 0;
        document.getElementById('totalScripts').textContent = stats.scripts || 0;
        document.getElementById('totalDownloads').textContent = stats.downloads || 0;
        document.getElementById('totalViews').textContent = stats.views || 0;
        
        // 加载最近活动
        await loadRecentActivity();
        
    } catch (error) {
        console.error('加载仪表板数据失败:', error);
    }
}

// 加载统计数据
async function loadStatistics() {
    try {
        // 从 Firestore 获取统计数据
        const usersSnapshot = await db.collection('users').get();
        const scriptsSnapshot = await db.collection('scripts').get();
        
        // 计算下载量和访问量（示例数据）
        let totalDownloads = 0;
        let totalViews = 0;
        
        scriptsSnapshot.forEach(doc => {
            const data = doc.data();
            totalDownloads += data.downloads || 0;
            totalViews += data.views || 0;
        });
        
        return {
            users: usersSnapshot.size,
            scripts: scriptsSnapshot.size,
            downloads: totalDownloads,
            views: totalViews
        };
    } catch (error) {
        console.error('加载统计数据失败:', error);
        return {
            users: 0,
            scripts: 0,
            downloads: 0,
            views: 0
        };
    }
}

// 加载最近活动
async function loadRecentActivity() {
    const activityDiv = document.getElementById('recentActivity');
    
    try {
        // 从 Firestore 获取最近活动
        const activities = await db.collection('activities')
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get();
        
        if (activities.empty) {
            activityDiv.innerHTML = `
                <div class="empty-state">
                    <p>暂无活动记录</p>
                </div>
            `;
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 1rem;">';
        
        activities.forEach(doc => {
            const data = doc.data();
            const time = data.timestamp?.toDate().toLocaleString() || '未知时间';
            
            html += `
                <div style="padding: 1rem; background: rgba(99, 102, 241, 0.05); border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="color: var(--text-primary); font-weight: 600;">${data.action || '未知操作'}</div>
                        <div style="color: var(--text-secondary); font-size: 0.85rem;">${data.user || '未知用户'}</div>
                    </div>
                    <div style="color: var(--text-secondary); font-size: 0.85rem;">${time}</div>
                </div>
            `;
        });
        
        html += '</div>';
        activityDiv.innerHTML = html;
        
    } catch (error) {
        console.error('加载活动记录失败:', error);
        activityDiv.innerHTML = `
            <div class="empty-state">
                <p>加载失败，请刷新重试</p>
            </div>
        `;
    }
}

// ==================== 用户管理 ====================

async function loadUsersData() {
    const tableDiv = document.getElementById('usersTable');
    
    try {
        // 从 Firestore 获取用户数据
        const usersSnapshot = await db.collection('users').get();
        
        if (usersSnapshot.empty) {
            tableDiv.innerHTML = `
                <div class="empty-state">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    <h3>暂无用户数据</h3>
                    <p>用户注册后会显示在这里</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>用户</th>
                        <th>邮箱</th>
                        <th>角色</th>
                        <th>注册时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        usersSnapshot.forEach(doc => {
            const data = doc.data();
            const role = data.role || 'user';
            const badgeClass = role === 'admin' ? 'badge-admin' : (role === 'vip' ? 'badge-vip' : 'badge-user');
            const roleText = role === 'admin' ? '管理员' : (role === 'vip' ? 'VIP' : '普通用户');
            const joinDate = data.createdAt?.toDate().toLocaleDateString() || '未知';
            
            html += `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <img src="${data.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.displayName || 'User')}`}" 
                                 style="width: 40px; height: 40px; border-radius: 50%;" alt="">
                            <div>
                                <div style="color: var(--text-primary); font-weight: 600;">${data.displayName || '未设置'}</div>
                                <div style="color: var(--text-secondary); font-size: 0.85rem;">ID: ${doc.id.substring(0, 8)}...</div>
                            </div>
                        </div>
                    </td>
                    <td>${data.email || '未设置'}</td>
                    <td><span class="user-badge ${badgeClass}">${roleText}</span></td>
                    <td>${joinDate}</td>
                    <td>
                        <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="editUser('${doc.id}')">编辑</button>
                        <button class="btn btn-danger" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="deleteUser('${doc.id}')">删除</button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        tableDiv.innerHTML = html;
        
    } catch (error) {
        console.error('加载用户数据失败:', error);
        tableDiv.innerHTML = `
            <div class="empty-state">
                <p>加载失败: ${error.message}</p>
            </div>
        `;
    }
}

// 刷新用户列表
function refreshUsers() {
    loadUsersData();
}

// 搜索用户
function searchUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#usersTable tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// 导出用户数据
async function exportUsers() {
    try {
        const usersSnapshot = await db.collection('users').get();
        const users = [];
        
        usersSnapshot.forEach(doc => {
            users.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // 转换为 CSV
        const csv = convertToCSV(users);
        downloadCSV(csv, 'users.csv');
        
        alert('用户数据导出成功！');
    } catch (error) {
        console.error('导出失败:', error);
        alert('导出失败: ' + error.message);
    }
}

// 编辑用户
function editUser(userId) {
    alert('编辑用户功能开发中...\n用户 ID: ' + userId);
    // TODO: 实现编辑用户功能
}

// 删除用户
async function deleteUser(userId) {
    if (!confirm('确定要删除这个用户吗？此操作不可恢复！')) {
        return;
    }
    
    try {
        await db.collection('users').doc(userId).delete();
        alert('用户已删除');
        loadUsersData();
    } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败: ' + error.message);
    }
}

// ==================== 脚本管理 ====================

async function loadScriptsData() {
    const tableDiv = document.getElementById('scriptsTable');
    
    try {
        const scriptsSnapshot = await db.collection('scripts').get();
        
        if (scriptsSnapshot.empty) {
            tableDiv.innerHTML = `
                <div class="empty-state">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                    </svg>
                    <h3>暂无脚本</h3>
                    <p>点击上传按钮添加脚本</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>脚本名称</th>
                        <th>版本</th>
                        <th>下载量</th>
                        <th>更新时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        scriptsSnapshot.forEach(doc => {
            const data = doc.data();
            const updateDate = data.updatedAt?.toDate().toLocaleDateString() || '未知';
            
            html += `
                <tr>
                    <td>
                        <div style="color: var(--text-primary); font-weight: 600;">${data.name || '未命名脚本'}</div>
                        <div style="color: var(--text-secondary); font-size: 0.85rem;">${data.description || '无描述'}</div>
                    </td>
                    <td>${data.version || '1.0.0'}</td>
                    <td>${data.downloads || 0}</td>
                    <td>${updateDate}</td>
                    <td>
                        <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="editScript('${doc.id}')">编辑</button>
                        <button class="btn btn-danger" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="deleteScript('${doc.id}')">删除</button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        tableDiv.innerHTML = html;
        
    } catch (error) {
        console.error('加载脚本数据失败:', error);
        tableDiv.innerHTML = `
            <div class="empty-state">
                <p>加载失败: ${error.message}</p>
            </div>
        `;
    }
}

// 刷新脚本列表
function refreshScripts() {
    loadScriptsData();
}

// 上传脚本
function uploadScript() {
    alert('上传脚本功能开发中...');
    // TODO: 实现脚本上传功能
}

// 编辑脚本
function editScript(scriptId) {
    alert('编辑脚本功能开发中...\n脚本 ID: ' + scriptId);
    // TODO: 实现编辑脚本功能
}

// 删除脚本
async function deleteScript(scriptId) {
    if (!confirm('确定要删除这个脚本吗？')) {
        return;
    }
    
    try {
        await db.collection('scripts').doc(scriptId).delete();
        alert('脚本已删除');
        loadScriptsData();
    } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败: ' + error.message);
    }
}

// ==================== 公告管理 ====================

async function loadAnnouncementsData() {
    const tableDiv = document.getElementById('announcementsTable');
    
    try {
        const announcementsSnapshot = await db.collection('announcements')
            .orderBy('createdAt', 'desc')
            .get();
        
        if (announcementsSnapshot.empty) {
            tableDiv.innerHTML = `
                <div class="empty-state">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
                    </svg>
                    <h3>暂无公告</h3>
                    <p>点击发布按钮添加公告</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>标题</th>
                        <th>内容</th>
                        <th>发布时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        announcementsSnapshot.forEach(doc => {
            const data = doc.data();
            const createDate = data.createdAt?.toDate().toLocaleString() || '未知';
            
            html += `
                <tr>
                    <td style="color: var(--text-primary); font-weight: 600;">${data.title || '无标题'}</td>
                    <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${data.content || '无内容'}</td>
                    <td>${createDate}</td>
                    <td>
                        <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="editAnnouncement('${doc.id}')">编辑</button>
                        <button class="btn btn-danger" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="deleteAnnouncement('${doc.id}')">删除</button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        tableDiv.innerHTML = html;
        
    } catch (error) {
        console.error('加载公告数据失败:', error);
        tableDiv.innerHTML = `
            <div class="empty-state">
                <p>加载失败: ${error.message}</p>
            </div>
        `;
    }
}

// 创建公告
function createAnnouncement() {
    const title = prompt('请输入公告标题:');
    if (!title) return;
    
    const content = prompt('请输入公告内容:');
    if (!content) return;
    
    db.collection('announcements').add({
        title: title,
        content: content,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        author: auth.currentUser.email
    }).then(() => {
        alert('公告发布成功！');
        loadAnnouncementsData();
    }).catch(error => {
        console.error('发布失败:', error);
        alert('发布失败: ' + error.message);
    });
}

// 编辑公告
function editAnnouncement(announcementId) {
    alert('编辑公告功能开发中...\n公告 ID: ' + announcementId);
    // TODO: 实现编辑公告功能
}

// 删除公告
async function deleteAnnouncement(announcementId) {
    if (!confirm('确定要删除这条公告吗？')) {
        return;
    }
    
    try {
        await db.collection('announcements').doc(announcementId).delete();
        alert('公告已删除');
        loadAnnouncementsData();
    } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败: ' + error.message);
    }
}

// ==================== 系统设置 ====================

function saveSettings() {
    const siteTitle = document.getElementById('siteTitle').value;
    const siteDescription = document.getElementById('siteDescription').value;
    const maintenanceMode = document.getElementById('maintenanceMode').checked;
    
    db.collection('settings').doc('site').set({
        title: siteTitle,
        description: siteDescription,
        maintenanceMode: maintenanceMode,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert('设置已保存！');
    }).catch(error => {
        console.error('保存失败:', error);
        alert('保存失败: ' + error.message);
    });
}

// ==================== 工具函数 ====================

// 转换为 CSV
function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    csvRows.push(headers.join(','));
    
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            return typeof value === 'string' ? `"${value}"` : value;
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

// 下载 CSV
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

console.log('管理后台已加载');
