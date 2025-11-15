// ==================== 背景动画效果 ====================

// 生成雪花
function createSnowflakes() {
    const snowflakesContainer = document.getElementById('snowflakes');
    if (!snowflakesContainer) return;
    
    const snowflakeCount = 50; // 雪花数量
    const snowflakeChars = ['❄', '❅', '❆', '✻', '✼', '❉']; // 雪花字符
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
        
        // 随机位置
        snowflake.style.left = Math.random() * 100 + '%';
        
        // 随机大小
        snowflake.style.fontSize = (Math.random() * 1 + 0.5) + 'em';
        
        // 随机动画时长（5-15秒）
        snowflake.style.animationDuration = (Math.random() * 10 + 5) + 's';
        
        // 随机延迟
        snowflake.style.animationDelay = Math.random() * 5 + 's';
        
        snowflakesContainer.appendChild(snowflake);
    }
}

// 生成流星
function createShootingStars() {
    const starsContainer = document.getElementById('shootingStars');
    if (!starsContainer) return;
    
    function addShootingStar() {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        
        // 随机起始位置（从右上角区域）
        star.style.top = Math.random() * 30 + '%';
        star.style.right = Math.random() * 30 + '%';
        
        // 随机动画时长（0.5-1.5秒）
        const duration = Math.random() * 1 + 0.5;
        star.style.animationDuration = duration + 's';
        
        starsContainer.appendChild(star);
        
        // 动画结束后移除元素
        setTimeout(() => {
            star.remove();
        }, duration * 1000);
    }
    
    // 每隔2-5秒生成一颗流星
    function scheduleNextStar() {
        const delay = Math.random() * 3000 + 2000;
        setTimeout(() => {
            addShootingStar();
            scheduleNextStar();
        }, delay);
    }
    
    scheduleNextStar();
}

// 页面加载时初始化背景动画
window.addEventListener('DOMContentLoaded', () => {
    createSnowflakes();
    createShootingStars();
});

// ==================== 复制脚本功能 ====================

// 复制脚本功能
function copyScript() {
    const scriptCode = document.getElementById('script-code').textContent;
    
    // 使用现代剪贴板 API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(scriptCode).then(() => {
            showNotification('脚本已复制到剪贴板！', 'success');
        }).catch(err => {
            console.error('复制失败:', err);
            fallbackCopy(scriptCode);
        });
    } else {
        fallbackCopy(scriptCode);
    }
}

// 备用复制方法
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('脚本已复制到剪贴板！', 'success');
    } catch (err) {
        console.error('复制失败:', err);
        showNotification('复制失败，请手动复制', 'error');
    }
    
    document.body.removeChild(textArea);
}

// 显示通知
function showNotification(message, type = 'success') {
    // 移除已存在的通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 创建新通知
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 滚动时导航栏效果
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// 元素进入视口时的动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 观察所有功能卡片和文档项
document.querySelectorAll('.feature-card, .doc-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Discord 按钮点击事件
document.querySelector('.discord-button').addEventListener('click', () => {
    showNotification('Discord 链接即将开放！', 'success');
});

// 购买按钮点击事件
document.querySelector('.buy-button').addEventListener('click', () => {
    showNotification('购买功能即将开放！', 'success');
});

// 鼠标跟随效果（可选）
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// 添加粒子效果到背景（可选）
function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: rgba(99, 102, 241, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        left: ${Math.random() * window.innerWidth}px;
        top: ${Math.random() * window.innerHeight}px;
        animation: float ${5 + Math.random() * 10}s linear infinite;
    `;
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 15000);
}

// 每隔一段时间创建粒子
setInterval(createParticle, 2000);

// 添加浮动动画
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(floatStyle);

// 页面加载完成后的初始化
window.addEventListener('load', () => {
    console.log('mspaint script loader initialized');
    
    // 添加加载动画完成类
    document.body.classList.add('loaded');
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K 复制脚本
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        copyScript();
    }
});

// ==================== AI 聊天功能 ====================

// 聊天状态
let chatHistory = [];
let isProcessing = false;

// 切换聊天窗口
function toggleChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.classList.toggle('active');
    
    // 如果打开聊天窗口，聚焦输入框
    if (chatContainer.classList.contains('active')) {
        document.getElementById('chatInput').focus();
        
        // 检查是否有 API Key
        const apiKey = localStorage.getItem('deepseek_api_key');
        if (!apiKey) {
            showNotification('请先设置 DeepSeek API Key', 'error');
        }
        
        // 初始化拖动和缩放功能
        initChatDragAndResize();
    }
}

// 初始化聊天窗口拖动和缩放
function initChatDragAndResize() {
    const chatContainer = document.getElementById('chatContainer');
    const chatHeader = chatContainer.querySelector('.chat-header');
    
    // 如果已经初始化过，不重复初始化
    if (chatContainer.dataset.initialized) return;
    chatContainer.dataset.initialized = 'true';
    
    // 拖动功能
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    
    chatHeader.style.cursor = 'move';
    
    chatHeader.addEventListener('mousedown', (e) => {
        // 不拖动关闭按钮
        if (e.target.classList.contains('chat-close-btn') || 
            e.target.closest('.chat-close-btn')) {
            return;
        }
        
        isDragging = true;
        initialX = e.clientX - chatContainer.offsetLeft;
        initialY = e.clientY - chatContainer.offsetTop;
        chatContainer.style.transition = 'none';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            // 限制在窗口范围内
            const maxX = window.innerWidth - chatContainer.offsetWidth;
            const maxY = window.innerHeight - chatContainer.offsetHeight;
            
            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));
            
            chatContainer.style.left = currentX + 'px';
            chatContainer.style.top = currentY + 'px';
            chatContainer.style.right = 'auto';
            chatContainer.style.bottom = 'auto';
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            chatContainer.style.transition = '';
        }
    });
    
    // 缩放功能
    addResizeHandle(chatContainer);
}

// 添加缩放手柄
function addResizeHandle(container) {
    // 创建缩放手柄
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'chat-resize-handle';
    resizeHandle.innerHTML = '⋰';
    container.appendChild(resizeHandle);
    
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
    
    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = container.offsetWidth;
        startHeight = container.offsetHeight;
        e.preventDefault();
        container.style.transition = 'none';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isResizing) {
            const width = startWidth + (e.clientX - startX);
            const height = startHeight + (e.clientY - startY);
            
            // 设置最小和最大尺寸
            const minWidth = 350;
            const maxWidth = window.innerWidth - 40;
            const minHeight = 400;
            const maxHeight = window.innerHeight - 40;
            
            container.style.width = Math.max(minWidth, Math.min(width, maxWidth)) + 'px';
            container.style.height = Math.max(minHeight, Math.min(height, maxHeight)) + 'px';
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            container.style.transition = '';
        }
    });
}

// 保存 API Key
function saveApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (apiKey) {
        localStorage.setItem('deepseek_api_key', apiKey);
        showNotification('API Key 已保存', 'success');
    }
}

// 加载 API Key
window.addEventListener('load', () => {
    const savedApiKey = localStorage.getItem('deepseek_api_key');
    if (savedApiKey) {
        document.getElementById('apiKeyInput').value = savedApiKey;
    } else {
        // 默认 API Key（仅用于个人测试）
        const defaultApiKey = 'sk-757cfa44e4ad49ad9ff305fa0e1ad49f';
        localStorage.setItem('deepseek_api_key', defaultApiKey);
        document.getElementById('apiKeyInput').value = defaultApiKey;
    }
});

// 处理键盘事件
function handleChatKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// 发送消息
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || isProcessing) return;
    
    // 检查 API Key
    const apiKey = localStorage.getItem('deepseek_api_key');
    if (!apiKey) {
        showNotification('请先设置 DeepSeek API Key', 'error');
        return;
    }
    
    // 清空输入框
    input.value = '';
    
    // 添加用户消息到界面
    addMessageToChat('user', message);
    
    // 添加到历史记录
    chatHistory.push({
        role: 'user',
        content: message
    });
    
    // 显示输入中指示器
    showTypingIndicator();
    
    // 调用 DeepSeek API
    isProcessing = true;
    const startTime = Date.now(); // 记录开始时间
    try {
        const response = await callDeepSeekAPI(apiKey, chatHistory);
        const endTime = Date.now(); // 记录结束时间
        const duration = ((endTime - startTime) / 1000).toFixed(2); // 计算用时（秒）
        
        hideTypingIndicator();
        
        if (response) {
            addMessageToChat('bot', response, duration);
            chatHistory.push({
                role: 'assistant',
                content: response
            });
        }
    } catch (error) {
        hideTypingIndicator();
        addMessageToChat('bot', '抱歉，发生了错误：' + error.message);
        console.error('Chat error:', error);
    }
    isProcessing = false;
}

// 调用 DeepSeek API
async function callDeepSeekAPI(apiKey, messages) {
    try {
        // 添加系统提示词（如果还没有）
        const messagesWithSystem = messages[0]?.role === 'system' 
            ? messages 
            : [
                { 
                    role: "system", 
                    content: `You are a helpful assistant for the mspaint Roblox script. You can help users understand how to use the script, answer questions about Build A Boat For Treasure game, and provide technical support.

请使用以下格式化风格回复：
1. 使用表情符号开头的标题（如：🌟 标题：）
2. 使用 • 符号列出要点
3. 使用数字列表（1. 2. 3.）展示步骤
4. 使用 **文本** 加粗重要内容
5. 使用 \`代码\` 标记代码或命令
6. 保持结构化、条理化的表达方式

示例格式：
🌟 关于这个功能：
•  第一个要点
•  第二个要点

💡 使用步骤：
1. 第一步操作
2. 第二步操作` 
                },
                ...messages
            ];
        
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messagesWithSystem,
                temperature: 0.7,
                max_tokens: 2000,
                stream: false
            })
        });
        
        if (!response.ok) {
            let errorMessage = `API 请求失败: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error?.message || errorMessage;
            } catch (e) {
                // 如果无法解析错误响应，使用默认错误消息
            }
            throw new Error(errorMessage);
        }
        
        // 确保正确解析 UTF-8 编码的响应
        const responseText = await response.text();
        const data = JSON.parse(responseText);
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('API 返回数据格式错误');
        }
        
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        
        // 提供更友好的错误提示
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            throw new Error('API Key 无效，请检查您的 DeepSeek API Key');
        } else if (error.message.includes('429')) {
            throw new Error('请求过于频繁，请稍后再试');
        } else if (error.message.includes('Failed to fetch')) {
            throw new Error('网络连接失败，请检查网络连接');
        }
        
        throw error;
    }
}

// 添加消息到聊天界面
function addMessageToChat(type, content, duration = null) {
    const messagesContainer = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type === 'user' ? 'user-message' : 'bot-message'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'user' ? '👤' : '🤖';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // 格式化消息内容
    messageContent.innerHTML = formatMessageContent(content);
    
    // 如果是 bot 消息且有用时信息，添加用时显示
    if (type === 'bot' && duration) {
        const timeInfo = document.createElement('div');
        timeInfo.className = 'message-time-info';
        timeInfo.innerHTML = `<span class="time-icon">⏱️</span> 用时 ${duration}秒`;
        messageContent.appendChild(timeInfo);
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    messagesContainer.appendChild(messageDiv);
    
    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 格式化消息内容
function formatMessageContent(content) {
    // 清理乱码字符
    content = cleanGarbledText(content);
    
    // 转义 HTML 特殊字符
    let formatted = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // 处理标题（以表情符号开头的行）
    formatted = formatted.replace(/^([🌟✨💡🎯🔥⚡📌🎨🚀💻🔧📝🎓💪👉])\s*(.+?)[:：]\s*$/gm, 
        '<div class="msg-title">$1 $2:</div>');
    
    // 处理列表项（• 或 - 开头）
    formatted = formatted.replace(/^[•\-]\s+(.+)$/gm, 
        '<div class="msg-list-item">• $1</div>');
    
    // 处理数字列表（1. 2. 等）
    formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, 
        '<div class="msg-list-item"><strong>$1.</strong> $2</div>');
    
    // 处理加粗文本（**文本**）
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // 处理代码块（`代码`）
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    // 处理换行
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
}

// 显示输入中指示器
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message';
    typingDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '🤖';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    
    messageContent.appendChild(typingIndicator);
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(messageContent);
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 隐藏输入中指示器
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// 清空聊天历史
function clearChatHistory() {
    chatHistory = [];
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = `
        <div class="chat-message bot-message">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <p>你好！我是 AI 助手，有什么可以帮助你的吗？</p>
            </div>
        </div>
    `;
    showNotification('聊天历史已清空', 'success');
}

// 打开文档文件
function openDoc(filename) {
    // 使用文档查看器打开
    window.location.href = `docs-viewer.html?doc=${filename}`;
}

// ==================== 文本选择 AI 提问功能 ====================

let selectionPopup = null;

// 创建选择弹出框
function createSelectionPopup() {
    if (selectionPopup) return selectionPopup;
    
    const popup = document.createElement('div');
    popup.className = 'selection-popup';
    popup.innerHTML = `
        <button class="selection-ai-btn" onclick="askAIAboutSelection()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            提问 AI
        </button>
    `;
    document.body.appendChild(popup);
    selectionPopup = popup;
    return popup;
}

// 处理文本选择
let selectedText = '';

document.addEventListener('mouseup', (e) => {
    // 延迟执行，确保选择完成
    setTimeout(() => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        
        // 如果在聊天窗口内选择，不显示弹出框
        const chatContainer = document.getElementById('chatContainer');
        if (chatContainer && chatContainer.contains(e.target)) {
            hideSelectionPopup();
            return;
        }
        
        if (text.length > 0 && text.length < 500) {
            selectedText = text;
            showSelectionPopup(e.pageX, e.pageY);
        } else {
            hideSelectionPopup();
        }
    }, 10);
});

// 显示选择弹出框
function showSelectionPopup(x, y) {
    const popup = createSelectionPopup();
    
    // 计算位置（避免超出屏幕）
    const popupWidth = 120;
    const popupHeight = 40;
    
    let left = x;
    let top = y - popupHeight - 10;
    
    // 防止超出右边界
    if (left + popupWidth > window.innerWidth) {
        left = window.innerWidth - popupWidth - 10;
    }
    
    // 防止超出上边界
    if (top < 0) {
        top = y + 10;
    }
    
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.style.display = 'block';
    
    // 添加淡入动画
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
}

// 隐藏选择弹出框
function hideSelectionPopup() {
    if (selectionPopup) {
        selectionPopup.classList.remove('show');
        setTimeout(() => {
            selectionPopup.style.display = 'none';
        }, 200);
    }
}

// 点击其他地方隐藏弹出框
document.addEventListener('mousedown', (e) => {
    if (selectionPopup && !selectionPopup.contains(e.target)) {
        hideSelectionPopup();
    }
});

// 提问 AI 关于选中的内容
function askAIAboutSelection() {
    if (!selectedText) return;
    
    // 打开聊天窗口
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer.classList.contains('active')) {
        toggleChat();
    }
    
    // 构建提问内容
    const question = `关于这段内容：\n\n"${selectedText}"\n\n请解释或回答相关问题。`;
    
    // 设置到输入框
    const chatInput = document.getElementById('chatInput');
    chatInput.value = question;
    
    // 聚焦输入框
    chatInput.focus();
    
    // 隐藏弹出框
    hideSelectionPopup();
    
    // 可选：自动发送
    // setTimeout(() => sendMessage(), 500);
}

// ==================== 网络搜索功能 ====================

let currentSearchEngine = 'bing';
let currentSearchUrl = '';

// 搜索引擎配置
const searchEngines = {
    bing: {
        name: '必应',
        url: 'https://www.bing.com/search?q=',
        color: '#008373'
    },
    baidu: {
        name: '百度',
        url: 'https://www.baidu.com/s?wd=',
        color: '#2932E1'
    },
    google: {
        name: '谷歌',
        url: 'https://www.google.com/search?q=',
        color: '#4285f4'
    }
};

// 切换搜索模态框
function toggleSearchModal() {
    const modal = document.getElementById('searchModal');
    const isActive = modal.classList.contains('active');
    
    if (isActive) {
        modal.classList.remove('active');
        // 重置搜索界面
        backToSearch();
    } else {
        modal.classList.add('active');
        // 聚焦搜索输入框
        setTimeout(() => {
            document.getElementById('searchInput').focus();
        }, 100);
    }
}

// 切换搜索引擎
function switchSearchEngine(engine) {
    currentSearchEngine = engine;
    
    // 更新标签样式
    document.querySelectorAll('.search-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.engine === engine) {
            tab.classList.add('active');
        }
    });
    
    // 更新输入框占位符
    const searchInput = document.getElementById('searchInput');
    searchInput.placeholder = `在${searchEngines[engine].name}中搜索...`;
}

// 执行搜索
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) {
        showNotification('请输入搜索内容', 'error');
        return;
    }
    
    // 构建搜索 URL
    currentSearchUrl = searchEngines[currentSearchEngine].url + encodeURIComponent(query);
    
    // 显示搜索结果区域
    showSearchResults(query);
    
    showNotification(`正在使用${searchEngines[currentSearchEngine].name}搜索...`, 'success');
}

// 显示搜索结果
function showSearchResults(query) {
    const resultsContainer = document.getElementById('searchResultsContainer');
    const searchTips = document.getElementById('searchTips');
    const searchInput = document.getElementById('searchInput');
    const resultsTitle = document.getElementById('searchResultsTitle');
    const resultsFrame = document.getElementById('searchResultsFrame');
    const modalContent = document.getElementById('searchModalContent');
    
    // 隐藏搜索输入区域
    searchInput.parentElement.style.display = 'none';
    searchTips.style.display = 'none';
    document.querySelector('.search-engine-tabs').style.display = 'none';
    
    // 显示结果区域
    resultsContainer.style.display = 'block';
    resultsTitle.textContent = `搜索: "${query}"`;
    
    // 扩大模态框
    modalContent.classList.add('expanded');
    
    // 加载搜索结果到 iframe
    resultsFrame.src = currentSearchUrl;
}

// 返回搜索界面
function backToSearch() {
    const resultsContainer = document.getElementById('searchResultsContainer');
    const searchTips = document.getElementById('searchTips');
    const searchInput = document.getElementById('searchInput');
    const resultsFrame = document.getElementById('searchResultsFrame');
    const modalContent = document.getElementById('searchModalContent');
    
    // 显示搜索输入区域
    searchInput.parentElement.style.display = 'flex';
    searchTips.style.display = 'block';
    document.querySelector('.search-engine-tabs').style.display = 'flex';
    
    // 隐藏结果区域
    resultsContainer.style.display = 'none';
    
    // 恢复模态框大小
    modalContent.classList.remove('expanded');
    
    // 清空 iframe
    resultsFrame.src = '';
    
    // 清空输入框
    searchInput.value = '';
}

// 在新标签页打开当前搜索结果
function openInNewTab() {
    if (currentSearchUrl) {
        window.open(currentSearchUrl, '_blank');
        showNotification('已在新标签页打开', 'success');
    }
}

// 处理搜索输入框的回车键
function handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        performSearch();
    }
}

// 点击模态框外部关闭
document.addEventListener('click', (e) => {
    const modal = document.getElementById('searchModal');
    if (modal && e.target === modal) {
        toggleSearchModal();
    }
});

// ESC 键关闭搜索模态框
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('searchModal');
        if (modal && modal.classList.contains('active')) {
            toggleSearchModal();
        }
    }
});

// ==================== 音频播放器功能 ====================

const bgmAudio = document.getElementById('bgmAudio');
let isLooping = true; // 默认开启循环

// 更新音频时长显示
function updateDuration() {
    const duration = bgmAudio.duration;
    if (duration && !isNaN(duration) && isFinite(duration) && duration > 0) {
        document.getElementById('duration').textContent = formatTime(duration);
        console.log('音频时长:', formatTime(duration));
        return true;
    }
    return false;
}

// 初始化音频播放器
window.addEventListener('load', () => {
    if (bgmAudio) {
        // 尝试自动播放
        const playPromise = bgmAudio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // 自动播放成功
                updatePlayButton(true);
                console.log('背景音乐自动播放成功');
                // 播放后再次尝试获取时长
                setTimeout(updateDuration, 100);
            }).catch(error => {
                // 自动播放被阻止（浏览器策略）
                console.log('自动播放被阻止，需要用户交互:', error);
                updatePlayButton(false);
            });
        }
        
        // 更新时长 - loadedmetadata
        bgmAudio.addEventListener('loadedmetadata', () => {
            console.log('loadedmetadata 事件触发');
            updateDuration();
        });
        
        // 更新时长 - loadeddata
        bgmAudio.addEventListener('loadeddata', () => {
            console.log('loadeddata 事件触发');
            updateDuration();
        });
        
        // 更新时长 - canplay
        bgmAudio.addEventListener('canplay', () => {
            console.log('canplay 事件触发');
            updateDuration();
        });
        
        // 更新时长 - canplaythrough
        bgmAudio.addEventListener('canplaythrough', () => {
            console.log('canplaythrough 事件触发');
            updateDuration();
        });
        
        // 如果音频已经加载，立即尝试获取时长
        if (bgmAudio.readyState >= 1) {
            console.log('音频已加载，立即获取时长');
            updateDuration();
        }
        
        // 备用方案：定时检查时长
        let retryCount = 0;
        const durationCheckInterval = setInterval(() => {
            if (updateDuration() || retryCount >= 20) {
                clearInterval(durationCheckInterval);
                if (retryCount >= 20) {
                    console.log('无法获取音频时长');
                }
            }
            retryCount++;
        }, 500);
        
        // 更新进度
        bgmAudio.addEventListener('timeupdate', () => {
            // 确保时长已显示
            const durationElement = document.getElementById('duration');
            if (durationElement.textContent === '0:00') {
                updateDuration();
            }
            
            const progress = (bgmAudio.currentTime / bgmAudio.duration) * 100;
            document.getElementById('progressSlider').value = progress || 0;
            document.getElementById('currentTime').textContent = formatTime(bgmAudio.currentTime);
            
            // 计算并显示剩余时间
            const remaining = bgmAudio.duration - bgmAudio.currentTime;
            if (remaining && !isNaN(remaining) && isFinite(remaining)) {
                document.getElementById('remainingTime').textContent = formatTime(remaining);
            }
        });
        
        // 播放开始
        bgmAudio.addEventListener('play', () => {
            updatePlayButton(true);
        });
        
        // 播放暂停
        bgmAudio.addEventListener('pause', () => {
            updatePlayButton(false);
        });
        
        // 播放结束（虽然设置了loop，但保留逻辑）
        bgmAudio.addEventListener('ended', () => {
            if (isLooping) {
                bgmAudio.currentTime = 0;
                bgmAudio.play();
            } else {
                updatePlayButton(false);
            }
        });
        
        // 初始化循环按钮状态
        updateLoopButton();
    }
});

// 切换播放器面板
function toggleAudioPlayer() {
    const panel = document.getElementById('audioPlayerPanel');
    panel.classList.toggle('active');
}

// 播放/暂停
function togglePlay() {
    if (bgmAudio.paused) {
        bgmAudio.play();
        updatePlayButton(true);
    } else {
        bgmAudio.pause();
        updatePlayButton(false);
    }
}

// 更新播放按钮图标
function updatePlayButton(isPlaying) {
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    
    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
}

// 调整进度
function seekAudio(value) {
    const time = (value / 100) * bgmAudio.duration;
    bgmAudio.currentTime = time;
}

// 调整音量
function changeVolume(value) {
    bgmAudio.volume = value / 100;
    document.getElementById('volumeValue').textContent = value;
}

// 调整播放速度
function changeSpeed(value) {
    const speed = value / 100;
    bgmAudio.playbackRate = speed;
    document.getElementById('speedValue').textContent = speed.toFixed(1);
}

// 快退 10 秒
function skipBackward() {
    bgmAudio.currentTime = Math.max(0, bgmAudio.currentTime - 10);
}

// 快进 10 秒
function skipForward() {
    bgmAudio.currentTime = Math.min(bgmAudio.duration, bgmAudio.currentTime + 10);
}

// 切换循环播放
function toggleLoop() {
    isLooping = !isLooping;
    bgmAudio.loop = isLooping;
    updateLoopButton();
    
    if (isLooping) {
        showNotification('已开启循环播放', 'success');
    } else {
        showNotification('已关闭循环播放', 'info');
    }
}

// 更新循环按钮状态
function updateLoopButton() {
    const loopBtn = document.getElementById('loopBtn');
    if (loopBtn) {
        if (isLooping) {
            loopBtn.style.color = 'var(--accent-color)';
            loopBtn.style.background = 'rgba(99, 102, 241, 0.1)';
        } else {
            loopBtn.style.color = '';
            loopBtn.style.background = '';
        }
    }
}

// 格式化时间
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 清理乱码字符
function cleanGarbledText(text) {
    if (!text) return '';
    
    // 移除 Unicode 替换字符 (U+FFFD) - 这是 � 的 Unicode 编码
    text = text.replace(/\uFFFD/g, '');
    text = text.replace(/�/g, '');
    
    // 移除所有不可见的替换字符和占位符
    text = text.replace(/[\uFFFD\uFFFE\uFFFF]/g, '');
    
    // 移除零宽字符
    text = text.replace(/[\u200B-\u200D\uFEFF]/g, '');
    
    // 移除其他控制字符（保留换行、制表符和回车）
    text = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
    
    // 移除 BOM (Byte Order Mark)
    text = text.replace(/^\uFEFF/, '');
    
    // 修复常见的编码问题
    text = text.replace(/\?{2,}/g, '');
    
    // 移除连续的空格（保留单个空格）
    text = text.replace(/  +/g, ' ');
    
    // 移除行首行尾的空白
    text = text.split('\n').map(line => line.trim()).join('\n');
    
    return text.trim();
}
