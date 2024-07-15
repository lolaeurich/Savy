import React, { useRef, useEffect } from "react";
import { Quagga } from "quagga";

const QRCodeScannerComponent = ({ onQRCodeScanned }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const initQuagga = async () => {
            if (!videoRef.current) return;

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });

                videoRef.current.srcObject = stream;

                Quagga.init({
                    inputStream: {
                        name: "Live",
                        type: "LiveStream",
                        target: videoRef.current,
                    },
                    decoder: {
                        readers: ["ean_reader", "upc_reader"], // You can add more readers here
                    },
                }, function(err) {
                    if (err) {
                        console.error("Error initializing Quagga:", err);
                        return;
                    }
                    console.log("Initialization finished. Ready to start");
                    Quagga.start();
                });

                Quagga.onDetected(data => {
                    onQRCodeScanned(data.codeResult.code);
                });

            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        };

        initQuagga();

        return () => {
            Quagga.stop();
        };

    }, [onQRCodeScanned]);

    return <video ref={videoRef} style={{ width: "100%", maxWidth: "600px" }} />;
};

export default QRCodeScannerComponent;
