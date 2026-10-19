import { useEffect, useRef, useState } from "react";

export default function UploadWidget({ config, onUpload, label = "Upload" }) {
  const widgetRef = useRef(null);
  const onUploadRef = useRef(onUpload);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    onUploadRef.current = onUpload;
  }, [onUpload]);

  useEffect(() => {
    let active = true;
    let widget;

    setReady(false);
    setError("");

    if (!window.cloudinary?.createUploadWidget) {
      setError("Không tải được Cloudinary. Vui lòng tải lại trang.");
      return;
    }

    try {
      widget = window.cloudinary.createUploadWidget(config, (err, result) => {
        // Ignore events from a widget that has been cleaned up.
        if (!active) return;

        if (err) {
          setError(err.message || "Upload thất bại.");
          return;
        }

        if (result?.event === "success") {
          setError("");
          onUploadRef.current?.(result.info);
        }
      });

      widgetRef.current = widget;
      setReady(true);
    } catch (err) {
      setError(err.message || "Không thể khởi tạo upload.");
    }

    return () => {
      active = false;
      widgetRef.current = null;

      if (widget) {
        widget.destroy({ removeThumbnails: true }).catch((err) => {
          console.error("Cloudinary cleanup failed:", err);
        });
      }
    };
  }, [config]);

  return (
    <div>
      <button
        type="button"
        className="cloudinary-button"
        disabled={!ready}
        onClick={() => widgetRef.current?.open()}
      >
        {ready ? label : error ? "Upload không khả dụng" : "Đang chuẩn bị…"}
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}
