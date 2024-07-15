import React, { useState } from 'react';
import { BarcodeScanner } from 'react-barcode-scanner';

const BarcodeScannerComponent = () => {
    const [barcode, setBarcode] = useState('');

    const handleScan = (data) => {
        setBarcode(data);
        console.log('Código de barras detectado:', data);
    };

    const handleError = (err) => {
        console.error('Erro ao acessar a câmera:', err);
    };

    return (
        <div>
            <BarcodeScanner
                onScan={handleScan}
                onError={handleError}
                facingMode="environment"
            />
            <p>{barcode}</p>
        </div>
    );
};

export default BarcodeScannerComponent;
