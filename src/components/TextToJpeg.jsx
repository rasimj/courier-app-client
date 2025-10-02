import React, { useState, useRef, useEffect } from 'react';
import './TextToJpeg.css';

export default function TextToJpeg({ initialText }) {
  const [text, setText] = useState('');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [textColor, setTextColor] = useState('#000000');
  const [jpegUrl, setJpegUrl] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (initialText) {
      setText(initialText);
    }
  }, [initialText]);

  const handleGenerate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const canvasWidth = 800;
    const canvasHeight = 400;
    const padding = 40;
    const lineHeight = 56;
    const font = 'bold 48px Arial';

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = textColor;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const paragraphs = text.split('\n');
    const lines = [];
    const maxWidth = canvas.width - (padding * 2);

    paragraphs.forEach(paragraph => {
      const words = paragraph.split(' ');
      let currentLine = '';
      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          lines.push(currentLine.trim());
          currentLine = words[i] + ' ';
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine.trim());
    });

    const totalTextHeight = lines.length * lineHeight;
    let startY = (canvas.height / 2) - (totalTextHeight / 2) + (lineHeight / 2);

    lines.forEach(line => {
      ctx.fillText(line, canvas.width / 2, startY);
      startY += lineHeight;
    });

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setJpegUrl(dataUrl);
  };

  return (
    <div className="text-jpeg-container">
      <h2>Text to JPEG Converter </h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="5"
        placeholder="Enter your text here..."
      />
      <div className="controls">
        <div className="control-item">
          <label>Background Color:</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
        </div>
        <div className="control-item">
          <label>Text Color:</label>
          <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
        </div>
      </div>
      <button onClick={handleGenerate} className="generate-btn">
        Generate JPEG
      </button>

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      {jpegUrl && (
        <div className="preview-section">
          <h3>Preview:</h3>
          <img src={jpegUrl} alt="Generated text" />
          <a href={jpegUrl} download="text-image.jpeg" className="download-btn">
            Download JPEG
          </a>
        </div>
      )}
    </div>
  );
}