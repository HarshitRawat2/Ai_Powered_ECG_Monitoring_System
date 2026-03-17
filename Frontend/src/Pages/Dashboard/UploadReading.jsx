import { useState } from 'react';
import API from '../../api/axiosInstance';
import { Activity, Upload, CheckCircle } from 'lucide-react';

export default function UploadReading({ onUploadSuccess }) {
  const [dataString, setDataString] = useState(''); // User inputs comma-separated numbers
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert "0.1, 0.2, 0.3" into [0.1, 0.2, 0.3]
    const dataPoints = dataString.split(',').map(num => parseFloat(num.trim()));

    try {
      await API.post('/readings/', {
        dataPoints,
        recordedAt: new Date().toISOString(),
        abnormalDetected: false // Default for now
      });
      setIsSuccess(true);
      onUploadSuccess();
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      alert("Error uploading data");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Upload className="text-blue-600" size={20} /> Upload New Reading
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            ECG Data Points (Comma separated)
          </label>
          <textarea 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="0.12, 0.15, 0.22, -0.05..."
            value={dataString}
            onChange={(e) => setDataString(e.target.value)}
          />
        </div>

        <button 
          type="submit"
          className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-lg transition-all"
        >
          {isSuccess ? <CheckCircle size={20} /> : <Activity size={20} />}
          {isSuccess ? "Reading Saved!" : "Process Reading"}
        </button>
      </form>
    </div>
  );
}