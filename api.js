/**
 * 🛡️ Top Vex - Multi API Client
 * ✅ يدعم نمط Dev-Hamza الموحد
 */

// ==========================================
// أنماط API المدعومة
// ==========================================
const API_PATTERNS = {
    'dev_hamza': {
        name: 'Dev-Hamza الموحد',
        auth_type: 'header',           // api-token في الهيدر
        auth_key: 'api-token',
        endpoints: {
            profile: '/profile',
            products: '/products',
            createOrder: '/newOrder/{product_id}/params',
            checkOrder: '/check'
        },
        status_completed: ['accept', 'done', 'completed', 'success', 'accepted', 'ok', 'complete'],
        status_rejected: ['reject', 'rejected', 'fail', 'failed', 'error', 'cancel', 'cancelled'],
        status_pending: ['wait', 'pending', 'processing', 'in_progress']
    }
    // ✚ ممكن إضافة أنماط جديدة هنا
};

// ==========================================
// تخزين البيانات محلياً (LocalStorage)
// ==========================================
const DB = {
    get(key) {
        try { return JSON.parse(localStorage.getItem(key)); }
        catch { return null; }
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    // جلب المصادر
    getSources() { return this.get('sources') || []; },
    saveSources(sources) { this.set('sources', sources); },
    // جلب إعدادات
    getSettings() { return this.get('settings') || {}; },
    saveSettings(settings) { this.set('settings', settings); },
    // جلب الطلبات
    getOrders() { return this.get('orders') || []; },
    saveOrders(orders) { this.set('orders', orders); },
    // جلب المستخدمين
    getUsers() { return this.get('users') || []; },
    saveUsers(users) { this.set('users', users); },
    // قائمة الأدمنز
    getAdmins() { return this.get('admins') || [8257250965]; },
    saveAdmins(admins) { this.set('admins', admins); }
};

// ==========================================
// HTTP Client (يدعم CORS)
// ==========================================
async function httpRequest(url, options = {}) {
    const {
        method = 'GET',
        headers = {},
        body = null,
        timeout = 15000,
        retries = 2
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'TopVex/1.0'
    };

    const finalHeaders = { ...defaultHeaders, ...headers };

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const fetchOptions = {
                method,
                headers: finalHeaders,
                signal: controller.signal
            };

            if (body && method !== 'GET') {
                fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
            }

            // بناء الرابط للـ GET
            let finalUrl = url;
            if (method === 'GET' && body && typeof body === 'object') {
                const params = new URLSearchParams(body).toString();
                finalUrl = `${url}${url.includes('?') ? '&' : '?'}${params}`;
            }

            const response = await fetch(finalUrl, fetchOptions);
            clearTimeout(timeoutId);

            if (!response.ok) {
                if (attempt < retries) {
                    await sleep(1000 * (attempt + 1));
                    continue;
                }
                return null;
            }

            const data = await response.json();
            return data;

        } catch (error) {
            clearTimeout(timeoutId);
            if (attempt < retries) {
                await sleep(1000 * (attempt + 1));
                continue;
            }
            console.error(`HTTP Error [${url}]:`, error.message);
            return null;
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==========================================
// MultiSource API Client
// ==========================================
class MultiSourceAPI {
    
    // الحصول على هيدر المصادقة
    static getHeaders(source) {
        const pattern = API_PATTERNS[source.api_pattern || 'dev_hamza'] || API_PATTERNS['dev_hamza'];
        const headers = {};
        if (pattern.auth_type === 'header') {
            headers[pattern.auth_key] = source.api_token || '';
        }
        return headers;
    }

    // تنظيف رابط API
    static cleanApiUrl(baseUrl) {
        if (!baseUrl) return '';
        return baseUrl.replace(/\/(api-docs|docs|swagger).*$/, '').replace(/\/$/, '');
    }

    // بناء الراوابط المحتملة
    static buildUrls(source, endpointPath, params = {}) {
        const baseUrl = this.cleanApiUrl(source.api_url || '');
        let path = endpointPath;
        for (const [key, value] of Object.entries(params)) {
            path = path.replace(`{${key}}`, value);
        }

        const candidates = [];
        if (baseUrl.endsWith('/api/client')) {
            candidates.push(`${baseUrl}${path}`);
        } else if (baseUrl.endsWith('/api')) {
            candidates.push(`${baseUrl}/client${path}`);
            candidates.push(`${baseUrl}/client/api${path}`);
        } else {
            candidates.push(`${baseUrl}/api/client${path}`);
            candidates.push(`${baseUrl}/client/api${path}`);
        }
        return [...new Set(candidates)];
    }

    // محاولة الطلب على عدة روابط
    static async tryRequest(urls, headers, method = 'GET', body = null) {
        for (const url of urls) {
            const result = await httpRequest(url, { method, headers, body });
            if (result && !result.error) {
                return { result, url };
            }
        }
        return { result: null, url: null };
    }

    // استخراج قيمة متداخلة
    static getNestedValue(data, path) {
        if (!data || typeof data !== 'object') return path === '' ? data : null;
        const keys = path.split('.');
        let current = data;
        for (const key of keys) {
            if (current && typeof current === 'object') {
                current = current[key];
            } else {
                return null;
            }
        }
        return current;
    }

    // ========== الملف الشخصي ==========
    static async getProfile(source) {
        try {
            const headers = this.getHeaders(source);
            const urls = this.buildUrls(source, '/profile');
            const { result } = await this.tryRequest(urls, headers);

            if (!result || typeof result !== 'object') {
                return { balance: 0, username: 'فشل الاتصال' };
            }

            let balance = 0;
            for (const path of ['balance', 'data.balance', 'user.balance']) {
                const bal = this.getNestedValue(result, path);
                if (bal !== null && bal !== undefined) {
                    balance = parseFloat(bal) || 0;
                    break;
                }
            }

            const username = result.username || result.name ||
                           this.getNestedValue(result, 'data.username') || 'مستخدم';

            return { balance, username: String(username) };
        } catch (error) {
            console.error('getProfile error:', error);
            return { balance: 0, username: 'خطأ' };
        }
    }

    // ========== المنتجات ==========
    static async getProducts(source) {
        try {
            const headers = this.getHeaders(source);
            const urls = this.buildUrls(source, '/products');
            const { result } = await this.tryRequest(urls, headers);

            if (!result) return [];
            if (Array.isArray(result)) return result;
            if (typeof result === 'object') {
                for (const key of ['data', 'products', 'services', 'items', 'result']) {
                    if (key in result && Array.isArray(result[key])) {
                        return result[key];
                    }
                }
                for (const [key, value] of Object.entries(result)) {
                    if (Array.isArray(value) && value.length > 0) {
                        if (typeof value[0] === 'object' && 'id' in value[0]) {
                            return value;
                        }
                    }
                }
            }
            return [];
        } catch (error) {
            console.error('getProducts error:', error);
            return [];
        }
    }

    // ========== منتج محدد ==========
    static async getProductById(source, productId) {
        const products = await this.getProducts(source);
        return products.find(p => String(p.id) === String(productId)) || null;
    }

    // ========== إنشاء طلب ==========
    static async createOrder(source, productId, quantity = 1, playerId = "0") {
        try {
            const headers = this.getHeaders(source);
            const orderUuid = this.generateUUID();

            // بناء بارامترات الطلب
            const params = {
                qty: String(parseFloat(quantity)),
                playerId: String(playerId),
                order_uuid: orderUuid
            };
            const queryString = new URLSearchParams(params).toString();

            const urls = this.buildUrls(source, '/newOrder/{product_id}/params', {
                product_id: productId
            });
            const fullUrls = urls.map(u => `${u}?${queryString}`);

            const { result } = await this.tryRequest(fullUrls, headers);

            if (!result || typeof result !== 'object') {
                return {
                    order_id: orderUuid,
                    order_uuid: orderUuid,
                    status: 'error',
                    message: 'لا يوجد رد من المصدر'
                };
            }

            // استخراج رقم الطلب
            let orderId = null;
            for (const path of ['data.order_id', 'order_id', 'id', 'orderId']) {
                const oid = this.getNestedValue(result, path);
                if (oid) { orderId = String(oid); break; }
            }
            if (!orderId) orderId = orderUuid;

            // تحديد الحالة
            const pattern = API_PATTERNS['dev_hamza'];
            const apiStatus = String(result.status || '').toLowerCase();
            let finalStatus = 'error';

            if (pattern.status_completed.includes(apiStatus)) finalStatus = 'completed';
            else if (pattern.status_rejected.includes(apiStatus)) finalStatus = 'rejected';
            else if (pattern.status_pending.includes(apiStatus)) finalStatus = 'pending';
            else if (orderId) finalStatus = 'processing';

            // استخراج رسالة
            let message = '';
            for (const path of ['message', 'data.message', 'error']) {
                const msg = this.getNestedValue(result, path);
                if (msg) { message = String(msg); break; }
            }

            return {
                order_id: orderId,
                order_uuid: orderUuid,
                status: finalStatus,
                message,
                price: parseFloat(result.price || 0),
                raw: result
            };

        } catch (error) {
            console.error('createOrder error:', error);
            return {
                order_id: null,
                order_uuid: this.generateUUID(),
                status: 'error',
                message: String(error).substring(0, 100)
            };
        }
    }

    // ========== فحص طلب ==========
    static async checkOrder(source, orderId) {
        try {
            const headers = this.getHeaders(source);
            const ids = JSON.stringify([String(orderId)]);

            const urls = this.buildUrls(source, '/check');
            const fullUrls = urls.map(u => {
                const sep = u.includes('?') ? '&' : '?';
                return `${u}${sep}orders=${encodeURIComponent(ids)}`;
            });

            const { result } = await this.tryRequest(fullUrls, headers);

            if (!result || typeof result !== 'object') return null;

            const pattern = API_PATTERNS['dev_hamza'];
            let dataList = result.data || [];
            if (!Array.isArray(dataList)) dataList = [dataList];

            if (dataList.length > 0) {
                const orderData = dataList[0];
                const apiStatus = String(orderData.status || '').toLowerCase();

                if (pattern.status_completed.includes(apiStatus)) return { status: 'completed', data: orderData };
                if (pattern.status_rejected.includes(apiStatus)) return { status: 'rejected', data: orderData };
                if (pattern.status_pending.includes(apiStatus)) return { status: 'pending', data: orderData };
            }
            return null;
        } catch (error) {
            console.error('checkOrder error:', error);
            return null;
        }
    }

    // ========== اختبار اتصال ==========
    static async testConnection(source) {
        try {
            const profile = await this.getProfile(source);
            const balance = parseFloat(profile.balance || -1);
            const username = String(profile.username || '');
            const success = balance >= 0 && !username.startsWith('خطأ') && username !== 'فشل الاتصال';
            return { success, profile };
        } catch {
            return { success: false, profile: { balance: 0, username: 'فشل' } };
        }
    }

    // ========== UUID مصغر ==========
    static generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// ==========================================
// تصدير الدوال للاستخدام العام
// ==========================================
window.MultiSourceAPI = MultiSourceAPI;
window.DB = DB;
window.httpRequest = httpRequest;/**
 * 🛡️ Top Vex - التطبيق الرئيسي
 */

// إعدادات تيليجرام
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// بيانات المستخدم
const user = tg.initDataUnsafe?.user || {};
const userId = user.id || 0;
const userFirstName = user.first_name || 'مستخدم';

// قائمة الأدمنز
const admins = DB.getAdmins();
const isAdmin = admins.includes(userId);

// ==========================================
// عرض زر الأدمن للأدمن فقط
// ==========================================
if (isAdmin) {
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) adminBtn.style.display = 'flex';
}

// ==========================================
// تحميل الإعدادات
// ==========================================
const settings = DB.getSettings();
applySettings(settings);

function applySettings(settings) {
    // اسم المتجر
    const storeName = document.getElementById('storeName');
    if (storeName && settings.storeName) {
        storeName.textContent = settings.storeName;
    }

    // اللون الرئيسي
    if (settings.primaryColor) {
        document.documentElement.style.setProperty('--primary', settings.primaryColor);
    }

    // الوضع الداكن/الفاتح
    if (settings.theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// ==========================================
// تحميل الأقسام من التخزين
// ==========================================
function loadCategories() {
    const categories = DB.get('categories') || [];
    const container = document.getElementById('categoriesContainer');
    if (!container) return;

    container.innerHTML = '';
    categories.forEach(cat => {
        const card = createCategoryCard(cat);
        container.appendChild(card);
    });
}

function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.onclick = () => navigateToCategory(category.id);
    card.innerHTML = `
        <img src="${category.image || 'images/default-cat.png'}" alt="${category.name}">
        <span>${category.name}</span>
    `;
    return card;
}

// ==========================================
// التهيئة
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    console.log('✅ Top Vex Store Ready');
});
