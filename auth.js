// ==================== Firebase 配置 ====================

// Firebase 配置（已配置完成）
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

// Google 登录提供商
const googleProvider = new firebase.auth.GoogleAuthProvider();

// GitHub 登录提供商
const githubProvider = new firebase.auth.GithubAuthProvider();

// ==================== 认证状态监听 ====================

// 监听用户登录状态
auth.onAuthStateChanged((user) => {
    if (user) {
        // 用户已登录
        console.log('用户已登录:', user);
        updateUIForLoggedIn(user);
    } else {
        // 用户未登录
        console.log('用户未登录');
        updateUIForLoggedOut();
    }
});

// ==================== UI 更新函数 ====================

// 更新 UI - 已登录状态
function updateUIForLoggedIn(user) {
    const signInBtn = document.getElementById('signInBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    
    if (signInBtn) signInBtn.style.display = 'none';
    if (userMenu) userMenu.style.display = 'block';
    
    // 设置用户信息
    if (userName) userName.textContent = user.displayName || user.email.split('@')[0];
    if (userEmail) userEmail.textContent = user.email;
    if (userAvatar) {
        userAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=6366f1&color=fff`;
    }
}

// 更新 UI - 未登录状态
function updateUIForLoggedOut() {
    const signInBtn = document.getElementById('signInBtn');
    const userMenu = document.getElementById('userMenu');
    
    if (signInBtn) signInBtn.style.display = 'block';
    if (userMenu) userMenu.style.display = 'none';
}

// ==================== 模态框控制 ====================

// 打开认证模态框
function openAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    modal.classList.add('active');
    
    if (mode === 'login') {
        switchToLogin();
    } else {
        switchToRegister();
    }
}

// 关闭认证模态框
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.remove('active');
}

// 切换到登录表单
function switchToLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

// 切换到注册表单
function switchToRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

// 点击模态框外部关闭
document.addEventListener('click', (e) => {
    const modal = document.getElementById('authModal');
    if (modal && e.target === modal) {
        closeAuthModal();
    }
});

// ==================== 邮箱登录/注册 ====================

// 邮箱登录
async function loginWithEmail() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('请填写邮箱和密码', 'error');
        return;
    }
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('登录成功:', userCredential.user);
        showNotification('登录成功！', 'success');
        closeAuthModal();
    } catch (error) {
        console.error('登录失败:', error);
        handleAuthError(error);
    }
}

// 邮箱注册
async function registerWithEmail() {
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!email || !password || !confirmPassword) {
        showNotification('请填写所有字段', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('密码至少需要6个字符', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('两次输入的密码不一致', 'error');
        return;
    }
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        console.log('注册成功:', userCredential.user);
        showNotification('注册成功！', 'success');
        closeAuthModal();
    } catch (error) {
        console.error('注册失败:', error);
        handleAuthError(error);
    }
}

// ==================== Google 登录 ====================

// Google 登录
async function loginWithGoogle() {
    try {
        const result = await auth.signInWithPopup(googleProvider);
        console.log('Google 登录成功:', result.user);
        showNotification('Google 登录成功！', 'success');
        closeAuthModal();
    } catch (error) {
        console.error('Google 登录失败:', error);
        
        // 特殊处理：邮箱已被其他方式注册
        if (error.code === 'auth/account-exists-with-different-credential') {
            await handleAccountExistsForGoogle(error);
        } else {
            handleAuthError(error);
        }
    }
}

// 处理 Google 登录时账号已存在的情况
async function handleAccountExistsForGoogle(error) {
    try {
        console.log('检测到邮箱已被注册，尝试自动关联 Google 账号...');
        console.log('完整错误对象:', error);
        
        const email = error.email;
        const pendingCred = error.credential;
        
        console.log('冲突的邮箱:', email);
        console.log('待关联的凭证:', pendingCred);
        
        // 如果没有邮箱信息，显示通用提示
        if (!email) {
            console.error('错误对象中没有邮箱信息');
            showNotification('该邮箱已被注册，请尝试使用其他登录方式', 'error');
            return;
        }
        
        // 获取该邮箱已有的登录方式
        let methods;
        try {
            methods = await auth.fetchSignInMethodsForEmail(email);
            console.log('该邮箱已有的登录方式:', methods);
        } catch (fetchError) {
            console.error('获取登录方式失败:', fetchError);
            showNotification('该邮箱已被注册，请尝试使用邮箱密码或 GitHub 登录', 'info');
            return;
        }
        
        // 如果无法获取登录方式，提供通用建议
        if (!methods || methods.length === 0) {
            console.warn('无法获取该邮箱的登录方式，可能是 Firebase 配置问题');
            showNotification('该邮箱已被注册，请尝试使用邮箱密码或 GitHub 登录', 'info');
            return;
        }
        
        const methodName = getMethodDisplayName(methods[0]);
        console.log('将使用的登录方式:', methodName);
        showNotification(`该邮箱已使用 ${methodName} 注册，正在自动关联账号...`, 'info');
        
        // 根据已有的登录方式，引导用户登录
        let result;
        if (methods[0] === 'github.com') {
            // 使用 GitHub 登录
            console.log('尝试使用 GitHub 登录...');
            result = await auth.signInWithPopup(githubProvider);
        } else if (methods[0] === 'password') {
            // 邮箱密码登录需要用户输入密码
            showNotification(`该邮箱已使用邮箱密码注册，请使用邮箱密码登录`, 'info');
            setTimeout(() => {
                switchToLogin();
                const emailInput = document.getElementById('loginEmail');
                if (emailInput) {
                    emailInput.value = email;
                    emailInput.focus();
                }
            }, 2000);
            return;
        } else {
            showNotification(`该邮箱已使用 ${methodName} 注册，请使用该方式登录`, 'info');
            return;
        }
        
        // 关联 Google 凭证到现有账号
        if (result && pendingCred) {
            try {
                await result.user.linkWithCredential(pendingCred);
                showNotification('Google 账号已成功关联！现在可以使用 Google 登录了', 'success');
                console.log('Google 凭证已关联到现有账号');
            } catch (linkErr) {
                console.error('关联凭证失败:', linkErr);
                // 即使关联失败，用户也已经登录了
                showNotification('登录成功！（账号关联失败，但不影响使用）', 'success');
            }
        } else {
            showNotification('登录成功！', 'success');
        }
        
        closeAuthModal();
        
    } catch (linkError) {
        console.error('账号关联过程失败:', linkError);
        console.error('错误代码:', linkError.code);
        console.error('错误信息:', linkError.message);
        
        if (linkError.code === 'auth/credential-already-in-use') {
            showNotification('该 Google 账号已被其他账号使用', 'error');
        } else if (linkError.code === 'auth/popup-closed-by-user') {
            showNotification('登录已取消', 'info');
        } else if (linkError.code === 'auth/cancelled-popup-request') {
            console.log('用户取消了弹窗');
        } else {
            showNotification('该邮箱已被注册，请尝试使用其他登录方式', 'error');
        }
    }
}

// ==================== GitHub 登录 ====================

// GitHub 登录
async function loginWithGithub() {
    try {
        console.log('开始 GitHub 登录...');
        const result = await auth.signInWithPopup(githubProvider);
        console.log('GitHub 登录成功:', result.user);
        console.log('用户信息:', {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            uid: result.user.uid
        });
        showNotification('GitHub 登录成功！', 'success');
        closeAuthModal();
    } catch (error) {
        console.error('GitHub 登录失败 - 错误代码:', error.code);
        console.error('GitHub 登录失败 - 错误信息:', error.message);
        console.error('GitHub 登录失败 - 完整错误:', error);
        
        // 特殊处理：邮箱已被其他方式注册
        if (error.code === 'auth/account-exists-with-different-credential') {
            await handleAccountExistsError(error);
        } else if (error.code === 'auth/popup-closed-by-user') {
            showNotification('GitHub 登录已取消', 'info');
        } else if (error.code === 'auth/cancelled-popup-request') {
            // 用户取消，不显示错误
            console.log('用户取消了 GitHub 登录');
        } else {
            handleAuthError(error);
        }
    }
}

// 处理账号已存在的情况（自动关联账号）
async function handleAccountExistsError(error) {
    try {
        console.log('检测到邮箱已被注册，尝试自动关联账号...');
        console.log('完整错误对象:', error);
        
        // 获取已存在账号使用的登录方式
        const email = error.email;
        const pendingCred = error.credential;
        
        console.log('冲突的邮箱:', email);
        console.log('待关联的凭证:', pendingCred);
        
        // 如果没有邮箱信息，显示通用提示
        if (!email) {
            console.error('错误对象中没有邮箱信息');
            showNotification('该邮箱已被注册，请尝试使用其他登录方式', 'error');
            return;
        }
        
        // 获取该邮箱已有的登录方式
        let methods;
        try {
            methods = await auth.fetchSignInMethodsForEmail(email);
            console.log('该邮箱已有的登录方式:', methods);
        } catch (fetchError) {
            console.error('获取登录方式失败:', fetchError);
            showNotification('该邮箱已被注册，请尝试使用邮箱密码或 Google 登录', 'info');
            return;
        }
        
        // 如果无法获取登录方式，提供通用建议
        if (!methods || methods.length === 0) {
            console.warn('无法获取该邮箱的登录方式，可能是 Firebase 配置问题');
            showNotification('该邮箱已被注册，请尝试使用邮箱密码或 Google 登录', 'info');
            return;
        }
        
        // 提示用户使用原有方式登录
        const methodName = getMethodDisplayName(methods[0]);
        console.log('将使用的登录方式:', methodName);
        showNotification(`该邮箱已使用 ${methodName} 注册，正在自动关联账号...`, 'info');
        
        // 根据已有的登录方式，引导用户登录
        let result;
        if (methods[0] === 'google.com') {
            // 使用 Google 登录
            console.log('尝试使用 Google 登录...');
            result = await auth.signInWithPopup(googleProvider);
        } else if (methods[0] === 'password') {
            // 邮箱密码登录需要用户输入密码
            showNotification(`该邮箱已使用邮箱密码注册，请使用邮箱密码登录`, 'info');
            // 切换到登录表单
            setTimeout(() => {
                switchToLogin();
                // 自动填充邮箱
                const emailInput = document.getElementById('loginEmail');
                if (emailInput) {
                    emailInput.value = email;
                    emailInput.focus();
                }
            }, 2000);
            return;
        } else {
            showNotification(`该邮箱已使用 ${methodName} 注册，请使用该方式登录`, 'info');
            return;
        }
        
        // 关联 GitHub 凭证到现有账号
        if (result && pendingCred) {
            try {
                await result.user.linkWithCredential(pendingCred);
                showNotification('GitHub 账号已成功关联！现在可以使用 GitHub 登录了', 'success');
                console.log('GitHub 凭证已关联到现有账号');
            } catch (linkErr) {
                console.error('关联凭证失败:', linkErr);
                // 即使关联失败，用户也已经登录了
                showNotification('登录成功！（账号关联失败，但不影响使用）', 'success');
            }
        } else {
            showNotification('登录成功！', 'success');
        }
        
        closeAuthModal();
        
    } catch (linkError) {
        console.error('账号关联过程失败:', linkError);
        console.error('错误代码:', linkError.code);
        console.error('错误信息:', linkError.message);
        
        if (linkError.code === 'auth/credential-already-in-use') {
            showNotification('该 GitHub 账号已被其他账号使用', 'error');
        } else if (linkError.code === 'auth/popup-closed-by-user') {
            showNotification('登录已取消', 'info');
        } else if (linkError.code === 'auth/cancelled-popup-request') {
            console.log('用户取消了弹窗');
        } else {
            showNotification('该邮箱已被注册，请尝试使用其他登录方式', 'error');
        }
    }
}

// 获取登录方式的显示名称
function getMethodDisplayName(method) {
    const methodNames = {
        'google.com': 'Google',
        'github.com': 'GitHub',
        'password': '邮箱密码',
        'facebook.com': 'Facebook',
        'twitter.com': 'Twitter'
    };
    return methodNames[method] || method;
}

// ==================== 切换账号 ====================

// 切换账号
async function switchAccount() {
    try {
        // 先退出当前账号
        await auth.signOut();
        
        // 关闭下拉菜单
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.remove('active');
        
        // 打开登录模态框
        setTimeout(() => {
            openAuthModal('login');
            showNotification('请登录其他账号', 'info');
        }, 300);
        
        console.log('已退出当前账号，准备切换');
    } catch (error) {
        console.error('切换账号失败:', error);
        showNotification('切换失败，请重试', 'error');
    }
}

// ==================== 退出登录 ====================

// 退出登录
async function signOut() {
    try {
        await auth.signOut();
        console.log('退出登录成功');
        showNotification('已退出登录', 'info');
        
        // 关闭下拉菜单
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.remove('active');
    } catch (error) {
        console.error('退出登录失败:', error);
        showNotification('退出失败，请重试', 'error');
    }
}

// ==================== 用户菜单 ====================

// 切换用户下拉菜单
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
}

// 点击外部关闭下拉菜单
document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('userMenu');
    const dropdown = document.getElementById('userDropdown');
    
    if (dropdown && !userMenu.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// ==================== 错误处理 ====================

// 处理认证错误
function handleAuthError(error) {
    let message = '操作失败，请重试';
    
    switch (error.code) {
        // 邮箱相关错误
        case 'auth/email-already-in-use':
            message = '该邮箱已被注册，请直接登录';
            break;
        case 'auth/invalid-email':
            message = '邮箱格式不正确，请检查后重试';
            break;
        case 'auth/user-not-found':
            message = '用户不存在，请先注册';
            break;
        
        // 密码相关错误
        case 'auth/weak-password':
            message = '密码强度太弱，请使用至少6个字符';
            break;
        case 'auth/wrong-password':
            message = '密码错误，请重新输入';
            break;
        case 'auth/invalid-credential':
            message = '邮箱或密码错误，请检查后重试';
            break;
        case 'auth/invalid-login-credentials':
            message = '登录信息错误，请检查邮箱和密码';
            break;
        
        // 账户状态错误
        case 'auth/user-disabled':
            message = '该账户已被禁用，请联系管理员';
            break;
        case 'auth/account-exists-with-different-credential':
            message = '该邮箱已使用其他方式注册，请尝试其他登录方式';
            break;
        
        // 操作限制错误
        case 'auth/too-many-requests':
            message = '操作过于频繁，请稍后再试';
            break;
        case 'auth/operation-not-allowed':
            message = '该登录方式未启用，请联系管理员';
            break;
        
        // 弹窗相关错误
        case 'auth/popup-closed-by-user':
            message = '登录窗口已关闭，请重试';
            break;
        case 'auth/popup-blocked':
            message = '弹窗被浏览器阻止，请允许弹窗后重试';
            break;
        case 'auth/cancelled-popup-request':
            message = '登录已取消';
            break;
        
        // 网络相关错误
        case 'auth/network-request-failed':
            message = '网络连接失败，请检查网络后重试';
            break;
        case 'auth/timeout':
            message = '请求超时，请重试';
            break;
        
        // 域名授权错误
        case 'auth/unauthorized-domain':
            message = '当前域名未授权，请联系管理员';
            break;
        
        // 其他错误
        case 'auth/invalid-api-key':
            message = '配置错误，请联系管理员';
            break;
        case 'auth/app-deleted':
            message = '应用配置错误，请联系管理员';
            break;
        case 'auth/expired-action-code':
            message = '验证链接已过期';
            break;
        case 'auth/invalid-action-code':
            message = '验证链接无效';
            break;
        
        default:
            // 隐藏技术细节，显示友好提示
            if (error.message && error.message.includes('credential')) {
                message = '登录信息有误，请检查后重试';
            } else if (error.message && error.message.includes('password')) {
                message = '密码错误，请重新输入';
            } else if (error.message && error.message.includes('email')) {
                message = '邮箱格式错误，请检查后重试';
            } else if (error.message && error.message.includes('network')) {
                message = '网络连接失败，请检查网络';
            } else {
                message = '操作失败，请稍后重试';
            }
            
            // 在控制台记录详细错误，方便调试
            console.error('认证错误详情:', error);
    }
    
    showNotification(message, 'error');
}

// ==================== 回车键支持 ====================

// 登录表单回车键
document.addEventListener('DOMContentLoaded', () => {
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    
    if (loginEmail) {
        loginEmail.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loginWithEmail();
        });
    }
    
    if (loginPassword) {
        loginPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loginWithEmail();
        });
    }
    
    // 注册表单回车键
    const registerEmail = document.getElementById('registerEmail');
    const registerPassword = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (registerEmail) {
        registerEmail.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') registerWithEmail();
        });
    }
    
    if (registerPassword) {
        registerPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') registerWithEmail();
        });
    }
    
    if (confirmPassword) {
        confirmPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') registerWithEmail();
        });
    }
});
