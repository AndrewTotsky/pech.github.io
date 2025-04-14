import React from "react";

const CodeStatus = ({ status, code, onApplyDiscount, onReset }) => {
    const getStatusMessage = () => {
        switch (status) {
            case "checking":
                return "Проверка кода...";
            case "used":
                return "❌ Данному посетителю скидка уже выдавалась ❌";
            case "valid":
                return "💫 Этот посетитель еще не получал скидку 💫";
            case "error":
                return "Произошла ошибка. Попробуйте еще раз";
            default:
                return "";
        }
    };

    return (
        <div className="code-status">
            <h3>Статус кода: {getStatusMessage()}</h3>

            {status === "valid" && (
                <button
                    className="discount-btn"
                    onClick={() => onApplyDiscount(code)}
                >
                    Применить скидку
                </button>
            )}

            {(status === "used" || status === "error") && (
                <button className="scan-another-btn" onClick={onReset}>
                    Сканировать другой код
                </button>
            )}
        </div>
    );
};

export default CodeStatus;
