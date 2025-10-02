import { useState } from 'react';
import OcrUpload from '../components/OcrUpload.jsx';
import TextToJpeg from '../components/TextToJpeg.jsx';

export default function HomePage() {
  const [textForJpeg, setTextForJpeg] = useState('');

  return (
    <div>
      <TextToJpeg initialText={textForJpeg} />
      <hr className="divider" /> 
      <OcrUpload onMakeJpeg={setTextForJpeg} />
    </div>
  );
}