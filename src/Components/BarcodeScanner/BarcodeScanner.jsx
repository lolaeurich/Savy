import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const BarcodeScannerComponent = () => {
    const [result, setResult] = useState('');

    const handleScan = (data) => {
        if (data) {
            setResult(data);
            console.log('Código de barras detectado:', data);
            // Aqui você pode manipular o código de barras detectado
        }
    };

    const handleError = (err) => {
        console.error('Erro ao acessar a câmera:', err);
    };

    return (
        <div>
            <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
            />
            <p>{result}</p>
        </div>
    );
};

export default BarcodeScannerComponent;
