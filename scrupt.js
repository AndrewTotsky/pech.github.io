const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const canvasCtx = canvas.getContext("2d");
const resultText = document.getElementById("result-text");
const resultLink = document.getElementById("result-link");
const startButton = document.getElementById("start-button");

let scanning = false;

// Запуск камеры
startButton.addEventListener("click", async () => {
    if (scanning) {
        stopScanning();
        startButton.textContent = "Запустить камеру";
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });
            video.srcObject = stream;
            video.play();
            scanning = true;
            startButton.textContent = "Остановить";
            scanQR();
        } catch (error) {
            resultText.textContent =
                "Ошибка доступа к камере: " + error.message;
        }
    }
});

// Остановка камеры
function stopScanning() {
    if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
    }
    scanning = false;
}

// Сканирование QR-кода
function scanQR() {
    if (!scanning) return;

    canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
        resultText.textContent = "Найден QR-код:";
        if (isValidUrl(code.data)) {
            resultLink.href = code.data;
            resultLink.textContent = code.data;
            resultLink.style.display = "inline";
        } else {
            resultLink.style.display = "none";
            resultText.textContent = "Содержимое QR-кода: " + code.data;
        }
    } else {
        resultText.textContent = "Наведите камеру на QR-код...";
        resultLink.style.display = "none";
    }

    requestAnimationFrame(scanQR);
}

// Проверка, является ли текст URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
