import React, { useState } from "react";
import QRScanner from "./QRScanner";
import CodeStatus from "./CodeStatus";
import axios from "axios";
import "./App.css";

function App() {
    const [scannedData, setScannedData] = useState(null);
    const [status, setStatus] = useState("waiting");
    const [dataFromServer, setDataFromServer] = useState();

    const handleScanSuccess = (data) => {
        console.log("data", data);
        if (!data) return;

        setScannedData(data);
        setStatus("checking");
        checkCodeStatus(data);
    };

    const handleScanError = (error) => {
        console.error("Camera error:", error);
        setStatus("error");
    };

    const checkCodeStatus = async (code) => {
        try {
            const { data } = await axios({
                method: "get",
                url: `http://localhost:3000/check?identifier=${code}`,
            });

            setDataFromServer(data);

            if (data.result) {
                setStatus("valid");
            } else {
                setStatus("used");
            }
        } catch (error) {
            console.error("Error checking code:", error);
            setStatus("error");
        }
    };

    const applyDiscount = async (code) => {
        try {
            await axios({
                method: "PUT",
                url: `http://localhost:3000/apply`,
                data: {
                    code,
                },
            });
            setStatus("waiting");
            alert("Скидка применена успешно!");
        } catch (error) {
            console.error("Error applying discount:", error);
            setStatus("error");
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1 style={{ textAlign: "center" }}>
                    Система проверки скидочных QR-кодов
                </h1>

                {status === "waiting" && (
                    <QRScanner
                        onScanSuccess={handleScanSuccess}
                        onScanError={handleScanError}
                    />
                )}

                {status !== "waiting" && scannedData && (
                    <CodeStatus
                        status={status}
                        code={scannedData}
                        onApplyDiscount={applyDiscount}
                        onReset={() => {
                            setScannedData(null);
                            setStatus("waiting");
                        }}
                    />
                )}
            </header>
        </div>
    );
}

export default App;
