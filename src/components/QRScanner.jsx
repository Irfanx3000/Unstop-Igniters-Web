import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ onScan, onClose }) => {
  const qrInstance = useRef(null);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);

  const startScanner = async () => {
    try {
      setError("");

      qrInstance.current = new Html5Qrcode("qr-reader");

      // ✅ STEP 1: get cameras explicitly
      const devices = await Html5Qrcode.getCameras();

      if (!devices || devices.length === 0) {
        setError("No camera found on this device");
        return;
      }

      // ✅ STEP 2: prefer back camera safely
      const backCamera =
        devices.find((d) =>
          d.label.toLowerCase().includes("back")
        ) || devices[devices.length - 1];

      await qrInstance.current.start(
        backCamera.id, // ✅ CAMERA ID (MOST RELIABLE)
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        async (decodedText) => {
          await stopScanner();
          onScan(decodedText);
        }
      );

      setStarted(true);
    } catch (err) {
      console.error(err);
      setError(
        "Camera access failed. Make sure HTTPS is enabled and permission is allowed."
      );
    }
  };

  const stopScanner = async () => {
    try {
      if (qrInstance.current) {
        await qrInstance.current.stop();
        await qrInstance.current.clear();
        qrInstance.current = null;
      }
    } catch {}
    onClose();
  };

  useEffect(() => {
    return () => {
      if (qrInstance.current) {
        qrInstance.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-sm p-5 rounded-2xl space-y-4">

        <h3 className="text-lg font-bold text-center text-hot-pink">
          Scan Attendance QR
        </h3>

        {!started && (
          <button
            onClick={startScanner}
            className="w-full gradient-btn py-2 rounded-xl font-semibold"
          >
            Start Scanner
          </button>
        )}

        {error && (
          <p className="text-sm text-red-400 text-center">{error}</p>
        )}

        <div
          id="qr-reader"
          className={`w-full aspect-square rounded-xl overflow-hidden bg-black ${
            !started ? "hidden" : ""
          }`}
        />

        <button
          onClick={stopScanner}
          className="w-full bg-red-500 text-white py-2 rounded-xl font-semibold"
        >
          Close Scanner
        </button>
      </div>
    </div>
  );
};

export default QRScanner;
