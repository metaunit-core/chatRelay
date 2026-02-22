window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(location.search);
    const payload = params.get("payload");
    const status = document.getElementById("status");

    if (!status) {
        console.error("❌ 未找到 status 元素");
        return;
    }

    if (!payload) {
        status.innerText = "❌ 未找到 payload";
        return;
    }

    try {
        const data = JSON.parse(atob(payload));
        window.relayData = data;
        status.innerText = "✔ 已接收 Cognivex 数据，准备跳转…";

        // 延迟后跳转到 ChatGPT
        setTimeout(() => {
            window.location.href = "https://chat.openai.com/";
        }, 800);

    } catch (err) {
        status.innerText = "❌ payload 解析失败：" + err;
        console.error(err);
    }
});

