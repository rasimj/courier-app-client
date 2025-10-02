import { useState, useEffect } from "react";
import axios from "axios";
import './OcrUpload.css';

export default function OcrUpload({ onMakeJpeg }) {
  const [file, setFile] = useState(null);
  const [latestText, setLatestText] = useState("");
  const [savedTexts, setSavedTexts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Define the live server URL once
  const API_URL = "https://courier-app-server.onrender.com";

  const fetchSavedTexts = async () => {
    try {
      // --- CORRECTED URL 1 ---
      const res = await axios.get(`${API_URL}/texts`);
      setSavedTexts(res.data);
    } catch (error) {
      console.error("Failed to fetch texts:", error);
    }
  };

  useEffect(() => {
    fetchSavedTexts();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setLatestText("");
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setIsCopied(false);
    
    const formData = new FormData();
    formData.append("image", file);

    try {
      // --- CORRECTED URL 2 ---
      const res = await axios.post(`${API_URL}/ocr`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const extractedText = res.data.savedText.extractedText;
      setLatestText(extractedText);
      fetchSavedTexts(); 
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Error: Could not extract text. Please try a clearer image.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(latestText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleMakeJpeg = () => {
    onMakeJpeg(latestText);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="ocr-container">
      <h2>Image-to-Text (OCR) ✍️</h2>
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button onClick={handleUpload} disabled={!file || loading}>
          {loading ? "Processing..." : "Extract Text"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {latestText && (
        <div className="result-box latest-result">
          <div className="result-header">
            <h3>Last Extracted Text:</h3>
            <div className="action-buttons">
              <button onClick={handleCopy} className="copy-btn">
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={handleMakeJpeg} className="secondary-btn">
                Make JPEG 🖼️
              </button>
            </div>
          </div>
          <pre>{latestText}</pre>
        </div>
      )}
      
      <div className="history-section">
        <h3>📜 Saved Text History (Temporary)</h3>
        <div className="results-list">
          {savedTexts.length > 0 ? (
            <ul>
              {savedTexts.map((item) => (
                <li key={item._id}>
                  <pre>{item.extractedText}</pre>
                  <span className="timestamp">{new Date(item.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No texts saved yet. Upload an image to start.</p>
          )}
        </div>
      </div>
    </div>
  );
}