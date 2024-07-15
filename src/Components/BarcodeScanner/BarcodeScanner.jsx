import React, { useEffect } from "react";
import Quagga from "quagga"; // Certifique-se de ter instalado 'quagga'

const BarcodeScanner = ({ onQRCodeScanned }) => {
  useEffect(() => {
    const initQuagga = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        const videoElement = document.getElementById("scanner-video");

        if (videoElement) {
          videoElement.srcObject = stream;

          Quagga.init(
            {
              inputStream: {
                type: "LiveStream",
                target: videoElement,
              },
              decoder: {
                readers: ["ean_reader"],
              },
            },
            (err) => {
              if (err) {
                console.error(err);
                return;
              }
              Quagga.start();
            }
          );

          Quagga.onDetected((data) => {
            const { codeResult } = data;
            if (codeResult) {
              onQRCodeScanned(codeResult.code);
            }
          });
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    initQuagga();

    return () => {
      Quagga.stop(); // Certifique-se de parar o Quagga quando o componente for desmontado
    };
  }, [onQRCodeScanned]);

  return (
    <div className="scanner-container">
      <video id="scanner-video" className="scanner-video" autoPlay></video>
    </div>
  );
};

export default BarcodeScanner;
