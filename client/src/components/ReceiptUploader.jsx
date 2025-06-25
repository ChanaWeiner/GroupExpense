import { useState } from "react";
import sendRequest from "../services/serverApi";

export default function ReceiptUploader({ onResult }) {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return;
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const res = await sendRequest("receipt/scan-receipt", "POST", formData);            
    onResult(data.text);
    } catch (err) {
      setError("אירעה שגיאה");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="receipt-uploader">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="תצוגה מקדימה" style={{ maxWidth: "200px", marginTop: "10px" }} />}
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "סורק..." : "סרוק קבלה"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
