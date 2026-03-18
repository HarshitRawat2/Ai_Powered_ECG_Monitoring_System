import { useState } from 'react';
import API from '../../api/axiosInstance';
import { Activity, Upload, CheckCircle, AlertCircle, Loader2, Cpu } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function UploadReading({ onUploadSuccess }) {
  const [dataString, setDataString] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validation: Check if input is empty
    if (!dataString.trim()) {
      toast.error("Please enter or paste ECG data points.");
      return;
    }

    setLoading(true);

    // 2. Formatting: Convert string to array and filter out non-numbers
    const dataPoints = dataString
      .split(',')
      .map(num => parseFloat(num.trim()))
      .filter(num => !isNaN(num));

    // 3. Logic Check: Ensure we have enough data to analyze
    if (dataPoints.length < 10) {
      toast.error("Insufficient data points for a valid heart scan.");
      setLoading(false);
      return;
    }

    try {
      await API.post('/readings/', {
        dataPoints,
        recordedAt: new Date().toISOString(),
        abnormalDetected: false 
      });

      setIsSuccess(true);
      toast.success(`Successfully analyzed ${dataPoints.length} data points`);
      
      if (onUploadSuccess) onUploadSuccess();
      
      // Reset after success
      setTimeout(() => {
        setIsSuccess(false);
        setDataString('');
        setLoading(false);
      }, 2000);

    } catch (err) {
      toast.error("Analysis failed. System was unable to process the signal.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-900/5 mt-8 max-w-2xl mx-auto relative overflow-hidden">
      <Toaster position="bottom-right" />
      
      {/* Decorative pulse line in background */}
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Activity size={120} className="text-blue-600" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <Cpu className="text-blue-600" size={24} /> 
            AI Signal Analysis
          </h2>
          <p className="text-slate-500 text-sm font-medium">Input raw ECG voltages for real-time processing.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 relative">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Raw Signal Stream (CSV Format)
          </label>
          <div className="relative">
            <textarea 
              className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl h-40 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-mono text-xs leading-relaxed text-blue-900"
              placeholder="0.47, 0.44, 0.445, 0.455, 0.445, 0.425..."
              value={dataString}
              onChange={(e) => setDataString(e.target.value)}
            />
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-slate-100 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400">
                {dataString.split(',').filter(x => x.trim()).length} Points Detected
              </span>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading || isSuccess}
          className={`group flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black transition-all active:scale-[0.98] shadow-lg ${
            isSuccess 
            ? "bg-emerald-500 text-white shadow-emerald-200" 
            : "bg-slate-900 hover:bg-blue-600 text-white shadow-slate-200"
          } disabled:opacity-80`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span className="animate-pulse">Analyzing Waveforms...</span>
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle size={20} className="animate-bounce" />
              Saved to Medical History
            </>
          ) : (
            <>
              <Upload size={18} className="group-hover:-translate-y-1 transition-transform" />
              Upload to HeartSense AI
            </>
          )}
        </button>

        <div className="flex items-center gap-2 justify-center text-slate-400">
          <AlertCircle size={14} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">AI Analysis is not a substitute for clinical diagnosis</span>
        </div>
      </form>
    </div>
  );
}