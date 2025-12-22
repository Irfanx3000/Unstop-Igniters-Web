import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ onScan, onClose }) => {
  const qrInstance = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const startScanner = async () => {
      try {
        await new Promise((res) => setTimeout(res, 300));
        if (cancelled) return;

        const instance = new Html5Qrcode("qr-reader");
        qrInstance.current = instance;

        const devices = await Html5Qrcode.getCameras();
        if (!devices?.length) throw new Error("No camera found");

        const backCamera =
          devices.find((d) => d.label.toLowerCase().includes("back")) ||
          devices[devices.length - 1];

        await instance.start(
          { deviceId: { exact: backCamera.id } },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            disableFlip: true,
          },
          (decodedText) => {
            onScan(decodedText);
            stopScanner(true); // ✅ close ONLY on success
          }
        );
      } catch (err) {
        console.error(err);
        setError("Camera permission denied or unavailable.");
      }
    };

    const stopScanner = async (close = false) => {
      try {
        if (qrInstance.current?.isScanning) {
          await qrInstance.current.stop();
          await qrInstance.current.clear();
        }
      } catch {}
      qrInstance.current = null;

      if (close) onClose(); // ✅ controlled close
    };

    startScanner();

    return () => {
      cancelled = true;
      // ❌ DO NOT call onClose here
      if (qrInstance.current) {
        qrInstance.current.stop().catch(() => {});
      }
    };
  }, [onScan, onClose]);

  return (
    <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center">
      <div className="bg-black p-4 rounded-xl w-full max-w-sm">
        <h3 className="text-center text-white font-semibold mb-3">
          Scan QR Code
        </h3>

        {error ? (
          <p className="text-red-400 text-center text-sm">{error}</p>
        ) : (
          <div
            id="qr-reader"
            className="w-full aspect-square rounded-lg overflow-hidden"
          />
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-xl"
        >
          Close Scanner
        </button>
      </div>
    </div>
  );
};

export default QRScanner;
