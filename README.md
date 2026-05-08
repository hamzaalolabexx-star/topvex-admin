<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>محرر البوت</title>
    <style>
        body { margin: 0; padding: 15px; background: #1e1e1e; color: #d4d4d4; font-family: monospace; }
        textarea { width: 100%; height: 85vh; background: #252526; color: #d4d4d4; border: 1px solid #3e3e3e; padding: 20px; font-size: 14px; resize: none; box-sizing: border-box; }
        button { background: #007acc; color: white; border: none; padding: 12px 20px; border-radius: 4px; font-size: 16px; margin-top: 10px; width: 100%; }
    </style>
</head>
<body>
    <h2>📝 محرر بوت تلجرام</h2>
    <textarea id="code" placeholder="ألصق كود البوت هنا..."></textarea>
    <button onclick="saveCode()">💾 حفظ التعديلات</button>
    <script>
        // استقبال الكود من البوت
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) document.getElementById('code').value = decodeURIComponent(code);

        function saveCode() {
            const editedCode = document.getElementById('code').value;
            window.Telegram.WebApp.sendData(editedCode);
        }
    </script>
</body>
</html>
