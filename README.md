


window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(location.search);
    const payload = params.get("payload");
    const status = document.getElementById("status");

    if (!payload) {
        status.innerText = "❌ 未找到 payload";
        return;
    }

    try {
        const data = JSON.parse(atob(payload));
        window.relayData = data;
        status.innerText = "✔ 已收到 Cognivex 数据，准备跳转…";

        setTimeout(() => {
            window.location.href = "https://chat.openai.com/";
        }, 800);

    } catch (err) {
        status.innerText = "❌ payload 解析失败：" + err;
    }
});
// ChatGPT 页面加载完成后注入逻辑
const interval = setInterval(() => {
    if (!window.relayData) return;
    if (!document.querySelector("input[type='file']")) return;

    clearInterval(interval);

    const data = window.relayData;
    const { prompt, images } = data;

    // 1. 构造 DataTransfer，用于模拟用户上传图片
    const dt = new DataTransfer();

    images.forEach((img, i) => {
        const byteString = atob(img.base64.split(",")[1]);
        const mime = img.type;
        const buffer = new Uint8Array(byteString.length);

        for (let j = 0; j < byteString.length; j++) {
            buffer[j] = byteString.charCodeAt(j);
        }

        const file = new File([buffer], `cognivex_img_${i}.png`, { type: mime });
        dt.items.add(file);
    });

    // 2. 找到 ChatGPT 的上传按钮
    const input = document.querySelector("input[type='file']");
    input.files = dt.files;

    // 派发事件让 ChatGPT 识别文件上传
    input.dispatchEvent(new Event("change", { bubbles: true }));

    // 3. 输入 prompt
    const textarea = document.querySelector("textarea");
    textarea.value = prompt;

    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    // 4. 自动点击发送
    setTimeout(() => {
        const btn = document.querySelector("button:has(svg)");
        if (btn) btn.click();
    }, 700);
}, 500);
