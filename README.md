<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>محرر البوت</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: #1a1a2e; 
            color: #fff; 
            font-family: 'Segoe UI', Tahoma, sans-serif;
            min-height: 100vh;
        }
        .toolbar {
            background: #16213e;
            padding: 12px 15px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            border-bottom: 1px solid #0f3460;
        }
        .btn {
            padding: 10px 18px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            color: white;
        }
        .btn-red { background: #e94560; }
        .btn-blue { background: #0f3460; }
        .btn-green { background: #4CAF50; }
        #codeEditor {
            width: 100%;
            height: 65vh;
            background: #1a1a2e;
            color: #d4d4d4;
            border: none;
            padding: 15px;
            font-family: 'Consolas', monospace;
            font-size: 14px;
            resize: none;
            direction: ltr;
        }
        #codeEditor:focus { outline: none; }
        .info {
            padding: 10px 15px;
            background: #16213e;
            font-size: 13px;
            color: #888;
            display: flex;
            justify-content: space-between;
        }
        .output {
            padding: 10px 15px;
            background: #0a0a1a;
            color: #4CAF50;
            font-size: 13px;
            min-height: 40px;
        }
    </style>
</head>
<body>
    <div class="toolbar">
        <button class="btn btn-red" onclick="scanButtons()">🔍 فحص الأزرار</button>
        <button class="btn btn-blue" onclick="changeToken()">🔑 تغيير التوكن</button>
        <button class="btn btn-green" onclick="checkErrors()">✅ فحص الأخطاء</button>
        <button class="btn btn-blue" onclick="sendToBot()">📤 إرسال للبوت</button>
    </div>
    
    <textarea id="codeEditor" placeholder="الكود رح يظهر هنا..."></textarea>
    
    <div class="info">
        <span id="lineCount">أسطر: 0</span>
        <span id="btnCount">أزرار: 0</span>
        <span id="errCount">أخطاء: 0</span>
    </div>
    <div class="output" id="output">⏳ في انتظار الكود من البوت...</div>

    <script>
        const editor = document.getElementById('codeEditor');
        const output = document.getElementById('output');

        // استلام الكود من البوت
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();

        // استلام البيانات من البوت
        tg.onEvent('mainButtonClicked', function() {
            tg.sendData(editor.value);
        });

        // إذا البوت بعت كود مع الرابط
        const params = new URLSearchParams(window.location.search);
        const codeFromBot = params.get('code');
        
        if (codeFromBot) {
            editor.value = decodeURIComponent(codeFromBot);
            output.innerHTML = '✅ تم استلام الكود من البوت';
            updateStats();
        }

        // تحديث الإحصائيات
        function updateStats() {
            const code = editor.value;
            document.getElementById('lineCount').textContent = 'أسطر: ' + code.split('\n').length;
            
            const btnMatches = code.match(/InlineKeyboardButton\s*\(/g);
            document.getElementById('btnCount').textContent = 'أزرار: ' + (btnMatches ? btnMatches.length : 0);
            
            let errors = 0;
            if (code && !code.includes('import')) errors++;
            if (code && !code.includes('Application') && !code.includes('Updater')) errors++;
            if (code && code.split('(').length !== code.split(')').length) errors++;
            document.getElementById('errCount').textContent = 'أخطاء: ' + errors;
        }

        editor.addEventListener('input', updateStats);

        // فحص الأزرار
        function scanButtons() {
            const code = editor.value;
            const matches = [...code.matchAll(/InlineKeyboardButton\s*\(\s*["']([^"']+)["']/g)];
            const buttons = [...new Set(matches.map(m => m[1]))];
            
            if (buttons.length === 0) {
                alert('لا توجد أزرار في الكود');
                return;
            }
            
            let msg = 'الأزرار المكتشفة:\n\n';
            buttons.forEach((btn, i) => msg += `${i+1}. ${btn}\n`);
            msg += '\nاختر لون للزر:';
            
            const btnChoice = prompt(msg);
            if (btnChoice) {
                const colorChoice = prompt('اختر اللون:\n1. أحمر 🔴\n2. أزرق 🔵\n3. أخضر 🟢');
                const emoji = { '1': '🔴', '2': '🔵', '3': '🟢' }[colorChoice] || '';
                
                const regex = new RegExp(`(InlineKeyboardButton\\s*\\(\\s*["'])(${btnChoice})(["'])`, 'g');
                editor.value = editor.value.replace(regex, `$1${emoji} $2$3`);
                output.innerHTML = `✅ تم تلوين الزر "${btnChoice}"`;
                updateStats();
            }
        }

        // تغيير التوكن
        function changeToken() {
            const newToken = prompt('أدخل التوكن الجديد:');
            if (newToken) {
                editor.value = editor.value.replace(/(TOKEN|BOT_TOKEN)\s*=\s*["'][^"']*["']/g, `$1 = "${newToken}"`);
                output.innerHTML = '✅ تم تغيير التوكن';
            }
        }

        // فحص الأخطاء
        function checkErrors() {
            const code = editor.value;
            if (!code) {
                output.innerHTML = '⚠️ لا يوجد كود';
                return;
            }
            
            let errors = [];
            if (!code.includes('import')) errors.push('لا يوجد استيراد');
            if (!code.includes('Application') && !code.includes('Updater')) errors.push('لا يوجد إطار عمل');
            if (!code.includes('TOKEN') && !code.includes('BOT_TOKEN')) errors.push('لا يوجد توكن');
            if (code.split('(').length !== code.split(')').length) errors.push('الأقواس غير متطابقة');
            
            if (errors.length === 0) {
                output.innerHTML = '✅ الكود سليم - لا توجد أخطاء';
            } else {
                output.innerHTML = '❌ الأخطاء:<br>' + errors.join('<br>');
            }
        }

        // إرسال للبوت
        function sendToBot() {
            tg.sendData(editor.value);
            output.innerHTML = '📤 تم إرسال الكود للبوت';
        }
    </script>
</body>
</html>
