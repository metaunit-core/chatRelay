// 注入脚本，每隔 500ms 检查 ChatGPT 页面是否加载完毕
const interval = setInterval(() => {
    // relayData 来自 upload.js
    if (!window.relayData) return;

    const inputFile = document.querySelector("input[type='file']");
    if (!inputFile) return; // ChatGPT 页面没加载完

    clearInterval(interval);

    const { prompt, images } = window.relayData;
    const dt = new DataTransfer();

    // 处理图片（base64 → File）
    if (Array.isArray(images)) {
        images.forEach((img, index) => {
            const base64 = img.base64.split(",")[1];
            const mime = img.type || "image/png";

            const bytes = atob(base64);
            const buffer = new Uint8Array(bytes.length);

            for (let i = 0; i < bytes.length; i++) {
                buffer[i] = bytes.charCodeAt(i);
            }

            const file = new File([buffer], `cognivex_${index}.png`, {
                type: mime
            });

            dt.items.add(file);
        });
    }

    // 设置文件输入框
    inputFile.files = dt.files;
    inputFile.dispatchEvent(new Event("change", { bubbles: true }));

    // 输入 prompt 到 ChatGPT 文本框
    const textarea = document.querySelector("textarea");
    if (textarea) {
        textarea.value = prompt || "";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }

    // 自动点击发送
    setTimeout(() => {
        const sendBtn = document.querySelector("button:has(svg)");
        if (sendBtn) sendBtn.click();
    }, 700);
}, 500);

