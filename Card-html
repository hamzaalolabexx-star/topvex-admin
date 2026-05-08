<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ONE Store</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <link rel="stylesheet" href="css/style.css">
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        :root{
            --primary:#6366f1;
            --primary-light:#818cf8;
            --bg:#0a0a0a;
            --bg-card:#1a1a2e;
            --bg-card-hover:#252540;
            --text:#ffffff;
            --text-secondary:#a1a1aa;
            --border:rgba(255,255,255,0.1);
            --gold:#f59e0b;
            --danger:#ef4444;
            --success:#10b981;
            --radius-lg:20px;
            --radius-md:14px;
            --radius-sm:10px;
            --shadow:0 4px 24px rgba(0,0,0,0.4);
            --transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        body.light-mode{
            --bg:#f8fafc;
            --bg-card:#ffffff;
            --bg-card-hover:#f1f5f9;
            --text:#0f172a;
            --text-secondary:#64748b;
            --border:rgba(0,0,0,0.08);
            --shadow:0 4px 24px rgba(0,0,0,0.06);
        }
        body{
            font-family:'Cairo',-apple-system,sans-serif;
            background:var(--bg);
            color:var(--text);
            min-height:100vh;
            overflow-x:hidden;
            transition:var(--transition);
            padding-bottom:100px;
        }
        /* خلفية لامعة */
        body::before{
            content:'';
            position:fixed;
            top:-50%;left:-50%;
            width:200%;height:200%;
            background:radial-gradient(ellipse at 30% 20%,rgba(99,102,241,0.08) 0%,transparent 50%),
                       radial-gradient(ellipse at 70% 60%,rgba(245,158,11,0.05) 0%,transparent 50%),
                       radial-gradient(ellipse at 50% 90%,rgba(16,185,129,0.04) 0%,transparent 50%);
            pointer-events:none;
            z-index:0;
            transition:var(--transition);
        }
        /* الحاوية الرئيسية */
        .app{position:relative;z-index:1;max-width:500px;margin:0 auto;padding:12px}

        /* الهيدر */
        .header{
            display:flex;align-items:center;justify-content:space-between;
            padding:12px 8px;margin-bottom:16px;
            position:sticky;top:0;z-index:100;
            background:rgba(10,10,10,0.85);backdrop-filter:blur(20px);
            border-radius:0 0 var(--radius-lg) var(--radius-lg);
        }
        body.light-mode .header{background:rgba(255,255,255,0.85)}
        .logo-area{display:flex;align-items:center;gap:10px}
        .logo-img{width:44px;height:44px;border-radius:var(--radius-sm);object-fit:cover;background:var(--bg-card)}
        .store-name{font-size:20px;font-weight:800;letter-spacing:-0.5px}
        .header-actions{display:flex;gap:6px}
        .icon-btn{
            width:40px;height:40px;border-radius:50%;
            border:none;background:var(--bg-card);
            color:var(--text);font-size:18px;
            cursor:pointer;display:flex;align-items:center;justify-content:center;
            transition:var(--transition);
            position:relative;
        }
        .icon-btn:hover{background:var(--bg-card-hover);transform:scale(1.05)}
        .icon-btn.admin-btn{display:none}
        .badge{
            position:absolute;top:-4px;right:-4px;
            background:var(--danger);color:#fff;
            font-size:10px;width:18px;height:18px;border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-weight:700;
        }
        /* الشريط الجانبي */
        .sidebar{
            position:fixed;top:0;right:-320px;width:300px;height:100vh;
            background:var(--bg-card);z-index:200;
            transition:var(--transition);
            box-shadow:var(--shadow);
            padding:80px 20px 20px;
            overflow-y:auto;
            display:flex;flex-direction:column;gap:8px;
        }
        .sidebar.open{right:0}
        .sidebar-overlay{
            position:fixed;top:0;left:0;width:100%;height:100%;
            background:rgba(0,0,0,0.6);z-index:199;
            display:none;
        }
        .sidebar-overlay.show{display:block}
        .sidebar-close{
            position:absolute;top:16px;right:16px;
            width:40px;height:40px;border-radius:50%;
            border:none;background:var(--bg-card-hover);
            color:var(--text);font-size:22px;cursor:pointer;
        }
        .sidebar-item{
            display:flex;align-items:center;gap:12px;
            padding:14px 16px;border-radius:var(--radius-md);
            border:none;background:transparent;color:var(--text);
            font-family:inherit;font-size:15px;font-weight:600;
            cursor:pointer;transition:var(--transition);
            width:100%;text-align:right;
        }
        .sidebar-item:hover{background:var(--bg-card-hover)}
        .sidebar-item .icon{font-size:22px;width:32px;text-align:center}
        .sidebar-item.fav{color:var(--danger)}
        /* السلايدر */
        .slider-container{
            position:relative;overflow:hidden;
            border-radius:var(--radius-lg);
            margin-bottom:16px;
            height:160px;
            background:var(--bg-card);
        }
        .slider-track{
            display:flex;height:100%;
            transition:transform 0.5s ease;
        }
        .slider-slide{
            min-width:100%;height:100%;
            display:flex;align-items:center;justify-content:center;
            padding:20px;
        }
        .slider-slide img{max-width:100%;max-height:100%;border-radius:var(--radius-md)}
        .slider-dots{
            position:absolute;bottom:12px;left:50%;transform:translateX(-50%);
            display:flex;gap:8px;
        }
        .slider-dot{
            width:8px;height:8px;border-radius:50%;
            background:rgba(255,255,255,0.3);border:none;cursor:pointer;
            transition:var(--transition);
        }
        .slider-dot.active{background:var(--primary);width:24px;border-radius:12px}
        /* رسائل الترحيب */
        .welcome-slider{
            background:linear-gradient(135deg,var(--primary),var(--primary-light));
            border-radius:var(--radius-lg);
            padding:16px 20px;margin-bottom:16px;
            min-height:50px;
            display:flex;align-items:center;
            font-weight:700;font-size:14px;
            position:relative;overflow:hidden;
        }
        .welcome-slider .msg{position:absolute;width:100%;padding:0 20px;transition:var(--transition);opacity:0;transform:translateY(20px)}
        .welcome-slider .msg.active{opacity:1;transform:translateY(0)}
        /* قسم الأقسام */
        .section-title{
            font-size:17px;font-weight:800;margin:20px 0 12px;
            display:flex;align-items:center;gap:8px;
        }
        .section-title::after{
            content:'';flex:1;height:2px;
            background:linear-gradient(to left,var(--primary),transparent);
            border-radius:2px;
        }
        .categories-grid{
            display:grid;grid-template-columns:repeat(3,1fr);gap:10px;
        }
        .cat-card{
            background:var(--bg-card);
            border-radius:var(--radius-md);
            padding:16px 8px;text-align:center;
            cursor:pointer;transition:var(--transition);
            border:1px solid var(--border);
            display:flex;flex-direction:column;align-items:center;gap:8px;
        }
        .cat-card:hover{background:var(--bg-card-hover);transform:translateY(-2px);box-shadow:var(--shadow)}
        .cat-card img{width:48px;height:48px;border-radius:var(--radius-sm);object-fit:cover}
        .cat-card span{font-size:12px;font-weight:700;line-height:1.3}
        /* صفحة الأقسام الفرعية والسلع */
        .page{display:none}
        .page.active{display:block}
        .back-btn{
            display:flex;align-items:center;gap:6px;
            padding:10px 16px;border:none;background:var(--bg-card);
            color:var(--text);border-radius:var(--radius-md);
            font-family:inherit;font-size:14px;font-weight:600;
            cursor:pointer;margin-bottom:12px;transition:var(--transition);
        }
        .back-btn:hover{background:var(--bg-card-hover)}
        /* كرت السلعة */
        .item-card{
            background:var(--bg-card);border-radius:var(--radius-md);
            padding:16px;margin-bottom:8px;
            display:flex;align-items:center;justify-content:space-between;
            border:1px solid var(--border);transition:var(--transition);
            cursor:pointer;
        }
        .item-card:hover{background:var(--bg-card-hover);border-color:var(--primary)}
        .item-info{flex:1}
        .item-name{font-weight:700;font-size:15px;margin-bottom:4px}
        .item-price{color:var(--primary);font-weight:800;font-size:14px}
        .item-type{font-size:11px;color:var(--text-secondary)}
        .fav-btn{
            width:36px;height:36px;border-radius:50%;
            border:none;background:transparent;font-size:20px;
            cursor:pointer;transition:var(--transition);
        }
        .fav-btn:hover{transform:scale(1.2)}
        .fav-btn.active{color:var(--danger)}
        /* فوتر التواصل */
        .footer{
            display:flex;justify-content:center;gap:16px;
            padding:20px;margin-top:24px;
        }
        .social-link{
            width:44px;height:44px;border-radius:50%;
            background:var(--primary);color:#fff;
            display:flex;align-items:center;justify-content:center;
            font-size:20px;text-decoration:none;
            transition:var(--transition);
        }
        .social-link:hover{transform:scale(1.1);box-shadow:0 4px 16px rgba(99,102,241,0.4)}
        /* نافذة شراء */
        .modal{
            position:fixed;top:0;left:0;width:100%;height:100%;
            background:rgba(0,0,0,0.7);z-index:300;
            display:none;align-items:flex-end;justify-content:center;
        }
        .modal.show{display:flex}
        .modal-content{
            background:var(--bg-card);width:100%;max-width:500px;
            border-radius:var(--radius-lg) var(--radius-lg) 0 0;
            padding:24px 20px;max-height:85vh;overflow-y:auto;
        }
        .modal-header{
            display:flex;justify-content:space-between;align-items:center;
            margin-bottom:16px;
        }
        .modal-title{font-size:18px;font-weight:800}
        .modal-close{
            width:36px;height:36px;border-radius:50%;border:none;
            background:var(--bg-card-hover);color:var(--text);
            font-size:20px;cursor:pointer;
        }
        .input-group{margin-bottom:14px}
        .input-group label{display:block;font-size:13px;color:var(--text-secondary);margin-bottom:6px;font-weight:600}
        .input-group input{
            width:100%;padding:12px 14px;border-radius:var(--radius-sm);
            border:1px solid var(--border);background:var(--bg);
            color:var(--text);font-family:inherit;font-size:14px;
            transition:var(--transition);
        }
        .input-group input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,0.15)}
        .btn{
            width:100%;padding:14px;border-radius:var(--radius-sm);
            border:none;font-family:inherit;font-size:15px;font-weight:700;
            cursor:pointer;transition:var(--transition);
            display:flex;align-items:center;justify-content:center;gap:8px;
        }
        .btn-primary{background:var(--primary);color:#fff}
        .btn-primary:hover{background:var(--primary-light);box-shadow:0 4px 16px rgba(99,102,241,0.4)}
        .btn-danger{background:var(--danger);color:#fff}
        .btn-outline{background:transparent;border:1px solid var(--border);color:var(--text)}
        /* تبويبات الطلبات */
        .tabs{display:flex;gap:4px;margin-bottom:16px;background:var(--bg);border-radius:var(--radius-sm);padding:4px}
        .tab{
            flex:1;padding:10px;text-align:center;border-radius:var(--radius-sm);
            border:none;background:transparent;color:var(--text-secondary);
            font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;
            transition:var(--transition);
        }
        .tab.active{background:var(--primary);color:#fff}
        /* Toast */
        .toast{
            position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-120px);
            background:var(--bg-card);border:1px solid var(--border);
            border-radius:var(--radius-md);padding:12px 20px;
            font-weight:700;font-size:14px;z-index:999;
            transition:transform 0.4s ease;text-align:center;
            box-shadow:var(--shadow);
        }
        .toast.show{transform:translateX(-50%) translateY(0)}
        .toast.success{border-color:var(--success)}
        .toast.error{border-color:var(--danger)}
    </style>
</head>
<body>

    <!-- Toast -->
    <div class="toast" id="toast"></div>

    <!-- Overlay -->
    <div class="sidebar-overlay" id="overlay" onclick="closeSidebar()"></div>

    <!-- الشريط الجانبي -->
    <div class="sidebar" id="sidebar">
        <button class="sidebar-close" onclick="closeSidebar()">✕</button>
        <button class="sidebar-item" onclick="navigatePage('home')"><span class="icon">🏠</span> الرئيسية</button>
        <button class="sidebar-item fav" onclick="navigatePage('favorites')"><span class="icon">❤️</span> منتجاتي المفضلة</button>
        <button class="sidebar-item" onclick="navigatePage('deposit')"><span class="icon">💰</span> إضافة رصيد لحسابي</button>
        <button class="sidebar-item" onclick="navigatePage('payments')"><span class="icon">💳</span> دفعاتي المالية</button>
        <button class="sidebar-item" onclick="navigatePage('wallet')"><span class="icon">👛</span> محفظتي</button>
        <button class="sidebar-item" onclick="navigatePage('orders')"><span class="icon">📦</span> مشترياتي</button>
        <button class="sidebar-item" onclick="navigatePage('account')"><span class="icon">👤</span> حسابي</button>
        <button class="sidebar-item" onclick="navigatePage('about')"><span class="icon">ℹ️</span> من نحن</button>
        <hr style="border-color:var(--border);margin:8px 0">
        <button class="sidebar-item" onclick="toggleTheme()"><span class="icon" id="themeIcon">🌙</span> الوضع الداكن</button>
    </div>

    <!-- التطبيق -->
    <div class="app">
        <!-- الهيدر -->
        <div class="header">
            <div class="logo-area">
                <img class="logo-img" id="logoImg" src="images/logo.png" alt="Logo">
                <span class="store-name" id="storeName">ONE Store</span>
            </div>
            <div class="header-actions">
                <button class="icon-btn admin-btn" id="adminBtn" title="لوحة الأدمن" onclick="openAdmin()">⚙️</button>
                <button class="icon-btn" onclick="openSidebar()">☰</button>
            </div>
        </div>

        <!-- الصفحة الرئيسية -->
        <div class="page active" id="page-home">
            <!-- سلايدر الصور -->
            <div class="slider-container" id="imageSlider">
                <div class="slider-track" id="sliderTrack"></div>
                <div class="slider-dots" id="sliderDots"></div>
            </div>

            <!-- رسائل الترحيب -->
            <div class="welcome-slider" id="welcomeSlider">
                <div class="msg active">👋 أهلاً بك في ONE Store - أفضل متجر شحن</div>
                <div class="msg">🚀 شحن فوري وتلقائي لجميع الخدمات</div>
                <div class="msg">💳 طرق دفع متعددة وآمنة</div>
            </div>

            <!-- الأقسام -->
            <div class="section-title">📂 تصفح الأقسام</div>
            <div class="categories-grid" id="categoriesGrid"></div>

            <!-- روابط التواصل -->
            <div class="footer" id="socialFooter"></div>
        </div>

        <!-- صفحات فرعية -->
        <div class="page" id="page-subcategories"><div id="subContent"></div></div>
        <div class="page" id="page-favorites"><h3>❤️ المفضلة</h3><div id="favContent"></div></div>
        <div class="page" id="page-deposit"><h3>💰 إضافة رصيد</h3><div id="depositContent"></div></div>
        <div class="page" id="page-orders"><h3>📦 مشترياتي</h3><div id="ordersContent"></div></div>
        <div class="page" id="page-account"><h3>👤 حسابي</h3><div id="accountContent"></div></div>
        <div class="page" id="page-about"><h3>ℹ️ من نحن</h3><p>ONE Store - متجركم الأول للشحن</p></div>
    </div>

    <!-- مودال الشراء -->
    <div class="modal" id="purchaseModal">
        <div class="modal-content">
            <div class="modal-header">
                <span class="modal-title" id="modalTitle">شراء سلعة</span>
                <button class="modal-close" onclick="closeModal()">✕</button>
            </div>
            <div id="modalBody"></div>
        </div>
    </div>

    <!-- السكريبتات -->
    <script src="js/api.js"></script>
    <script>
        // ==========================================
        // الإعدادات الأولية
        // ==========================================
        const tg = window.Telegram.WebApp;
        tg.ready(); tg.expand();
        
        const user = tg.initDataUnsafe?.user || {};
        const userId = user.id || 0;
        const admins = JSON.parse(localStorage.getItem('admins') || '[8257250965]');
        const isAdmin = admins.includes(userId);
        
        let currentTheme = localStorage.getItem('theme') || 'dark';
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        let currentCategory = null;

        initApp();

        function initApp() {
            applyTheme();
            if (isAdmin) document.getElementById('adminBtn').style.display = 'flex';
            loadSettings();
            loadCategories();
            loadSlider();
            loadWelcomeMessages();
            loadSocialLinks();
            startSliders();
        }

        // ==========================================
        // الثيم
        // ==========================================
        function toggleTheme() {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            applyTheme();
        }

        function applyTheme() {
            if (currentTheme === 'light') {
                document.body.classList.add('light-mode');
                document.getElementById('themeIcon').textContent = '☀️';
            } else {
                document.body.classList.remove('light-mode');
                document.getElementById('themeIcon').textContent = '🌙';
            }
        }

        // ==========================================
        // تحميل الإعدادات
        // ==========================================
        function loadSettings() {
            const settings = JSON.parse(localStorage.getItem('settings') || '{}');
            if (settings.storeName) document.getElementById('storeName').textContent = settings.storeName;
            if (settings.logo) document.getElementById('logoImg').src = settings.logo;
            if (settings.primaryColor) document.documentElement.style.setProperty('--primary', settings.primaryColor);
            if (settings.primaryColor) document.documentElement.style.setProperty('--primary-light', settings.primaryColor + 'cc');
        }

        // ==========================================
        // الأقسام
        // ==========================================
        function loadCategories() {
            const categories = JSON.parse(localStorage.getItem('categories') || '[]');
            const grid = document.getElementById('categoriesGrid');
            grid.innerHTML = categories.filter(c => !c.parent_id).map(cat => `
                <div class="cat-card" onclick="openCategory(${cat.id})">
                    <img src="${cat.image || 'images/default-cat.png'}" alt="${cat.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22><rect fill=%22%23ddd%22 width=%2248%22 height=%2248%22 rx=%228%22/><text x=%2224%22 y=%2230%22 text-anchor=%22middle%22 font-size=%2218%22>📁</text></svg>'">
                    <span>${cat.name}</span>
                </div>
            `).join('');
        }

        function openCategory(catId) {
            currentCategory = catId;
            const categories = JSON.parse(localStorage.getItem('categories') || '[]');
            const items = JSON.parse(localStorage.getItem('items') || '[]');
            const cat = categories.find(c => c.id === catId);
            const subCats = categories.filter(c => c.parent_id === catId);
            const catItems = items.filter(i => i.category_id === catId);

            let html = `<button class="back-btn" onclick="goBack()">⬅️ رجوع</button>`;
            html += `<h3>${cat ? cat.name : 'قسم'}</h3>`;
            
            // أقسام فرعية
            if (subCats.length > 0) {
                html += `<div class="categories-grid" style="margin-top:12px">${subCats.map(sc => `
                    <div class="cat-card" onclick="openCategory(${sc.id})">
                        <img src="${sc.image || 'images/default-cat.png'}" alt="${sc.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22><rect fill=%22%23ddd%22 width=%2248%22 height=%2248%22 rx=%228%22/><text x=%2224%22 y=%2230%22 text-anchor=%22middle%22 font-size=%2218%22>📁</text></svg>'">
                        <span>${sc.name}</span>
                    </div>
                `).join('')}</div>`;
            }

            // السلع
            if (catItems.length > 0) {
                html += `<div class="section-title">🛒 السلع</div>`;
                html += catItems.map(i => {
                    const isFav = favorites.includes(i.id);
                    return `
                    <div class="item-card" onclick="openPurchase(${i.id})">
                        <div class="item-info">
                            <div class="item-name">${i.name}</div>
                            <div class="item-price">${i.price || 0} $</div>
                            <div class="item-type">${i.type === 'auto' ? '🤖 تلقائي' : '✋ يدوي'}</div>
                        </div>
                        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation();toggleFav(${i.id}, this)">❤️</button>
                    </div>
                    `;
                }).join('');
            }

            document.getElementById('subContent').innerHTML = html;
            navigatePage('subcategories');
        }

        function goBack() {
            navigatePage('home');
            currentCategory = null;
        }

        // ==========================================
        // المفضلة
        // ==========================================
        function toggleFav(itemId, btn) {
            if (favorites.includes(itemId)) {
                favorites = favorites.filter(f => f !== itemId);
                btn.classList.remove('active');
            } else {
                favorites.push(itemId);
                btn.classList.add('active');
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }

        function loadFavorites() {
            const items = JSON.parse(localStorage.getItem('items') || '[]');
            const favItems = items.filter(i => favorites.includes(i.id));
            const content = document.getElementById('favContent');
            if (favItems.length === 0) {
                content.innerHTML = '<p style="color:var(--text-secondary);text-align:center;margin:40px 0">لا توجد منتجات مفضلة</p>';
            } else {
                content.innerHTML = favItems.map(i => `
                    <div class="item-card" onclick="openPurchase(${i.id})">
                        <div class="item-info">
                            <div class="item-name">${i.name}</div>
                            <div class="item-price">${i.price || 0} $</div>
                        </div>
                        <button class="fav-btn active" onclick="event.stopPropagation();toggleFav(${i.id}, this)">❤️</button>
                    </div>
                `).join('');
            }
        }

        // ==========================================
        // نافذة الشراء
        // ==========================================
        function openPurchase(itemId) {
            const items = JSON.parse(localStorage.getItem('items') || '[]');
            const item = items.find(i => i.id === itemId);
            if (!item) return;

            document.getElementById('modalTitle').textContent = item.name;
            document.getElementById('modalBody').innerHTML = `
                <p style="margin-bottom:12px;font-weight:700">💰 السعر: ${item.price || 0} $</p>
                <p style="margin-bottom:12px;color:var(--text-secondary)">${item.type === 'auto' ? '🤖 شحن تلقائي' : '✋ شحن يدوي'}</p>
                <div class="input-group">
                    <label>الكمية</label>
                    <input type="number" id="purchaseQty" value="1" min="1" onchange="updateTotal(${item.price || 0})">
                </div>
                <div class="input-group">
                    <label>${item.input_label || 'رقم الهاتف'}</label>
                    <input type="text" id="purchasePlayerId" placeholder="${item.input_label || 'أدخل رقم الهاتف'}">
                </div>
                <p style="font-weight:800;font-size:18px;margin:12px 0">الإجمالي: <span id="totalPrice">${item.price || 0}</span> $</p>
                <button class="btn btn-primary" onclick="confirmPurchase(${item.id})">✅ تأكيد الشراء</button>
                <button class="btn btn-outline" style="margin-top:8px" onclick="closeModal()">❌ إلغاء</button>
            `;
            document.getElementById('purchaseModal').classList.add('show');
        }

        function updateTotal(price) {
            const qty = parseInt(document.getElementById('purchaseQty').value) || 1;
            document.getElementById('totalPrice').textContent = (price * qty).toFixed(2);
        }

        function confirmPurchase(itemId) {
            const items = JSON.parse(localStorage.getItem('items') || '[]');
            const item = items.find(i => i.id === itemId);
            if (!item) return;

            const qty = parseInt(document.getElementById('purchaseQty').value) || 1;
            const playerId = document.getElementById('purchasePlayerId').value.trim();

            if (!playerId) {
                showToast('يرجى إدخال ' + (item.input_label || 'رقم الهاتف'), 'error');
                return;
            }

            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const orderId = 'ID_' + Date.now().toString(36);
            orders.unshift({
                id: orderId,
                item_id: itemId,
                item_name: item.name,
                quantity: qty,
                price: (item.price || 0) * qty,
                player_id: playerId,
                type: item.type || 'manual',
                status: item.type === 'auto' ? 'processing' : 'pending',
                date: new Date().toISOString(),
                response: ''
            });
            localStorage.setItem('orders', JSON.stringify(orders));

            closeModal();
            showToast('✅ تم تقديم الطلب بنجاح!', 'success');
        }

        function closeModal() {
            document.getElementById('purchaseModal').classList.remove('show');
        }

        // ==========================================
        // السلايدر
        // ==========================================
        function loadSlider() {
            const slides = JSON.parse(localStorage.getItem('sliderImages') || '[]');
            const track = document.getElementById('sliderTrack');
            const dots = document.getElementById('sliderDots');

            if (slides.length === 0) {
                slides.push({ image: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="500" height="160"><rect fill="%231a1a2e" width="500" height="160" rx="20"/><text x="250" y="80" text-anchor="middle" fill="%23a1a1aa" font-size="20">🛍️ ONE Store</text></svg>') });
            }

            track.innerHTML = slides.map(s => `<div class="slider-slide"><img src="${s.image}" alt="Slide"></div>`).join('');
            dots.innerHTML = slides.map((_, i) => `<button class="slider-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></button>`).join('');
        }

        let currentSlide = 0;
        function startSliders() {
            setInterval(() => {
                const slides = JSON.parse(localStorage.getItem('sliderImages') || '[]');
                if (slides.length <= 1) return;
                currentSlide = (currentSlide + 1) % slides.length;
                document.getElementById('sliderTrack').style.transform = `translateX(-${currentSlide * 100}%)`;
                document.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
            }, 3000);

            // رسائل الترحيب
            let welcomeIndex = 0;
            setInterval(() => {
                const msgs = document.querySelectorAll('#welcomeSlider .msg');
                if (msgs.length <= 1) return;
                msgs.forEach(m => m.classList.remove('active'));
                welcomeIndex = (welcomeIndex + 1) % msgs.length;
                msgs[welcomeIndex].classList.add('active');
            }, 4000);
        }

        function goToSlide(i) {
            currentSlide = i;
            document.getElementById('sliderTrack').style.transform = `translateX(-${i * 100}%)`;
            document.querySelectorAll('.slider-dot').forEach((d, j) => d.classList.toggle('active', j === i));
        }

        function loadWelcomeMessages() {
            const msgs = JSON.parse(localStorage.getItem('welcomeMessages') || '["👋 أهلاً بك في ONE Store"]');
            const container = document.getElementById('welcomeSlider');
            container.innerHTML = msgs.map((m, i) => `<div class="msg ${i === 0 ? 'active' : ''}">${m}</div>`).join('');
        }

        function loadSocialLinks() {
            const links = JSON.parse(localStorage.getItem('socialLinks') || '[]');
            const footer = document.getElementById('socialFooter');
            footer.innerHTML = links.map(l => `
                <a href="${l.url}" target="_blank" class="social-link">${l.icon}</a>
            `).join('');
        }

        // ==========================================
        // التنقل
        // ==========================================
        function navigatePage(page) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const target = document.getElementById('page-' + page);
            if (target) target.classList.add('active');
            closeSidebar();

            if (page === 'favorites') loadFavorites();
            if (page === 'orders') loadOrders();
            if (page === 'account') loadAccount();
        }

        function loadOrders() {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const content = document.getElementById('ordersContent');
            if (orders.length === 0) {
                content.innerHTML = '<p style="color:var(--text-secondary);text-align:center;margin:40px 0">لا توجد طلبات</p>';
            } else {
                content.innerHTML = `
                    <div class="tabs">
                        <button class="tab active" onclick="filterOrders('all', this)">الكل</button>
                        <button class="tab" onclick="filterOrders('completed', this)">مقبول</button>
                        <button class="tab" onclick="filterOrders('pending', this)">قيد الانتظار</button>
                        <button class="tab" onclick="filterOrders('rejected', this)">مرفوض</button>
                    </div>
                    <div id="ordersList">${renderOrders(orders)}</div>
                `;
            }
        }

        function renderOrders(orders) {
            const statusMap = { completed: '✅ مقبول', pending: '⏳ قيد الانتظار', processing: '🔄 جاري', rejected: '❌ مرفوض' };
            return orders.map(o => `
                <div class="item-card" onclick="showOrderDetail('${o.id}')">
                    <div class="item-info">
                        <div class="item-name">${o.item_name} ${o.quantity > 1 ? '(x' + o.quantity + ')' : ''}</div>
                        <div class="item-price">${o.price} $</div>
                        <div style="font-size:11px;color:var(--text-secondary)">${statusMap[o.status] || o.status} | ${new Date(o.date).toLocaleString('ar')}</div>
                    </div>
                    <span>→</span>
                </div>
            `).join('');
        }

        function filterOrders(status, btn) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const filtered = status === 'all' ? orders : orders.filter(o => o.status === status);
            document.getElementById('ordersList').innerHTML = renderOrders(filtered);
        }

        function showOrderDetail(orderId) {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const order = orders.find(o => o.id === orderId);
            if (!order) return;
            const statusMap = { completed: '✅ مقبول', pending: '⏳ قيد الانتظار', rejected: '❌ مرفوض', processing: '🔄 جاري' };
            document.getElementById('modalTitle').textContent = 'تفاصيل الطلب';
            document.getElementById('modalBody').innerHTML = `
                <p><strong>الحالة:</strong> ${statusMap[order.status]}</p>
                <p><strong>رقم العملية:</strong> ${order.id}</p>
                <p><strong>السلعة:</strong> ${order.item_name}</p>
                <p><strong>الكمية:</strong> ${order.quantity}</p>
                <p><strong>السعر:</strong> ${order.price} $</p>
                <p><strong>التاريخ:</strong> ${new Date(order.date).toLocaleString('ar')}</p>
                <p><strong>${order.input_label || 'رقم الهاتف'}:</strong> ${order.player_id}</p>
                ${order.response ? `<p><strong>الرد:</strong> ${order.response}</p>` : ''}
                <button class="btn btn-outline" onclick="closeModal()" style="margin-top:12px">🔙 إغلاق</button>
            `;
            document.getElementById('purchaseModal').classList.add('show');
        }

        function loadAccount() {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const myUser = users.find(u => u.id === userId) || { id: userId, balance: 0 };
            document.getElementById('accountContent').innerHTML = `
                <div class="item-card"><div class="item-info"><div class="item-name">🆔 الايدي</div><div>${userId}</div></div></div>
                <div class="item-card"><div class="item-info"><div class="item-name">💰 الرصيد</div><div>${myUser.balance || 0} $</div></div></div>
            `;
        }

        // ==========================================
        // الشريط الجانبي
        // ==========================================
        function openSidebar() {
            document.getElementById('sidebar').classList.add('open');
            document.getElementById('overlay').classList.add('show');
        }
        function closeSidebar() {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('overlay').classList.remove('show');
        }

        function openAdmin() {
            window.location.href = 'admin.html';
        }

        // ==========================================
        // Toast
        // ==========================================
        function showToast(msg, type) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.className = 'toast ' + type + ' show';
            setTimeout(() => t.classList.remove('show'), 2500);
        }
    </script>
</body>
</html> 
