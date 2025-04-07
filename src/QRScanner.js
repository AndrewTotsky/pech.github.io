import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

const QRScanner = ({ onScanSuccess, onScanError }) => {
    const webcamRef = useRef(null);
    const [facingMode, setFacingMode] = useState("environment");
    const [isScanning, setIsScanning] = useState(true);
    const canvasRef = useRef(null);

    const captureInterval = useRef();

    const scanQRCode = () => {
        if (!webcamRef.current || !isScanning) return;

        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = context.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );
            const code = jsQR(
                imageData.data,
                imageData.width,
                imageData.height,
                {
                    inversionAttempts: "dontInvert",
                }
            );

            if (code) {
                setIsScanning(false);
                onScanSuccess(code.data);
            }
        }
    };

    useEffect(() => {
        if (isScanning) {
            captureInterval.current = setInterval(scanQRCode, 300);
        } else {
            clearInterval(captureInterval.current);
        }

        return () => clearInterval(captureInterval.current);
    }, [isScanning]);

    const resetScanner = () => {
        setIsScanning(true);
    };

    return (
        <div className="qr-scanner-container">
            <div className="webcam-wrapper">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                        facingMode,
                        width: 1280,
                        height: 720,
                    }}
                    onUserMediaError={onScanError}
                />
                <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>

            <div className="scanner-controls">
                {!isScanning && (
                    <button onClick={resetScanner} className="control-button">
                        Сканировать снова
                    </button>
                )}
            </div>

            <p className="scan-instruction">
                {isScanning
                    ? "Наведите камеру на QR-код"
                    : "Сканирование завершено"}
            </p>
        </div>
    );
};

export default QRScanner;
